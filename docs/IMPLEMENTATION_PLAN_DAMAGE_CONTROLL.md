# Plan: Implement Damage Control for pi.dev

## Goal
Implement Claude Code-style security hooks for pi.dev that:
- Block dangerous bash commands (rm -rf, git reset --hard, etc.)
- Protect zero-access paths (secrets, credentials, .env)
- Make read-only paths read-only (package-lock.json, .git/, etc.)
- Block deleting protected files
- Block file paths outside the project directory

---

## Phase 1: Core Security Scripts

### 1.1 Create Python Scripts

Location: `.pi/hooks/damage-control/`

```
.pi/hooks/damage-control/
├── patterns.yaml              # Security patterns (from claude-code-damage-control)
├── bash-guard.py             # Block dangerous bash commands
├── path-guard.py             # Block access to protected paths
├── delete-guard.py           # Block file deletion
└── __init__.py
```

### 1.2 Script Requirements

**bash-guard.py**
- Load `patterns.yaml`
- Check bash commands against `bashToolPatterns`
- Exit 0 = allow, Exit 2 = block

**path-guard.py**
- Check file paths in Write/Edit tools
- Enforce `zeroAccessPaths`, `readOnlyPaths`
- Check if path is outside project root

**delete-guard.py**
- Block delete operations in `noDeletePaths`
- Block deletion of files outside project

---

## Phase 2: Path Validation

### 2.1 Project Boundary Protection

```python
def is_within_project(path):
    project_root = os.getcwd()
    abs_path = os.path.abspath(path)
    return abs_path.startswith(project_root)
```

**Blocked:**
- `/home/zerwiz/...`
- `/etc/`
- `/tmp/`
- Any path outside project root

### 2.2 Path Protection Levels

| Level | Read | Write | Delete |
|-------|------|-------|--------|
| `zeroAccessPaths` | ✗ | ✗ | ✗ |
| `readOnlyPaths` | ✓ | ✗ | ✗ |
| `noDeletePaths` | ✓ | ✓ | ✗ |

### 2.3 Default Protections

**Zero Access (no read/write):**
- `.env`, `*.pem`, `*.key`, `secrets*`
- `~/.ssh/`, `~/.aws/`, `~/.gnupg/`
- `*credentials*.json`, `*service-account*.json`

**Read Only:**
- `package-lock.json`, `yarn.lock`, `bun.lockb`
- `.git/` directory
- System paths: `/etc/`, `/usr/`, `/bin/`

**No Delete:**
- `CLAUDE.md`, `.claude/`, `.github/`
- `README.md`, `LICENSE`, `CHANGELOG.md`
- `.git/` (except via git operations)

---

## Phase 3: pi.dev Integration

### 3.1 Create pi.dev Skill

Location: `.pi/skills/damage-control.md`

```markdown
---
description: Security damage control for pi.dev
---

# Damage Control

Blocks dangerous commands and protects sensitive files.

## Protected Paths

- Zero access: secrets, credentials, .env
- Read only: lock files, .git/, system paths
- No delete: CLAUDE.md, README.md, .github/
```

### 3.2 Create Hook Scripts

For pi.dev to use hooks, create scripts that can be integrated:

```bash
.pi/hooks/
├── pre-bash.sh      # Run before bash commands
├── pre-edit.sh      # Run before edit operations  
├── pre-write.sh     # Run before write operations
└── pre-delete.sh    # Run before delete operations
```

### 3.3 Alternative: pi.dev Extension

Create a pi extension that registers PreToolUse hooks:

```typescript
// .pi/extensions/damage-control/index.ts
import { defineTool, ExtensionContext } from "@mariozechner/pi-coding-agent";

export function activate(ctx: ExtensionContext) {
  ctx.registerPreToolUseHook("Bash", async (tool, context) => {
    const result = spawn("python", [".pi/hooks/damage-control/bash-guard.py", tool.command]);
    // Process result...
  });
}
```

---

## Phase 4: Implementation Tasks

### Task 4.1: Create Directory Structure

```
.pi/hooks/damage-control/
├── patterns.yaml
├── bash_guard.py
├── path_guard.py
├── delete_guard.py
└── guard_utils.py
```

### Task 4.2: Implement bash_guard.py

