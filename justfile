# CodepOS Multi-Agent System
# Harness for www.pi.dev

# =========================
# SCANNERS (no LLM - fast scripts)
# =========================

scanner name *args:
    @echo "🔍 Running scanner: {{name}}..."
    @if [ -f ".pi/multi-team/agents/{{name}}/index.mjs" ]; then \
        bun run .pi/multi-team/agents/{{name}}/index.mjs {{args}}; \
    else \
        echo "❌ Scanner '{{name}}' not found"; \
        echo "Available: scout, sentinel, librarian, mapper"; \
        exit 1; \
    fi

scout:
    bun run .pi/multi-team/agents/scout/index.mjs

sentinel:
    bun run .pi/multi-team/agents/sentinel/index.mjs

librarian:
    bun run .pi/multi-team/agents/librarian/index.mjs

mapper:
    bun run .pi/multi-team/agents/mapper/index.mjs

# =========================
# TEAM LEADERS (LLM-powered via pi.dev)
# =========================

leader name *task:
    @echo "🤖 Running LLM Team Leader: {{name}}..."
    @if [ -z "{{task}}" ]; then \
        echo "Usage: just leader <name> <task>"; \
        exit 1; \
    fi
    @pi -p "{{task}}"

leader:security:
    pi -p "You are the Security Team Leader. Analyze security scan results and provide remediation guidance."

leader:analysis:
    pi -p "You are the Analysis Team Leader. Review codebase analysis and provide insights."

leader:review:
    pi -p "You are the Code Review Team Leader. Analyze code patterns and suggest improvements."

# =========================
# TEAMS (Scanner + LLM Leader)
# =========================

team name *args:
    @echo "🚀 Deploying team: {{name}}..."
    @if [ -f ".pi/multi-team/teams/{{name}}/index.mjs" ]; then \
        bun run .pi/multi-team/teams/{{name}}/index.mjs {{args}}; \
    else \
        echo "❌ Team '{{name}}' not found"; \
        ls .pi/multi-team/teams/ 2>/dev/null || echo "No teams"; \
        exit 1; \
    fi

security:
    @echo "🛡️ Security Team (Scanner + LLM Leader)"
    @echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    bun run .pi/multi-team/teams/security/index.mjs

# =========================
# MEMORY (learning from past runs)
# =========================

# View memory for a team/leader
memory name:
    @echo "📝 Memory for: {{name}}"
    @echo "━━━━━━━━━━━━━━━━━━━━━"
    @if [ -f ".pi/state/{{name}}-memory.json" ]; then \
        echo "Recent sessions:"; \
        cat .pi/state/{{name}}-memory.json | tail -10; \
    else \
        echo "(no memory yet)"; \
    fi
    @echo ""
    @if [ -f ".pi/state/{{name}}-learnings.json" ]; then \
        echo "What worked:"; \
        cat .pi/state/{{name}}-learnings.json; \
    else \
        echo "(no learnings yet)"; \
    fi

# View learnings only
learnings name:
    @echo "📚 Learnings for: {{name}}"
    @if [ -f ".pi/state/{{name}}-learnings.json" ]; then \
        cat .pi/state/{{name}}-learnings.json; \
    else \
        echo "(no learnings yet)"; \
    fi

# Track that a fix worked
memory:worked team issue_type fix:
    @echo "💡 Recording successful fix..."
    @mkdir -p .pi/state
    @if [ -f ".pi/state/{{team}}-learnings.json" ]; then \
        cat .pi/state/{{team}}-learnings.json | python3 -c "import sys,json; d=json.load(sys.stdin); d.append({'issue_type':'{{issue_type}}','attempts':1,'successes':1,'last_fix':'{{fix}}','notes':''}); print(json.dumps(d))" > .pi/state/{{team}}-learnings.json.tmp && mv .pi/state/{{team}}-learnings.json.tmp .pi/state/{{team}}-learnings.json; \
    else \
        echo '[{"issue_type":"{{issue_type}}","attempts":1,"successes":1,"last_fix":"{{fix}}","notes":""}]' > .pi/state/{{team}}-learnings.json; \
    fi
    @echo "✅ Recorded: {{issue_type}} - {{fix}}"

# Clear memory
memory:clear name:
    @rm -f .pi/state/{{name}}-memory.json .pi/state/{{name}}-learnings.json
    @echo "✅ Memory cleared for {{name}}"

# =========================
# ORCHESTRATION
# =========================

orchestrate: council-overview design testing api-backend ui-components integration database frontend planning setup security-scan

council-overview:
    @echo "🏛️  === CodepOS System ==="
    @echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    @echo "Scanners: scout, sentinel, librarian, mapper"
    @echo "Leaders: security, analysis, review"
    @echo "Teams: security (scanner + leader)"
    @echo "Memory: just memory <name>"
    @echo ""

test: testing
    @echo "✅ Aliased to testing"

design:
    @echo "🎨 === Design System ==="

testing:
    @echo "🧪 === Testing Suite ==="

api-backend:
    @echo "🔌 === API Backend ==="

ui-components:
    @echo "🖥️  === UI Components ==="

integration:
    @echo "🔗 === Integration ==="

database:
    @echo "🗄️  === Database ==="

frontend:
    @echo "🌐 === Frontend ==="

planning:
    @echo "📋 === Planning ==="

setup:
    @echo "🔧 === Setup ==="

security-scan:
    @echo "🛡️  === Security ==="
    @echo "  - Team: just team security"
    @echo "  - Memory: just memory security"
    @echo "  - Track fix: just memory:worked security '<type>' '<fix>'"

pi-status:
    bun run .pi/multi-team/ui/terminal.mjs

pi-watch:
    bun run .pi/multi-team/ui/terminal.mjs watch

init: setup
    @echo "✅ CodepOS init complete!"

clean:
    rm -rf .codepos/database/database.db
    @echo "🧹 Cleaned temporary files"

watch:
    @echo "👁️  Watching for changes..."