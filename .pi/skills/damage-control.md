---
description: Security damage control for CodepOS - blocks dangerous commands and protects sensitive files
---

# CodepOS Damage Control

CodepOS implements Claude Code-style damage control to protect your project from accidental or malicious operations.

## Protection Levels

| Level | Read | Write | Delete | Description |
|-------|------|-------|--------|-------------|
| **Zero Access** | ✗ | ✗ | ✗ | Secrets, credentials |
| **Read Only** | ✓ | ✗ | ✗ | Lock files, system paths |
| **No Delete** | ✓ | ✓ | ✗ | CLAUDE.md, README.md |

## How It Works

```
You → pi → Guard Script → Check patterns → Allow/Block/Ask
```

Each tool call is checked against security patterns before execution.

## Protected Paths

**Zero Access (no access at all):**
- `.env`, `*.pem`, `*.key`, `secrets*`
- `~/.ssh/`, `~/.aws/`, `~/.gnupg/`
- `*credentials*.json`

**Read Only:**
- `package-lock.json`, `yarn.lock`, `bun.lockb`
- `.git/` directory
- `/etc/`, `/usr/`, `/bin/`

**No Delete:**
- `CLAUDE.md`, `.claude/`
- `README.md`, `LICENSE`
- `.github/`, `.git/`

## Violation Handling

1. **First violation**: User prompted for confirmation
2. **Second violation**: Warning displayed
3. **Third violation**: Blocked automatically

## Guard Scripts

| Script | Purpose |
|--------|---------|
| `bash_guard.py` | Blocks dangerous commands (rm -rf, etc.) |
| `path_guard.py` | Blocks protected path access |
| `delete_guard.py` | Blocks deletion of protected files |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Allowed |
| 1 | Ask user (prompt for approval) |
| 2 | Blocked |

## Customization

Edit `.pi/hooks/damage-control/patterns.yaml` to:
- Add/remove protected paths
- Add/remove dangerous command patterns
- Change protection levels

## Commands

```bash
# Check if a command is blocked
python .pi/hooks/damage-control/bash_guard.py "rm -rf /tmp"

# Check if a path is protected
python .pi/hooks/damage-control/path_guard.py write ".env"

# Check if deletion is allowed
python .pi/hooks/damage-control/delete_guard.py "CLAUDE.md"

# View approval history
cat .pi/state/damage-control-approvals.json
```