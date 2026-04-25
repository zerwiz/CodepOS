# Multi-Agent Orchestration System - Documentation

## Overview
This project is a specialized multi-agent framework designed for UI generation and validation. It utilizes a `.pi/multi-team` organizational structure to manage agent teams and their capabilities.

## 1. Directory Structure Overview

```
Root/
├── .pi/
│   └── multi-team/
│       ├── agents/                 # Individual agent definitions
│       ├── agents-os/             # OS/runtime layer for agents
│       ├── expertise/             # Specialized knowledge bases
│       ├── skills/                # Modular capabilities
│       ├── sessions/              # State management for agent runs
│       ├── multi-team-config.yaml # Main orchestration config
│       └── multi-team-config-min.yaml # Minimal config
├── apps/                          # Application source code
├── prompts/                       # Agent prompt templates
├── specs/                         # Technical specifications
├── scripts/                       # Automation scripts
├── justfile                       # CLI runner and team execution
├── .env                           # Environment variables
├── justfile                       # Task definitions
└── docs/
    └── Multi-Agent Orchestration System
```

### Core Components (`.pi/multi-team/`)

| Directory | Purpose |
|-----------|---------|
| `/agents` | Individual agent definitions and logic |
| `/agents-os` | Underlying OS/runtime for agent interactions |
| `/expertise` | Specialized knowledge bases/skill sets |
| `/skills` | Modular capabilities agents can utilize |
| `/sessions` | History/state management for agent runs |

### Infrastructure (Root Level)

| Directory | Purpose |
|-----------|---------|
| `/apps` | Application source code and schemas |
| `/prompts` | Templates and instructions for agent behavior |
| `/specs` | Technical specifications |
| `/scripts` | Automation and utility scripts |
| `/justfile` | CLI runner and command definitions |

## 2. Variable Storage & Injection

### Environment Variables (`.env`)
```bash
# Team Configuration
TEAM_SETUP=true
TEAM_BRAND=true
TEAM_UI_GEN_A=true
TEAM_VALIDATION_A=true

# Variable Injection
UI_SCHEME_PATH=apps/infinite-ui/src/schemas
BRANDING_PATH=apps/branding/src
ARCHITECTURE_PATH=apps/infinite-ui/src/schemas/trees.schema.ts

# Agent Metadata Directories
AGENT_MDS_PATH=.pi/multi-team/agents
AGENT_REF_PATH=.pi/multi-team/agents/ref
```

### Variable Injection Patterns
1. **Runtime Variables**: Injected via command-line flags or `.env` file
2. **Context Variables**: Defined in `multi-team-config.yaml` under `shared_context`
3. **Persistent Variables**: Stored in `.pi/multi-team/sessions/`

### Example: Injecting Variables into Team Execution
```bash
# Justfile example
team setup team-ui --env UIRoot=/path/to/ui --schema=custom-schema

# The command will:
# 1. Load .env variables
# 2. Inject --env / --schema / --config flags
# 3. Merge with multi-team-config.yaml defaults
```

## 3. Running Teams from Justfile

### Justfile Definition Structure
```just
# Define a team rule
team name:
    cd .pi/multi-team
    # Execute the team
    bun run ${name}
    # Pass arguments
    --env {{env vars}}
    --config ${config file}
    --args

# Example usage:
# just team setup
# just team validation-a
# just team brand
```

### Justfile Teams
```just
# Setup team
team setup:
    bun run setup
    --init
    --schema=trees.schema.ts

# Brand team  
team brand:
    bun run brand
    --styles=branding.schema.ts
    --assets=branding/assets

# UI Generation
team ui-gen:
    bun run ui-generation
    --pipeline=A
    --schema=ui.schema.ts

# Validation
team validation:
    bun run validation
    --stage={{stage}}
    --checks={{checks}}
```

### Running Teams with Arguments
```bash
# Basic team execution
just team setup

# With custom environment
just team setup --env UIRoot=/custom-path
just team brand --env Scheme=dark

# With config override
just team ui-gen --config=my-custom-config.yaml
```

## 4. YAML Agent Structure

### Agent Definition Format
```yaml
agents/
  team-name/
    manifest.yaml        # Agent metadata and MD5 checksums
    manifest-mds.ts      # MD5 checksums (pi and ref)
    prompts/
      instructions.yaml
      context.yaml
    skills/              # Agent capabilities
      - validate.yaml
      - generate.yaml
    expertise/           # Knowledge base
      - schema-kb.yaml
```

