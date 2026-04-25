# CodepOS Multi-Agent Orchestration System - Project Status

**Status:** Pipeline Active  
**Date:** 2026-04-25  
**Version:** 1.0.0

---

## 1. Overview

CodepOS is a harness for pi.dev that coordinates scanners, agents, and teams to help users with their projects.

```
You (Orchestrator) ← THE MAIN AGENT
    ├── Scanners (fast, no LLM)
    │   ├── scout     - Quick structure check
    │   ├── sentinel  - Security scan
    │   ├── mapper    - Architecture view
    │   ├── librarian - Docs index
    │   └── indexer  - Deep index (uses LLM)
    │
    ├── Council (LLM agents)
    │   ├── planning   - Create task plans
    │   ├── dokumenter - Generate docs
    │   └── orchestrator - Coordinates everything
    │
    └── Teams (pipeline)
        ├── main     - Full analysis pipeline
        └── security - Security scan + analysis
```

---

## 2. Components

### 2.1 Scanners (`.pi/multi-team/scanners/`)

| Scanner | Purpose | LLM |
|---------|---------|-----|
| `scout` | Quick structure check | No |
| `sentinel` | Security scan | No |
| `mapper` | Architecture view | No |
| `librarian` | Docs index | No |
| `indexer` | Deep index with analysis | Yes |

### 2.2 Council (`.pi/multi-team/council/`)

| Agent | Purpose |
|-------|---------|
| `planning` | Creates task plans from analysis |
| `dokumenter` | Generates documentation |
| `orchestrator` | Coordinates scanners + agents |

### 2.3 Teams (`.pi/multi-team/teams/`)

| Team | Pipeline |
|------|----------|
| `main` | scout → indexer → planning → dokumenter |
| `security` | sentinel → planning |

---

## 3. Commands

### Orchestrator (talks to Council)
```bash
just orchestrate status     # Project status + Council advice
just orchestrate analyze    # Quick project analysis
just orchestrate security  # Security check
just orchestrate plan       # Create task plan
just orchestrate full       # Run full pipeline
```

### Scanners
```bash
just scanner scout         # Quick structure check
just scanner sentinel      # Security scan
just scanner mapper        # Architecture view
just scanner librarian     # Docs index
just scanner indexer       # Deep index with LLM
```

### Agents
```bash
just agent planning        # Create task plan
just agent dokumenter      # Generate documentation
```

### Teams
```bash
just team main             # Full pipeline
just team main full        # Full pipeline with all steps
just team security         # Security scan + analysis
```

---

## 4. State Files

| Path | Purpose |
|------|---------|
| `.pi/state/file-tree.md` | Project structure |
| `.pi/state/codebase-index.json` | LLM-generated analysis |
| `.pi/state/planning-output.md` | Task plan |
| `.pi/state/security-learnings.json` | Security findings |
| `.pi/state/memory.json` | What worked/failed |

---

## 5. Next Steps

1. Test full pipeline: `just orchestrate full`
2. Add more scanners as needed
3. Enhance Council with specialized advisors
4. Add persistence to memory system

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-04-25  
**Maintained By:** CodepOS Team