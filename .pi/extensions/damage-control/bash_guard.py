#!/usr/bin/env python3
"""
Damage Control Bash Guard - Security Guard for Dangerous Commands

This script validates bash commands against a set of dangerous patterns
including infrastructure and cloud-native operations that could cause
accidental data loss or system compromise.

Usage:
    python bash_guard.py <command>

Exit codes:
    0 - Command is safe to execute
    1 - Command is dangerous and blocked
    2 - Unknown error occurred
"""

import sys
import re
import json

# Dangerous command patterns for infrastructure operations
INFRASTRUCTURE_PATTERNS = {
    "kubectl_delete_namespace": r"kubectl\s+delete\s+namespace\s+[-\w]+",
    "kubectl_delete_all": r"kubectl\s+delete\s+-[a-z]+\s+(-[a-z]+)*/?",
    "kubectl_replace_secret": r"kubectl\s+replace|kubectl\s+apply\s+--force",
    "kubectl_patch_node": r"kubectl\s+patch\s+nodes?/?\s+[-\w]+",
    "kubectl_scale_down": r"kubectl\s+scale\s+-[a-z]+\.?/[\w\-]+.*0",
}

# Dangerous terraform patterns
TERRAFORM_PATTERNS = {
    "terraform_destroy": r"terraform\s+destroy.*-(f|force|-force-destroy)?",
    "terraform_apply_unconfirmed": r"terraform\s+apply\s+!?",
    "terraform_init_destroy": r"terraform\s+init.*terraform.*destroy",
}

# Dangerous ansible patterns
ANSIBLE_PATTERNS = {
    "ansible_playbook_clean": r"ansible-playbook.*clean|ansible playbook.*purge.*all",
    "ansible_inventory_remove": r"ansible.*inventory.*-remove$",
    "ansible_remove_all": r"ansible.*-a=.*-.*remove.*all",
    "ansible_reset_hosts": r"ansible.*hosts.*-r",
}

# Dangerous git patterns
GIT_PATTERNS = {
    "git_reset_hard": r"git\s+reset\s+--hard",
    "git_revert_force": r"git\s+revert.*--force.*--no-edit",
    "git_clean": r"git\s+clean\s+-[fd]?",
    "git_pull_ff": r"git\s+(pull|merge).*--ff|ff|squash",
    "git_force_push": r"git\s+(push|force-push|\S*-(-f|--force))",
    "git_rebase_ff": r"git\s+rebase.*--ff|squash",
}

# Dangerous shell patterns
SHELL_PATTERNS = {
    "rm_rf_recursive": r"rm\s+(-[^\s\r\f])*-[rfR]|\b(?:rm\s+(-Rf)?\s+|-f\s+rm)\s+/-\./",
    "rm_rf_all": r"rm\s+-rf[^a-zA-Z0-9]|rm\s+(-[^\s\rfF])*-[rR]|rm\s+(-Rf)*\s+/-\.",
    "find_xdel_permission": r"find\s+.*-.*-x.*-.*-del.*",
    "chmod_777": r"(?:sudo\s+)?chmod\s+777[^\s]*|\s+777\s+(?:\w+|\s)",
    "chmod_o+w": r"chmod\s+(?:\S+\s+)?o\+=\w",
    "rm_recursive": r"rm\s+(-Rf)*\s+[-.]/",
    "find_delete_recursive": r"find\s+.*-.*-exec.*rm\s+-rf",
    "rm_tmp_all": r"rm\s+(?:-f|\S*\s+)?-[rR](?:f|f+)?\s+.*/tmp/?",
    "delete_git": r"os\s+-remove.*git",
    "chmod_git_dir": r"chmod\s+-[w+]?[rw]+.*\.git",
    "chmod_git_config": r"chmod.*\.git.*\.config",
    "chmod_git_hooks": r"chmod.*\.(git|pre-commit|post-commit).*-r?",
}

# Dangerous curl/wget patterns (unverified, dangerous)
CURL_PATTERNS = {
    "curl_exec_force": r"curl.*-O.*!?",
    "wget_download_all": r"(curl|wget).*-[fF]|\s+[-rfF][rF]?[-dD]|\s+[-dD][-fF]",
    "wget_curl_all": r"(curl|wget).*\s+\S*-f.*-d",
}

# Dangerous system commands
SYSTEM_PATTERNS = {
    "systemctl_disable_all": r"systemctl\s+disable.*-all|systemctl\s+disable\s+[-\w]+",
    "systemctl_start_all": r"systemctl\s+enable.*all.*-t",
    "usermod_addsudo_noauth": r"usermod.*-aG.*sudo.*-[naN]?oauth",
}

# Dangerous apt/conda patterns
APT_PATTERNS = {
    "apt_get_all": r"apt\s+get\s+install.*\S*-y",
    "apt_dpkg_install": r"dpkg.*add|apt.*dpkg.*add",
}

# Pattern compilation
def compile_patterns(pattern_dict):
    return [re.compile(p) for p in pattern_dict]

PATTERNS = {
    **INFRASTRUCTURE_PATTERNS,
    **TERRAFORM_PATTERNS,
    **ANSIBLE_PATTERNS,
    **GIT_PATTERNS,
    **SHELL_PATTERNS,
    **CURL_PATTERNS,
    **SYSTEM_PATTERNS,
    **APT_PATTERNS,
}

COMPILATED_PATTERNS = {k: compile_patterns(v) for k, v in PATTERNS.items()}


def validate_command(command: str) -> dict:
    """
    Validate a bash command against dangerous patterns.
    
    Args:
        command: The bash command to validate
    
    Returns:
        dict with keys:
            - allowed: bool (True if command is safe)
            - reason: str (reason for blocking, if blocked)
    """
    command_upper = command.strip().upper()
    command_original = command
    
    # Check each pattern category
    for category, compiled in COMPILATED_PATTERNS.items():
        for pattern in compiled:
            try:
                if pattern.search(command_original):
                    return {
                        "allowed": False,
                        "reason": f"⚠️ Blocked: {category}\nOriginal: {command_original}",
                    }
            except re.error:
                continue
    
    return {
        "allowed": True,
        "reason": None,
    }


def run_command(command: str) -> dict:
    """
    Validate and log command execution.
    
    Args:
        command: The bash command to execute
    
    Returns:
        dict with execution result
    """
    # Validate command first
    validation = validate_command(command)
    
    if not validation["allowed"]:
        return {
            "exit_code": 1,
            "stdout": json.dumps(validation, indent=2),
            "stderr": None,
        }
    
    # Command is allowed
    try:
        # Execute the command (in real implementation this would be exec or subprocess)
        result = {
            "exit_code": 0,
            "stdout": f"✅ Command allowed: {command}",
            "stderr": None,
        }
    except Exception as e:
        result = {
            "exit_code": -1,
            "stdout": f"Command executed: {command}",
            "stderr": str(e),
        }
    
    return result


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({
            "exit_code": 2,
            "stdout": "Usage: python bash_guard.py <command>",
            "stderr": None,
        }))
        sys.exit(2)
    
    command = " ".join(sys.argv[1:])
    result = validate_command(command)
    
    # Output JSON for programmatic use
    print(json.dumps(result))
    
    if not result["allowed"]:
        sys.exit(1)
    else:
        sys.exit(0)