```python
#!/usr/bin/env python3
"""Block dangerous bash commands."""

import sys
import yaml
import re

def load_patterns():
    with open(".pi/hooks/damage-control/patterns.yaml") as f:
        data = yaml.safe_load(f)
    return data.get("bashToolPatterns", [])

def check_command(cmd):
    patterns = load_patterns()
    for p in patterns:
        pattern = p["pattern"]
        if re.search(pattern, cmd):
            if p.get("ask"):
                print(f'{{"ask": true, "reason": "{p["reason"]}"}}')
                return 2  # ASK
            print(f'BLOCKED: {p["reason"]}', file=sys.stderr)
            return 2  # BLOCK
    return 0  # ALLOW

if __name__ == "__main__":
    cmd = sys.stdin.read() if len(sys.argv) == 1 else sys.argv[1]
    sys.exit(check_command(cmd))
```

### Task 4.3: Implement path_guard.py

```python
#!/usr/bin/env python3
"""Block access to protected paths."""

import sys
import os
import yaml
import glob

def load_patterns():
    with open(".pi/hooks/damage-control/patterns.yaml") as f:
        return yaml.safe_load(f)

def expand_patterns(paths):
    expanded = []
    for p in paths:
        if "~" in p:
            p = os.path.expanduser(p)
        if "*" in p or "?" in p:
            expanded.extend(glob.glob(p))
        else:
            expanded.append(p)
    return expanded

def is_protected(path, patterns, mode):
    abs_path = os.path.abspath(path)
    project_root = os.getcwd()
    
    # Outside project = blocked
    if not abs_path.startswith(project_root):
        return True, "Path is outside project directory"
    
    for protected in patterns:
        if protected.startswith("/"):
            if abs_path.startswith(protected):
                return True, f"System path: {protected}"
        elif protected in abs_path:
            return True, f"Protected: {protected}"
    
    return False, None

def main():
    if len(sys.argv) < 3:
        print("Usage: path_guard.py <mode> <path>", file=sys.stderr)
        sys.exit(1)
    
    mode = sys.argv[1]  # write, edit
    path = sys.argv[2]
    
    data = load_patterns()
    
    if mode in ("write", "edit"):
        if is_protected(path, data.get("zeroAccessPaths", []), "zero"):
            print("BLOCKED: Zero access path", file=sys.stderr)
            sys.exit(2)
        if is_protected(path, data.get("readOnlyPaths", []), "read"):
            print("BLOCKED: Read-only path", file=sys.stderr)
            sys.exit(2)
    
    sys.exit(0)

if __name__ == "__main__":
    main()
```

### Task 4.4: Implement delete_guard.py

```python
#!/usr/bin/env python3
"""Block deletion of protected files."""

import sys
import os
import yaml

def load_patterns():
    with open(".pi/hooks/damage-control/patterns.yaml") as f:
        return yaml.safe_load(f)

def is_protected_delete(path):
    abs_path = os.path.abspath(path)
    project_root = os.getcwd()
    
    # Outside project = blocked
    if not abs_path.startswith(project_root):
        return True, "Cannot delete files outside project"
    
    data = load_patterns()
    no_delete = data.get("noDeletePaths", [])
    
    for protected in no_delete:
        if protected in abs_path:
            return True, f"Cannot delete: {protected}"
    
    return False, None

def main():
    if len(sys.argv) < 2:
        print("Usage: delete_guard.py <path>", file=sys.stderr)
        sys.exit(1)
    
    path = sys.argv[1]
    protected, reason = is_protected_delete(path)
    
    if protected:
        print(f"BLOCKED: {reason}", file=sys.stderr)
        sys.exit(2)
    
    sys.exit(0)

if __name__ == "__main__":
    main()
```

### Task 4.5: Create guard_utils.py

```python
"""Shared utilities for damage control guards."""

import os
import yaml

PROJECT_ROOT = os.getcwd()

def load_patterns():
    patterns_path = os.path.join(PROJECT_ROOT, ".pi", "hooks", "damage-control", "patterns.yaml")
    if os.path.exists(patterns_path):
        with open(patterns_path) as f:
            return yaml.safe_load(f)
    return {}

def is_within_project(path):
    """Check if path is within project directory."""
    abs_path = os.path.abspath(path)
    return abs_path.startswith(PROJECT_ROOT)

def expand_path(path):
    """Expand ~ and relative paths."""
    if path.startswith("~"):
        return os.path.expanduser(path)
    if not os.path.isabs(path):
        return os.path.join(PROJECT_ROOT, path)
    return path
```

---

