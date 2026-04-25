# CodepOS Multi-Team System Documentation

## 🎯 Overview

This project is for CodepOS, a multi-agent coding assistant designed to help users with various AI agents working together.

## 🏗️ Architecture

### Damage Control Layer
```
.pi/
├── extensions/
│   ├── damage-control/           ← BLOCKS DANGEROUS COMMANDS
│   │   ├── bash_guard.py         ← Validates bash commands
│   │   ├── path_guard.py         ← Validates path access
│   │   └── delete_guard.py       ← Validates deletions
│   └── ui-extension.ts           ← Registers UI tools
│         ├── damage-control-display        ← Shows damage control status
│         └── damage-control-safety         ← Checks safety
└── multi-team/
    ├── agents/                   ← All AI agents
    ├── councils/                 → Agent consensus
    └── teams/                   → Team workflows
```

## ⚠️ Damage Control Guardrails

### Blocked Dangerous Commands

```bash
# Shell commands blocked
❌ rm -rf /*                    → BLOCKED
❌ rm -rf                      → BLOCKED  
✅ ls -la                      → ALLOWED

# Git operations blocked
❌ git reset --hard            → BLOCKED
❌ git clean -f                → BLOCKED
✅ git status                  → ALLOWED

# Kubernetes operations blocked
❌ kubectl delete namespace    → BLOCKED
❌ kubectl delete all          → BLOCKED
✅ kubectl get pods            → ALLOWED

# Infrastructure blocked
❌ terraform destroy           → BLOCKED
❌ ansible playbook clean      → BLOCKED
✅ terraform init              → ALLOWED

# System operations blocked
❌ chmod 777 *                 → BLOCKED
❌ sudo rm                     → BLOCKED
✅ chmod 644 file.txt          → ALLOWED
```

### Protected Paths

```typescript
// Zero Access (secrets)
.env          → ❌ No read/write access
*.pem         → ❌ No read/write access
*.key         → ❌ No read/write access

// Read Only
.git/         → ✅ Read-only access
README.md     → ✅ Read-only access
package-lock.json → ✅ Read-only access

// No Delete
LICENSE       → ❌ Cannot delete
CLAUDE.md     → ❌ Cannot delete
.git/*        → ❌ Cannot delete
```

## 💻 Inline Code Examples

### Example 1: Validate Command Safety
```typescript
// Check if command is safe to execute
const isSafe = await validateCommand("ls -la");
if (!isSafe) {
  ctx.ui.notify("⚠️ Command blocked by damage control", "error");
}

// Safe command
const result = await validateCommand("git status");
if (result.allowed) {
  ctx.executeTool("Bash", { command: "git status" });
}
```

### Example 2: Validate Path Access
```typescript
// Check if file can be written to
const isWritable = await validatePath("/path/to/file", "write");
if (isWritable.allowed) {
  ctx.tools.write({ filePath, oldContent, newContent });
} else {
  ctx.ui.notify(isWritable.reason, "error");
}

// Check if file can be deleted
const isDeletable = await validateDelete(filePath);
if (isDeletable.allowed) {
  await ctx.deleteFile(filePath);
} else {
  ctx.ui.notify(isDeletable.reason, "error");
}
```

### Example 3: Register Agent
```typescript
// Register a new AI agent
ctx.registerAgent({
  name: "my-new-agent",
  description: "This agent handles specific tasks",
  capabilities: [
    "task-1",
    "task-2",
    "task-3",
  ],
  model: "mistral-large",
  system: "You are a helpful agent.",
});
```

### Example 4: Register Skill
```typescript
// Register a skill for the agent
ctx.registerSkill({
  name: "my-skill",
  description: "This skill helps with my-task",
  actions: [
    {
      name: "perform-action",
      description: "Perform task",
      execute: async (args) => {
        // Perform the actual task
        return { result: true };
      },
    },
  ],
});
```

### Example 5: Tool Definition
```typescript
// Register a typed tool
pi.registerTool({
  name: "my-tool",
  description: "My custom tool for my-task",
  parameters: {
    task: {
      type: "string",
      description: "The task to perform",
      required: true,
    },
    context: {
      type: "object",
      description: "Task execution context",
      properties: {
        workspace: { type: "string" },
        files: { type: "array" },
      },
    },
  },
  execute: async (args, ctx) => {
    const { task } = args;
    const result = await myCustomLogic(task, ctx);
    return { success: true, result };
  },
});
```

### Example 6: Error Handling
```typescript
// Graceful error handling
try {
  const result = await ctx.executeTool("MyTool", args);
  ctx.ui.notify(`Success: ${JSON.stringify(result)}`, "success");
} catch (e) {
  ctx.ui.notify(`Error: ${e.message}`, "error");
}
```

### Example 7: Agent Communication
```typescript
// Multi-agent consensus
const agents = [
  { name: "scout", question: "Is this file safe to delete?" },
  { name: "auditor", question: "Is this operation safe?" },
  { name: "security", question: "Does this affect security?" },
];

for (const agent of agents) {
  const response = await ctx.agentResponse(agent.name, agent.question);
  console.log(`${agent.name}: ${response.text}`);
  
  if (response.safelyExecute && !response.deny) {
    // All agents agree it's safe
    await ctx.executeTool("Bash", { command });
  }
}
```

