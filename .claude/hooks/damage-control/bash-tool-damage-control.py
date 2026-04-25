#!/usr/bin/env uv run --script
# /// script
# requires-python = ">=3.8"
# dependencies = ["pyyaml"]
# ///
"""
Claude Code Security Firewall - Python/UV Implementation
=====================

Blocks dangerous commands before execution via PreToolUse hook.
Handles patterns from YAML config file.

Exit codes:
  0 = Allow command
  2 = Block command

JSON output for ask patterns:
  {"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "ask", "permissionDecisionReason": ". . ."}}
"""

import json
import sys
import re
import os
import fnmatch
from pathlib import Path
from typing import Tuple, List, Dict, Any

import yaml

def expand_path_with_tilde(path: str) -> str:
    """Expand a path, handling tildes."""
    if path.startswith("~"):
        expanded = os.path.expanduser(path)
    else:
        expanded = path
    return expanded

def expand_path_with_project_root(path: str, project_root: str = "") -> str:
    """Expand a path using PROJECT_ROOT for relative paths.

    If path is absolute, return as-is.
    If path is relative (contains / or starts with .), prepend project_root.
    If path is user-tilde (~), expand it.
    If project_root is None or empty, return the path unchanged.
    """
    path = path.rstrip("/")

    if path.startswith("~"):
        expanded = expand_path_with_tilde(path)
    else:
        expanded = path

    if not project_root:
        return expanded

    if os.path.isabs(expanded):
        return expanded

    if expanded.startswith(".") or ("/" in expanded and not expanded.startswith("/")):
        expanded = os.path.join(project_root.rstrip("/"), expanded.lstrip("./"))
        return expanded

    return expanded

# === OPERATION PATTERNS ===

WRITE_PATTERNS = [
    (r">\s*{path}", "write"),
    (r"\btee\s+(?!.*-a).*{path}", "write"),
]

APPEND_PATTERNS = [
    (r">>\s*{path}", "append"),
    (r"\btee\s+-a\s+.*{path}", "append"),
    (r"\btee\s+.*-a.*{path}", "append"),
]

EDIT_PATTERNS = [
    (r"\bsed\s+-i.*{path}", "edit"),
    (r"\bperl\s+-[^\s]*i.*{path}", "edit"),
    (r"\bawk\s+-i\s+inplace.*{path}", "edit"),
]

MOVE_COPY_PATTERNS = [
    (r"\bmv\s+.*\s+{path}", "move"),
    (r"\bcp\s+.*\s+{path}", "copy"),
]

DELETE_PATTERNS = [
    (r"\brm\s+.*{path}", "delete"),
    (r"\bunlink\s+.*{path}", "delete"),
    (r"\brmdir\s+.*{path}", "delete"),
    (r"\bshred\s+.*{path}", "delete"),
]

PERMISSION_PATTERNS = [
    (r"\bchmod\s+.*{path}", "chmod"),
    (r"\bchown\s+.*{path}", "chown"),
    (r"\bchgrp\s+.*{path}", "chgrp"),
]

TRUNCATE_PATTERNS = [
    (r"\btruncate\s+.*{path}", "truncate"),
    (r":\s*>\s*{path}", "truncate"),
]

READ_ONLY_BLOCKED = (
    WRITE_PATTERNS +
    APPEND_PATTERNS +
    EDIT_PATTERNS +
    MOVE_COPY_PATTERNS +
    DELETE_PATTERNS +
    PERMISSION_PATTERNS +
    TRUNCATE_PATTERNS
)

NO_DELETE_BLOCKED = DELETE_PATTERNS