## Phase 5: Testing

### 5.1 Test Cases

```bash
# Should BLOCK (outside project)
python .pi/hooks/damage-control/bash_guard.py "rm -rf /tmp/test"
python .pi/hooks/damage-control/path_guard.py write "/etc/passwd"

# Should BLOCK (zero access)
python .pi/hooks/damage-control/path_guard.py write ".env"
python .pi/hooks/damage-control/path_guard.py write "*.pem"

# Should BLOCK (read only)
python .pi/hooks/damage-control/path_guard.py write "package-lock.json"
python .pi/hooks/damage-control/path_guard.py write ".git/config"

# Should BLOCK (no delete)
python .pi/hooks/damage-control/delete_guard.py "CLAUDE.md"
python .pi/hooks/damage-control/delete_guard.py ".github/"

# Should ALLOW
python .pi/hooks/damage-control/bash_guard.py "ls -la"
python .pi/hooks/damage-control/path_guard.py write "src/app.py"
python .pi/hooks/damage-control/delete_guard.py "tempfile.tmp"
```

### 5.2 Integration Test

Create a test script that simulates rogue commands:

```bash
#!/bin/bash
# test-damage-control.sh

echo "Testing damage control..."
echo ""

# Test 1: Dangerous command
echo "Test 1: rm -rf /tmp"
python .pi/hooks/damage-control/bash_guard.py "rm -rf /tmp"
[ $? -eq 2 ] && echo "PASS: Blocked" || echo "FAIL: Not blocked"

# Test 2: Zero access path
echo "Test 2: Write to .env"
python .pi/hooks/damage-control/path_guard.py write ".env"
[ $? -eq 2 ] && echo "PASS: Blocked" || echo "FAIL: Not blocked"

# Test 3: Read only path
echo "Test 3: Write to package-lock.json"
python .pi/hooks/damage-control/path_guard.py write "package-lock.json"
[ $? -eq 2 ] && echo "PASS: Blocked" || echo "FAIL: Not blocked"

# Test 4: Outside project
echo "Test 4: Write to /etc/passwd"
python .pi/hooks/damage-control/path_guard.py write "/etc/passwd"
[ $? -eq 2 ] && echo "PASS: Blocked" || echo "FAIL: Not blocked"
```

---

## Phase 6: Documentation

### 6.1 Update CLAUDE.md

```markdown
# CodepOS - Damage Control Enabled

This project has Claude Code Damage Control installed.

## Protected Paths

- **Zero Access**: .env, *.pem, ~/.ssh/, ~/.aws/
- **Read Only**: package-lock.json, .git/, /etc/
- **No Delete**: CLAUDE.md, README.md, .github/

## Security Rules

1. Never delete files in noDeletePaths
2. Never write to zeroAccessPaths or readOnlyPaths
3. Never run commands that access paths outside the project
4. Dangerous commands (rm -rf, git reset --hard) are blocked
```

### 6.2 Create SECURITY.md

```markdown
# Security - Damage Control

## Overview

This project implements Claude Code Damage Control to prevent accidental or malicious file operations.

## Protection Levels

| Level | Description |
|-------|-------------|
| Zero Access | No read/write/delete allowed |
| Read Only | Read allowed, modifications blocked |
| No Delete | All operations except delete |

## Adding Custom Rules

Edit `.pi/hooks/damage-control/patterns.yaml` to add custom patterns.
```

---

## Priority Order

1. **Phase 1**: Create directory structure and core scripts
2. **Phase 2**: Implement path validation
3. **Phase 3**: Integrate with pi.dev (via skill or extension)
4. **Phase 4**: Add all security patterns
5. **Phase 5**: Test all guards
6. **Phase 6**: Update documentation

---

## Files to Create

```
.pi/hooks/damage-control/
├── patterns.yaml           # Security patterns (copy from claude-code-damage-control)
├── bash_guard.py          # Bash command guard
├── path_guard.py          # Path access guard
├── delete_guard.py        # Delete guard
├── guard_utils.py         # Shared utilities
└── test_guard.py          # Test script

.pi/skills/
└── damage-control.md      # pi.dev skill

docs/
└── DAMAGE_CONTROL.md      # Documentation
```

---

## Exit Codes

| Code | Meaning | Action |
|------|---------|--------|
| 0 | Allowed | Proceed with tool |
| 2 | Blocked | Reject tool call |
| JSON | Ask | Prompt user for confirmation |