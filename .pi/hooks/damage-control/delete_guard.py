#!/usr/bin/env python3
"""
Delete Guard - Blocks deletion of protected files with user approval memory.

Features:
- First violation: Ask user for confirmation
- Repeated violations: Block and reject
- Approval stored per path

Usage:
    python delete_guard.py <path>

Exit codes:
    0 = Allowed
    1 = Ask user (prompt for approval)
    2 = Blocked
"""

import sys
import os
import json
import hashlib
from datetime import datetime

sys.path.insert(0, os.path.dirname(__file__))
from guard_utils import (
    load_patterns, 
    expand_path, 
    is_within_project, 
    block, 
    allow
)

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
    os.makedirs(os.path.dirname(APPROVAL_CACHE), exist_ok=True)
    with open(APPROVAL_CACHE, "w") as f:
        json.dump(data, f, indent=2)

def get_path_hash(path):
    """Create a hash for path."""
    return hashlib.md5(path.encode()).hexdigest()[:12]

def record_violation(path_hash, reason, path):
    """Record a violation and return whether to block."""
    data = load_approvals()
    
    if path_hash not in data["violations"]:
        data["violations"][path_hash] = {
            "path": path,
            "reason": reason,
            "count": 0,
            "first": datetime.now().isoformat()
        }
    
    data["violations"][path_hash]["count"] += 1
    data["violations"][path_hash]["last"] = datetime.now().isoformat()
    save_approvals(data)
    
    count = data["violations"][path_hash]["count"]
    
    if count == 1:
        return "ask", reason
    elif count == 2:
        return "warn", reason
    else:
        return "block", reason

def check_delete(path):
    """Check if file deletion should be blocked."""
    
    abs_path = os.path.abspath(expand_path(path))
    
    if not is_within_project(path):
        path_hash = get_path_hash(path)
        action, reason = record_violation(path_hash, "Path outside project", path)
        
        if action == "ask":
            print(f'{{"ask": true, "reason": "{reason}", "path": "{path}"}}')
            sys.exit(1)
        elif action == "warn":
            print(f'{{"warn": true, "reason": "{reason}", "path": "{path}", "count": 2}}', file=sys.stderr)
            sys.exit(1)
        else:
            block(f"{reason} (repeated violation)")
    
    patterns = load_patterns()
    no_delete = patterns.get("noDeletePaths", [])
    
    for protected in no_delete:
        expanded = expand_path(protected)
        if abs_path.startswith(expanded) or protected in abs_path:
            path_hash = get_path_hash(path)
            action, reason = record_violation(path_hash, f"Protected: {protected}", path)
            
            if action == "ask":
                print(f'{{"ask": true, "reason": "{reason}", "path": "{path}"}}')
                sys.exit(1)
            elif action == "warn":
                print(f'{{"warn": true, "reason": "{reason}", "path": "{path}", "count": 2}}', file=sys.stderr)
                sys.exit(1)
            else:
                block(f"{reason} (repeated violation)")
    
    allow()

def main():
    if len(sys.argv) < 2:
        print("Usage: delete_guard.py <path>", file=sys.stderr)
        sys.exit(1)
    
    path = sys.argv[1]
    check_delete(path)

if __name__ == "__main__":
    main()