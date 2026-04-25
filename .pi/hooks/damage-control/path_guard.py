#!/usr/bin/env python3
"""
Path Guard - Blocks access to protected paths with user approval memory.

Features:
- First violation: Ask user for confirmation
- Repeated violations: Block and reject
- Approval stored per path/pattern

Usage:
    python path_guard.py <mode> <path>

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
    matches_pattern,
    block, 
    allow,
    PROJECT_ROOT
)

APPROVAL_CACHE = os.path.join(PROJECT_ROOT, ".pi", "state", "damage-control-approvals.json")

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

def get_path_hash(path, mode):
    """Create a hash for path+mode combination."""
    key = f"{mode}:{path}"
    return hashlib.md5(key.encode()).hexdigest()[:12]

def record_violation(path_hash, reason, path, mode):
    """Record a violation and return whether to block."""
    data = load_approvals()
    
    if path_hash not in data["violations"]:
        data["violations"][path_hash] = {
            "path": path,
            "mode": mode,
            "reason": reason,
            "count": 0,
            "first": datetime.now().isoformat()
        }
    
    data["violations"][path_hash]["count"] += 1
    data["violations"][path_hash]["last"] = datetime.now().isoformat()
    save_approvals(data)
    
    count = data["violations"][path_hash]["count"]
    
    # First violation: Ask user
    # Second: Warn
    # Third+: Block
    if count == 1:
        return "ask", reason
    elif count == 2:
        return "warn", reason
    else:
        return "block", reason

def check_path(mode, path):
    """Check if path access should be blocked."""
    
    abs_path = os.path.abspath(expand_path(path))
    
    # Check if path is outside project
    if not is_within_project(path):
        path_hash = get_path_hash(path, mode)
        action, reason = record_violation(path_hash, "Path outside project", path, mode)
        
        if action == "ask":
            print(f'{{"ask": true, "reason": "{reason}", "path": "{path}", "mode": "{mode}"}}')
            sys.exit(1)
        elif action == "warn":
            print(f'{{"warn": true, "reason": "{reason}", "path": "{path}", "count": 2}}', file=sys.stderr)
            sys.exit(1)
        else:
            block(f"{reason} (repeated violation)")
    
    # Check zero access paths
    patterns = load_patterns()
    zero_access = patterns.get("zeroAccessPaths", [])
    
    for protected in zero_access:
        expanded = expand_path(protected)
        if abs_path.startswith(expanded) or protected in abs_path:
            path_hash = get_path_hash(path, mode)
            action, reason = record_violation(path_hash, f"Zero access: {protected}", path, mode)
            
            if action == "ask":
                print(f'{{"ask": true, "reason": "{reason}", "path": "{path}", "mode": "{mode}"}}')
                sys.exit(1)
            elif action == "warn":
                print(f'{{"warn": true, "reason": "{reason}", "path": "{path}", "count": 2}}', file=sys.stderr)
                sys.exit(1)
            else:
                block(f"{reason} (repeated violation)")
    
    # For write/edit, check read-only paths
    if mode in ("write", "edit"):
        read_only = patterns.get("readOnlyPaths", [])
        
        for protected in read_only:
            expanded = expand_path(protected)
            if abs_path.startswith(expanded) or protected in abs_path:
                path_hash = get_path_hash(path, mode)
                action, reason = record_violation(path_hash, f"Read-only: {protected}", path, mode)
                
                if action == "ask":
                    print(f'{{"ask": true, "reason": "{reason}", "path": "{path}", "mode": "{mode}"}}')
                    sys.exit(1)
                elif action == "warn":
                    print(f'{{"warn": true, "reason": "{reason}", "path": "{path}", "count": 2}}', file=sys.stderr)
                    sys.exit(1)
                else:
                    block(f"{reason} (repeated violation)")
    
    allow()

def main():
    if len(sys.argv) < 3:
        print("Usage: path_guard.py <mode> <path>", file=sys.stderr)
        print("Modes: read, write, edit", file=sys.stderr)
        sys.exit(1)
    
    mode = sys.argv[1].lower()
    path = sys.argv[2]
    
    if mode not in ("read", "write", "edit"):
        print(f"Invalid mode: {mode}", file=sys.stderr)
        sys.exit(1)
    
    check_path(mode, path)

if __name__ == "__main__":
    main()