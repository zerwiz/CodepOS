# hook-init-tilt-on Specification

## Hook Name

`hook-init-tilt-on`

## Description

Initialize tilt-on state - enable proactive monitoring, enhance detection, prepare for action.

## Priority

Priority 30

## Applicable Agents

Agents in tilt-on mode
`tilt-on-analyzer-lead` - backend monitoring
`tilt-on-frontend-analyzer-lead` - UI monitoring
`tilt-on-lead-agent` - lead coordination
`tilt-on-lead-orientations` - orientation tracking
`tilt-on-orientation-agent` - orientation delivery
`tilt-on-orientation-tilt-on` - enhanced monitoring
`tilt-on-analyzer-tilt-on` - backend analysis
`tilt-on-frontend-analyzer-tilt-on` - frontend analysis
`tilt-on-lead-tilt-on` - lead tilt coordination

## Trigger

Tilt-on activation or monitoring request

## Pre-conditions

- Agent in tilt-on state
- Monitoring enabled
- Detection tools ready
- Communication channels open
- Alert thresholds set

## Actions

### 1. Enable Proactive Monitoring

- Continuous watching
- Pattern detection
- Anomaly scanning
- Threshold checking

### 2. Enhance Detection

- Scan for issues
- Identify risks
- Flag problems
- Prepare alerts

### 3. Prepare for Action

- Plan responses
- Script fixes
- Define escalation
- Set notification channels

### 4. Monitor Team State

- Check team status
- Track progress
- Validate completion
- Alert on delays

### 5. Update Status

- Mark as active
- Log activation
- Set monitoring interval
- Request confirmations

## Post-conditions

- Monitoring enabled
- Detection active
- Action prepared
- Status updated
- Alerts configured

## Error Handling

| Error | Action |
|-------|--------|
| Monitoring disabled | Enable monitoring |
| Detection failed | Retry detection |
| Alert throttled | Request unthrottle |
| Channel unavailable | Use backup channel |

## Example Execution

```
[HOOK] hook-init-tilt-on: Starting
[HOOK] hook-init-tilt-on: Enabling proactive monitoring...
[HOOK] hook-init-tilt-on: Watching files for changes
[HOOK] hook-init-tilt-on: Enhancing detection...
[HOOK] hook-init-tilt-on: Scanning for issues
[HOOK] hook-init-tilt-on: Identifying risks
[HOOK] hook-init-tilt-on: Flagging problems
[HOOK] hook-init-tilt-on: Preparing for action...
[HOOK] hook-init-tilt-on: Planning responses
[HOOK] hook-init-tilt-on: Updating status...
[HOOK] hook-init-tilt-on: Marking as active
[HOOK] hook-init-tilt-on: Monitoring enabled
```

## Integration

- Called on tilt-on activation
- Enhanced monitoring
- Part of readiness chain
- May trigger alerts

## Related Hooks

- `hook-init-agent`: Normal init
- `hook-update-mental-model`: Pattern updates
- `hook-capture-learning`: Learning capture
- `hook-validate-code`: Quality validation
- `hook-check-performance`: Performance monitoring

---

End of hook-init-tilt-on specification