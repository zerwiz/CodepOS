# hook-update-mental-model Specification

## Hook Name

`hook-update-mental-model`

## Description

Update mental model system - discover new patterns, document rationale, sync parallel teams.

## Priority

Priority 15

## Applicable Agents

Agent stream (all agents discover through expertise/skills)

## Trigger

New pattern discovered or work completed

## Pre-conditions

- Work completed
- Pattern discovered
- Rationale understood
- Mental model accessible

## Actions

### 1. Discover New Pattern

- Review code for patterns
- Identify new conventions
- Note applicable use-cases
- Estimate applicability

### 2. Document Rationale

- Why this pattern
- What problem solved
- Trade-offs involved
- Success metrics

### 3. Track Dependencies

- Applicable hooks
- Required expertise
- Relevant skills
- Team requirements

### 4. Notify Team

- Share new pattern
- Request validation
- Note improvements
- Request adoption

### 5. Version Increment

- Bump pattern version
- Update expertise YAML
- Document in mental model
- Notify via chat

## Post-conditions

- Mental model updated
- Pattern documented
- Version incremented
- Team notified
- Improvements noted

## Error Handling

| Error | Action |
|-------|--------|
| Pattern invalid | Request review |
| Documentation missing | Complete docs |
| Version conflict | Merge resolve |
| Notification failed | Retry later |

## Example Execution

```
[HOOK] hook-update-mental-model: Starting
[HOOK] hook-update-mental-model: Discovering new patterns...
[HOOK] hook-update-mental-model: Found: async function pattern
[HOOK] hook-update-mental-model: Documenting rationale...
[HOOK] hook-update-mental-model: Why: Improves error handling
[HOOK] hook-update-mental-model: What: Async/Await with try/catch
[HOOK] hook-update-mental-model: Tracking dependencies...
[HOOK] hook-update-mental-model: Hooks: hook-validate-code
[HOOK] hook-update-mental-model: Notifying team...
[HOOK] hook-update-mental-model: Incrementing version...
[HOOK] hook-update-mental-model: Mental model updated
[HOOK] hook-update-mental-model: Pattern version 2.0
```

## Integration

- Called by `hook-execute-task`
- Improves future work
- Part of learning system
- May trigger `hook-capture-learning`

## Related Hooks

- `hook-execute-task`: Work execution trigger
- `hook-capture-learning`: Learning capture
- `hook-read-conversation`: Pattern sharing
- `hook-init-agent`: Pattern loading

---

End of hook-update-mental-model specification