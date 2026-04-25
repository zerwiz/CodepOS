# hook-capture-learning Specification

## Hook Name

`hook-capture-learning`

## Description

Capture learning from work - review completed task, document pattern, sync parallel teams.

## Priority

Priority 16

## Applicable Agents

All agents

## Trigger

Task completed successfully

## Pre-conditions

- Task completed
- `hook-deliver-output` finished
- Lessons learned
- Patterns identified
- Documentation ready

## Actions

### 1. Review Completed Task

- What was accomplished
- What worked well
- What failed
- What could improve

### 2. Document Pattern

- Code pattern
- Component structure
- Best practices
- Gotchas to avoid

### 3. Update Mental Model

- Record in mental model
- Update version
- Increment count
- Document rationale

### 4. Share with Lead

- Post to team chat
- Request feedback
- Note improvements
- Request approval

### 5. Sync Parallel Teams

- Share with frontends
- Share with backends
- Sync context
- Distribute patterns

## Post-conditions

- Pattern documented
- Mental model updated
- Team shared
- Version updated
- Ready for deployment

## Error Handling

| Error | Action |
|-------|--------|
| Documentation failed | Retry later |
| Pattern unclear | Request review |
| Sync failed | Note and continue |
| Notification failed | Retry later |

## Example Execution

```
[HOOK] hook-capture-learning: Starting
[HOOK] hook-capture-learning: Reviewing completed task...
[HOOK] hook-capture-learning: Task: Create login form
[HOOK] hook-capture-learning: What worked: Vue SFC structure
[HOOK] hook-capture-learning: Documenting pattern...
[HOOK] hook-capture-learning: Recording component patterns
[HOOK] hook-capture-learning: Updating mental model...
[HOOK] hook-capture-learning: Pattern saved
[HOOK] hook-capture-learning: Sharing with lead...
[HOOK] hook-capture-learning: Syncing parallel teams...
[HOOK] hook-capture-learning: Learning captured
```

## Integration

- Called by `hook-deliver-output`
- Part of learning loop
- Improves mental models
- Triggers team sync

## Related Hooks

- `hook-deliver-output`: Task completion
- `hook-update-mental-model`: Mental model update
- `hook-read-conversation`: Context sharing
- `hook-init-agent`: Fresh start

---

End of hook-capture-learning specification