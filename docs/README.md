# CodepOS Elite Documentation

## Architecture Overview

CodepOS Elite is a **harness framework** that operates **above** `www.pi.dev`.

### Layer Relationship

```
┌──────────────────────────────────────────┐
│ www.pi.dev (Main Agent System)          │
│ ──────────────────────────────────────── │
│   Orchestrators    Subagents    Teams   │
└──────────────────────────────────────────┘
              ▼
┌──────────────────────────────────────────┐
│ CodepOS Elite (Harness Layer)            │
│ ──────────────────────────────────────── │
│   Agent Isolation    Rules    Teams      │
└──────────────────────────────────────────┘
```

### Responsibilities

| Layer | Component | Responsibility |
|-------|-----------|----------------|
| **www.pi.dev** | Orchestrators | High-level orchestration |
| **www.pi.dev** | Subagents | Core agent operations |
| **This Project** | Harness | Agent isolation and sandboxing |
| **This Project** | Agents | Specific agent rules |
| **This Project** | Teams | Agent team management |

### Use Case

```python
# www.pi.dev handles main orchestration
orchestrator = www.pi.dev.Orchestrator()
orchestrator.run()

# This harness runs specific agents above pi.dev
harness = CodepOS.Harness()
harness.run_agent("com.atelier.analyzer", "analyze")
```

---

## Getting Started

1. **Clone repository**
2. **Install dependencies**
3. **Configure .pi/multi-team/**
4. **Run `justfile` workflows**

---

## Directory Structure

```
ui-agents/
├── .pi/multi-team/          # pi.dev orchestrators & agents
├── harness/                 # CodepOS Elite harness
├── apps/                    # Application code
├── agents/                  # Agent definitions
├── agents-os/               # Agent OS configs
├── expertise/               # Agent expertise
├── sessions/                # Agent sessions
├── skills/                  # Agent skills
└── justfile                 # Workflow runner
```

---

## Next Steps

- [Agent Teams](./teams/)
- [Harness Setup](./harness/)
- [Multi-Team Config](./multi-team/)
- [Orchestration Guide](./orchestration/)

---

**Status**: Production-Ready ✅  
**Version**: 15.0  
**Relationship**: Harness above www.pi.dev
