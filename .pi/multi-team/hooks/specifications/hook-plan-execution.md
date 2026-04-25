# hook-plan-execution Specification

## Hook Name

`hook-plan-execution`

## Description

Plan execution before coding - break down task, map dependencies, check patterns.

## Priority

Priority 3

## Applicable Agents

All agents

## Trigger

Task received and parsed

## Pre-conditions

- `hook-receive-task` completed
- Requirements parsed
- Dependencies mapped
- Mental model checked

## Actions

### 1. Break Down Task

- Identify atomic steps
- Map sub-tasks
- Define deliverables
- Estimate completion

### 2. Map File Dependencies

- Existing files to modify
- New files to create
- Import relationships
- Configuration changes

### 3. Check Existing Patterns

- Find similar components
- Review mental model
- Identify applicable hooks
- Note best practices

### 4. Create Execution Plan

- Step-by-step approach
- Hook chain to use
- Resource requirements
- Timeline estimate

### 5. Estimate Completion Time

- Simple tasks: <1 min
- Medium tasks: 1-5 min
- Complex tasks: 5-30 min
- Major feature: >30 min

## Post-conditions

- Plan created
- Dependencies mapped
- Timeline estimated
- Ready for execution
- Resources allocated

## Error Handling

| Error | Action |
|-------|--------|
| Dependencies unclear | Request information |
| Pattern not found | Use defaults |
| Task too complex | Request breakdown |
| Time estimate exceeded | Request scope change |

## Example Execution

```
[HOOK] hook-plan-execution: Starting
[HOOK] hook-plan-execution: Breaking down task...
[HOOK] hook-plan-execution: Step 1: Create Login.vue
[HOOK] hook-plan-execution: Step 2: Add props/emit
[HOOK] hook-plan-execution: Step 3: Implement form
[HOOK] hook-plan-execution: Step 4: Add styles
[HOOK] hook-plan-execution: Mapping file dependencies...
[HOOK] hook-plan-execution: Creating Login.vue: .aegis/ui/components
[HOOK] hook-plan-execution: Checking patterns...
[HOOK] hook-plan-execution: Found matching patterns
[HOOK] hook-plan-execution: Estimating time...
[HOOK] hook-plan-execution: Estimated: 3 min
[HOOK] hook-plan-execution: Plan created
```

## Integration

- Called by `hook-receive-task`
- Triggers `hook-execute-task`
- May trigger `hook-capture-learning`
- Part of execution chain

## Related Hooks

- `hook-receive-task`: Previous hook
- `hook-execute-task`: Next hook
- `hook-deliver-output`: Success path
- `hook-validate-code`: Quality check

---

End of hook-plan-execution specification