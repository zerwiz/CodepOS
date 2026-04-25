# hook-snapshot-context Specification

## Hook Name

`hook-snapshot-context`

## Description

Take context snapshot - save file state, capture dependencies, document context.

## Priority

Priority 26

## Applicable Agents

All agents

## Trigger

Context reset or checkpoint

## Pre-conditions

- Current state captured
- Dependencies tracked
- Tasks noted
- Context available

## Actions

### 1. Save File State

- File contents
- File structure
- Dependencies
- Import maps

### 2. Capture Dependencies

- Task dependencies
- File dependencies
- Component dependencies
- Hook dependencies

### 3. Note Running Tasks

- Active work
- Pending items
- Blocked tasks
- Est. completion

### 4. Document Context

- Current goals
- Recent changes
- Team status
- Issue flags

### 5. Create Snapshot

- Timestamp
- State hash
- Dependency graph
- Context summary

## Post-conditions

- Snapshot created
- Dependencies captured
- Context documented
- State preserved
- Ready for recovery

## Error Handling

| Error | Action |
|-------|--------|
| State too large | Compress snapshot |
| Dependencies missing | Note missing |
| Capture failed | Retry later |
| Snapshot invalid | Request validation |

## Example Execution

```
[HOOK] hook-snapshot-context: Starting
[HOOK] hook-snapshot-context: Saving file state...
[HOOK] hook-snapshot-context: Capturing dependencies...
[HOOK] hook-snapshot-context: Noting running tasks...
[HOOK] hook-snapshot-context: Documenting context...
[HOOK] hook-snapshot-context: Creating snapshot...
[HOOK] hook-snapshot-context: Snapshot saved (hash: abc123)
[HOOK] hook-snapshot-context: Dependencies captured
[HOOK] hook-snapshot-context: Context documented
[HOOK] hook-snapshot-context: State preserved
```

## Integration

- Called by `hook-read-conversation`
- Checkpoint creation
- Part of context management
- May trigger backup

## Related Hooks

- `hook-read-conversation`: Context reading
- `hook-init-agent`: Fresh context
- `hook-deliver-output`: Reset if failed
- `hook-capture-learning`: Learning capture

---

End of hook-snapshot-context specification