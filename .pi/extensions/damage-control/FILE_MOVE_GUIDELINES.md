# File Move Guidelines

This document provides guidelines for using the `mv` and `cp` commands, which are validated through the damage-control system.

## 🛡️ Damage-Control Validation

All file moves (`mv`, `cp`) are validated through the damage-control system:

```bash
# This will be validated by damage-control
mv file.txt ./folder/

# This will be validated by damage-control
cp file1.txt file2.txt
```

## ✅ Safe Operations

### Moving Files
```bash
# SAFE: Move within project
mv file.txt .

# SAFE: Move project file to same directory
mv src/old.js src/new.js

# SAFE: Create backups
cp config.json config.json.backup

# SAFE: Create gitignore (safe operation)
touch .gitignore
```

### Creating Files
```bash
# SAFE: Create new file
touch README.md

# SAFE: Create folder
mkdir my-folder

# SAFE: Create gitkeep files
touch .gitkeep

# SAFE: Create git hook directories
mkdir -p .git/hooks
```

## ❌ Unsafe Operations

```bash
# UNSAFE: Outside project directory
mv ../secret.txt ./

# UNSAFE: Attempting protected path
mv .env .env.backup  # Will be blocked

# UNSAFE: Delete git hooks
rm -rf .git/hooks/*  # Will be blocked
```

## 📋 Protected Files

### Zero Access (Cannot Read or Write)
- `.env`
- `*.pem`
- `*.key`
- `~/.ssh/`
- `~/.aws/`

### Read Only (Cannot Modify or Delete)
- `.git/`
- `.github/`
- `.claude/`
- `CLAUDE.md`
- `README.md`
- `LICENSE`
- `CODEP.md`

## 🎯 Damage-Control Integration

### Example: Validated File Move
```typescript
// Example of damage-control validation
export async function validateFileMove(original: string, destination: string): Promise<GuardResult> {
  // Check if original exists and can be read
  // Check if destination is within project
  // Check if destination is protected
  // Check for permission issues
  return { allowed: boolean, reason: string | null };
}
```

### Example: Protected Operations
```typescript
// Operations that are protected
- Moving files outside project
- Deleting protected files
- Overwriting other protected files
- Accessing sensitive paths without permission
```

## 🔐 Permission Check Examples

```bash
#!/bin/bash
# Example: Checking file permissions
stat file.txt

# Example: Checking if path protects files
ls -la /protected/path/

# Example: Safe file operation
touch .gitignore
```

