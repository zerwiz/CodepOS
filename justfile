# CodepOS Multi-Agent System
# Harness for www.pi.dev

# =========================
# TERMINAL UI (pi-subagents style)
# =========================

ui *args:
    @bun run .pi/multi-team/ui/terminal.mjs {{args}}

# =========================
# SCANNERS (no LLM - fast scripts)
# =========================

scanner name *args:
    @echo "🔍 Running scanner: {{name}}..."
    @if [ -f ".pi/multi-team/scanners/{{name}}/index.mjs" ]; then \
        bun run .pi/multi-team/scanners/{{name}}/index.mjs {{args}}; \
    else \
        echo "❌ Scanner '{{name}}' not found"; \
        echo "Available: scout, sentinel, librarian, mapper, indexer"; \
        exit 1; \
    fi

scout:
    bun run .pi/multi-team/scanners/scout/index.mjs

sentinel:
    bun run .pi/multi-team/scanners/sentinel/index.mjs

librarian:
    bun run .pi/multi-team/scanners/librarian/index.mjs

mapper:
    bun run .pi/multi-team/scanners/mapper/index.mjs

indexer:
    bun run .pi/multi-team/scanners/indexer/index.mjs

# =========================
# AGENTS (LLM-powered via pi.dev)
# =========================

codepos-agent name *args:
    @echo "🤖 Running agent: {{name}}..."
    @if [ -f ".pi/multi-team/council/{{name}}/index.mjs" ]; then \
        bun run .pi/multi-team/council/{{name}}/index.mjs {{args}}; \
    else \
        echo "Available agents: planning, dokumenter"; \
        exit 1; \
    fi

plan-task:
    bun run .pi/multi-team/council/planning/index.mjs

generate-doc:
    bun run .pi/multi-team/council/dokumenter/index.mjs README

council:
    @echo "🏛️ Council Leader"
    @echo "Available commands: just council help"
    bun run .pi/multi-team/council/council.mjs

council-coordinator:
    @echo "🏛️ Council Coordinator Mode"
    bun run .pi/multi-team/council/council.mjs coordinator

council-analyze:
    @echo "🏛️ Council Analyze Mode"
    bun run .pi/multi-team/council/council.mjs analyze scout

council-security:
    @echo "🏛️ Council Security Mode"
    bun run .pi/multi-team/council/council.mjs security

council-list:
    @echo "🏛️ Council Agent List"
    bun run .pi/multi-team/council/council.mjs list

council-clear:
    @echo "🏛️ Council Clear"
    bun run .pi/multi-team/council/council.mjs clear

# =========================
# TEAMS (Scanner + LLM Agents)
# =========================

team name *args:
    @echo "🚀 Deploying team: {{name}}..."
    @if [ -f ".pi/multi-team/teams/{{name}}/index.mjs" ]; then \
        bun run .pi/multi-team/teams/{{name}}/index.mjs {{args}}; \
    else \
        echo "❌ Team '{{name}}' not found"; \
        echo "Available: main, security"; \
        exit 1; \
    fi

main mode:
    @echo "🔄 Main Team - Multi-Agent Pipeline"
    bun run .pi/multi-team/teams/main/index.mjs {{mode}}

security:
    @echo "🛡️ Security Team"
    bun run .pi/multi-team/teams/security/index.mjs

# =========================
# MEMORY
# =========================

memory name:
    @echo "📝 Memory for: {{name}}"
    @if [ -f ".pi/state/{{name}}-memory.json" ]; then \
        cat .pi/state/{{name}}-memory.json | tail -10; \
    else \
        echo "(no memory yet)"; \
    fi

memory-clear name:
    @rm -f .pi/state/{{name}}-memory.json .pi/state/{{name}}-learnings.json
    @echo "✅ Memory cleared"

# =========================
# ORCHESTRATOR (talks to Council)
# =========================

orchestrate *args:
    @if [ -z "{{args}}" ]; then \
        bun run .pi/multi-team/orchestrator/index.mjs help; \
    else \
        bun run .pi/multi-team/orchestrator/index.mjs {{args}}; \
    fi

council-overview:
    @echo "🏛️  === CodepOS System ==="
    @echo "Scanners: scout, sentinel, librarian, mapper"
    @echo "Council: coordinator, analyze, security (LLM-powered)"
    @echo "Teams: security"

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
    @echo "  just scanner sentinel"
    @echo "  just council-security"

init: setup
    @echo "✅ CodepOS init complete!"

clean:
    rm -rf .codepos/database/database.db
    @echo "🧹 Cleaned temporary files"