### Example 8: Dashboard Display
```typescript
// Display multi-team status in status bar
// Status bar: [scout] [auditor] [security] [orchestrator] [council]

// Example: Council decision
if (councilDecided) {
  // Council has made a decision
  const action = councilDecided.to;
  if (action.deny) {
    ctx.ui.notify("⚠️ Council denied the operation", "error");
  } else if (action.safelyExecute) {
    await ctx.executeTool("Bash", { command });
  }
}
```

### Example 9: Agent Health Monitoring
```typescript
// Monitor agent health
const healthStatus = await getAgentHealth();
if (!healthStatus.isHealthy) {
  ctx.ui.notify(
    `⚠️ Agent health alert: ${healthStatus.agent}`,
    "warning",
  );
}
```

### Example 10: Council Meeting
```typescript
// Council meeting
const council = new Council(agents, { maxVotingRounds: 5 });
const decision = await council.makingDecision(
  "Which files to delete?",
  [file1, file2, file3],
);

if (decision.hasReachedConsensus) {
  console.log(`Council decided: ${decision.decision}`);
  // Execute decision
} else {
  ctx.ui.notify("⚠️ Council could not reach consensus", "warning");
}
```

## 📖 Extension API Guide

| Interface | Purpose | Example |
|-----------|---------|---------|
| `pi-coding-agent` | Base agent interface | `registerAgent`, `registerSkill` |
| `registerTool` | Register custom tools | `pi.registerTool()` |
| `registerSkill` | Register custom skills | `ctx.registerSkill()` |
| `registerAgent` | Register new agent | `ctx.registerAgent()` |
| `registerSkill` | Register new skill | `pi.registerSkill()` |

### Damage Control APIs

```typescript
// Example: Register damage control hook
ctx.registerPreToolUseHook(
  "Bash",
  async (tool, context) => {
    const command = tool.command || "";
    // Check dangerous patterns
    // Return tool result if needed
  },
);
```

### Tool Categories
| Tool | Description | Example |
|------|-------------|---------|
| `Bash` | Execute bash commands | `ls -la`, `git status` |
| `Read` | Read file | `cat`, `npm` |
| `Write` | Write file | `sed`, `echo` |
| `Delete` | Delete file | `rm`, `git reset` |
| `Write` | Write file | `git push`, `npm` |

## 🎯 Usage Patterns

### Pattern 1: Validate Command
```typescript
// Pattern 1: Validate before executing
const isSafe = await validateCommand("command");
if (isSafe) {
  // Execute if safe
}
```

### Pattern 2: Protected Operation
```typescript
// Pattern 2: Protected operation
const isWritable = await validatePath(path, "write");
if (isWritable.allowed) {
  // Perform write operation
}
```

### Pattern 3: Damage-Control Check
```typescript
// Pattern 3: Damage-control check
const isProtected = await validateDelete(path);
if (isProtected.allowed) {
  // Perform delete operation
}
```

## 🔄 Migration Guide

This guide helps migrate from `pi-extension` to `pi-coding-agent`.

### Before (pi-extension)
```typescript
pi.registerTool({
  name: "old-tool",
  description: "Old tool",
  parameters: { task: { type: "string" } },
  execute: async (args) => { /* ... */ },
});
```

### After (pi-coding-agent)
```typescript
pi.registerTool({
  name: "my-tool",
  description: "New tool",
  parameters: {
    task: {
      type: "string",
      description: "The task",
      required: true,
    },
  },
  execute: async (args, ctx) => {
    const { task } = args;
    // Use ctx.api to access agent capabilities
    // Use ctx.ui to display notifications
  },
});
```

### Key Changes
- Use `ctx.registerAgent` instead of `pi.registerAgent`
- Use `ctx.registerSkill` instead of `pi.registerSkill`
- Use `ctx.ui.notify` instead of `console.log`
- Use `ctx.executeTool` for executing tools
- Use `ctx.agentResponse` for multi-agent consensus
- Use `ctx.registerPreToolUseHook` for damage control validation

## 🔑 Key Features

| Feature | Description | Example |
|---------|-------------|---------|
| Validation | Command/path validation | `validateCommand()` |
| Protection | Protected operations | `validatePath()` |
| Damage Control | Blocks dangerous ops | `bash_guard.py` |
| Agent Health | Monitor agent status | `getAgentHealth()` |
| Consensus | Multi-agent decision | Council API |

## 📚 Additional Resources

- [Multi-Team System Architecture](../../architectures/multi-team/README.md)
- [Agent Development Guide](../../ARCHI/AGENT_DEVELOPMENT_GUIDE.md)
- [Tool Definition Patterns](../../TOOL_DEVELOPMENT_GUIDE.md)
- [Extension Development Guide](../../EXTENSION_GUIDE.md)

## 📜 License

This project is for CodepOS and is subject to the CodepOS terms.

