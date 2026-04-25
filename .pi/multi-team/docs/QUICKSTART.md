# Quick Start Guide

## Overview

This guide explains how to get started with the pi.dev multi-team system.

## Prerequisites

### Requirements

- Python 3.12+
- pip3 or uv
- bash/zsh
- git (for cloning repo)

### Tools

- **uv**: Python package manager
- **bun**: JavaScript runtime (optional)
- **git**: Version control
- **just**: Workflow automation (optional)

## Setup

### 1. Clone Repository

```bash
git clone https://github.com/zerwiz/CodepOS.git
cd CodepOS
```

### 2. Install Dependencies

```bash
uv sync --only-group dev
just dev
```

### 3. Navigate Structure

```bash
# View multi-team structure
tree .pi/multi-team

# View docs
ls .pi/multi-team/docs/
```

### 4. Check Configuration

```bash
# View team configuration
cat .pi/multi-team/multi-team-config.yaml

# Check team inventory
cat .cli/team/analyzer/__init__.py

# Check agent configuration
cat .pi/multi-team/agents/analyzer/team-config.yaml
```

## Understanding the System

### Team Hierarchy

```
/agents/
├── /agents/backend/
│   ├── /agents/backend/analyzer/
│   ├── /agents/backend/testers/
│   └── /agents/backend/reviewers/
├── /agents/frontend/
│   └── /agents/frontend/analyzer/
└── /agents/infra/
```

### Components

- **Teams**: Hierarchical organization
- **Agents**: Individual workers
- **Sessions**: Coordination state
- **Skills**: Shared capabilities
- **Expertise**: Domain knowledge

### Documentation

- **team-hierarchy.md**: Tree structure
- **collaboration.md**: Rules and access
- **agent-discovery.md**: Discovery process
- **api-reference.md**: API endpoints
- **valuation-api-vs-yaml.md**: Config comparison

## Next Steps

1. **Read documentation**: Start with team-hierarchy.md
2. **Understand teams**: Learn agent discovery process
3. **Explore API**: Check api-reference.md for endpoints
4. **Test collaboration**: Use collaboration.md rules
5. **Configure teams**: Use multi-team-config.yaml
6. **Deploy to prod**: Follow migration guide

## Getting Help

- **Read docs**: All in .pi/multi-team/docs/
- **Check issues**: GitHub issues
- **Contact support**: dev@codepos.com

## Troubleshooting

### Common Issues

| Problem | Solution |
|--------|----------|
| Can't find team | Check .pi/multi-team/ directory |
| API errors | Verify network and auth |
| YAML syntax errors | Use YAML linter |
| Agent not discovered | Check team config |

### Debug Commands

```bash
# Check team config
cat .pi/multi-team/multi-team-config.yaml

# Check agents
find .pi/multi-team/agents -type f

# Check API endpoints
ls .cli/multi-team/

# View docs
cat .pi/multi-team/docs/README.md
```

## Summary

Get started by:

1. Cloning repository
2. Installing dependencies
3. Checking configuration
4. Reading documentation
5. Understanding teams
6. Exploring API
7. Testing collaboration

For more details, read full documentation in docs/ directory.
