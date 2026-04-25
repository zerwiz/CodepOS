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
just scanner librarian # List documentation files ONLY

# Agents (LLM-powered - for deep analysis)
just scanner indexer   # Deep index with AI analysis ← USE THIS for intelligent indexing
just team main       # Full pipeline with LLM agents
just team security  # Security pipeline

# Orchestrator
just orchestrate analyze   # Quick analysis
just orchestrate full      # Full pipeline
just orchestrate status  # Status + Council advice
```

## Scanner vs Agent Decision

| Command | LLM | Use Case |
|---------|-----|----------|
| `scanner librarian` | NO | Just list files |
| `scanner indexer` | YES | Deep AI analysis |
| `scanner scout` | NO | Structure overview |
| `team main` | YES | Full pipeline |

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
    execute: async (args) => ({ content: [{ type: "text", text: "result" }] })
  })
}
```

## Common Pitfalls
- **Tool results MUST use `content` array** - Never return `{ message: "..." }`. The pi-coding-agent requires `{ content: [{ type: "text", text: "..." }] }`. Using the wrong format causes `TypeError: Cannot read properties of undefined (reading 'filter')`.

## Testing
- Run `bun run <scanner/team/council>` directly for testing
- Check `.pi/multi-team/` structure first