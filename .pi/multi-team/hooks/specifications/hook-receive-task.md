# hook-receive-task Specification

## Hook Name

`hook-receive-task`

## Description

Process incoming task - parse requirements, check mental model, map dependencies.

## Priority

Priority 2

## Applicable Agents

All agents

## Trigger

Incoming task assignment

## Pre-conditions

- `hook-init-agent` completed
- Expertise loaded
- Skills loaded
- Agent in idle state

## Actions

### 1. Parse Task Requirements

- Read task text
- Identify task type
- Extract requirements
- Map expected outputs

### 2. Check Mental Model

- Search existing patterns
- Identify applicable hooks
- Note relevant skills
- Check team config

### 3. Map Dependencies

- File dependencies
- Component dependencies
- Hook chain dependencies
- Expertise dependencies

### 4. Request Clarification

- If requirements unclear
- Note ambiguity
- Ask team questions
- Validate scope

### 5. Validate Scope

- Check task boundaries
- Ensure no scope creep
- Verify team capacity
- Estimate resources needed

## Post-conditions

- Task understood
- Requirements parsed
- Dependencies mapped
- Scope validated
- Ready for planning

## Error Handling

| Error | Action |
|-------|--------|
| Task unclear | Request clarification |
| No expertise match | Use defaults |
| Dependencies missing | Log warning, proceed |
| Scope too large | Request splitting |

## Example Execution

```
[SYSTEM] Task received: Create login form
[HOOK] hook-receive-task: Starting
[HOOK] hook-receive-task: Parsing requirements...
[HOOK] hook-receive-task: Identified: Vue component, form fields
[HOOK] hook-receive-task: Checking mental model...
[HOOK] hook-receive-task: Found: Vue component patterns
[HOOK] hook-receive-task: Mapping dependencies...
[HOOK] hook-receive-task: Dependencies: shadcn-ui, shiki
[HOOK] hook-receive-task: Validating scope...
[HOOK] hook-receive-task: Scope valid
[HOOK] hook-receive-task: Moving to planning
```

## Integration

- Called by `hook-init-agent` (after init)
- Triggers `hook-plan-execution`
- May trigger `hook-read-conversation`
- Integrates with task management

## Related Hooks

- `hook-init-agent`: Previous hook
- `hook-plan-execution`: Next hook
- `hook-read-conversation`: Context checking
- `hook-validate-code`: Quality check later

---

End of hook-receive-task specification