# hook-check-performance Specification

## Hook Name

`hook-check-performance`

## Description

Check performance metrics - measure load times, check bundle size, profile memory.

## Priority

Priority 21

## Applicable Agents

`analyzer`, `analyzer-lead`, `tilt-on-analyzer-lead`

## Trigger

After validation or on-demand performance check

## Pre-conditions

- Code validated
- `hook-validate-code` completed
- Performance tools configured
- Metrics enabled

## Actions

### 1. Measure Load Times

- Initial render
- Component interaction
- API calls
- Bundle load time

### 2. Check Bundle Size

- Code splitting
- Tree shaking
- Lazy loading
- Asset optimization

### 3. Profile Memory

- Memory usage
- Leakage detection
- Garbage collection
- Heap analysis

### 4. Review Queries

- Database queries
- API endpoints
- Rendering optimization
- Component tree

### 5. Optimize Where Needed

- Lazy components
- Debounce inputs
- Memoize calculations
- Use SSR where needed

## Post-conditions

- Metrics measured
- Issues identified
- Optimization suggestions
- Performance report
- Ready for deployment

## Error Handling

| Error | Action |
|-------|--------|
| Perf too slow | Request optimization |
| Memory leak | Debug and fix |
| Bundle too large | Reduce/bundle |
| Query slow | Optimize/index |

## Example Execution

```
[HOOK] hook-check-performance: Starting
[HOOK] hook-check-performance: Measuring load times...
[HOOK] hook-check-performance: Initial render: 240ms
[HOOK] hook-check-performance: Component interaction: 45ms
[HOOK] hook-check-performance: API calls: 60ms
[HOOK] hook-check-performance: Checking bundle size...
[HOOK] hook-check-performance: Bundle: 245KB
[HOOK] hook-check-performance: Checking memory...
[HOOK] hook-check-performance: Memory: stable
[HOOK] hook-check-performance: Reviewing queries...
[HOOK] hook-check-performance: All queries optimized
[HOOK] hook-check-performance: Checking performance...
[HOOK] hook-check-performance: Performance acceptable
[HOOK] hook-check-performance: Ready for delivery
```

## Integration

- Called by `hook-validate-code`
- Used in production builds
- Part of quality assurance
- Triggers optimization if needed

## Related Hooks

- `hook-validate-code`: Quality check
- `hook-verify-work`: Work verification
- `hook-update-mental-model`: Optimization patterns
- `hook-deliver-output`: Final delivery

---

End of hook-check-performance specification