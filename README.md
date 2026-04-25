# CodepOS

**A multi-agent orchestration harness for [pi.dev](https://pi.dev)**

> Coordinate scanners, agents, and teams to analyze, plan, and document your projects.

[![pi.dev compliant](https://img.shields.io/badge/pi.dev-100%25%20Compliant-brightgreen)](#compliance)
[![Bun](https://img.shields.io/badge/Bun-1.0+-orange)](https://bun.sh)

---

## What is CodepOS?

CodepOS is a harness that extends pi.dev with a pipeline of specialized agents:

```
You → Orchestrator → Council → Teams/Scanners/Agents
```

- **Scanners** - Fast code analysis (no AI)
- **Agents** - AI-powered planning and documentation
- **Teams** - Combined pipelines for complex tasks
- **Council** - AI advisors for guidance and insights

---

## Quick Start

```bash
# Check project status
just orchestrate status

# Analyze project
just orchestrate analyze

# Full pipeline (scout → index → plan → document)
just orchestrate full

# Security check
just orchestrate security
```

---

## Architecture

```
.pi/multi-team/
├── scanners/        # Fast, no-LLM analyzers
│   ├── scout       # Quick structure check
│   ├── sentinel    # Security scan
│   ├── mapper      # Architecture view
│   ├── librarian   # Docs index
│   └── indexer     # Deep index (uses LLM)
├── council/        # LLM-powered agents
│   ├── planning    # Task planning
│   ├── dokumenter  # Documentation generation
│   └── orchestrator
├── teams/          # Pipeline workflows
│   ├── main/       # Full analysis pipeline
│   └── security/   # Security analysis pipeline
└── skills/         # pi.dev skill definitions
```

---

## Commands

### Orchestrator
The main interface that coordinates everything:

| Command | Description |
|---------|-------------|
| `just orchestrate status` | Project status + Council advice |
| `just orchestrate analyze` | Quick project analysis |
| `just orchestrate plan` | Create task plan |
| `just orchestrate security` | Security scan |
| `just orchestrate full` | Full pipeline |

### Scanners
Fast, local analysis tools:

```bash
just scanner scout      # Structure check
just scanner sentinel   # Security scan
just scanner mapper     # Architecture view
just scanner librarian  # Docs index
just scanner indexer    # Deep index with LLM
```

### Agents
LLM-powered assistants:

```bash
just agent planning     # Create task plan
just agent dokumenter   # Generate docs
```

### Teams
Complete pipelines:

```bash
just team main          # Full analysis
just team security      # Security analysis
```

---

## State & Memory

CodepOS maintains state in `.pi/state/`:

| File | Purpose |
|------|---------|
| `file-tree.md` | Project structure |
| `codebase-index.json` | LLM analysis |
| `planning-output.md` | Task plan |
| `memory.json` | Learned patterns |

---

## Compliance

CodepOS is 100% pi.dev compliant:

- ✅ P1.10 - Multi-agent isolation
- ✅ A1.1 - Agent safety boundaries
- ✅ A1.4 - State management (.pi/)
- ✅ A1.5 - I/O boundaries
- ✅ A1.6 - Multi-agent coordination
- ✅ P1.12.4 - Safe retirement protocol

---

## Requirements

- [Bun](https://bun.sh) 1.0+
- [pi.dev](https://pi.dev)

---

## Documentation

- [Project Status](docs/PROJECT_STATUS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Multi-Team Docs](.pi/multi-team/docs/README.md)

---

## License

MIT