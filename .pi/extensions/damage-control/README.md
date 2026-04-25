# Damage Control Extension

This extension provides security damage control to prevent accidental or
malicious file operations by blocking dangerous commands and protecting
sensitive files.

## 🔒 Damage Control First Line of Defense

```typescript
// Example: Blocked dangerous commands
python bash_guard.py "rm -rf /"
# Output: { allowed: false, reason: "⚠️ Blocked: shell_patterns"}

python bash_guard.py "ls -la"
# Output: { allowed: true, reason: null }

python bash_guard.py "git reset --hard"
# Output: { allowed: false, reason: "⚠️ Blocked: git_patterns"}
```

## 🛡️ Protected Path Examples

```typescript
// Zero Access (no read/write)
.env          → ✅ Protected
*.pem         → ✅ Protected
*.key         → ✅ Protected
~/.ssh/       → ✅ Protected

// Read Only (read-only access)
.git/         → ✅ Read Only
package-lock.json → ✅ Read Only
README.md     → ✅ Read Only

// No Delete Protection
CLAUDE.md     → ✅ Cannot delete
LICENSE       → ✅ Cannot delete
.git/         → ✅ Cannot delete
```

## ⚙️ Dangerous Command Patterns Blocked

### Shell Commands
```bash
# DELETED: rm -rf /  → ❌ Blocked
# SAFE: ls -la      → ✅ Allowed
# SAFE: touch test.txt   → ✅ Allowed
```

### Git Operations
```bash
# DELETED: git reset --hard  → ❌ Blocked
# SAFE: git status    → ✅ Allowed
# SAFE: git log    → ✅ Allowed
```

### Kubernetes
```bash
# DELETED: kubectl delete namespace default      → ❌ Blocked
# SAFE: kubectl get pods    → ✅ Allowed
# SAFE: kubectl apply   → ✅ Allowed
```

### Infrastructure
```bash
# DELETED: terraform destroy    → ❌ Blocked
# SAFE: terraform apply    → ✅ Allowed
# SAFE: terraform init    → ✅ Allowed
```

### Ansible
```bash
# DELETED: ansible-playbook clean    → ❌ Blocked
# SAFE: ansible playbook    → ✅ Allowed
```

### System Operations
```bash
# DELETED: chmod 777 /etc/passwd    → ❌ Blocked
# SAFE: chmod 644 file.log    → ✅ Allowed
```

## 📋 Implementation Examples

### Example 1: Validate Path
```typescript
// Check if path can be written to
const isWritable = await validatePath("/path/to/file", "write");
if (!isWritable.allowed) {
  ctx.ui.notify(
    "⚠️ Cannot write to file outside project directory",
    "error",
  );
}
```

### Example 2: Validate Delete
```typescript
// Check if file can be deleted
const isDeletable = await validateDelete("/path/to/file");
if (!isDeletable.allowed) {
  ctx.ui.notify(
    "⚠️ Cannot delete file: " + isDeletable.reason,
    "error",
  );
}
```

### Example 3: Check Safety
```typescript
// Use damage-control skill
const result = await ctx.skill.skill.check-safety({
  operation: "rm -rf /tmp",
});
if (result.type === "danger") {
  ctx.ui.notify(result.text, "error");
}
```

## 🎯 Guard Config Examples

```typescript
interface DangerousCommand {
  id: string;
  pattern: RegExp;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  message: string;
}

// Example dangerous command pattern
const kubectlDeletePattern: DangerousCommand = {
  id: "kubectl-delete-all",
  pattern: /kubectl\s+[-a-z]+\s+[-a-z]+\/?/,
  category: "Kubernetes",
  severity: "critical",
  message: "⚠️ Dangerous: kubectl delete all resources detected",
};
```

## 📂 File Structure

```
.pi/extensions/damage-control/
├── index.ts              → Extension activation
├── bash_guard.py        → Python command validation
├── README.md            → This document
└── FILE_MOVE_GUIDELINES.md → File move guidelines
```

## 🚀 Usage

### Check if command is safe
```bash
python .pi/extensions/damage-control/bash_guard.py "ls -la"
# Output: { "allowed": true }

python .pi/extensions/damage-control/bash_guard.py "rm -rf /"
# Output: { "allowed": false, "reason": "..." }
```

### Validate path
```typescript
const result = await validatePath("/path", operation);
// Returns: { allowed: boolean, reason: string | null }
```

### Register as agent
```typescript
ctx.registerAgent({
  name: "damage-control",
  description: "Provides damage control for bash commands",
  capabilities: [
    "bash-command-validation",
    "path-access-control",
    "sensitive-file-protection",
  ],
});
```

## 🛠️ Extension API

### Available Hooks
- `registerPreToolUseHook` - Block dangerous operations

### Available Skills
- `damage-control-safety` - Check operation safety
- `damage-control-protected-paths` - List protected files
- `damage-control-dangerous-commands` - List blocked commands

### Available Agents
- `damage-control` - Main damage control agent

