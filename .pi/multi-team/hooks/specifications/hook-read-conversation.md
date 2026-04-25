# hook-read-conversation Specification

## Hook Name

`hook-read-conversation`

## Description

Read conversation context - read message history, track context, note assignments.

## Priority

Priority 25

## Applicable Agents

`active-listener`, `active-listener-lead`, `tilt-on-active-listener-lead`

## Trigger

Context needed or on schedule

## Pre-conditions

- Conversation log initialized
- Message history accessible
- Context tracking enabled
- Assignments mapped

## Actions

### 1. Read Message History

- Recent messages
- Previous tasks
- Completed work
- Ongoing discussions

### 2. Track Context

- Current task
- Assigned goals
- Open questions
- Dependencies

### 3. Note Assignments

- Who is working
- Who to notify
- Pending work
- Team roles

### 4. Validate Dependencies

- Task dependencies
- File dependencies
- Context dependencies
- Resource dependencies

### 5. Maintain Awareness

- Team status
- Project progress
- Issue tracking
- Goal alignment

## Post-conditions

- Context read
- Assignments noted
- Dependencies validated
- Awareness maintained
- Ready for next action

## Error Handling

| Error | Action |
|-------|--------|
| Log missing | Initialize log |
| History unreadable | Request access |
| Context unclear | Request clarification |
| Assignment conflict | Resolve conflict |

## Example Execution

```
[HOOK] hook-read-conversation: Starting
[HOOK] hook-read-conversation: Reading message history...
[HOOK] hook-read-conversation: Recent messages: 3 unread
[HOOK] hook-read-conversation: Tracking context...
[HOOK] hook-read-conversation: Current task: Create login form
[HOOK] hook-read-conversation: Assigned goals: Complete by 18:45
[HOOK] hook-read-conversation: Noting assignments...
[HOOK] hook-read-conversation: Active workers: vue-generator
[HOOK] hook-read-conversation: Validating dependencies...
[HOOK] hook-read-conversation: All dependencies valid
[HOOK] hook-read-conversation: Context maintained
```

## Integration

- Called by `hook-deliver-output`
- Context maintenance
- Part of awareness loop
- May trigger `hook-snapshot-context`

## Related Hooks

- `hook-deliver-output`: Output delivery
- `hook-snapshot-context`: Snapshot capture
- `hook-capture-learning`: Learning capture
- `hook-init-agent`: Context reset

---

End of hook-read-conversation specification