
---

## Happy Path Workflow (Example Task)

### Scenario: Build AI Chatbot

```bash
# 1. Deploy system
pi deploy multi-agent-system

# 2. User request
pi -p "Build an AI chatbot for legal consultations"

# 3. System execution (internal flow):
#    Orchestrator receives → Council broadcasts → 
#    Planning breaks down → Design creates → UI-Gen-A generates →
#    Validation-A validates → Council approves → Export to .ui file

# 4. View output
pi --export chatbot-ui.ui.html
```

### Example Trace Flow

```
[Request] User: "Create legal chatbot"
   ↓
[Orchestrator] Receives, spawns council
   ↓
[Council] Broadcasts to all channels
   ↓
[Planning] Breaks into: requirements, UI, backend
   ↓
[Design] Creates .ui components
   ↓  
[UI-Gen-A] Generates .html code
   ↓
[Validation-A] Passes security checks
   ↓  
[Council] Approves, compacts old messages
   ↓
[Orchestrator] Delivers final .ui file


[Completion] User: "Review .ui file"
```

### Example: Debugging Failed Flow

```bash
# If validation fails:
pi --fork <id>  # Re-try from last validation step
pi --session <id> --tools read   # View previous validation output
pi -c  # Continue from where it stopped
```

---

## Troubleshooting Guide

### 1. If Pi Drops the Orchestrator Persona

```bash
# Wipe current sessions and retry
pi clear

# Re-deploy system
pi deploy multi-agent-system

# Reload if needed
pi --no-session  # New session
pi  # Then paste system prompt again
```

### 2. If a `just team` Command Hangs

```bash
# Check logs
cat .pi/teams/orchestrator/.pi/logs/just-team.log | head -100

# Check agent-specific logs
cat .pi/teams/<agent-name>/.pi/logs/alerts.mjs

# Kill hung process
pkill -f "just team"

# Restart just
just team <agent>
```

### 3. How to Bypass Council for Testing

```bash
# Deploy without council
pi deploy team <agent-name> --no-council

# Test agent directly
pi -p "Test this agent"
```

### 4. If State Management Fails (File Locking)

The system uses file-based state which has limitations. For production scaling:

```bash
# Current approach: File-based YAML (OK for testing)
# Future improvement: SQLite state

# Monitor file locks (if used by Pi):
lsof +L0

# Fix stuck locks:
fuser -k /path/to/state_file

# Alternative: Clear and restart
rm -f .pi/state/*
pi clear
```

### 5. Context Window Bloat

```bash
# Watch context size (in bytes)
# Estimated cost increases with message count

# Manual compaction:
/pi/compact  # Or use Shift+Tab in Pi

# Auto-compact after task:
# Add to team scripts:
#   After success: pi -p /compact
```

### 6. Missing API Credentials

```bash
# Re-enter credentials
pi /settings
# Then paste new key
```

### 7. Council Members Disappearing

```bash
# Recreate council
pi deploy multi-agent-system --reset

# Check council status
pi list | grep council
```

### 8. File System Quota Reached

```bash
# Check disk space
df -h

# Clean old sessions
rm -f .pi/agent/sessions/*  # Or use /compact
```

### Common Error Patterns

| Error | Cause | Solution |
|-------|-------|----------|
| "Permission denied" | Missing execute bit | `chmod +x` on scripts |
| "Agent not found" | Team not deployed | `pi deploy team <name>` |
| "Context too long" | No compaction | Run `/compact` |
| "Council timeout" | Members unreachable | Check `.pi/teams/` permissions |
| "Skill not loaded" | Wrong location | Move to `.pi/skills/` |

### Escalation Paths

1. **Agent stuck?** → Check `.pi/logs/alerts.mjs`
2. **Council silent?** → Check `council.broadcast()` in logs
3. **State corrupted?** → Run `pi clear` and re-deploy
4. **System prompt lost?** → Re-run `pi` with system prompt

---
## Next Steps: Technical Improvements

### 1. SQLite State Management (Recommended)

Currently file-based state has race condition risks. Next improvement:

**Current (File-Based):**
```json
# .pi/state/agent-<name>/memory.yaml
memory:
  - key: user_prompt
    value: "User request"
    timestamp: 1716556800000
```

**Future (SQLite):**
```sql
-- codepos-state.db schema
CREATE TABLE memories (
  id INTEGER PRIMARY KEY,
  agent TEXT,
  user_id TEXT,
  key TEXT,
  value TEXT,
  timestamp INTEGER,
  UNIQUE(agent, user_id, key)
);
```

**Benefits:**
- ✅ Concurrent reads/writes without locks
- ✅ Atomic transactions
- ✅ No file corruption
- ✅ Query capability

### 2. Distributed Tracing (Trace IDs)

**Current (No Trace IDs):**
```
council.broadcast(channel, message)
```

**Future (With Trace IDs):**
```typescript
interface TracePayload {
  traceId: string,           // Unique per request
  spanId: string,            // Unique per agent step
  startTime: number,
  agent: string,
  action: 'broadcast'|'request'|'approve'|'deny'
}

council.broadcast({
  traceId: crypto.randomUUID(),  // Or use existing Pi trace
  message: "Validation complete",
  channel: "validation-channel"
})
```

**Log grep pattern for debugging:**
```bash
grep "trace_id" .pi/teams/*/logs/
```

### 3. Scalability Improvements

When moving from 10 → 100 agents:

| Metric | Current (13) | Expected (100+) |
|--------|-------------|-----------------|
| State management | File-based | SQLite/Redis |
| Tracing | Manual logs | Opentelemetry + Prometheus |
| Context management | `/compact` | Auto-compaction |
| Monitoring | `pi` logs | Grafana dashboards |

Would you like me to:
1. **Create the SQLite state implementation** next?
2. **Add trace ID support** to the council script?
3. **Set up the monitoring dashboard** for 100+ agents?

---
**End of Troubleshooting Guide**

