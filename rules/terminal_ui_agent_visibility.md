# Terminal UI Agent Visibility Rules

## Purpose
These rules ensure that all agents are fully visible in the terminal UI, providing complete transparency and observability for the user at all times.

---

## Rule 1: Full Transparency
**All agents must be fully visible in the terminal UI at all times. No hidden processes or suppressed output. All activity, thoughts, and actions of every agent must be displayed transparently so the user can monitor everything happening.**

- Every agent must be visible and trackable at all moments in the execution lifecycle.
- No agent activity should be hidden, suppressed, or run in the background without visibility.
- All agent actions including initialization, task execution, reasoning, and completion must be logged and displayed.
- The user must have real-time visibility into all concurrent operations.

## Rule 2: Proper English Communication
**All agent output in the terminal UI must use proper English spelling and grammar. No abbreviations, typos, or non-English text unless explicitly requested by the user.**

- All text output must be spelled and grammatically correct in standard English.
- Avoid internet slang, excessive abbreviations, or informal shorthand unless appropriate.
- Non-English text is only permitted if explicitly requested by the user.
- Maintain professional and clear communication throughout all agent interactions.

---

## Implementation Guidelines

### Visibility Requirements
- Display agent status indicators (Active, Processing, Completed, Error)
- Show current agent task and progress at all times
- Log all agent communications and decision-making processes
- Provide clear separation between different agents' outputs
- Include timestamps for all operations

### Output Standards
- Use clear, well-formatted text output
- Include meaningful status messages for each operation
- Never omit error messages or exception details
- Provide context for every action taken

### Enforcement
- All agents must comply with these visibility rules by default
- Any deviation must be reported and visible to the user
- User-configurable settings may only enhance (not reduce) transparency

---

## User Benefits

1. **Complete Observability**: See everything happening in real-time
2. **Trust & Confidence**: Know exactly what each agent is doing
3. **Debugging**: Trace issues across multiple agents easily
4. **Learning**: Understand agent behavior and capabilities
5. **Control**: Full awareness enables better decision-making

---

## Last Updated
{{current_date}}

---

## Related Rules
- `rule.terminal.agent_visibility`
- `rule.terminal.language`
