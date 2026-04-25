# Agent Discovery

## Overview

Agents discover their team membership and locate other team members through a system of discovery endpoints and configuration files.

## Discovery Endpoints

### Team Inventory

Each team has an inventory endpoint at `.cli/multi-team/<team-name>/__init__.py` that provides:

- **Team Members**: List of active agents in the team
- **Team Status**: Current state of the team
- **Available Slots**: Number of slots remaining before capacity

### Agent Inventory

The agent inventory endpoint provides:

- Agent ID
- Agent class
- Expertise area
- Current tasks
- Status

## Discovery Process

### 1. Self-Discovery

When an agent starts:

```python
agent = Agent()  # Auto-discovered by system
agent.team = "agents/backend/analyzer"  # Team assignment
agent.inventory_endpoint = ".cli/multi-team/<team>/__init__.py"
```

### 2. Parent Team Discovery

An agent discovers its parent team by:

1. **Reading Configuration**: `.pi/multi-team/agents/<agent>/team-config.yaml`
2. **Querying System**: `.cli/multi-team/__init__.py`
3. **Inventory Lookup**: Accessing parent team's inventory endpoint

### 3. Child Team Discovery

A team discovers its children by:

1. **Scanning Subtree**: Looking at `/.pi/multi-team/agents/<parent>/`
2. **Inventory Check**: Using parent's `__init__.py` endpoint
3. **Configuration Files**: Reading `.pi/multi-team/agents/<child>/team-config.yaml`

### 4. Sibling Team Discovery

Agents discover siblings by:

1. **Reading Parent Configuration**: `.pi/multi-team/multi-team-config.yaml`
2. **Team Inventory**: Checking parent team's `__init__.py`
3. **Cross-Reference**: Matching team IDs with same parent

## Discovery Code Example

```python
# Pseudo-code for team discovery
def discover_team(team_id):
    """
    Discover all agents in a team and its children.
    
    Args:
        team_id: The team to discover
    
    Returns:
        Dictionary with team info, children, and agents
    """
    
    # Get team from configuration
    team = get_team_from_config(team_id)
    
    # Get team inventory
    agents = team.inventory.get_agents()
    
    # Get children teams
    children = team.inventory.get_children()
    
    return {
        'team': team,
        'agents': agents,
        'children': children,
        'sibling_teams': find_siblings(team.parent)
    }
```

## Inventory Structure

### Team Inventory

```json
{
    "team_id": "agents/backend/analyzer",
    "parent_id": "agents/backend",
    "capacity": 8,
    "active_agents": 2,
    "available_slots": 6,
    "children": [
        "agents/backend/analyzer/task-handler",
        "agents/backend/analyzer/scheduler"
    ]
}
```

### Agent Inventory

```json
{
    "agent_id": "com.atelier.analyzer",
    "agent_class": "apps.backend.agents.analyzer.AnalyzerAgent",
    "expertise": "code-analysis",
    "status": "active",
    "tasks_count": 1,
    "last_seen": "2025-04-24T18:23:00Z"
}
```

## Discovery Best Practices

### 1. Cache Inventory Results

Team inventory should be cached to avoid repeated API calls:

```python
inventory_cache = {}

def get_cached_inventory(team_id):
    if team_id not in inventory_cache:
        inventory_cache[team_id] = fetch_inventory(team_id)
    return inventory_cache[team_id]
```

### 2. Invalidate on Changes

When a team adds or removes agents:

1. Update `inventory_cache`
2. Notify listeners via events
3. Refresh team status displays

### 3. Handle Failures

If team inventory is unavailable:

- **Retry**: Exponential backoff (1s, 2s, 5s, 10s)
- **Timeout**: Give up after 30 seconds
- **Fallback**: Use last known state or empty state

### 4. Security

- **Authentication**: Use agent credentials
- **Authorization**: Verify team ownership
- **Sanity Check**: Validate discovered agents match configuration

## Summary

Agent discovery enables:

- **Self-discovery**: Agents learn their team membership
- **Parent discovery**: Agents locate their supervisor
- **Child discovery**: Teams learn their subordinates
- **Sibling discovery**: Teams find peers for collaboration

The system uses `__init__.py` endpoints and `.pi/multi-team/config.yaml` for discovery.
