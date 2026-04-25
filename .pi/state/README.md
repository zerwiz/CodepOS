# State Management Improvements

## Current Approach (File-Based YAML)

**OK for testing, has limitations:**
```yaml
# .pi/state/agent-<name>/memory.yaml
memory:
  - key: user_prompt
    value: "User request"
    timestamp: 1716556800000
```

## Production Improvements

### 1. SQLite Migration Path

**Future file:** `.pi/state/states-manager.ts`

**Benefits:**
- ✅ Concurrent reads/writes without locks
- ✅ Atomic transactions
- ✅ No file corruption
- ✅ Query capability with indexes

### 2. Trace ID System

**File:** `.pi/tracking/trace-logger.mjs`

**Usage:**
```typescript
const trace = createTraceContext()
council.broadcast({
  trace_id: trace.traceId
  message: "Validation complete"
})

// Debug failed flows:
grep "trace_id" .pi/teams/*/logs/
```

## Quick Start

```bash
# Test current file-based approach
pi deploy multi-agent-system

# Future: Enable SQLite
npm install better-sqlite3
# Then use states-manager.ts
```

## Troubleshooting State Issues

| Issue | Solution |
|-------|---------|
| "File not found" | Check `.pi/state/` exists |
| "Permission denied" | `chmod +x` on directories |
| "Context too large" | Run `/compact` |
| "State corrupted" | Run `pi clear` |

## Migration Checklist

- [ ] SQLite installed (better-sqlite3)
- [ ] Trace logger integrated
- [ ] Auto-compaction enabled
- [ ] Monitoring dashboards ready (optional)

