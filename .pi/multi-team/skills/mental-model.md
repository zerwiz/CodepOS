# Mental Model System

This document tracks the mental model, active listener, and precise worker patterns used in this workspace.

## Mental Model Tracking

### Purpose

Track Vue/React component generation patterns, SFC conventions, CSS custom property usage, and responsive design patterns.

### Update Rules

- Read at task start for context
- Update after completing work to capture learnings
- Share with sibling instances in parallel teams
- Max 5000 lines to keep mental model lean

## Active Listener Pattern

### Purpose

Always read conversation log before every response to maintain context awareness.

### Rules

1. **Read Conversation Log**: Always check conversation history
2. **Track Assignments**: Note all task assignments and instructions
3. **Validate Understanding**: Confirm understanding before executing
4. **Capture Dependencies**: Note all file dependencies and context needed
5. **Update Understanding**: Learn from each interaction

## Precise Worker Pattern

### Purpose

Execute exactly what lead assigned - no improvising.

### Rules

1. **Follow Instructions**: Execute exactly as specified
2. **No Improvising**: Do not add features not requested
3. **Validate Before Write**: Double-check requirements before writing
4. **Report Issues**: Immediately report if requirements unclear
5. **Stay In Scope**: Do not drift from assigned task

## Parallel Mental Model Updates

### Purpose

Mental model file shared with sibling instances in parallel teams.

### Update Strategy

1. **Sync Changes**: Ensure all instances have same mental model
2. **Share Learnings**: Document new patterns discovered
3. **Version Control**: Keep mental model versioned
4. **Review Regularly**: Periodically review and clean up
5. **Migrate Smoothly**: Ensure parallel instances stay in sync

## Example Mental Model Entries

### Component Pattern

```
Component: <ComponentName>
Type: Vue SFC
Structure:
  - <script setup>
  - defineProps()
  - defineEmits()
  - defineSlots()
  - Template
  - Style
Dependencies:
  - shadcn-ui components
  - Headless UI
  - Framer Motion
```

### Hook Pattern

```
Hook: useX()
Purpose: Specific functionality
Context: When component needs X feature
Returns: Data and callbacks
Usage: Import and call in setup
```

### State Management Pattern

```
State: Global/Local
Type: Computed/Persisted
Tool: Pinia/Store
Sync: Reactive updates
Cleanup: Unsubscribe listeners
```

## Update Log

| Date | Update | Author | Notes |
|------|--------|--------|-------|
| 2024-01-01 | Initial | System | Created mental model file |
| 2024-01-15 | Added Vue patterns | Vue team | Vue component patterns added |
| 2024-02-01 | Added React hooks | React team | React hooks patterns added |
| 2024-03-01 | Added CSS patterns | Design team | CSS custom properties tracked |
| 2024-04-01 | Added responsive patterns | UI team | Responsive design patterns added |

## Guidelines

1. **Keep Mental Model Lean**: Max 5000 lines
2. **Version Control**: Track all mental model changes
3. **Share Regularly**: Sync with parallel teams
4. **Review Quarterly**: Clean up and update patterns
5. **Document Examples**: Include concrete examples
6. **Stay Relevant**: Remove outdated patterns

## Next Steps

1. Read this file before every task
2. Update mental model after work
3. Share with parallel teams
4. Review quarterly
5. Stay precise and follow instructions

---

End of Mental Model System