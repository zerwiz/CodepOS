# CodepOS Multi-Team System

CodepOS organizes agents into a hierarchy that works with pi.dev.

## Structure

```
.pi/multi-team/
├── scanners/      # Fast analysis tools (no LLM)
├── council/       # LLM-powered advisors
├── teams/         # Pipeline workflows
├── agents/        # Legacy agent configs
└── skills/        # pi.dev skill definitions
```

## How It Works

1. **User** asks pi.dev (the Orchestrator)
2. **Orchestrator** coordinates scanners/agents
3. **Council** provides AI insights
4. **Teams** execute pipelines

## Commands

```bash
# Quick start
just orchestrate status

# Full pipeline
just orchestrate full

# Individual components
just scanner scout       # Fast structure check
just agent planning      # AI task planning
just team main          # Full pipeline
```

## State

All state is in `.pi/state/` for pi.dev compliance.

## Learn More

- [Full Documentation](docs/PROJECT_STATUS.md)
- [pi.dev](https://pi.dev)