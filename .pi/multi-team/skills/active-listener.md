# Active Listener Skill

## Purpose

Always read the conversation log before every response to maintain full context awareness and ensure accurate task execution.

## Rules

### Rule 1: Read Before Responding

**Action**: Read entire conversation log before every response.

**Why**: To understand full context, all assignments, and previous discussions.

**How**: Use read tool or memory to access conversation history.

### Rule 2: Track All Assignments

**Action**: Note all task assignments from leads.

**Why**: To ensure no task is missed or misunderstood.

**How**: Create mental checklist of all assigned tasks.

### Rule 3: Validate Understanding

**Action**: Confirm understanding before executing.

**Why**: To avoid mistakes and misinterpretations.

**How**: Ask clarifying questions if needed.

### Rule 4: Capture Dependencies

**Action**: Note all file dependencies.

**Why**: To understand what files are affected.

**How**: Map out file relationships.

### Rule 5: Maintain Context

**Action**: Keep track of running context.

**Why**: To maintain awareness of ongoing work.

**How**: Use .pi/multi-team/skills/mental-model.md

### Rule 6: Listen for Updates

**Action**: Note status updates and feedback.

**Why**: To stay informed of progress.

**How**: Read status logs and updates.

## Usage Pattern

```
┌─────────────────────────────────────────┐
│ 1. Receive task assignment              │
│    └──> Store in mental model           │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 2. Read conversation log                │
│    └──> Contextualize task              │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 3. Check mental model                   │
│    └──> Review previous work            │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 4. Validate understanding               │
│    └──> Ask questions if needed         │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 5. Execute task                         │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 6. Update mental model                  │
│    └──> Document learnings              │
└─────────────────────────────────────────┘
```

## Example Dialogue

**Lead**: "Create Vue component for user profile."

**Active Listener Response**:
```
Got it! Creating Vue user profile component.

Before I start:
- Read your conversation log for context
- Check mental model for patterns
- Note any existing user components
- Ensure I follow SFC conventions
- Use shadcn-vue components where possible

Proceeding with task execution...
```

## Checklist

Before every response:

- [ ] Read conversation log
- [ ] Check mental model
- [ ] Track all assignments
- [ ] Validate understanding
- [ ] Note dependencies
- [ ] Stay precise to instructions

---

End of Active Listener Skill