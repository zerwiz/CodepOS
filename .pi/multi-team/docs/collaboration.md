# Collaboration Rules

## Overview

Collaboration between agents is governed by team hierarchy and access rules. This document explains who can collaborate with whom and under what conditions.

## Collaborator Types

### Parent Team

- A **parent team** is the immediate supervisor of a given team
- Provides oversight and coordination
- Does NOT interfere with children's work
- Communicates via `.pi/multi-team/sessions/<team>/parent-communication.yaml`

### Direct Children

- **Direct children** are teams directly supervised by the parent
- Can coordinate with parent team
- Cannot coordinate with other children directly

### Collateral Siblings

- **Collateral siblings** are at the same level within the same hierarchy
- Can collaborate across team boundaries
- Do NOT interfere with parent-child relationships

### Collateral Parent

- **Collateral parent** is a team at the same level as siblings
- Provides additional coordination context
- Communicates via sibling channels

## Collaboration Rules

### Rule 1: Direct Subtree Access

> An agent can access resources within its own direct subtree.

**Example:**
```
Agent at /agents/backend/analyzer/
Can access:
  ✓ /agents/backend/analyzer/ resources
  ✓ /agents/backend/ resources (parent)
  ✗ /agents/frontend/ resources (outside subtree)
```

### Rule 2: Cross-Team Coordination

> Agents at different tree levels can coordinate.

**Example:**
```
Can coordinate:
  ✓ /agents/backend/analyzer/ with /agents/backend/testers/
  ✗ /agents/backend/ with /agents/infra/ (different subtree)
```

### Rule 3: Sibling Collaboration

> Sibling teams can collaborate without parent intervention.

**Example:**
```
/agents/backend/analyzer/ can collaborate with:
  ✓ /agents/backend/testers/ (sibling)
  ✓ /agents/backend/reviewer/ (sibling)
```

### Rule 4: No Horizontal Conflict

> Two different subtrees cannot interfere.

**Example:**
```
Tree A: /agents/backend/*
Tree B: /agents/frontend/*
✗ Cannot: /agents/backend/analyzer/ interfere with /agents/frontend/analyzer
```

## Access Control

### Read Access

- Agents can read resources within their subtree
- Parent teams can read child team resources
- Sibling teams can read shared resources

### Write Access

- Only agents within the same subtree can write
- Parent teams can write to shared state
- Children must request permission for cross-tree writes

### Communication Channels

- **Within Subtree**: Direct communication allowed
- **Between Trees**: Requires coordination protocol
- **Via Sessions**: Use `.pi/multi-team/sessions/<team>/`

## Communication Protocol

### 1. Same Subtree

Direct communication through:

```
.agent_comm
.agent_status
.shared_state
```

### 2. Different Subtrees

Coordinate through parent team:

```
1. Child requests coordination via parent
2. Parent mediates
3. Children collaborate via parent
```

### 3. Sibling Teams

Siblings coordinate directly:

```
1. Detect sibling relationship
2. Establish communication channel
3. Share status updates
```

## Summary

- Agents work within their team's subtree
- Parent teams provide oversight, not interference
- Sibling teams can collaborate freely
- Cross-tree communication requires coordination protocols
