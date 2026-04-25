#!/usr/bin/env python3
"""Shared utilities for damage control guards."""

import os
import sys
import yaml
import glob
import json

PROJECT_ROOT = os.getcwd()
PATTERNS_PATH = os.path.join(PROJECT_ROOT, ".pi", "hooks", "damage-control", "patterns.yaml")
APPROVAL_CACHE = os.path.join(PROJECT_ROOT, ".pi", "state", "damage-control-approvals.json")

def load_patterns():
    """Load patterns from patterns.yaml"""
    if os.path.exists(PATTERNS_PATH):
        with open(PATTERNS_PATH) as f:
            return yaml.safe_load(f)
    return {
        "zeroAccessPaths": [],
        "readOnlyPaths": [],
        "noDeletePaths": [],
        "bashToolPatterns": []
    }

def expand_path(path):
    """Expand ~ and relative paths."""
    if "~" in path:
        path = os.path.expanduser(path)
    if not os.path.isabs(path):
        path = os.path.join(PROJECT_ROOT, path)
    return os.path.normpath(path)

def is_within_project(path):
    """Check if path is within project directory."""
    abs_path = os.path.abspath(expand_path(path))
    return abs_path.startswith(PROJECT_ROOT)

def matches_pattern(path, patterns):
    """Check if path matches any protected pattern."""
    abs_path = os.path.abspath(path)
    for pattern in patterns:
        # Handle glob patterns
        if "*" in pattern or "?" in pattern:
            # Check if the pattern could match
            if pattern.startswith("."):
                if pattern in abs_path or abs_path.endswith(pattern):
                    return True
            elif "/" in pattern:
                if pattern in abs_path:
                    return True
        else:
            # Direct path match
            if pattern in abs_path:
                return True
    return False

def block(reason):
    """Print block message and exit with code 2."""
    print(f"BLOCKED: {reason}", file=sys.stderr)
    sys.exit(2)

def allow():
    """Exit with code 0 (allowed)."""
    sys.exit(0)

def ask(reason):
    """Return ask response (exit code 2 with JSON)."""
    print(json.dumps({"ask": True, "reason": reason}))
    sys.exit(2)