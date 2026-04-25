# Multi-Team Architecture

The multi-team architecture enables organizing pi.dev agents into hierarchical teams for structured collaboration.

## Structure

```
.pi/multi-team/
├── agents/           # Individual agent configurations
├── agents-os/        # Agent OS and runtime configurations
├── expertise/        # Domain expertise definitions
├── sessions/         # Active session coordination
└── skills/           # Skill libraries
```

## Team Organization

Teams are organized in a tree structure where:
- A **parent team** (e.g., `/agents/backend`) supervises child teams
- Children coordinate with their direct parent and optionally collaborate across siblings
- Parent teams provide oversight and coordination without interfering with work

## Agent Discovery

- Each team can have up to 8 agents
- New agents are added via API when team count < 8
- Agent discovery uses `.cli/multi-team/<team-name>/__init__.py`
