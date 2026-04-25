# AGENTS.md - CodepOS Agent Instructions

## Critical Rules
- **NEVER delete files** - user explicitly forbids deletion
- Use `just` command runner for all operations
- Extensions go in `.pi/extensions/`

## Quick Commands
```bash
# Scanners (no LLM, fast)
just scanner scout       # Structure check
just scanner sentinel  # Security scan
just scanner mapper   # Architecture view
just scanner librarian # Docs index

# Teams (scanner + LLM)
just team main       # Full pipeline
just team security  # Security pipeline

# Orchestrator
just orchestrate analyze   # Quick analysis
just orchestrate full      # Full pipeline
just orchestrate status  # Status + Council advice

# Extensions
# - .pi/extensions/*.ts load automatically
# - Use pi extension API: pi.registerTool({...}), pi.notify(msg, type)
```

## Architecture
- Scanners: `.pi/multi-team/scanners/<name>/index.mjs`
- Council: `.pi/multi-team/council/<name>/index.mjs`
- Teams: `.pi/multi-team/teams/<name>/index.mjs`
- State: `.pi/state/` (never delete)

## Extension API (pi.dev)
```typescript
export default function(pi: ExtensionAPI): void {
  pi.registerTool({
    name: "tool_name",
    description: "...",
    parameters: { type: "object", properties: {...} },
    execute: async (args) => ({ message: "result" })
  })
}
```

## Testing
- Run `bun run <scanner/team/council>` directly for testing
- Check `.pi/multi-team/` structure first