### Manifest Structure
```yaml
agent:
  name: team-name
  team: ui-generation
  metadata:
    md5: 
      pi: d41d8cd98f00b204e9800998ecf8427e
      ref: a1b2c3d4e5f6789012345678efghijkl
  permissions:
    - read
    - write
    - validate
  status: active
  last_updated: 2024-01-01T00:00:00Z
  dependencies:
    - skill-validate
    - skill-generate
```

### Manifest MD5 Directories
```
mds/
  pi/                    # Primary integration MD5 for project integration
  ref/                   # Reference MD5 for schema references
```

### Agent MD5 Files
```yaml
# .pi/multi-team/agents/team-name/md5/pi.yaml
pi:
  project-root: apps/infinite-ui
  schema-path: apps/infinite-ui/src/schemas/trees.schema.ts
  branding-root: apps/branding
  last-check: 2024-01-01T00:00:00Z
  version: 1.0.0

# .pi/multi-team/agents/team-name/md5/ref.yaml  
ref:
  schema-versions:
    - trees.schema.ts:1.0.0
    - ui.schema.ts:2.1.0
  last-check: 2024-01-01T00:00:00Z
```

### Agent Teams
| Team Name | Likely Function |
|-----------|----------------|
| `setup` | Environment initialization and pre-flight checks |
| `brand` | Management of branding assets and styles |
| `ui-gen-A` | Main component/UI generation pipeline |
| `validation-A` | Quality assurance pipeline |
| `validation-B` | Automated testing pipeline |
| `validation-C` | Style validation pipeline |

## 5. Configuration Files

### Multi-Team Config Structure
```yaml
# .pi/multi-team/multi-team-config.yaml
shared_context:
  - README.md
  - CLAUDE.md
  - DEBRIEF.md
  - apps/infinite-ui/src/schemas/trees.schema.ts
  
teams:
  - name: setup
    type: initializer
    priority: 1
    
  - name: brand
    type: asset_management
    priority: 2
    
  - name: ui-generation-A
    type: generation
    priority: 3
    dependencies:
      - setup
      - brand
      
  - name: validation-A
    type: quality_assurance
    priority: 4
    dependencies:
      - ui-generation-A
      
  - name: validation-B
    type: testing
    priority: 4
    
  - name: validation-C
    type: style_validation
    priority: 4
```

## 6. Shared Context
Every team operates under the same documentation and schema rules to ensure alignment and reduce configuration drift.

```yaml
shared_context:
  documentation:
    - README.md
    - CLAUDE.md
    - DEBRIEF.md
  schemas:
    - apps/infinite-ui/src/schemas/trees.schema.ts
  branding:
    - apps/branding/src
  architecture:
    - apps/infinite-ui/src/schemas/trees.schema.ts
```

## 7. Key Workflow Patterns

### Check-Before-Commit
1. **Setup team** runs first to sanitize the environment
2. **Brand team** loads stylistic guidelines
3. **Generation team** produces UI components
4. **Validation teams** run in parallel (A/B/C)
5. **Commit** only proceeds when all validations pass

### Parallel Validation
```yaml
validation_stages:
  A: qa_tests  # Automated testing
  B: style_check # Style guidelines validation
  C: schema_check # Schema compliance
```

## 8. Development Guidelines

1. Write tests first (TDD)
2. Use TypeScript strict mode
3. Follow existing naming conventions
4. Add JSDoc for public APIs
5. Keep functions under 50 lines
6. Inject variables via `.env` or command-line
7. Validate schema paths before generation

## 9. Important Notes

- Always validate inputs using Zod schemas
- Use Result<T, E> pattern for error handling
- Database queries go through repository pattern
- API responses use standardized format
- For Python types, never use Dict, always use a concrete pydantic model with typed fields
- Store agent MD5 checksums in `pi/` and `ref/` directories
- Use `justfile` for all team execution commands

## 10. Commands Summary

```bash
# Run a team
just team <team-name>

# Run with environment variables
just team <team-name> --env VAR=value

# Run with custom config
just team <team-name> --config=<path>

# List all available teams
just teams list

# Validate schema
just team validation-C

# Reset environment
just team setup --reset
```

## 11. Project Structure
 ** Critical ** Allways read and update PROJECT_STATUS.md
 
 
- `apps/frontend/` - Frontend source code
- `apps/backend/` - Backend source code
- `ai_docs/` - Additional documentation
- `.pi/multi-team/` - Multi-agent orchestration system
- `multi-team-config.yaml` - Main orchestration configuration
- `justfile` - Task definitions and team execution
- `.env` - Environment variables for variable injection
