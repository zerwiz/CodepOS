# hook-verify-work Specification

## Hook Name

`hook-verify-work`

## Description

Verify completed work - review changes, validate requirements, test functionality.

## Priority

Priority 5

## Applicable Agents

All agents

## Trigger

Task execution completed

## Pre-conditions

- `hook-execute-task` completed
- Code written
- Testing completed
- Mental model updated

## Actions

### 1. Review Changes

- Check file contents
- Review structure
- Verify code quality
- Check for typos

### 2. Validate Against Requirements

- Match against original task
- Check all requirements met
- Verify deliverables
- Ensure no extras added

### 3. Test Functionality

- Component renders
- Props work
- Events fire
- State updates

### 4. Check for Issues

- Lint checks
- Logic errors
- Missing imports
- Performance issues

### 5. Request Review if Needed

- Flag for team review
- Request lead approval
- Note concerns
- Prepare explanation

## Post-conditions

- Work verified
- Issues identified
- Ready for delivery
- Quality checked
- Approved or needs fixes

## Error Handling

| Error | Action |
|-------|--------|
| Validation failed | Request fixes |
| Testing failed | Debug and retry |
| Issue found | Log and escalate |
| Approval needed | Request lead |

## Example Execution

```
[HOOK] hook-verify-work: Starting
[HOOK] hook-verify-work: Reviewing changes...
[HOOK] hook-verify-work: Checking structure...
[HOOK] hook-verify-work: Verifying code quality...
[HOOK] hook-verify-work: Validating requirements...
[HOOK] hook-verify-work: All requirements met
[HOOK] hook-verify-work: Testing functionality...
[HOOK] hook-verify-work: Component renders
[HOOK] hook-verify-work: Props working
[HOOK] hook-verify-work: Events firing
[HOOK] hook-verify-work: Checking for issues...
[HOOK] hook-verify-work: No issues found
[HOOK] hook-verify-work: Work verified
[HOOK] hook-verify-work: Ready for delivery
```

## Integration

- Called by `hook-execute-task`
- Triggers `hook-deliver-output`
- May trigger `hook-validate-code`
- Part of verification path

## Related Hooks

- `hook-execute-task`: Previous hook
- `hook-deliver-output`: Next hook
- `hook-validate-code`: Quality check
- `hook-check-performance`: Performance verification

---

End of hook-verify-work specification