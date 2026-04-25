# Hooks System Documentation

## Overview

The Hooks System defines behaviors that agents follow when executing tasks. Hooks orchestrate agent actions, quality checks, context management, and team coordination.

## Hook Categories

### Core Lifecycle Hooks (Priority 1-6)

These hooks manage task lifecycle from initiation to delivery.

- `hook-init-agent` - Agent initialization
- `hook-receive-task` - Task reception
- `hook-plan-execution` - Execution planning
- `hook-execute-task` - Task execution
- `hook-verify-work` - Work verification
- `hook-deliver-output` - Output delivery

### Domain-Specific Hooks (Priority 10-12)

Domain-specific hooks for specialized agent types.

- `hook-vue-component` - Vue SFC creation
- `hook-react-component` - React component creation
- `hook-api-endpoint` - API endpoint creation

### Quality Control Hooks (Priority 20-21)

Quality assurance hooks for validation.

- `hook-validate-code` - Code validation
- `hook-check-performance` - Performance checking

### Learning Hooks (Priority 15-16)

Learning and pattern documentation hooks.

- `hook-update-mental-model` - Mental model updates
- `hook-capture-learning` - Learning capture

### Context Management Hooks (Priority 25-26)

Context tracking and snapshot hooks.

- `hook-read-conversation` - Context reading
- `hook-snapshot-context` - Context snapshotting

### Tilt-On Hooks (Priority 30-)

Enhanced monitoring and proactive state hooks.

- `hook-init-tilt-on` - Tilt-on initialization
- Various tilt-on variants

## Hook Execution Flow

```
[Task Received]
    │
    ├─→ hook-init-agent
    │   └─→ hook-receive-task
    │       └─→ hook-plan-execution
    │           └─→ hook-execute-task
    │               └─→ hook-verify-work
    │                   └─→ hook-deliver-output
    │                       └─→ hook-capture-learning
    │                           └─→ hook-update-mental-model
    │
    └─→ hook-read-conversation
            └─→ hook-snapshot-context
```

## How to Add a Hook

1. Add hook definition to `.pi/multi-team/hooks/hooks.yaml`
2. Create specification in `.pi/multi-team/hooks/specifications/`
3. Update orchestration in `.pi/multi-team/hooks/orchestration/`
4. Test hook execution
5. Document usage patterns

## Hook Specification Template

```markdown
# {hook-name} Specification

## Hook Name

{hook_name}

## Description

{description}

## Priority

{priority_number}

## Applicable Agents

{list of applicable agents}

## Trigger

{trigger description}

## Pre-conditions

{list of pre-conditions}

## Actions

### 1. Action Name

{action description}

## Post-conditions

{list of post-conditions}

## Error Handling

| Error | Action |
|-------|--------|
| error1 | action1 |
| error2 | action2 |

## Example Execution

```
[HOOK] hook-name: Starting
[HOOK] hook-name: Performing action...
[HOOK] hook-name: Success
```

## Integration

{integration description}

## Related Hooks

{related hooks list}
```

## Team Coordination

Hooks orchestrate multi-agent workflows:

1. **Lead Agent**: Coordinates tasks and monitors progress
2. **Frontend Team**: Handles Vue/React components
3. **Backend Team**: Handles API endpoints
4. **Analyzer Team**: Validates code and performance
5. **Listener Team**: Manages context and conversation
6. **Monitoring Team**: Tracks issues and alerts

## Monitoring with Tilt-On

When tilt-on is enabled, hooks become proactive:

- `hook-init-tilt-on` enables monitoring
- Various tilt-on variants handle specific areas
- Enhanced detection and alerting occur

## Hooks in YAML Configuration

The `hooks.yaml` file defines hook chains:

```yaml
hooks:
  vue-component:
    init-hook: hook-init-agent
    task-hook: hook-receive-task
    plan-hook: hook-plan-execution
    execute-hook: hook-execute-task
    verify-hook: hook-verify-work
    deliver-hook: hook-deliver-output
    learn-hook: hook-capture-learning
    update-hook: hook-update-mental-model

  tilt-on:
    init-hook: hook-init-tilt-on
    monitoring-hook: hook-init-monitoring
    alert-hook: hook-delivery-alert
```

## Common Patterns

### Task Completion Pattern

1. Task received
2. Context read
3. Code generated
4. Work verified
5. Output delivered
6. Learning captured
7. Mental model updated

### Quality Assurance Pattern

1. Code created
2. Code validated
3. Performance checked
4. Patterns documented
5. Team notified

### Team Sync Pattern

1. Task assigned
2. Frontend team works
3. Backend team works
4. Both complete
5. Learning synced
6. Patterns shared

## Best Practices

1. **Keep hooks simple** - Focus on specific responsibilities
2. **Document purpose** - Clear specifications
3. **Handle errors** - Error recovery paths
4. **Enable tilt-on** - When proactive monitoring needed
5. **Update mental model** - Capture learnings
6. **Sync parallel teams** - Share context and patterns
7. **Prioritize hooks** - Use priority system

## Maintenance

- Review hooks quarterly
- Update for new patterns
- Remove unused hooks
- Add new hooks as needed

## Support

For questions about hooks:

1. Check specifications in `.pi/multi-team/hooks/specifications/`
2. Review orchestration in `.pi/multi-team/hooks/orchestration/`
3. Refer to hooks YAML configuration
4. Ask AI lead agent for clarification

---

End of hooks README