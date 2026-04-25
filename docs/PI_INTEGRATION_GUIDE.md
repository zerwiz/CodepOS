# CodepOS - pi.dev Integration Guide

**Version:** 1.0  
**Last Updated:** 2026  
**Author:** CodepOS Team  
**Compliance:** pi.dev 100% Compliant ✅

---

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Quick Start](#3-quick-start)
4. [Step 1: Install pi CLI](#1-step-1-install-pi-cli)
5. [Step 2: Create Skills](#2-step-2-create-skills)
6. [Step 3: Create Extensions](#3-step-3-create-extensions)
7. [Step 4: Run the Orchestrator](#4-step-4-run-the-orchestrator)
8. [Step 5: Command Your Teams](#5-step-5-command-your-teams)
9. [Available Tools](#6-available-tools)
10. [Usage Examples](#7-usage-examples)
11. [Troubleshooting](#8-troubleshooting)
12. [Best Practices](#9-best-practices)

---

## 1. Overview

This guide explains how to integrate your **CodepOS** multi-agent system natively with **pi.dev** (Mario Zechner's `pi-coding-agent`).

### The Advantage

Because `pi.dev` avoids bloated built-in features and gives you raw primitives (`bash`, `read`, `write`, `edit`), you can hook up your entire `CodepOS` infrastructure in just a few minutes.

### Architecture

```
┌─────────────────────────────────────────┐
│           pi.dev Orchestrator           │
│         (Mario's pi-coding-agent)       │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      CodepOS Team Orchestrator Skill    │
│    (Markdown instructions + bash tool)  │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│   CodepOS Agent Teams (justfile)        │
│   .pi/multi-team/agents/                │
└─────────────────────────────────────────┘
```

---

## 2. Prerequisites

Ensure you have the following installed:

- **Node.js** 18+ (for `pi` CLI)
- **Bun** or **Node.js** (for `just` execution)
- **Git** (for cloning CodepOS)
- **Just** CLI tool (for task management)

---

## 3. Quick Start

### Installation

```bash
# Clone CodepOS repository
git clone https://github.com/zerwiz/CodepOS.git
cd CodepOS

# Install pi CLI globally
npm install -g @mariozechner/pi-coding-agent

# Navigate to project root
cd CodepOS
```

### Setup Integration

```bash
# Create skill directory if it doesn't exist
mkdir -p .pi/skills

# Create extension directory if it doesn't exist
mkdir -p .pi/extensions

# The skill and extension files will be created in the next sections
```

### Run the System

```bash
# Start pi CLI
pi

# Now you can command your teams!
```

---

## 4. Step 1: Install pi CLI

### Install the Core pi Agent

```bash
npm install -g @mariozechner/pi-coding-agent
```

### Verify Installation

```bash
pi --version
# Expected output: pi-coding-agent v1.x.x
```

---

## 5. Step 2: Create Skills

Skills are Markdown files that teach `pi` how to use your CodepOS infrastructure.

### Create the Orchestrator Skill

```bash
# Create the skill directory
mkdir -p .pi/skills

# The skill file will be provided in the next section
```

### Skill Content

Create `.pi/skills/codepos-orchestrator.md` with the content from Section 6.

### Why Skills?

- **Idiomatic**: Markdown is easy to read and edit
- **No JavaScript needed**: Use `bash` tool for execution
- **Fast prototyping**: Quick to iterate on instructions
- **Human-readable**: Easy to understand and modify

---

## 6. Step 3: Create Extensions

Extensions are TypeScript modules that provide stricter control over tools and UI.

### Create the Extension Directory

```bash
mkdir -p .pi/extensions
```

### Extension File: team_manager.ts

Create `.pi/extensions/team_manager.ts` with the TypeScript code from Section 7.

### Register Tools

The extension registers these tools:

| Tool Name | Description |
|-----------|-------------|
| `list_codepos_teams` | Lists all available teams |
| `deploy_codepos_team` | Deploys a specific team |
| `manage_codepos_team` | Management operations (init, reset, clean) |
| `check_codepos_status` | System status checks |
| `discover_teams` | Team discovery and analysis |

---

## 7. Step 4: Run the Orchestrator

### Navigate to Project Root

```bash
cd /home/zerwiz/CodeP/CodepOS
```

### Start pi CLI

```bash
pi
```

### What Happens

1. `pi` boots up the terminal UI
2. It auto-discovers `.pi/skills/` and `.pi/extensions/`
3. Your CodepOS infrastructure is immediately available
4. You can now command your teams naturally

---

## 8. Step 5: Command Your Teams

### Basic Commands

```bash
# List all available teams
pi list_codepos_teams

# Deploy a specific team
pi deploy_codepos_team teamName=validation-A

# Reset environment
pi manage_codepos_team operation=reset

# Check system status
pi check_codepos_status detailed
```

### Natural Language Commands

> **User:** "Hey pi, can you use the **validation-C** team to run a style check on the frontend apps?"

**What happens next:**

1. `pi` evaluates the request against registered tools
2. It matches to `deploy_codepos_team`
3. Executes `just team validation-C`
4. Your agents wake up and do the work
5. `pi` reads terminal output and summarizes results

### Examples

```bash
# Style validation
pi deploy_codepos_team teamName=validation-C

# Run QA tests
pi deploy_codepos_team teamName=validation-A

# Run automated tests
pi deploy_codepos_team teamName=validation-B

# Initialize environment
pi manage_codepos_team operation=init

# Clean temporary files
pi manage_codepos_team operation=clean

# See all teams
pi list_codepos_teams
```

---

## 9. Available Tools

### 9.1 list_codepos_teams

Lists all available CodepOS agent teams.

**Parameters:**
- `filter` (optional): Filter team names

**Example:**
```bash
pi list_codepos_teams
# Output:
# 📦 Available CodepOS Teams:
#   - setup
#   - ui-gen-A
#   - validation-A
#   - validation-B
#   - validation-C
#   - planning
#   - ...
```

### 9.2 deploy_codepos_team

Deploys a specialized CodepOS agent team.

**Parameters:**
- `teamName` (required): Team name
- `args` (optional): Additional arguments

**Example:**
```bash
pi deploy_codepos_team teamName=validation-A
```

### 9.3 manage_codepos_team

Performs management operations.

**Parameters:**
- `operation` (required): init, reset, clean, health, help, status
- `teamName` (optional): Team name
- `args` (optional): Additional arguments

**Example:**
```bash
pi manage_codepos_team operation=reset
pi manage_codepos_team operation=clean
pi manage_codepos_team operation=health
```

### 9.4 check_codepos_status

Checks overall system status.

**Parameters:**
- `depth` (optional): quick, detailed, verbose

**Example:**
```bash
pi check_codepos_status detailed
```

### 9.5 discover_teams

Discovers and analyzes teams.

**Parameters:**
- `teamName` (optional): Specific team to analyze

**Example:**
```bash
pi discover_teams teamName=validation-C
```

---

## 10. Usage Examples

### 10.1 Style Validation

```bash
# User request: "Run style validation on frontend"

# You execute:
pi deploy_codepos_team teamName=validation-C
```

### 10.2 QA Testing

```bash
# User request: "Run automated tests on the backend"

# You execute:
pi deploy_codepos_team teamName=validation-A
```

### 10.3 UI Generation

```bash
# User request: "Generate new UI components for the dashboard"

# You execute:
pi deploy_codepos_team teamName=ui-gen-A
```

### 10.4 Multi-Step Task

```bash
# User request: "Set up a new project with custom branding"

# You execute:
pi manage_codepos_team operation=init
pi deploy_codepos_team teamName=brand
pi deploy_codepos_team teamName=ui-gen-A
pi deploy_codepos_team teamName=validation-A
pi deploy_codepos_team teamName=validation-C
```

### 10.5 Complex Command with Args

```bash
# User request: "Run validation with specific environment"

# You execute:
pi deploy_codepos_team teamName=validation-C args="--env SCHEME=dark"
```

---

## 11. Troubleshooting

### 11.1 Teams Not Found

**Error:** "No teams found in .pi/multi-team/agents"

**Solution:**
1. Ensure you're in the CodepOS root directory
2. Run `pi list_codepos_teams` to verify
3. Check that `.pi/multi-team/agents/` exists

### 11.2 Command Execution Failed

**Error:** "Error running team <team_name>"

**Solution:**
1. Check if `just` is installed: `just --version`
2. Run the command manually: `just team <team_name>`
3. Check `.env` file for required variables

### 11.3 Extension Not Loading

**Error:** "Extension not found or not loading"

**Solution:**
1. Ensure `.pi/extensions/team_manager.ts` exists
2. Check for TypeScript errors
3. Restart `pi` after creating the file

### 11.4 Tool Not Available

**Error:** "Tool not found"

**Solution:**
1. Ensure extension file is loaded
2. Check for syntax errors in TypeScript
3. Restart `pi` after modifications

---

## 12. Best Practices

### 12.1 Keep Skills Simple

- Use clear, concise language
- Document available teams and commands
- Include examples for common use cases

### 12.2 Use Extensions for Complex Logic

- Keep skills for documentation
- Use extensions for custom tools
- Implement business logic in extensions

### 12.3 Validate Before Acting

- Check team exists before deploying
- Validate environment variables
- Handle errors gracefully

### 12.4 Monitor System Health

```bash
# Regular health checks
pi check_codepos_status detailed

# View team logs
tail -f .pi/multi-team/agents/*/logs/

# Check for alerts
grep -r "alert" .pi/multi-team/agents/*/alerts.mjs
```

### 12.5 Document Your Architecture

- Keep this guide updated
- Document new teams
- Note any custom tools

---

## Quick Reference

### Commands Summary

```bash
# List teams
pi list_codepos_teams

# Deploy team
pi deploy_codepos_team teamName=<name>

# Management operations
pi manage_codepos_team operation=<init|reset|clean|health|help>

# System status
pi check_codepos_status <depth>

# Team discovery
pi discover_teams teamName=<name>
```

### Team Names

| Team | Role |
|------|------|
| `setup` | Environment initialization |
| `ui-gen-A` | UI component generation |
| `validation-A` | QA tests |
| `validation-B` | Automated testing |
| `validation-C` | Style validation |
| `planning` | Workflow management |
| `design` | Design system |
| `frontend` | Frontend operations |
| `testing` | Test coordination |
| `database` | Database management |
| `api-backend` | API development |
| `integration` | Integration testing |
| `orchestrator` | Main orchestration |
| `council` | Council coordination |

---

## Support

**Issues:** Report issues on the CodepOS GitHub repository  
**Documentation:** See `CodepOS/docs/` for additional guides  
**Contact:** zerviz@gmail.com  

---

**End of Integration Guide**