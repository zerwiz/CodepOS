# Damage Control Documentation for CodepOS

## Overview

Damage Control is a security extension for CodepOS that implements a three-tier protection system to prevent accidental or malicious file operations. It blocks dangerous commands and protects sensitive files before they can be affected.

## What This Extension Does

Damage Control protects your project by:

- **Blocking dangerous bash commands** (rm -rf, git reset --hard, terraform destroy, etc.)
- **Protecting zero-access paths** (secrets, credentials, .env, *.pem, ~/.ssh/)
- **Making read-only paths read-only** (lock files, system paths, package-lock.json)
- **Blocking deletion of protected files** (CLAUDE.md, README.md, LICENSE, .git/)
- **Validating file move operations** (mv, cp commands)
- **Blocking file paths outside the project directory**

## Protection Levels

| Level | Read | Write | Delete | Description |
|-------|------|-------|--------|-------------|
| **Zero Access** | ✗ | ✗ | ✗ | Secrets, credentials, sensitive paths |
| **Read Only** | ✓ | ✗ | ✗ | Lock files, system paths |
| **No Delete** | ✓ | ✓ | ✗ | Important project files |

## Configuration

### patterns.yaml

Edit the `patterns.yaml` file in `.pi/extensions/damage-control/` to customize protection rules.

#### Easy Editing Guide

```yaml
# Dangerous commands to block (add your own)
dangerousCommands:
  - "rm -rf *"      # Add this to block any rm with flags
  - "git reset"     # Add this to block all git resets
  - "chmod 777"     # Add this to block world-writable permissions

# Protected paths and their levels
protectedPaths:
  zero:
    - ".env"                    # Your secrets file
    - "secret*"                 # Any file starting with secret
  read-only:
    - "README.md"               # Your main readme
    - "CHANGELOG.md"
  no-delete:
    - "LICENSE"                 # License file
    - ".github/"                # GitHub workflows
```

#### Default Behavior

- **Outside project directory**: Blocked (prevents accessing system files)
- **Repeated violations**: After 2 warnings, operations are automatically blocked
- **First violation**: User is asked to confirm the operation

## Usage

### For Users

The extension works automatically. You'll see notifications when:

- A dangerous command is about to run (blocked with explanation)
- You're trying to access a protected path
- You're deleting a protected file

**Tip**: Review the notifications to understand what was blocked and why.

### For Developers

#### Check Command Safety

```bash
# Use the damage-control skill
pi skill damage-control check-safety operation="your-command"

# Or test directly
python .pi/extensions/damage-control/bash_guard.py "your-command"
```

#### List Protected Paths

```bash
pi skill damage-control list-protected
```

#### Add Custom Protection Rules

Edit `.pi/extensions/damage-control/patterns.yaml`:

```yaml
dangerousCommands:
  - "your-dangerous-command"
  
protectedPaths:
  zero:
    - "your-sensitive-file"
  read-only:
    - "your-lock-file"
```

Then rebuild:

```bash
bun run build
```

## How It Works

### Architecture

```
User → pi.dev → Extension → Damage Control → Check Patterns → Allow/Block/Ask
```

### Flow

1. **User** runs a command or operation
2. **Extension** intercepts via `registerPreToolUseHook`
3. **Damage Control** checks against configured patterns
4. **Result**:
   - Exit 0 = Allowed (proceed)
   - Exit 1 = Ask (prompt for confirmation)
   - Exit 2 = Blocked (reject operation)

### Guard Scripts

The extension uses three Python guard scripts:

- **bash_guard.py**: Validates bash commands
- **path_guard.py**: Validates path access (read/write/edit)
- **delete_guard.py**: Validates deletions and file moves

## Exit Codes

| Code | Meaning | Action |
|------|---------|--------|
| 0 | Allowed | Proceed with tool |
| 1 | Ask User | Prompt for confirmation |
| 2 | Blocked | Reject tool call |

## Protected Paths

### Zero Access (No Read/Write/Delete)

These paths contain secrets and credentials:

- `.env`, `.env.*`
- `*.pem`, `*.key`, `*.p12`, `*.pfx`
- `~/.ssh/`, `~/.aws/`, `~/.gnupg/`, `~/.kube/`
- `kubeconfig`, `secrets.yaml`
- `*.tfstate`, `*.tfstate.backup`
- `.vercel/`, `.netlify/`
- `firebase-adminsdk*.json`

### Read-Only (Read Only)

These paths can be read but not modified:

