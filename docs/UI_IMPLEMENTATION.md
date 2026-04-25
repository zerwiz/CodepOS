# CodepOS Terminal UI - Implementation Guide

**Document Version:** 3.0  
**Last Updated:** 2026-04-25  
**Compliance:** pi.dev 100% Compliant

---

## 1. Overview

CodepOS provides two UI options:
1. **Standalone Terminal UI** - Run via `just ui` or `bun run .pi/multi-team/ui/terminal.mjs`
2. **Pi Extension UI** - Integrated into pi.dev's terminal (in progress)

---

## 2. Architecture

```
pi.dev (Orchestrator)
    ├── Pi Extension UI (.pi/extensions/codepos-ui.ts) - Shows in pi's terminal
    ├── Standalone UI (.pi/multi-team/ui/terminal.mjs) - Run separately
    │
    ├── Scanners (fast, no LLM)
    ├── Council (LLM agents)
    └── Teams (pipelines)
```

---

## 3. Standalone Terminal UI

**Location:** `.pi/multi-team/ui/terminal.mjs`

### Features

- **Pi theme colors** - Uses `.pi/themes/*.json` themes (Catppuccin Mocha default)
- **Pi-subagents style** - Tree view with animated spinners
- **Real-time activity** - Shows what each component is doing
- **Watch mode** - Live monitoring with periodic updates

### Commands

```bash
bun run .pi/multi-team/ui/terminal.mjs          # Status view
bun run .pi/multi-team/ui/terminal.mjs status   # Status view
bun run .pi/multi-team/ui/terminal.mjs tree     # Tree view
bun run .pi/multi-team/ui/terminal.mjs watch    # Live monitoring
bun run .pi/multi-team/ui/terminal.mjs help    # Help

# Or via just
just ui status
just ui tree
just ui watch
```

### UI Style

```
 ○ CodepOS
 ├─ Scanners
 │  ├─ ○ scout   · Structure check
 │  ├─ ○ sentinel · Security scan
 │  └─ ○ indexer · Deep index
 ├─ Council
 │  ├─ ○ planning · Task planning
 │  └─ ○ dokumenter · Documentation
 └─ Teams
    ├─ ○ main · Full pipeline
    └─ ○ security · Security analysis
```

---

## 4. Pi Extension Tools

**Location:** `.pi/extensions/ui-extension.ts`

Shows CodepOS components via tools in pi's terminal.

### Tools

| Tool | Description |
|------|------------|
| `codepos_status` | Show status tree (view=tree/status/activity) |
| `run_scanner` | Run a scanner |
| `run_agent` | Run an LLM agent |
| `run_team` | Run a team |
| `list_codepos` | List all components |

### Usage

```
pi codepos_status           # Status view
pi codepos_status tree   # Tree view
pi codepos_status activity  # Activity view

pi run_scanner name=scout
pi run_agent name=security
pi run_team name=main
```

### Tree View Output

```
 ○ CodepOS
 ├─ Scanners
 │  ├─ ○ scout   · Structure check
 │  ├─ ○ sentinel · Security scan
 │  ├─ ○ librarian · Documentation
 │  └─ ○ mapper · Architecture
 ├─ Agents
 │  ├─ ○ scout-ai · Codebase analysis
 │  ├─ ○ security · Security analysis
 │  └─ ○ planner · Task planning
 └─ Teams
    └─ ○ main · Full pipeline
```

### Implementation Status

- [x] Status tools (run_scanner, run_agent, run_team)
- [x] Dynamic loading from manifests
- [x] Tree view via tool output
- [ ] Widget integration (setWidget API - complex)

---

## 5. Component Activity Tracking

To show running status in the UI, components write state to `.pi/state/`:

### Activity Files

| File | Purpose |
|------|---------|
| `<name>-activity.json` | Current status and activity |
| `<name>-log.json` | Execution log |

### Activity JSON Structure

```json
{
  "status": "idle | running | completed | error",
  "startedAt": 1745623400000,
  "completedAt": 1745623450000,
  "toolUses": 5,
  "tokens": 1200,
  "activity": {
    "tools": ["read", "bash"],
    "text": "Analyzing..."
  },
  "error": "Error message if status is error"
}
```

### Status Icons

| Icon | Meaning |
|------|---------|
| `●` | Has active components |
| `○` | All idle |
| `⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏` | Animated spinner (running) |
| `✓` | Completed |
| `✗` | Error |
| `⎿` | Activity indicator |

---

## 6. Quick Reference

### Justfile Commands

```bash
# Standalone UI
just ui status    # Status view
just ui tree      # Tree view
just ui watch     # Live monitoring

# Orchestrator
just orchestrate status    # Status + Council advice
just orchestrate full      # Full pipeline

# Scanners
just scanner scout         # Structure check
just scanner sentinel      # Security scan
just scanner indexer       # Deep index

# Teams
just team main             # Full pipeline
just team security         # Security pipeline
```

### Files

| File | Purpose |
|------|---------|
| `.pi/multi-team/ui/terminal.mjs` | Standalone terminal UI |
| `.pi/extensions/ui-extension.ts` | Pi extension tools (scanners, teams, agents) |
| `.pi/extensions/theme-cycler.ts` | Theme switching via pi |
| `.pi/themes/*.json` | Theme definitions |
| `.pi/state/<name>-activity.json` | Component status |

---

## 7. Theme System

**Location:** `.pi/themes/`

### Available Themes

| Theme | Description |
|-------|-------------|
| `catppuccin-mocha` | Default - Dark purple accent |
| `nord` | Nordic theme |
| `dracula` | Dracula theme |
| `monokai` | Monokai theme |
| `gruvbox` | Gruvbox theme |
| `tokyo-night` | Tokyo Night theme |
| `ocean-breeze` | Ocean theme |
| `synthwave` | Synthwave theme |
| `cyberpunk` | Cyberpunk theme |
| `everforest` | Everforest theme |
| `dark-pro` | Dark Pro theme |
| `rose-pine` | Rose Pine theme |

### Theme Structure

```json
{
  "name": "theme-name",
  "vars": {
    "bg": "#1e1e2e",
    "fg": "#cdd6f4",
    "accent": "#cba6f7",
    "success": "#a6e3a1",
    "error": "#f38ba8",
    "comment": "#6c7086"
  }
}
```

---

**Document Version:** 3.0  
**Last Updated:** 2026-04-25  
**Status:** Standalone UI Complete | Pi Extension In Progress