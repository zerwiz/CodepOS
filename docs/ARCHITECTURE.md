# CodepOS - AI Agent Harness for pi.dev

## Overview

CodepOS is a **harness** that extends pi.dev with specialized scanners, agents, and teams.

```
User → pi.dev (Orchestrator) → CodepOS → Scanners/Agents/Teams
```

## Architecture

```
.pi/multi-team/
├── scanners/      # Fast, no-LLM analyzers
├── council/       # LLM-powered advisors
├── teams/         # Pipeline workflows
└── skills/        # pi.dev skill definitions
```

## How It Works

1. **User** interacts with pi.dev (the Orchestrator)
2. **pi.dev** coordinates via CodepOS
3. **Scanners** analyze quickly (no AI)
4. **Council** provides AI insights
5. **Teams** execute complete pipelines

## Quick Commands

```bash
just orchestrate status    # Status + advice
just orchestrate analyze   # Quick analysis
just orchestrate full      # Full pipeline
just orchestrate security  # Security check

just scanner scout         # Fast structure check
just agent planning        # AI task planning
just team main             # Full pipeline
```

## State Management

All state stored in `.pi/state/` for pi.dev compliance:
- `file-tree.md` - Project structure
- `codebase-index.json` - LLM analysis
- `planning-output.md` - Task plan
- `memory.json` - Learned patterns

## Compliance

100% pi.dev compliant with proper isolation and state management.

## Learn More

- [README.md](../README.md) - Quick start
- [docs/PROJECT_STATUS.md](PROJECT_STATUS.md) - Full status
- [pi.dev](https://pi.dev)