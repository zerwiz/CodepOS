#!/bin/env python3
import sys, os, json, yaml, fnmatch, re, sys
from pathlib import Path
from typing import List, Tuple, Dict, Any

BASE_DIR = Path(__file__).absolute().parent.parent
PROJECT_ROOT = BASE_DIR.resolve()
ZERO_ACCESS_BLOCKED = "zero-access"
READ_ONLY_BLOCKED = "read-only"
NO_DELETE_BLOCKED = "no-delete"

def expand_path_with_project_root(path: str, project_root: str = "") -> str:
    if project_root and path.startswith("~"):
        return project_root.rstrip("/") + path[1:]
    return path

def extract_paths_from_command(command: str, project_root: str = "") -> List[str]:
    import re
    paths = set()
    quoted = re.findall(r'["\']([^"\']+)["\']', command)
    for path in quoted:
        paths.add(expand_path_with_project_root(path, project_root))
    words = command.split()
    skip = ["cat", "echo", "ls", "find", "grep", "test", "file", "mkdir", "rm", "cp", "mv", "pwd", "whoami", "date", "hostname", "env", "set", "export", "unset", "source", ".", "sh", "bash", "zsh", "python", "node", "npm", "cd", "pushd", "popd", "dirs", "fc", "fg", "bg", "kill", "jobs", "wait", "trap", "hash", "alias", "unalias", "type", "which", "whereis", "readlink", "ln", "touch", "true", "false", "exit", "read", "seq", "for", "in", "done", "if", "else", "fi", "while", "until", "function", "local", "case", "esac", "select", "break", "continue", "return", "shift", "eval", "exec"]
    for word in words:
        if word in skip or word.startswith("-") or "." in word or "_" in word and word.endswith("=") or word == "":
            continue
        paths.add(word)
    return list(paths)

def check_path_patterns(command: str, path: str, patterns: List[Tuple[str, str]], project_root: str, path_type: str) -> Tuple[bool, str]:
    expanded = expand_path_with_project_root(path, project_root)
    if "*" in expanded or "?" in expanded or "[" in expanded:
        glob_regex = r"/" + "".join(r"[^\s]*" if c == "*" else r"[^\s]" if c == "?" else r"\\" + c if c in r"\.^$+{}[]|()" else c for c in expanded.replace("*", "").replace("?", "")) + "/" if expanded.endswith("/") else r"/" + "".join(r"[^\s]*" if c == "*" else r"[^\s]" if c == "?" else r"\\" + c if c in r"\.^$+{}[]|()" else c for c in expanded.replace("*", "").replace("?", ""))
        for pattern_template, operation in patterns:
            try:
                cmd_prefix = pattern_template.replace("{path}", "")
                if cmd_prefix and re.search(re.escape(cmd_prefix) + (glob_regex if "*" in expanded or "?" in expanded or "[" in expanded else r"\\" + re.escape(expanded)), command, re.IGNORECASE):
                    return True, f"Blocked: {operation} operation on {path_type} {expanded}"
            except:
                continue
    else:
        escaped = re.escape(expanded)
        for pattern_template, operation in patterns:
            try:
                pattern_expanded = pattern_template.replace("{path}", escaped)
                if re.search(pattern_expanded, command):
                    return True, f"Blocked: {operation} operation on {path_type} {expanded}"
            except:
                continue
    return False, ""

def get_path_type(path: str, command: str, config: Dict[str, Any]) -> str:
    if config.get("zeroAccessPaths", []) and any(fnmatch.fnmatch(path, zp) for zp in config.get("zeroAccessPaths")):
        return ZERO_ACCESS_BLOCKED
    if config.get("readOnlyPaths", []) and any(fnmatch.fnmatch(path, rop) for rop in config.get("readOnlyPaths")):
        return READ_ONLY_BLOCKED
    if config.get("noDeletePaths", []) and any(fnmatch.fnmatch(path, ndp) for ndp in config.get("noDeletePaths")):
        return NO_DELETE_BLOCKED
    return "normal"

def process_bash_command(input_data: Dict[str, Any], config: Dict[str, Any], project_root: Path = None) -> Dict[str, Any]:
    try:
        tool_name = input_data.get("tool_name", "Bash")
        command = input_data.get("tool_input", {}).get("command", "")
        if project_root is None:
            project_root = PROJECT_ROOT
        extracted_paths = extract_paths_from_command(command, str(project_root))
        for path in extracted_paths:
            path_type = get_path_type(path, command, config)
            if path_type and path_type != "normal":
                if path_type == ZERO_ACCESS_BLOCKED:
                    return {"error": f"{tool_name}: blocked by zero-access restriction", "result": False}
                elif path_type == READ_ONLY_BLOCKED:
                    blocked = True
                    reason = f"Blocked: {path_type} operation on {path_type} {path}"
                elif path_type == NO_DELETE_BLOCKED:
                    blocked, reason = check_path_patterns(command, path, [(r"\bcd\s+.*{path}", "cd")], str(project_root), path_type)
                    if blocked:
                        return {"error": f"{tool_name}: path is no-delete", "result": False}
        if DEBUG:
            print(f"DEBUG: Command passed: {command}", file=sys.stderr)
        return {"error": None, "result": True}
    except Exception as e:
        return {"error": f"{tool_name}: exception processing: {str(e)}", "result": False}

if __name__ == "__main__":
    input_str = sys.stdin.read()
    try:
        data = json.loads(input_str)
    except json.JSONDecodeError as e:
        result = {"error": f"Failed to parse input: {str(e)}", "result": False}
        print(json.dumps(result, indent=2))
        sys.exit(1)
    config_path = Path(__file__).absolute().parent / "config.yaml"
    if not config_path.is_file():
        for parent in Path(__file__).absolute().parent.parents:
            potential_config = parent / "config.yaml"
            if potential_config.is_file():
                config_path = potential_config
                break
    if not config_path or not config_path.is_file():
        print("Warning: Config not found", file=sys.stderr)
        sys.exit(0)
    with open(config_path, "r") as f:
        config = yaml.safe_load(f)
    result = process_bash_command(data, config)
    print(json.dumps(result, indent=2))
    sys.exit(0)
if DEBUG:
    DEBUG = True
