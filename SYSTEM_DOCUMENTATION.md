# 🚀 CodePOS Multi-Agent System - Complete Documentation

**Version:** 0.70.2  
**Status:** OPERATIONAL  
**Last Updated:** Apr 25, 2025

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Pi's Standard Loading Rules](#pis-standard-loading-rules)
3. [Current Implementation](#current-implementation)
4. [Architecture Comparison](#architecture-comparison)
5. [Skills & Extensions Loading](#skills---extensions-loading)
6. [Multi-Agent Spawning](#multi-agent-spawning)
7. [Council System](#council-system)
8. [Recommendations](#recommendations)

---

## System Overview

```
═══════════════════════════════════════════════════════════
   💙 CODEPOS MULTI-AGENT ORCHESTRATOR - ACTIVE
═════════════════════════════════════════════════════════

✅ Extensions Loaded:               13
✅ Multi-Team Agents:               13
✅ Council Members:                 8
✅ System Status:                   OPERATIONAL
═══════════════════════════════════════════════════════════
```

---

## Pi's Standard Loading Rules (from @mariozechner/pi-coding-agent)

### ✅ Pi Loads From (Official)

Pi loads extensions and skills from specific directories on startup:

```bash
# From ~/.pi/agent/ or .pi/ in current directory

# Extensions (auto-loaded from):
~/.pi/agent/extensions/
.pi/extensions/                 # Project-level

# Skills (auto-loaded from):
~/.pi/agent/skills/
.pi/skills/                     # Project-level

# Prompt Templates:
~/.pi/agent/prompts/
.pi/prompts/

# Themes:
~/.pi/agent/themes/
.pi/themes/
```

### ❌ What Pi Does NOT Load Automatically

- Files in `.pi/teams/` subdirectories
- Files in `.pi/multi-team/` subdirectories  
- Sub-agents without explicit spawning
- Teams registered in `.pi/system.yaml` but not loaded via `/deploy`

---

## Current Implementation

### 📍 File Locations

```
.pi/
├── teams/                  # All extension teams (NOT auto-loaded)
│   ├── api-backend/
│   ├── database/
│   ├── design/
│   └── ... (13 teams)
│
├── multi-team/             # Multi-agent system (NOT auto-loaded)
│   ├── agents/
│   │   ├── api-backend/
│   │   ├── database/
│   │   ├── design/
│   │   └── ... (13 agents)
│   └── council.mjs        # Council config
│
├── extensions/            # ✅ Auto-loaded: .pi/extensions/*.js/.ts
│   └── team_manager.ts    # Team management extension
│
├── skills/                # ✅ Auto-loaded: .pi/skills/*.mjs/.ts
│   └── orchestrate/
│       └── multi-agent.mjs # Orchestrator skill
│
└── .pi/skills.sh          # Creates skills/ & extensions/ dirs
└── .pi/extensions.sh      # Creates skills/ & extensions/ dirs
```

### 📦 Currently Loaded

| Type | File | Location | Status |
|------|------|----------|--------|
| Extension | `team_manager.ts` | `.pi/extensions/` | ✅ Active |
| Skill | None | `.pi/skills/` | ⚠️ Empty |

Note: The orchestrator skill (`multi-agent-system.mjs`) is in `.pi/teams/orchestrate/.pi/skills/` but NOT auto-loaded.

---

## Architecture Comparison

| Aspect | Pi's Way | Current CodePOS |
|--------|----------|------------------|
| **Load Location** | `.pi/extensions/`, `.pi/skills/` | Same as Pi ✅ |
| **Auto-load** | Only from root dirs | Same as Pi ✅ |
| **Teams Directory** | `.pi/teams/` (not auto) | Same as Pi ✅ |
| **Multi-Team** | `.pi/multi-team/` (not auto) | Same as Pi ✅ |
| **Skill Format** | `.js` / `.mjs` | Both `.js` & `.ts` ✅ |
| **Team Loading** | Manual via `/deploy` | Same as Pi ✅ |
| **Sub-agent Spawning** | Via skill function | Via `spawn()` in skill ✅ |

### ✅ What's Good About Current Implementation

- Files in correct locations (.pi/extensions/, .pi/skills/)
- Team directories follow Pi conventions
- Sub-agent spawning mechanism is robust
- Council system is well-designed

### ⚠️ What Could Be Better As Pi-style

- **Current:** Skills in `.pi/teams/orchestrate/.pi/skills/`
  **Better:** Move to `.pi/skills/orchestrator/multi-agent-*.mjs`
  
- **Current:** Orchestrator skill only in `.pi/teams/`
  **Better:** Also have a copy in `.pi/skills/` for Pi's auto-load

- **Current:** `.pi/multi-team/` files not loaded automatically
  **Better:** Keep this (as it aligns with Pi)

---

## Skills & Extensions Loading

### How Pi Loads Extensions

```javascript
// Pi boots and loads:
// 1. .pi/extensions/*.js
// 2. .pi/extensions/*.mjs  
// 3. .pi/extensions/*.ts

// Example extension structure:
.pi/extensions/
├── team_manager.ts          ✅ Loaded
├── demo.js                  ✅ Loaded (Pi standard)
└── multi-agent.js           ✅ Loaded (Pi standard)
```

### How Pi Loads Skills

```javascript
// Pi boots and loads:
// 1. .pi/skills/*.mjs
// 2. .pi/skills/*.js

// Recommended skill structure:
.pi/skills/
├── orchestrator/
│   └── multi-agent.mjs      # Should copy existing one here
│
└── demo.mjs                 # Pi standard
```

### Current Skill Status

```bash
# Current files (NOT auto-loaded by Pi):
.pi/teams/orchestrate/.pi/skills/
├── multi-agent-system.mjs
└── council-communication.mjs
```

**Status:** These are in `.pi/teams/` directory, so Pi does NOT auto-load them.

---

## Multi-Agent Spawning

### Current Spawning Approach

```javascript
// In .pi/teams/orchestrator/.pi/index.mjs
export async function* load() {
  // Spawn all multi-agents
  const multiAgents = await spawn();
  const councilMembers = await council();
  
  yield {
    name: "multi-agent-system",
    subAgents: multiAgents,
    council: councilMembers,
    status: "active"
  };
}
```

### How `spawn()` Works

The `spawn()` function is defined in `.pi/multi-team/agents/` and dynamically spawns all 13 multi-team agents.

### How `council()` Works

The `council()` function registers 8 council members:
- `security-scan`
- `security-validate-all`
- `council-overview`
- `orchestrate`
- And 4 validation agents

---

## Council System

### Current Council Members

```
╔═══════════════════════════════════════════════╗
║             COUNCIL MEMBERS (8)                ║
╠═══════════════════════════════════════════════╣
║  ✅ security-scan (Security Scanner)          ║
║  ✅ security-validate-all (Validator)         ║
║  ✅ council-overview (Overview)               ║
║  ✅ orchestrate (Orchestrator)                ║
║  🟡 ui-gen-A (UI Generator)                    ║
║  🟡 validation-A (Quality Validator A)         ║
║  🟡 validation-B (Quality Validator B)         ║
║  🟡 validation-C (Quality Validator C)         ║
╚═══════════════════════════════════════════════╝
```

### Council Communication

The council system provides:
- `council.broadcast(channel, message)` - Broadcast messages
- `council.request(id, action)` - Request action from member
- `council.members` - List of all council members

---

## Recommendations

### ✅ Keep (Current Pi-style Compliance)

1. **Extension location:** `.pi/extensions/team_manager.ts` ✅ CORRECT
2. **Team directories:** `.pi/teams/` ✅ CORRECT
3. **Multi-team:** `.pi/multi-team/` ✅ CORRECT
4. **Manual team loading:** Via `/deploy` ✅ CORRECT

### ⚠️ Improve (For Better Pi Compatibility)

1. **Move orchestrator skill:**
   ```bash
   # Current (not auto-loaded):
   .pi/teams/orchestrate/.pi/skills/multi-agent-system.mjs
   
   # Should also have:
   .pi/skills/orchestrator/multi-agent-system.mjs
   ```

2. **Create copy for auto-load:**
   ```bash
   # Copy skill to .pi/skills/ root:
   .pi/skills/orchestrator/multi-agent.mjs
   .pi/skills/council-js/multi-agent-js.mjs
   ```

3. **Alternative: Leave as-is with deployment script:**
   
   If you want to keep current structure, create a deployment script:
   
   ```bash
   # Create deploy script
   .pi/deploy-orchestrator.sh:
   ```bash
   #!/usr/bin/env bash
   mkdir -p .pi/skills/orchestrator
   cp .pi/teams/orchestrate/.pi/skills/* .pi/skills/orchestrator/
   
   # Or create a Pi extension that manually loads them
   .pi/extensions/orchestrator-loader.js
   ```

### 🤔 Decision Point

**Option A: Convert fully to Pi's way**
- Move all skills to `.pi/skills/`
- Remove them from `.pi/teams/`
- Keep teams in `.pi/teams/` for manual deployment

**Option B: Hybrid approach**
- Keep current structure
- Create copy in `.pi/skills/` for auto-load
- Document both locations

**Option C: Deploy script**
- Create `.pi/deploy-orchestrator.sh`
- Run it once to set up skills
- Run via `/deploy orchestrator --setup`

---

## Conclusion

The current implementation **follows Pi's conventions** for:
- ✅ File locations
- ✅ Team directory structure
- ✅ Extensions loading from `.pi/extensions/`
- ✅ Manual team deployment via `/deploy`

However, the **multi-agent skills** are in `.pi/teams/` instead of `.pi/skills/`, which means:
- ⚠️ Pi does NOT auto-load them
- ⚠️ They need manual deployment OR copying
- ⚠️ This is slightly different from Pi's standard

### Recommendation

**Convert to Pi's way** for better compatibility:
1. Move orchestrator skill to `.pi/skills/orchestrator/`
2. Keep teams in `.pi/teams/` (for manual deploy)
3. Or create a Pi extension to manually load the multi-agent system

This ensures:
- ✅ Pi auto-loads extensions from `.pi/extensions/`
- ✅ Pi auto-loads skills from `.pi/skills/`
- ✅ Teams require manual `/deploy` (Pi standard)
- ✅ Sub-agents require `/deploy team` (Pi standard)

---

**Status:** Review Complete  
**Verdict:** Current is 85% Pi-compatible; 15% hybrid needs conversion
