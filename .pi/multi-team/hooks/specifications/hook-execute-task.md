# hook-execute-task Specification

## Hook Name

`hook-execute-task`

## Description

Execute the coding task - write files, implement logic, test functionality.

## Priority

Priority 4

## Applicable Agents

All agents

## Trigger

Plan created

## Pre-conditions

- `hook-plan-execution` completed
- Plan created
- Dependencies mapped
- Resources allocated

## Actions

### 1. Write Code Files

- Create new files
- Write functions
- Implement logic
- Add components

### 2. Create Components

- Vue SFC components
- React function components
- TypeScript interfaces
- Event handlers

### 3. Implement Logic

- Form validation
- State management
- API integration
- Error handling

### 4. Test Functionality

- Manual checks
- Logic flow
- Edge cases
- Component rendering

### 5. Update Mental Model

- Document pattern
- Record approach
- Note dependencies
- Track improvements

## Post-conditions

- Code written
- Files created
- Testing completed
- Mental model updated
- Ready for verification

## Error Handling

| Error | Action |
|-------|--------|
| Syntax error | Fix immediately |
| Logic error | Debug and retry |
| File conflict | Resolve manually |
| Dependency missing | Install/fix deps |

## Example Execution

```
[HOOK] hook-execute-task: Starting
[HOOK] hook-execute-task: Writing Login.vue...
[HOOK] hook-execute-task: Creating script setup...
[HOOK] hook-execute-task: Defining props/emit...
[HOOK] hook-execute-task: Implementing template...
[HOOK] hook-execute-task: Adding styles...
[HOOK] hook-execute-task: Creating index.ts...
[HOOK] hook-execute-task: Adding export...
[HOOK] hook-execute-task: Testing functionality...
[HOOK] hook-execute-task: Form validation working
[HOOK] hook-execute-task: Component rendering
[HOOK] hook-execute-task: Updating mental model...
[HOOK] hook-execute-task: Task executed
```

## Integration

- Called by `hook-plan-execution`
- Triggers `hook-verify-work`
- May trigger `hook-update-mental-model`
- Part of execution chain

## Related Hooks

- `hook-plan-execution`: Previous hook
- `hook-verify-work`: Next hook
- `hook-deliver-output`: Success path
- `hook-validate-code`: Quality check

---

End of hook-execute-task specification