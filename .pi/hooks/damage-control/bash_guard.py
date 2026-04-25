#!/usr/bin/env python3
"""
Bash Guard - Blocks dangerous bash commands with user approval memory.

Features:
- First violation: Ask user for confirmation
- Repeated violations: Block and reject
- Approval stored per command pattern

Usage:
    python bash_guard.py "<command>"

Exit codes:
    0 = Allowed
    1 = Ask user (prompt for approval)
    2 = Blocked
"""

import sys
import os
import re
import json
import hashlib
from datetime import datetime

sys.path.insert(0, os.path.dirname(__file__))
from guard_utils import load_patterns, block, allow

APPROVAL_CACHE = "/home/zerwiz/CodeP/CodepOS/.pi/state/damage-control-approvals.json"

def load_approvals():
    """Load cached approvals."""
    if os.path.exists(APPROVAL_CACHE):
        try:
            with open(APPROVAL_CACHE) as f:
                return json.load(f)
        except:
            pass
    return {"approved": {}, "violations": {}}

def save_approvals(data):
    """Save approvals to cache."""
    import os
    os.makedirs(os.path.dirname(APPROVAL_CACHE), exist_ok=True)
    with open(APPROVAL_CACHE, "w") as f:
        json.dump(data, f, indent=2)

def get_command_hash(cmd):
    """Create a hash for command."""
    return hashlib.md5(cmd.encode()).hexdigest()[:12]

def record_violation(cmd_hash, reason, cmd):
    """Record a violation and return whether to block."""
    data = load_approvals()
    
    if cmd_hash not in data["violations"]:
        data["violations"][cmd_hash] = {
            "command": cmd[:100],
            "reason": reason,
            "count": 0,
            "first": datetime.now().isoformat()
        }
    
    data["violations"][cmd_hash]["count"] += 1
    data["violations"][cmd_hash]["last"] = datetime.now().isoformat()
    save_approvals(data)
    
    count = data["violations"][cmd_hash]["count"]
    
    if count == 1:
        return "ask", reason
    elif count == 2:
        return "warn", reason
    else:
        return "block", reason

def check_command(cmd):
    """Check a bash command against dangerous patterns."""
    patterns = load_patterns().get("bashToolPatterns", [])
    
    for p in patterns:
        pattern = p["pattern"]
        try:
            if re.search(pattern, cmd):
                reason = p.get("reason", "Dangerous command")
                cmd_hash = get_command_hash(cmd)
                
                action, final_reason = record_violation(cmd_hash, reason, cmd)
                
                if action == "ask":
                    print(f'{{"ask": true, "reason": "{final_reason}", "command": "{cmd[:200]}"}}')
                    sys.exit(1)
                elif action == "warn":
                    print(f'{{"warn": true, "reason": "{final_reason}", "command": "{cmd[:100]}", "count": 2}}', file=sys.stderr)
                    sys.exit(1)
                else:
                    block(f"{final_reason} (repeated violation)")
        except re.error:
            continue
    
    allow()

def main():
    if len(sys.argv) > 1:
        cmd = " ".join(sys.argv[1:])
    else:
        cmd = sys.stdin.read().strip()
    
    if not cmd:
        allow()
    
    check_command(cmd)

if __name__ == "__main__":
    main()