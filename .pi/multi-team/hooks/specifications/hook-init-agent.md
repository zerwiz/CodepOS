# hook-init-agent Specification

## Hook Name

`hook-init-agent`

## Description

Initialize agent on startup - loads expertise, skills, and enters idle state.

## Priority

Priority 1 (highest - startup)

## Applicable Agents

All agents

## Trigger

Agent startup or agent restart

## Pre-conditions

- Agent configuration files loaded
- Expertise YAML files accessible
- Conversation log initialized

## Actions

### 1. Read Expertise YAML

- Load agent-specific YAML
- Read mental model patterns
- Apply domain-specific rules

### 2. Load Skills Markdown

- Read active-listener.md
- Read precise-worker.md
- Read parallel-mental-model-updates.md

### 3. Read Conversation Log

- Check message history
- Identify assigned tasks
- Note dependencies

### 4. Validate Configuration

- Verify team config
- Check hooks registry
- Validate expertise patterns

### 5. Start Idle State

- Monitor for tasks
- Process incoming tasks
- Execute hook chain

## Post-conditions

- Agent fully initialized
- Ready to receive tasks
- Context aware of assignments
- Mental model loaded

## Error Handling

| Error | Action |
|-------|--------|
| Expertise file missing | Log error, abort init |
| Skill file unreadable | Skip skill, continue |
| Config invalid | Request repair |
| Hook registry missing | Use defaults |

## Example Execution

```
[SYSTEM] Initializing agent...
[HOOK] hook-init-agent: Starting
[HOOK] hook-init-agent: Loading expertise YAML...
[HOOK] hook-init-agent: Loaded vue-generator-mental-model.yaml
[HOOK] hook-init-agent: Loading skills...
[HOOK] hook-init-agent: Loaded active-listener.md
[HOOK] hook-init-agent: Loaded precise-worker.md
[HOOK] hook-init-agent: Reading conversation log...
[HOOK] hook-init-agent: Validating configuration...
[HOOK] hook-init-agent: Configuration valid
[HOOK] hook-init-agent: Starting idle state...
[AGENT] Ready to receive tasks
```

## Integration

- Integrates with `hook-receive-task`
- Called on agent startup
- Part of core lifecycle
- Enables agent readiness

## Related Hooks

- `hook-receive-task`: Next hook in chain
- `hook-update-mental-model`: May be triggered during init
- `hook-read-conversation`: Context loading

---

End of hook-init-agent specification