def load_config() -> Dict[str, Any]:
    """Load patterns from YAML config file."""
    config_path = None

    project_dir = os.environ.get("CLAUDE_PROJECT_DIR")
    if project_dir:
        project_config = Path(project_dir) / ".claude" / "hooks" / "damage-control" / "patterns.yaml"
        if project_config.exists():
            config_path = project_config
            print(f"Loading config from: {project_config}", file=sys.stderr)

    settings_path = Path("settings.json")
    if settings_path.exists():
        with open(settings_path, "r") as f:
            settings = json.load(f)
        project_root = settings.get("PROJECT_ROOT", "")
        if project_root:
            config_path = Path(project_root) / ".claude" / "hooks" / "damage-control" / "patterns.yaml"
            if config_path.exists():
                print(f"Loading config from project hooks (via settings.json): {config_path}", file=sys.stderr)
            else:
                print(f"Config pattern file not found at: {config_path}", file=sys.stderr)

    script_dir = Path(__file__).parent
    local_config = script_dir / "patterns.yaml"
    if local_config.exists():
        config_path = local_config
        print(f"Loading config from local: {config_path}", file=sys.stderr)

    skill_root = script_dir.parent.parent / "patterns.yaml"
    if skill_root.exists():
        print(f"Falling back to skill root: {skill_root}", file=sys.stderr)
        if config_path is None:
            config_path = skill_root

    if config_path is None:
        print(f"Warning: Config not found", file=sys.stderr)
        return {"bashToolPatterns": [], "zeroAccessPaths": [], "readOnlyPaths": [], "noDeletePaths": []}

    with open(config_path, "r") as f:
        return yaml.safe_load(f) or {}

def is_glob_pattern(pattern: str) -> bool:
    """Check if pattern contains glob wildcards."""
    return "*" in pattern or "?" in pattern or "[" in pattern

def glob_to_regex(glob_pattern: str) -> str:
    """Convert a glob pattern to a regex pattern.

    Handles *, ?, [ ] patterns. Directories end with /.
    """
    result = ""
    in_command = False
    for char in glob_pattern:
        if char == "/" and not in_command:
            result += r"/"
            in_command = True
        elif char == "*":
            result += r"[^\s/]*)"
        elif char == "?":
            result += r"[^\s/]"
        elif char in r"\.^$+{}[]|()":
            result += "\\" + char
        elif char == "^" and not in_command:
            result += "^"
        else:
            result += char
    return result

def check_path_patterns(command: str, path: str, patterns: List[Tuple[str, str]], project_root: str, path_type: str) -> Tuple[bool, str]:
    """Check command against patterns for a specific path."""
    expanded = expand_path_with_project_root(path, project_root)

    if is_glob_pattern(expanded):
        glob_regex = glob_to_regex(expanded)
        for pattern_template, operation in patterns:
            try:
                cmd_prefix = pattern_template.replace("{path}", "")
                if cmd_prefix and re.search(cmd_prefix + glob_regex, command, re.IGNORECASE):
                    return True, f"Blocked: {operation} operation on {path_type} {expanded}"
            except re.error:
                continue
    else:
        escaped_expanded = re.escape(expanded)
        escaped_original = re.escape(path) if not path.startswith("~") else os.path.expanduser(path)
        for pattern_template, operation in patterns:
            try:
                pattern_expanded = pattern_template.replace("{path}", escaped_expanded)
                pattern_original = pattern_template.replace("{path}", escaped_original)
                if re.search(pattern_expanded, command) or re.search(pattern_original, command):
                    return True, f"Blocked: {operation} operation on {path_type} {expanded}"
            except re.error:
                continue

    return False, ""

def extract_paths_from_command(command: str, project_root: str = "") -> List[str]:
    """Extract all file paths from a command that can be matched against patterns.

    Extracts paths after common prefixes like cat, ls, cp, mv, rm, chmod, etc.
    Returns list of expanded paths.
    """
    import re
    
    paths = []
    
    # Extract quoted strings
    quoted = re.findall(r'["\']([^"\']+)["\"]', command)
    for path in quoted:
        paths.append(expand_path_with_project_root(path, project_root))
    
    # Extract unquoted words that could be paths
    # Split command by spaces and check each word
    words = command.split()
    for word in words:
        # Skip known command names and flags
        if word in ["cat", "echo", "ls", "find", "grep", "test", "file", "mkdir", 
                     "rm", "cp", "mv", "echo", "pwd", "whoami", "date", "hostname", 
                     "env", "set", "export", "unset", "source", ".", "sh", "bash", "zsh", 
                     "python", "node", "npm", "cd", "pushd", "popd", "dirs", "fc", "fg", "bg", 
                     "kill", "jobs", "jobs", "wait", "trap", "hash", "alias", "unalias", "type", 
                     "which", "whereis", "readlink", "ln", "ln", "touch", "rm", "true", "false", 
                     "exit", "exit", "read", "seq", "for", "in", "done", "if", "else", "fi", 
                     "while", "until", "function", "local", "case", "esac", "select", "break", 
                     "continue", "return", "shift", "eval", "exec"]:
            continue
        # Skip options/flags
        if word.startswith("-") or .		" in word::
            continue
        # Skip if it's a flag that ends with a path
        if "_" in word and word.endswith("="):
            continue
        
        # Remove any trailing newline or whitespace
        path = path.rstrip("/\n\r\t")
        
        # Only accept non-empty paths
        if path == "":
            continue
        
        paths.append(path)
    
    return list(set(paths))


