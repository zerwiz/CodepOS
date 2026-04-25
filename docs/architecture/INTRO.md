# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Web UI     │  │ CLI Client  │  │  VS Code    │              │
│  │  (React)    │  │ (TUI)       │  │  Extension   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                              │                                   │
│                          HTTP/WebSocket                           │
│                              │                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Harness Server Layer                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Harness API Server                       │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌────────────┐ │  │
│  │  │  Agent Router   │  │  Workspace Mgr  │  │  Auth      │ │  │
│  │  └─────────────────┘  └─────────────────┘  └────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Agent Registry                            │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  Registered Agents (Core + Custom)                    │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   State Broker                              │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Agent Execution Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Analyzer   │  │  Implementer │  │  Reviewer   │              │
│  │  Agent      │  │  Agent      │  │  Agent       │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Tester     │  │  Deployer   │  │  Observer   │              │
│  │  Agent      │  │  Agent      │  │  Agent      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Codebase & Tools Layer                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   CodepOS Workspace                         │  │
│  │  ┌───────────────────────────────────────────────────────┐ │  │
│  │  │  Source Code | Tests | Build Artifacts                │ │  │
│  │  └───────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Git        │  │  LSP Server │  │  Build      │              │
│  │  Manager    │  │  (vscode)   │  │  System     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Persistence Layer                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Redis / Postgres                          │  │
│  │  ┌───────────────────────────────────────────────────────┐ │  │
│  │  │  Sessions | State | Audit Logs | Metrics               │ │  │
│  │  └───────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Harness API Server
- RESTful API for agent operations
- WebSocket for real-time communication
- Authentication and authorization
- Rate limiting and quota management

### 2. Agent Router
- Routes requests to appropriate agents
- Load balancing across instances
- Failure handling and fallback

### 3. Workspace Manager
- Manages virtual environments per workspace
- Filesystem isolation
- Resource quotas

### 4. Agent Registry
- Dynamic agent registration
- Health checks
- Capability discovery

### 5. State Broker
- Shared state between agents
- Versioned state snapshots
- Consistency guarantees

## Communication Patterns

### Request Flow
```
Client → HTTP/WebSocket → API Server → Agent Router → Agent
                                              │
                                              ▼
                                        External Tools/Commands
```

### Real-time Stream
```
Agent → WebSocket → API Server → Client (Live Updates)
```

## Scalability Considerations

- Horizontal scaling via agent container orchestration
- Stateless API server design
- Redis-backed distributed state
- Horizontal pod autoscaling
