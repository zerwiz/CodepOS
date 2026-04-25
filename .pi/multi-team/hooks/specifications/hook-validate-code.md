# hook-validate-code Specification

## Hook Name

`hook-validate-code`

## Description

Validate code quality - run linters, check tests, review patterns, flag issues.

## Priority

Priority 20

## Applicable Agents

`analyzer`, `analyzer-lead`, `tilt-on-analyzer-lead`

## Trigger

After code execution or on-demand validation

## Pre-conditions

- Code written
- `hook-execute-task` completed
- Quality checks enabled
- Linters configured

## Actions

### 1. Run Linters

- Prettier check
- ESLint check
- TypeScript errors
- Stylelint rules

### 2. Check Tests

- Unit tests pass
- Integration tests
- E2E tests
- Performance tests

### 3. Review Patterns

- Follow best practices
- Adhere to conventions
- Use appropriate patterns
- Match mental model

### 4. Flag Issues

- Syntax errors
- Logic errors
- Style violations
- Performance issues

### 5. Request Fixes

- Log issues
- Request corrections
- Provide feedback
- Retry after fixes

## Post-conditions

- Code validated
- Issues identified
- Reports generated
- Ready for fixes
- Approved or needs work

## Error Handling

| Error | Action |
|-------|--------|
| Lint failed | Request fixes |
| Tests failed | Debug and retry |
| Critical issues | Request review |
| Non-blocking | Note and continue |

## Example Execution

```
[HOOK] hook-validate-code: Starting
[HOOK] hook-validate-code: Running linters...
[HOOK] hook-validate-code: ESLint check passed
[HOOK] hook-validate-code: Prettier check passed
[HOOK] hook-validate-code: Checking tests...
[HOOK] hook-validate-code: Unit tests: 45/45 passed
[HOOK] hook-validate-code: Integration tests: 12/12 passed
[HOOK] hook-validate-code: Reviewing patterns...
[HOOK] hook-validate-code: Patterns follow conventions
[HOOK] hook-validate-code: Flagging issues...
[HOOK] hook-validate-code: No critical issues
[HOOK] hook-validate-code: Code validated
```

## Integration

- Called by `hook-verify-work`
- Triggers `hook-check-performance`
- May trigger `hook-capture-learning`
- Part of quality chain

## Related Hooks

- `hook-verify-work`: Previous verification
- `hook-check-performance`: Performance check
- `hook-update-mental-model`: Pattern updates
- `hook-validate-code`: Quality loop

---

End of hook-validate-code specification