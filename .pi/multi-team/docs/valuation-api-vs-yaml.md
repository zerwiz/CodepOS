# Valuation: API vs YAML Configuration

## Overview

This document compares using JSON APIs versus YAML configuration for team and agent setup. The multi-team architecture supports both approaches and this document explains the trade-offs.

## Configuration Approaches

### YAML Configuration

**Pros:**
- Simple and readable
- Version control friendly
- Human-editable
- Fast to update

**Cons:**
- Requires filesystem access
- Limited runtime validation
- No dynamic updates
- Manual refresh needed

**Use Cases:**
- Development environment
- Static team configuration
- Initial deployment
- Test environments

```yaml
# .pi/multi-team/multi-team-config.yaml
agents:
  - id: "com.atelier.analyzer"
    class: "apps.backend.agents.analyzer.AnalyzerAgent"
    expertise: "code-analysis"
    config:
      rules: [com.atelier.analyzer.rules]
      timeout: 30
      sandbox: true
```

### JSON API

**Pros:**
- Runtime discovery
- Dynamic updates
- Centralized management
- Programmatic access

**Cons:**
- Requires API access
- Higher latency
- More complex setup
- Needs authentication

**Use Cases:**
- Production environments
- Multi-tenant systems
- Dynamic scaling
- Remote management

```python
# Example API call
import requests

response = requests.get(
    "https://api.codepos.com/teams/analyzer/inventory",
    auth=("api_key", "api_secret")
)

teams = response.json()
```

## Comparison Matrix

| Feature | YAML | API |
|---------|------|-----|
| Read Speed | Immediate | Network latency |
| Dynamic Updates | Manual | Real-time |
| Validation | Static | Runtime |
| Access | Local | Remote |
| Complexity | Low | Medium |
| Security | High | Medium-Low |
| Debugging | Simple | Complex |

## Recommended Approach

### Development

Use **YAML configuration** because:

- Fast iteration
- Easy debugging
- Version control ready
- No API overhead

### Production

Use **API configuration** because:

- Dynamic scaling
- Centralized management
- Runtime updates
- Security benefits

### Hybrid Approach

Recommended for most systems:

1. **Initial setup**: YAML configuration
2. **Runtime**: API for dynamic ops
3. **Fallback**: Both methods available
4. **Validation**: Check both consistency

## Implementation

### Step 1: YAML Configuration

Create initial team config in `.pi/multi-team/`:

```yaml
# .pi/multi-team/multi-team-config.yaml
agents:
  - id: "com.atelier.analyzer"
    class: "apps.backend.agents.analyzer.AnalyzerAgent"
    expertise: "code-analysis"
```

### Step 2: API Discovery

Use API for runtime information:

```python
# In .cli/team/<team>/__init__.py
from .discovery_utils import (
    get_team_inventory,
    get_children_teams,
    get_active_agents
)

def get():
    return {
        "team_id": team_id,
        "agents": get_active_agents(),
        "children": get_children_teams(),
        ...
    }
```

### Step 3: Sync Mechanism

Keep YAML and API in sync:

```python
# Sync configuration to API
def sync_config():
    """
    Read YAML config and update API.
    
    Returns:
        True if synced successfully
    """
    
    # Read YAML configuration
    config = read_yaml_config()
    
    # Update API
    write_api_config(config)
    
    # Validate both
    validate_api_config(config)
    
    return True
```

## Security Considerations

### YAML Configuration

- **Store in .git**: Version controlled
- **Encrypt secrets**: Use .env files
- **Restrict access**: File permissions
- **Validate paths**: Check for injection

### API Configuration

- **Authentication**: Use tokens
- **Authorization**: Check permissions
- **Rate limiting**: Prevent abuse
- **Audit logs**: Track access

## Migration Guide

### From YAML to API

1. **Audit current YAML configs**
2. **Create API endpoints**
3. **Implement sync mechanism**
4. **Validate compatibility**
5. **Run in parallel**
6. **Migrate fully**

### From API Back to YAML

1. **Download current API state**
2. **Store in YAML**
3. **Remove API dependencies**
4. **Validate YAML works**
5. **Test in dev first**

## Best Practices

1. **Keep both configs synced**: YAML for local, API for remote
2. **Use environment variables**: For secrets and flags
3. **Validate configuration**: Before deploying
4. **Monitor both systems**: Ensure consistency
5. **Document changes**: Update both YAML and API
6. **Test migration**: Verify no breaking changes

## Summary

| Scenario | Recommendation |
|----------|----------------|
| Development | YAML only |
| Production | Hybrid (YAML + API) |
| Initial setup | YAML first |
| Dynamic ops | API preferred |
| Security concerns | API preferred |
| Debugging | YAML preferred |
| Migration | Hybrid approach |

**Final**: Use hybrid approach for best of both worlds. YAML for initial dev, API for production ops, sync mechanisms keep both consistent.
