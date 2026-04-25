# Parallel Mental Model Updates

## Purpose

Mental model file shared with sibling instances in parallel teams. This skill ensures all parallel instances stay synchronized and informed about mental model updates, new patterns discovered, and shared learnings.

## Architecture

```
┌─────────────────────────────────────────────────┐
│          Parallel Team Instances                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │ Team A      │  │ Team B      │  │ Team C  │ │
│  │ Mental      │◄─┤ Mental      │◄─┤ Mental  │ │
│  │ Model       │ │ Model       │ │ Model    │ │
│  │ Instance    │ │ Instance    │ │ Instance │ │
│  └─────────────┘  └─────────────┘  └─────────┘ │
│        ▲                    ▲                 │
│        │                    │                 │
│        └───────────────────┼─────────────────┘
│                            │
│              Shared Update Bus                    │
│                      (File Watch & Sync)                 │
└─────────────────────────────────────────────────┘
```

## Rules

### Rule 1: Read Before Update

**Action**: Read current mental model before making updates.

**Why**: To avoid overwriting or conflicting with existing patterns.

**How**: Use read tool before writing.

### Rule 2: Track Changes

**Action**: Document all mental model changes.

**Why**: To maintain change history and rollback capability.

**How**: Add to update log.

### Rule 3: Validate with Leads

**Action**: Check with leads before major changes.

**Why**: To ensure changes align with team vision.

**How**: Request approval for structural changes.

### Rule 4: Sync Changes

**Action**: Ensure all instances have same mental model.

**Why**: To maintain consistency across parallel teams.

**How**: Use version control and sync scripts.

### Rule 5: Share Learnings

**Action**: Document new patterns discovered.

**Why**: To share knowledge across parallel teams.

**How**: Add to mental model and share.

### Rule 6: Version Control

**Action**: Use version tags for mental model.

**Why**: To track mental model evolution.

**How**: Use semantic versioning.

## Update Strategy

### Trigger-Based Updates

**When to update:**

1. **New pattern discovered**: Add new component pattern
2. **Best practice learned**: Document new conventions
3. **Issue resolved**: Add fix patterns
4. **Feature completed**: Document feature patterns
5. **Team request**: Update on team feedback

### Frequency-Based Updates

**When to sync:**

1. **Hourly**: For fast-moving projects
2. **Daily**: For normal projects
3. **Weekly**: For stable projects
4. **On-demand**: For major updates

### Update Process

```
┌─────────────────────────────────────────┐
│ 1. Discover or need to update           │
│    └──> Read current mental model        │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 2. Create update draft                   │
│    └──> Prepare mental model changes     │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 3. Validate with lead (if needed)        │
│    └──> Get approval for structural updates│
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 4. Write to mental model file            │
│    └──> Use write/edit tools             │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 5. Track update log                      │
│    └──> Document change details          │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 6. Notify parallel instances             │
│    └──> Trigger sync                    │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 7. Verify sync                           │
│    └──> Check all instances updated     │
└─────────────────────────────────────────┘
```

## Example Update Log

| Version | Date | Author | Description | Files Changed |
|---------|------|--------|-------------|---------------|
| 1.0.0 | 2024-01-01 | System | Initial mental model | All mental models |
| 1.1.0 | 2024-01-15 | Vue team | Add Vue component patterns | vue-generator mental model |
| 1.2.0 | 2024-02-01 | React team | Add React hook patterns | react-generator mental model |
| 1.3.0 | 2024-02-15 | Design team | Add CSS patterns | All mental models |
| 1.4.0 | 2024-03-01 | UI team | Add responsive patterns | All mental models |
| 1.5.0 | 2024-03-15 | All teams | Sync mental models | All mental models |

## Checklist

Before making mental model update:

- [ ] Read current mental model
- [ ] Prepare update draft
- [ ] Validate with lead (if needed)
- [ ] Write to mental model file
- [ ] Track in update log
- [ ] Notify parallel instances
- [ ] Verify sync
- [ ] Document rationale

## Communication Template

**Pattern Discovery:**
```
Discovered: New [pattern type] for [feature]
Location: [file path]
Impact: [brief impact description]
Action: [what needs to be done]
```

**Update Notification:**
```
Mental Model Update v[X.Y.Z]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Changes:
  - [change 1]
  - [change 2]
Impact: [brief impact]
Status: [synced/pending]
Action needed: [if any]
```

## Mental Model File Structure

```yaml
name: "[generator name]"
version: "[X.Y.Z]"
last-updated: "[ISO timestamp]"
patterns:
  - name: "[pattern name]"
    use-when: "[when to use]"
    description: "[pattern description]"
    code: "[example code]"
skills:
  - path: "[skill file path]"
    use-when: "[when to read]"
tools:
  - read
  - write
  - edit
domain:
  - path: "[domain path]"
    read: true
    upsert: true
    delete: false
status: "active"
```

## Best Practices

1. **Small Updates**: Keep updates focused and small.
2. **Well-Documented**: Document all changes clearly.
3. **Test Changes**: Test mental model changes before syncing.
4. **Notify Teams**: Always notify parallel instances.
5. **Version Control**: Use semantic versioning.
6. **Review Regularly**: Schedule periodic mental model reviews.

## Tools for Sync

- **File Watch**: Monitor file changes
- **Git**: Version control for mental models
- **Webhooks**: Notify instances of changes
- **CLI**: Command-line sync tools
- **API**: Remote sync methods

---

End of Parallel Mental Model Updates Skill