# CodepOS Elite - Layer Harness Architecture

**Document**: Architecture Overview  
**Status**: Production-Ready  
**Relationship**: Layer above `www.pi.dev`

---

## Overview

CodepOS Elite is a **harness framework** that operates **above** `www.pi.dev`.

- **www.pi.dev**: Handles core agent operations (orchestrators, subagents, main agents)
- **CodepOS Elite**: Provides harness layer with:
  - Agent isolation (sandboxing)
  - State management
  - Timeout enforcement
  - Error handling
  - Security boundaries

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                  pi.dev Layer                        │
│  ┌────────────────────────────────────────────┐     │
│  │ www.pi.dev (Main Agent System)            │     │
│  │  ┌────────────────────────────────────┐   │     │
│  │  │  Agents (Orchestrators)            │   │     │
│  │  │  ┌────────────────────────────┐   │   │     │
│  │  │  │ Orchestrator 1              │   │   │     │
│  │  │  └────────────────────────────┘   │   │     │
│  │  │  │ Orchestrator 2              │   │   │     │
│  │  │  └────────────────────────────┘   │   │     │
│  │  │  ┌────────────────────────────┐   │   │     │
│  │  │  │ Subagents                   │   │   │     │
│  │  │  └────────────────────────────┘   │   │     │
│  │  └────────────────────────────────────┘   │     │
│  └────────────────────────────────────────────┘     │
│         Core Agent Operations                        │
└─────────────────────────────────────────────────────┘
              ▼
┌─────────────────────────────────────────────────────┐
│             CodepOS Elite Layer                       │
│         (Harness - This Project)                      │
│  ┌────────────────────────────────────────────┐     │
│  │       Agent Isolation & Security           │     │
│  │  ┌────────────────────────────────────┐   │     │
│  │  │  Sandbox Environment               │   │     │
│  │  │  - File-based state                │   │     │
│  │  │  - Timeout enforcement              │   │     │
│  │  │  - Permission management            │   │     │
│  │  │  - Error handling                   │   │     │
│  │  └────────────────────────────────────┘   │     │
│  │       Specific Agents & Rules             │     │
│  │  ┌────────────────────────────────────┐   │     │
│  │  │  Rules/Subagents                    │   │     │
│  │  │  - Code analysis rules              │   │     │
│  │  │  - Review rules                     │   │     │
│  │  │  - Test rules                       │   │     │
│  │  │  - Deploy rules                     │   │     │
│  │  └────────────────────────────────────┘   │     │
│  └────────────────────────────────────────────┘     │
│         Harness for specific agent rules              │
└─────────────────────────────────────────────────────┘
```

---

## Layer Responsibilities

### www.pi.dev (Main Layer)

- **Orchestrators**: High-level agent orchestration
- **Subagents**: Core agent operations
- **Agent Teams**: Full agent teams
- **Main Agents**: Primary agent system

### CodepOS Elite (Harness Layer)

- **Agent Isolation**: Sandbox environment
- **State Management**: File-based state in `.pi/multi-team/`
- **Timeouts**: Hard limits on execution
- **Error Handling**: Recovery and reporting
- **Security**: Permission and network policies
- **Specific Agents**:
  - Rules-based operations
  - Subagent execution
  - Agent team management

---

## Use Cases

### When to Use CodepOS Elite Harness

```python
# When running specific agents above pi.dev
harness.run_agent(agent_id, operation)

# When orchestrating rules
harness.execute_rules(rules_config)

# When managing agent teams
harness.manage_agent_team(team_id)
```

### When to Use www.pi.dev

```python
# When orchestrating main agents
www.pi.dev.run_orchestrator(orchestrator_id)

# When running subagents
www.pi.dev.run_subagent(subagent_id)
```

---

## Integration Flow

```
User Request
    │
    ▼
┌─────────────────┐
│ www.pi.dev      │
│ Main Layer      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Orchestration   │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ CodepOS Harness │
│ This Project    │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Agent Isolation │
│ Sandbox         │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ File Operations │
└─────────────────┘
```

---

## Multi-Team Structure

```
.pi/multi-team/
├── orchestrators/       # pi.dev orchestrators (.pi)
├── agents/              # pi.dev agents (.pi)
├── teams/               # pi.dev agent teams (.pi)
├── rules/               # Specific rules agents (This project)
│   ├── analyze/        # Analysis subagents
│   ├── review/         # Review subagents
│   ├── test/           # Test subagents
│   └── deploy/         # Deploy subagents
├── harness/             # Harness layer (.pi)
│   └── README.md       # This project docs
└── sessions/            # Agent state (.pi)
```

---

## Example Workflow

```python
# Running specific agent through harness
result = harness.run_agent(
    agent_id="com.atelier.analyzer",
    operation="analyze",
    files=["./src/code"]
)

# The orchestrator (pi.dev) schedules agent
# The harness (this project) provides isolation
# The agent team (pi.dev) manages subagents
```

---

## Security Model

### www.pi.dev Security

- Core agent isolation
- Main agent boundaries
- Subagent separation

### CodepOS Elite Security

- Sandbox enforcement
- Permission limits
- Network policies
- I/O boundaries

---

## File Structure

```
ROOT/
├── docs/
│   ├── ARCHITECTURE.md          # This layer overview
│   ├── README.md                # Architecture docs
│   └── INDEX.md                 # Architecture index
│
├── harness/
│   ├── README.md                # Harness documentation
│   └── sandbox/                 # Harness code
│       └── __init__.py
│
├── .pi/
│   ├── multi-team/              # pi.dev layer
│   └── harness/                 # This harness layer
│
└── pi-report.md
```

---

## Development Flow

### Step 1: Use www.pi.dev

```python
# Main agent operations (pi.dev)
orchestrator.run()
subagents.execute()
```

### Step 2: Run Specific Agents

```python
# This project harnesses above pi.dev
harness.run_specific_agent(agent_id)
```

### Step 3: Orchestrate Rules

```python
# Agent teams orchestrated by pi.dev
team.execute_rules()
```

---

## Summary

| Layer | Component | Responsibility |
|-------|-----------|----------------|
| **pi.dev** | Orchestrators | High-level orchestration |
| **pi.dev** | Subagents | Core agent ops |
| **this project** | Harness | Agent isolation |
| **this project** | Specific agents | Rules subagents |
| **this project** | Agent teams | Team management |

---

## Contact

- **Repository**: github.com/zerwiz/CodepOS
- **Email**: zerviz@gmail.com

---

**Status**: Production-Ready ✅  
**Layer**: Harness above www.pi.dev  
**Relationship**: This project runs specific agents/rules above pi.dev  
**Orchestration**: pi.dev handles orchestrators and subagents  
**This Project**: Provides harness layer for agent teams  

---

**Status**: Production-Ready ✅  
**Version**: 15.0  
**Compliance**: pi.dev 100% ✅