def check_paths(command: str, config: Dict[str, Any], project_root: str = "") -> Tuple[bool, str]:
    """Check if command accesses restricted paths using fnmatch.

    Returns (blocked, reason).
    """
    zero_access_paths = config.get("zeroAccessPaths", [])
    read_only_paths = config.get("readOnlyPaths", [])
    no_delete_paths = config.get("noDeletePaths", [])

    # Extract paths from the command
    extracted_paths = extract_paths_from_command(command, project_root)

    # Check each extracted path against all restricted patterns
    for check_path in extracted_paths:
        # Check zero access paths
        for zero_path in zero_access_paths:
            expanded_zero_path = expand_path_with_project_root(zero_path, project_root)

            try:
                if fnmatch.fnmatch(check_path, expanded_zero_path + "*") or fnmatch.fnmatch(check_path, expanded_zero_path):
                    return True, f"Blocked: zero-access path {expanded_zero_path} (no operations allowed on: {check_path})"
            except:
                continue

        # Check read-only paths
        for readonly in read_only_paths:
            blocked, reason = check_path_patterns(check_path, readonly, READ_ONLY_BLOCKED, project_root, "read-only path")
            if blocked:
                return True, reason

        # Check no-delete paths
        for no_delete in no_delete_paths:
            blocked, reason = check_path_patterns(check_path, no_delete, NO_DELETE_BLOCKED, project_root, "no-delete path")
            if blocked:
                return True, reason

    return False, ""

def check_command(command: str, config: Dict[str, Any], project_root: str = "") -> Tuple[bool, bool, str]:
    """Check if command should be blocked or requires confirmation."""
    patterns = config.get("bashToolPatterns", [])
    zero_access_paths = config.get("zeroAccessPaths", [])
    read_only_paths = config.get("readOnlyPaths", [])
    no_delete_paths = config.get("noDeletePaths", [])

    # 1. Check against patterns from YAML (may block or ask)
    for item in patterns:
        pattern = item.get("pattern", "")
        reason = item.get("reason", "Blocked by pattern")
        should_ask = item.get("ask", False)

        try:
            if re.search(pattern, command, re.IGNORECASE):
                if should_ask:
                    return False, True, reason
                else:
                    return True, False, f"Blocked: {reason}"
        except re.error:
            continue

    # 2. Check for access to restricted paths (zero access, read-only, no-delete)
    blocked, reason = check_paths(command, config, project_root)
    if blocked:
        return True, False, reason

    return False, False, ""

def main() -> None:
    config = load_config()

    project_dir = os.environ.get("CLAUDE_PROJECT_DIR")
    if not project_dir:
        settings_path = Path("settings.json")
        if settings_path.exists():
            with open(settings_path, "r") as f:
                settings = json.load(f)
                if "PROJECT_ROOT" in settings:
                    project_dir = settings["PROJECT_ROOT"]

    try:
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error reading input: {e}", file=sys.stderr)
        sys.exit(1)

    tool_name = input_data.get("tool_name", "")
    command = input_data.get("tool_input", {}).get("command", "")

    if not command:
        print("Error: No command provided", file=sys.stderr)
        sys.exit(0)

    blocked, ask, reason = check_command(command, config, project_dir)

    if blocked:
        print(reason, file=sys.stderr)
        sys.exit(2)
    elif ask:
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "ask",
                "permissionDecisionReason": reason
            }
        }
        print(json.dumps(output))
    else:
        print(json.dumps({}))
        sys.exit(0)

if __name__ == "__main__":
    main()