- `/etc/`, `/usr/`, `/bin/`, `/sbin/`, `/boot/`, `/root/`
- `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `bun.lockb`
- `README.md`, `LICENSE`, `CLAUDE.md`
- `CHANGELOG.md`, `CONTRIBUTING.md`
- `*.min.js`, `*.min.css`
- `dist/`, `build/`, `node_modules/`

### No Delete (Protected from Deletion)

These paths can be edited but not deleted:

- `CLAUDE.md`, `README.md`, `LICENSE`
- `.github/`, `.git/`, `.gitignore`
- `.pi/state/`, `.pi/extensions/`, `.pi/multi-team/`
- `Dockerfile`, `docker-compose.yml`
- `.dockerignore`

### Dangerous Commands

The extension blocks these dangerous bash commands:

- `rm -rf`, `rm -rf-`, `rm -rf/`
- `git reset --hard`, `git clean -f/-d`
- `chmod 777`, `chmod -R 777`
- `sudo rm`, `rm --recursive`, `rm --force`
- `terraform destroy`, `pulumi destroy`
- `kubectl delete namespace`, `helm uninstall`
- `aws s3 rm --recursive`, `aws s3 rb --force`
- `gcloud projects delete`, `gcloud compute instances delete`

## Testing

### Test Cases

```bash
# Should BLOCK (destructive command)
python .pi/extensions/damage-control/bash_guard.py "rm -rf /tmp"

# Should BLOCK (zero access)
python .pi/extensions/damage-control/path_guard.py write ".env"

# Should BLOCK (read only)
python .pi/extensions/damage-control/path_guard.py write "package-lock.json"

# Should ALLOW
python .pi/extensions/damage-control/bash_guard.py "ls -la"
python .pi/extensions/damage-control/path_guard.py write "src/app.py"
```

### Test Script

Create a test script to verify damage control:

```bash
#!/bin/bash
# test-damage-control.sh

echo "Testing damage control..."

# Test 1: Dangerous command
echo "Test 1: rm -rf /tmp"
python .pi/extensions/damage-control/bash_guard.py "rm -rf /tmp"
[ $? -eq 2 ] && echo "PASS: Blocked" || echo "FAIL: Not blocked"

# Test 2: Zero access path
echo "Test 2: Write to .env"
python .pi/extensions/damage-control/path_guard.py write ".env"
[ $? -eq 2 ] && echo "PASS: Blocked" || echo "FAIL: Not blocked"

# Test 3: Read only path
echo "Test 3: Write to package-lock.json"
python .pi/extensions/damage-control/path_guard.py write "package-lock.json"
[ $? -eq 2 ] && echo "PASS: Blocked" || echo "FAIL: Not blocked"

# Test 4: Outside project
echo "Test 4: Write to /etc/passwd"
python .pi/extensions/damage-control/path_guard.py write "/etc/passwd"
[ $? -eq 2 ] && echo "PASS: Blocked" || echo "FAIL: Not blocked"
```

## Troubleshooting

### Operation Blocked - But I Need It

Some operations may be blocked after repeated violations. To unblock:

1. **Wait for violation count to reset** (after system restart)
2. **Edit patterns.yaml** to add exceptions for your specific case
3. **Request approval** through the UI notification prompt

### Extension Not Loading

If the extension doesn't load:

1. Check `bun run build` for errors
2. Verify Python scripts exist in `.pi/extensions/damage-control/`
3. Check `.pi/extensions/damage-control/README.md` for requirements
4. Ensure `patterns.yaml` is valid YAML (no syntax errors)

### False Positives

If damage control blocks legitimate operations:

1. Add an exception in `patterns.yaml`
2. Use the `ask` behavior for first violation
3. Review the protected paths to ensure they're correct

## Security Best Practices

1. **Never disable damage control** - it's your first line of defense
2. **Review notifications** - understand why an operation was blocked
3. **Use validation scripts** - before deleting/moving files
4. **Keep patterns updated** - add new dangerous patterns as needed
5. **Document exceptions** - if you need to allow certain operations
6. **Regular audits** - review protected paths periodically

## Migration from Hooks

This extension replaced the old hooks system:

- **Old location**: `.pi/hooks/damage-control/`
- **New location**: `.pi/extensions/damage-control/`
- **Python scripts**: Moved and integrated into the extension
- **Migration guide**: See [pi.dev CHANGELOG](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/CHANGELOG.md#extensions-migration)

## Related Documentation

- [pi.dev Extensions Guide](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md)
- [Damage Control Patterns](.pi/extensions/damage-control/patterns.yaml)
- [Damage Control README](.pi/extensions/damage-control/README.md)

## License

MIT License

---

**Version**: 1.0.0  
**Author**: CodepOS Team  
**Last Updated**: 2025-01-01