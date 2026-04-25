# hook-deliver-output Specification

## Hook Name

`hook-deliver-output`

## Description

Deliver completed work - package output, create documentation, update task list.

## Priority

Priority 6

## Applicable Agents

All agents

## Trigger

Work verified

## Pre-conditions

- `hook-verify-work` completed
- Quality checked
- Issues resolved
- Work verified

## Actions

### 1. Package Output

- Bundle code files
- Include dependencies
- Add configuration
- Create documentation

### 2. Deliver Work

- Create commit
- Write changelog
- Update README
- Generate examples

### 3. Update Task List

- Mark task complete
- Note completion time
- Document learnings
- Store in history

### 4. Notify Team

- Post completion
- Share deliverables
- Request feedback
- Celebrate success

### 5. Request Approval

- Get lead sign-off
- Request team review
- Incorporate feedback
- Deploy if approved

## Post-conditions

- Work delivered
- Documentation created
- Task marked complete
- Team notified
- Approval obtained

## Error Handling

| Error | Action |
|-------|--------|
| Documentation missing | Create docs |
| Approval denied | Request feedback |
| Team unavailable | Leave for team |
| Package failed | Debug and retry |

## Example Execution

```
[HOOK] hook-deliver-output: Starting
[HOOK] hook-deliver-output: Packaging output...
[HOOK] hook-deliver-output: Bundling code files...
[HOOK] hook-deliver-output: Creating documentation...
[HOOK] hook-deliver-output: Updating README...
[HOOK] hook-deliver-output: Delivering work...
[HOOK] hook-deliver-output: Marking task complete
[HOOK] hook-deliver-output: Completing at 18:45
[HOOK] hook-deliver-output: Notifying team...
[HOOK] hook-deliver-output: Requesting approval...
[HOOK] hook-deliver-output: Work delivered
```

## Integration

- Called by `hook-verify-work`
- Triggers `hook-read-conversation`
- Triggers `hook-capture-learning`
- Part of delivery path

## Related Hooks

- `hook-verify-work`: Previous hook
- `hook-read-conversation`: Context check
- `hook-capture-learning`: Learning capture
- `hook-init-agent`: Restart if needed

---

End of hook-deliver-output specification