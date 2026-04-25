# /// script
# requires-python = ">=3.8"
# dependencies = ["pyyaml"]
# ///
"""
Claude Code Security Firewall - Python/UV Implementation
=========================================================

Blocks dangerous commands before execution via PreToolUse hook.
Loads patterns from patterns.yaml for easy customization.

Exit codes:
  0 = Allow command (or JSON output with permissionDecision)
  2 = Block command (stderr fed back to Claude)

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


def expand_path_with_project_root(path: str, project_root: str = "") -> str:
    """Expand a path using PROJECT_ROOT for relative paths.

    If path is absolute, return as-is.
    If path is relative (contains / or starts with .), prepend project_root.
    If path is user-tilde (~), expand it.
    """
    # Handle literal tildes
    if path.startswith("~"):
        expanded = os.path.expanduser(path)
    else:
        expanded = path

    # Absolute paths - skip project_root expansion
    if os.path.isabs(expanded):
        return expanded

    # For CodepOS, we want .tmp/ and relative paths to be relative to project_root
    if expanded.startswith(".") or ("/" in expanded and not expanded.startswith("/")):
        return os.path.join(project_root, expanded)

    return expanded


# === OPERATION PATTERNS - Edit these to customize what operations are blocked
# ===
# {path} will be replaced with the escaped path at runtime

# Operations blocked for READ-ONLY paths (all modifications)
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

# Combined patterns for read-only paths (block ALL modifications)
READ_ONLY_BLOCKED = (
    WRITE_PATTERNS +
    APPEND_PATTERNS +
    EDIT_PATTERNS +
    MOVE_COPY_PATTERNS +
    DELETE_PATTERNS +
    PERMISSION_PATTERNS +
    TRUNCATE_PATTERNS
)

# Patterns for no-delete paths (block ONLY delete operations)
NO_DELETE_BLOCKED = DELETE_PATTERNS


def load_config() -> Dict[str, Any]:
    """Load patterns from YAML config file."""
    config_path = None

    # 1. Check project_hooks directory (installed location)
    project_dir = os.environ.get("CLAUDE_PROJECT_DIR")
    if project_dir:
        project_config = Path(project_dir) / ".claude" / "hooks" / "damage-control" / "patterns.yaml"
        if project_config.exists():
            config_path = project_config
            print(f"Loading config from: {project_config}", file=sys.stderr)

    # 1.5 Check settings.json in current directory
    settings_path = Path("settings.json")
    if settings_path.exists():
        # Load settings.json
        with open(settings_path, "r") as f:
            settings = json.load(f)

        # Get PROJECT_ROOT from settings.json
        project_root = settings.get("PROJECT_ROOT", "")
        if project_root:
            config_path = Path(project_root) / ".claude" / "hooks" / "damage-control" / "patterns.yaml"
            if config_path.exists():
                print(f"Loading config from project hooks (via settings.json): {config_path}", file=sys.stderr)
            else:
                print(f"Config pattern file not found at: {config_path}", file=sys.stderr)

    # 2. Check script's own directory
    script_dir = Path(__file__).parent
    local_config = script_dir / "patterns.yaml"
    if local_config.exists():
        config_path = local_config
        print(f"Loading config from local: {config_path}", file=sys.stderr)

    # 3. Check skill root directory
    skill_root = script_dir.parent.parent / "patterns.yaml"
    if skill_root.exists():
        print(f"Falling back to skill root: {skill_root}", file=sys.stderr)
        # Only use if the above didn't work
        if config_path is None:
            config_path = skill_root

    if config_path is None:
        print(f"Warning: Config not found", file=sys.stderr)
        return {"bashToolPatterns": [], "zeroAccessPaths": [], "readOnlyPaths": [], "noDeletePaths": []}

    with open(config_path, "r") as f:
        return yaml.safe_load(f) or {}


def check_path_patterns(command: str, path: str, patterns: List[Tuple[str, str]], project_root: str, path_type: str) -> Tuple[bool, str]:
    """Check command against a list of patterns for a specific path."""
    # Expand path using PROJECT_ROOT if it's relative
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


def is_glob_pattern(pattern: str) -> bool:
    """Check if pattern contains glob wildcards."""
    return "*" in pattern or "?" in pattern or "[" in pattern


def glob_to_regex(glob_pattern: str) -> str:
    """Convert a glob pattern to a regex pattern for matching in commands."""
    result = ""
    for char in glob_pattern:
        if char == "*":
            result += r"[^\s/]*"
        elif char == "?":
            result += r"[^\s/]"
        elif char in r"\.^$+{}[]|()":
            result += "\\" + char
        else:
            result += char
    return result


def check_command(command: str, config: Dict[str, Any], project_root: str = "") -> Tuple[bool, bool, str]:
    """Check if command should be blocked or requires confirmation.

    Returns: (blocked, ask, reason)
      - blocked=True, ask=False: Block the command
      - blocked=False, ask=True: Show confirmation dialog
      - blocked=False, ask=False: Allow the command
    """
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
                    return False, True, reason  # Ask for confirmation
                else:
                    return True, False, f"Blocked: {reason}"  # Block
        except re.error:
            continue

    # 2. Check for ANY access to zero-access paths (including reads)
    for zero_path in zero_access_paths:
        if is_glob_pattern(zero_path):
            glob_regex = glob_to_regex(zero_path)
            try:
                if re.search(glob_regex, command, re.IGNORECASE):
                    return True, False, f"Blocked: zero-access pattern {zero_path} (no operations allowed)"
            except re.error:
                continue
        else:
            expanded = expand_path_with_project_root(zero_path, project_root)
            escaped_expanded = re.escape(expanded)
            escaped_original = re.escape(zero_path) if not zero_path.startswith("~") else os.path.expanduser(zero_path)
            if re.search(escaped_expanded, command) or re.search(escaped_original, command):
                return True, False, f"Blocked: zero-access path {zero_path} (no operations allowed)"

    # 3. Check for modifications to read-only paths (reads allowed)
    for readonly in read_only_paths:
        blocked, reason = check_path_patterns(command, readonly, READ_ONLY_BLOCKED, project_root, "read-only path")
        if blocked:
            return True, False, reason

    # 4. Check for deletions on no-delete paths (read/write/edit allowed)
    for no_delete in no_delete_paths:
        blocked, reason = check_path_patterns(command, no_delete, NO_DELETE_BLOCKED, project_root, "no-delete path")
        if blocked:
            return True, False, reason

    return False, False, ""


def main() -> None:
    config = load_config()

    # Also try to get PROJECT_ROOT from environment or settings
    project_dir = os.environ.get("CLAUDE_PROJECT_DIR")
    if not project_dir:
        settings_path = Path("settings.json")
        if settings_path.exists():
            with open(settings_path, "r") as f:
                settings = json.load(f)
                if "PROJECT_ROOT" in settings:
                    project_dir = settings["PROJECT_ROOT"]

    # Read hook input from stdin
    try:
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error reading input: {e}", file=sys.stderr)
        sys.exit(1)

    tool_name = input_data.get("tool_name", "")
    tool_input = input_data.get("tool_input", {})

    # Only check Bash commands
    if tool_name != "Bash":
        sys.exit(0)

    command = tool_input.get("command", "")
    if not command:
        sys.exit(0)

    # Check the command
    is_blocked, should_ask, reason = check_command(command, config, project_dir)

    if is_blocked:
        print(f"SECURITY: {reason}", file=sys.stderr)
        print(f"Command: {command[:100]}{'...' if len(command) > 100 else ''}", file=sys.stderr)
        sys.exit(2)
    elif should_ask:
        # Output JSON to trigger confirmation dialog
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "ask",
                "permissionDecisionReason": reason
            }
        }
        print(json.dumps(output))
        sys.exit(0)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()