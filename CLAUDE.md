# CodepOS - Multi-Agent Harness for pi.dev

## Overview

CodepOS is a harness that extends pi.dev with scanners, agents, teams, and a Council for guidance.

## Architecture

```
pi.dev (Orchestrator)
    ├── Scanners (fast, no LLM)
    │   ├── scout       - Quick structure check
    │   ├── sentinel    - Security scan
    │   ├── mapper      - Architecture view
    │   ├── librarian   - Docs index
    │   └── indexer     - Deep index (uses LLM)
    │
    ├── Council (LLM advisors)
    │   ├── planning    - Task planning
    │   ├── dokumenter  - Documentation
    │   └── orchestrator - Coordination
    │
    └── Teams (pipelines)
        ├── main     - Full analysis
        └── security - Security analysis
```

## Quick Commands

```bash
# Orchestrator (main interface)
just orchestrate status     # Status + Council advice
just orchestrate analyze    # Quick analysis
just orchestrate full       # Full pipeline
just orchestrate security  # Security check

# Scanners (fast, no LLM)
just scanner scout         # Structure check
just scanner sentinel      # Security scan
just scanner mapper        # Architecture view
just scanner librarian     # Docs index
just scanner indexer       # Deep index

# Agents (LLM-powered)
just agent planning        # Create task plan
just agent dokumenter      # Generate docs

# Teams (pipelines)
just team main             # Full pipeline
just team security         # Security pipeline
```

## State Files

| Path | Purpose |
|------|---------|
| `.pi/state/file-tree.md` | Project structure |
| `.pi/state/codebase-index.json` | LLM analysis |
| `.pi/state/planning-output.md` | Task plan |
| `.pi/state/memory.json` | Learned patterns |

## Directory Structure

```
.pi/multi-team/
├── scanners/           # Fast analyzers (no LLM)
│   ├── scout.mjs
│   ├── sentinel.mjs
│   ├── mapper.mjs
│   ├── librarian.mjs
│   └── indexer.mjs
├── council/            # LLM agents
│   ├── planning/
│   ├── dokumenter/
│   └── orchestrator/
├── teams/              # Pipelines
│   ├── main/
│   └── security/
└── skills/             # pi.dev skills

justfile                # All commands
```

## Key Concept: Council

The Council provides AI-powered insights and guidance. The Orchestrator talks to the Council after running scanners.

**Flow:**
1. Scanner analyzes project
2. Orchestrator sends results to Council
3. Council provides insights/advice
4. Orchestrator presents to user

## Development Guidelines

1. Scanners should be fast - no LLM calls
2. Agents use `pi -p prompt` to invoke LLM
3. Teams combine scanners + agents
4. State always in `.pi/state/` for compliance
5. Update docs/PROJECT_STATUS.md regularly

## Important

- **Always read PROJECT_STATUS.md** when working on this project
- Scanners go in `.pi/multi-team/scanners/`
- LLM agents go in `.pi/multi-team/council/`
- Use `bun` for all scripts