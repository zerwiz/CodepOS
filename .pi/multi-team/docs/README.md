# Multi-Team Architecture Documentation

CodepOS organizes agents into scanners, council, and teams.

## Quick Start

```bash
just orchestrate status   # See what's available
just orchestrate full     # Run full pipeline
```

## Directory Structure

```
.pi/multi-team/
├── scanners/       # Fast, no-LLM analyzers
│   ├── scout       # Structure check
│   ├── sentinel   # Security scan
│   ├── mapper     # Architecture view
│   ├── librarian  # Docs index
│   └── indexer    # Deep index (LLM)
├── council/       # LLM-powered agents
│   ├── planning   # Task planning
│   ├── dokumenter # Documentation
│   └── orchestrator
└── teams/          # Pipelines
    ├── main/      # Full analysis
    └── security/  # Security scan
```

## Commands

| Command | What it does |
|---------|--------------|
| `just orchestrate status` | Status + advice |
| `just orchestrate full` | Full pipeline |
| `just scanner scout` | Quick structure |
| `just team main` | All-in-one pipeline |

## State

All state in `.pi/state/` for pi.dev compliance.

## Learn More

- [Project Status](../../docs/PROJECT_STATUS.md)
- [README](../../README.md)