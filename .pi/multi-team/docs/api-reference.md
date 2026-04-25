# API Reference

## Overview

This document describes the API endpoints available for working with the multi-team system.

## Endpoint Overview

### Team Inventory Endpoint

```python
# .cli/multi-team/<team-name>/__init__.py

class TeamInventory:
    """
    API endpoint for team inventory.
    
    Returns team information, child teams, and available agents.
    """
    
    def __init__(self, team_id: str, team_config: TeamConfig):
        self.team_id = team_id
        self.team_config = team_config
    
    def get(self) -> dict:
        """
        GET /teams/<team-id>/
        
        Returns team inventory information.
        
        Response:
        {
            "team_id": "<team-id>",
            "parent_id": "<parent-team-id|null>",
            "status": "<active|inactive>",
            "agents": [
                {
                    "agent_id": "...",
                    "agent_class": "...",
                    "expertise": "...",
                    "status": "<active|idle>"
                }
            ],
            "children": [
                "<child-team-1>",
                "<child-team-2>",
                ...
            ],
            "capacity": 8,
            "active_agents": <count>
        }
        """
```

### Agent Discovery Endpoint

```python
# .cli/agent-discovery/<team-or-agent-id>/__init__.py

class AgentDiscovery:
    """
    API endpoint for discovering agents within a team.
    
    Enables self-discovery and team membership detection.
    """
    
    def __init__(self, entity_id: str, entity_type: str):
        """
        Args:
            entity_id: Team or agent ID
            entity_type: 'team' or 'agent'
        """
        self.entity_id = entity_id
        self.entity_type = entity_type
    
    def discover(self) -> dict:
        """
        DISCOVER /<entity-id>/
        
        Returns discovery information for an entity.
        
        Response:
        {
            "entity_id": "...",
            "entity_type": "team|agent",
            "team_id": "...",
            "parent_id": "...",
            "children": [...],
            "agents": [...],
            "sibling_teams": [...]
        }
        """
```

### Team Configuration Endpoint

```python
# .cli/team-config/<team-id>/config.yaml

class TeamConfig:
    """
    Configuration endpoint for team settings.
    
    Defines agent class, expertise, and rules for team members.
    """
    
    def __init__(self, team_id: str, config: dict):
        self.team_id = team_id
        self.config = config
    
    def validate(self) -> bool:
        """
        Validate team configuration.
        
        Checks:
        - Agent class exists
        - Expertise is valid
        - Rules are properly defined
    
        Returns:
            True if configuration is valid
        """
        
        # Implementation would validate team config
        return True
    
    def get(self) -> dict:
        """
        GET /teams/<team-id>/config
    
        Returns team configuration.
        
        Response:
        {
            "team_id": "...",
            "agent_class": "...",
            "expertise": "...",
            "rules": [...],
            "timeout": 30,
            "sandbox": true
        }
        """
```

### Session Management Endpoint

```python
# .pi/multi-team/sessions/<team-id>/

class SessionManager:
    """
    Manages session state and coordination for teams.
    
    Handles:
    - Agent conversation history
    - Artifact tracking
    - Session state persistence
    """
    
    def __init__(self, session_dir: str):
        self.session_dir = session_dir
    
    def create_session(self, team_id: str) -> str:
        """
        Create a new session for team coordination.
        
        Returns:
            Session ID
        """
        
        # Create session directory
        session_path = f"{self.session_dir}/{team_id}.json"
        # Write session state
        return session_id
    
    def read_session(self, session_id: str) -> dict:
        """
        Read current session state.
        
        Response:
        {
            "session_id": "...",
            "team_id": "...",
            "agents": [...],
            "artifacts": [...],
            "last_activity": "...",
            "history": [...]
        }
        """
