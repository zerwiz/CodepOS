# File Move Validation Guidelines for Multi-Agent System

## Overview

This document outlines the validation requirements and precautions when moving, renaming, or deleting files in the CodepOS multi-agent orchestration system.

## Critical Pre-Move Validation Checklist

Before executing any file operations (move, rename, delete), validate the following:

### 1. Agent Dependency Verification
- [ ] Check which agents reference the target file
- [ ] Verify no active agent operations depend on the file
- [ ] Confirm file is not currently being used by any session

### 2. Agent Reference Validation
- [ ] Search `*.yaml` files in `.pi/multi-team/agents/*/` for file references
- [ ] Search `*.ts` files in `.pi/extensions/` for file imports
- [ ] Check `*.mjs` files in `.pi/multi-team/agents/database/` for references
- [ ] Verify schema files in `apps/infinite-ui/src/schemas/` don't reference the file

### 3. File Status Check
- [ ] Confirm file is not in active read/write operations
- [ ] Verify no file watchers are monitoring the target
- [ ] Check that no compilation processes are using the file

### 4. Rollback Capability
- [ ] Ensure file exists in version control (Git, etc.)
- [ ] Confirm backup is available if file is critical
- [ ] Document current file content and dependencies

### 5. Agent State Management
- [ ] Check `.pi/state/` for any file state dependencies
- [ ] Verify active-agent.json doesn't reference the file
- [ ] Confirm no file-based state is being persisted

## Safe-to-Move File Types

### ✅ Can Move Safely (with validation)
- Commented-out or deprecated expertise files
- Unused prompt templates
- Backup files (*.bak, *.old, *.copy)
- Test files in `/tests/` directories
- Documentation files not actively referenced

### ⚠️ Move with Caution
- Extension files (`.ts` in `.pi/extensions/`)
- Agent configuration files (`.yaml` in agent directories)
- Skill definition files (`.md` in skills directories)
- Session state files (`.json` in state directories)

### ❌ NEVER Move Without Special Review
- `multi-team-config.yaml` or `multi-team-config-min.yaml`
- Active agent manifest files
- Schema files in `apps/infinite-ui/src/schemas/`
- Currently executing scripts or extensions
- Files in `.pi/state/` directory

## Post-Move Validation

After completing a file move operation:

1. **Agent Health Check**
   ```bash
   # Run setup team to verify system integrity
   just team setup
   
   # Verify all agents are active
   just team ui-gen --verify
   ```

2. **File Integrity**
   ```bash
   # Verify no missing imports/errors
   bun run lint
   
   # Check for runtime errors
   bun run build
   ```

3. **Agent Re-registration**
   ```bash
   # Re-register moved agents if necessary
   just team setup --reindex
   ```

4. **Schema Validation**
   ```bash
   # Validate schema references
   just team validation-C
   ```

## Error Handling Protocol

### If File Operation Fails

1. **Stop All Operations**
   ```bash
   # Cancel any running teams
   just team setup --cancel-all
   ```

2. **Audit State**
   ```bash
   # Check current agent status
   cat .pi/state/active-agents.json
   
   # Review session state
   ls .pi/multi-team/sessions/
   ```

3. **Revert Changes**
   ```bash
   # If using version control
   git checkout -- path/to/moved/file
   
   # If no version control, restore from backup
   cp /path/to/backup/file /path/to/original
   ```

4. **Investigate Root Cause**
   - Check agent logs for errors
   - Review file dependencies
   - Identify which agent was affected

## Automation Scripts

### Pre-Move Validation Script
```bash
#!/bin/bash
# Validate before moving file

FILE_TO_MOVE=$1
AGENT_DIR=$2

# Check agent references
grep -r "$FILE_TO_MOVE" .pi/multi-team/agents/agent-*/ &>/dev/null && echo "WARNING: Agents reference this file" || echo "No agent references found"

# Check extension references
grep -r "$FILE_TO_MOVE" .pi/extensions/ &>/dev/null && echo "WARNING: Extensions reference this file" || echo "No extension references found"

# Check active sessions
if [ -f ".pi/state/active-agents.json" ]; then
  echo "Active agents file exists - verify no operations in progress"
fi

# Ask for confirmation
read -p "Proceed with move? [y/N]" -n 1 -r
[[ $REPLY =~ ^[Yy]$ ]] || exit 1
```

### Post-Move Verification Script
```bash
#!/bin/bash
# Verify after moving file

# Run setup team
just team setup

# Run validation teams in parallel
just team validation-A &
just team validation-B &
just team validation-C &
wait

echo "Validation complete"
```

## File Naming Conventions

To avoid move-related issues, follow these naming conventions:

- **Use versioned filenames**: `filename-v1.0.yaml` → `filename-v2.0.yaml`
- **Use dated backups**: `filename-20240101.yaml`
- **Use clear prefixes**: `deprecated_`, `temp_`, `backup_`, `archived_`
- **Avoid special characters**: Only use alphanumeric, `-`, `_`, `.`

## Common Pitfalls to Avoid

1. **Moving while agent is running** - Always stop agents first
2. **Breaking import paths** - Update all references if file moves
3. **Ignoring extension typos** - Fix `ui-extention` → `ui-extension` before committing
4. **Moving schema files** - These break the entire system
5. **Not checking MD5 checksums** - Update or invalidate checksums after moves

## Emergency Procedures

### If System Breaks After File Move

1. **Stop all agents**
   ```bash
   bun run team setup --cancel-all
   ```

2. **Restore critical files**
   ```bash
   git checkout -- .pi/multi-team/
   git checkout -- .pi/extensions/
   ```

3. **Reinitialize system**
   ```bash
   just team setup --reset
   ```

4. **Restart agents**
   ```bash
   just team ui-gen
   just team validation
   ```

## Documentation Maintenance

After any file move or modification:

1. Update this guideline document
2. Record the change in `CHANGELOG.md`
3. Update `.env` if paths were changed
4. Regenerate MD5 checksums if required

## Related Documentation

- [Multi-Agent Orchestration System](README.md)
- [Extension Development Guide](EXTENSION_GUIDELINES.md)
- [Agent Configuration Guide](AGENT_CONFIG_GUIDELINES.md)
- [Schema Management Guide](SCHEMA_GUIDELINES.md)

---

**Last Updated**: 2025-01-01
**Maintained By**: CodepOS Team
**Version**: 1.0.0