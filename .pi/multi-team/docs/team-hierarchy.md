# Team Hierarchy

## Overview

The multi-team architecture uses a tree structure to organize agents. Each agent belongs to exactly one team, and teams have parent-child relationships.

## Tree Structure

```
/agents/
├── /agents/backend/
│   ├── /agents/backend/analyzer/
│   ├── /agents/backend/reviewer/
│   └── /agents/backend/testers/
├── /agents/frontend/
│   └── /agents/frontend/analyzer/
└── /agents/infra/
```

## Parent-Child Relationships

### Direct Children

A team is a **direct child** of its parent if it immediately follows the parent in the tree structure.

```
Example:
Parent: /agents/backend/
Child:  /agents/backend/analyzer/
```

### Collateral Siblings

Teams at the same level within the same hierarchy are siblings.

```
Example:
/agents/backend/analyzer/
/agents/backend/reviewer/
/agents/backend/testers/
```

## Team Capacity

- **Max Agents per Team**: 8
- **New Agent Added**: Via API when team count < 8
- **Full Team**: Team inventory returns all team members

## Discovery

### Team Inventory

Each team has an inventory endpoint that returns:

- Team ID
- Parent team ID
- List of agents in team
- List of child teams

### Agent Discovery

Agents discover themselves via:

1. **Agent Inventory**: `.cli/multi-team/<team>/__init__.py`
2. **Team Config**: `.pi/multi-team/agents/<team>/team-config.yaml`
