# CodepOS Multi-Agent System

# =========================
# SCANNERS (no LLM)
# =========================

scanner name:
    @echo "🔍 Running scanner: {{name}}..."
    @if [ -f ".pi/multi-team/tools/{{name}}.mjs" ]; then \
        bun run .pi/multi-team/tools/{{name}}.mjs; \
    else \
        echo "❌ Scanner '{{name}}' not found"; \
        exit 1; \
    fi

scout:
    bun run .pi/multi-team/tools/scout.mjs

sentinel:
    bun run .pi/multi-team/tools/sentinel.mjs

# =========================
# TEAMS (scanners + agents)
# =========================

team name *args:
    @echo "🚀 Deploying team: {{name}}..."
    @if [ -f ".pi/multi-team/teams/{{name}}/index.mjs" ]; then \
        bun run .pi/multi-team/teams/{{name}}/index.mjs {{args}}; \
    elif [ -f ".pi/multi-team/agents/{{name}}/index.mjs" ]; then \
        bun run .pi/multi-team/agents/{{name}}/index.mjs {{args}}; \
    else \
        echo "❌ Team '{{name}}' not found"; \
        echo "Available teams:"; ls .pi/multi-team/teams/; \
        exit 1; \
    fi

security:
    bun run .pi/multi-team/teams/security/index.mjs

# =========================
# ORCHESTRATION
# =========================

# Main orchestration command
orchestrate: council-overview design testing api-backend ui-components integration database frontend planning setup security-scan

# =========================
# COUNCIL OVERVIEW
# =========================

council-overview:
    @echo "🏛️  === Council System Overview ==="
    @echo "Multi-Agent Council Architecture:"
    @echo "  - Agents: aegis (security), council (coordination)"
    @echo "  - Services: planning, testing, frontend, backend"
    @echo "  - Status: $(git status 2>/dev/null || echo 'Initialized')"
    @echo ""

# =========================
# DESIGN
# =========================

test: testing
    @echo "✅ Aliased to testing"

design:
    @echo "🎨 === Design System ==="
    @echo "  - Architecture: CodepOS Multi-Agent"
    @echo "  - Extensions: ~/.pi/extensions/"
    @echo "  - Skills: ~/.pi/skills/"
    @echo "  - Prompts: ~/.pi/prompts/"
    @echo "  - Models Registry: ~/.pi/models.json"
    @echo "  - Directory: ~/.pi/"

# =========================
# TESTING
# =========================

testing:
    @echo "🧪 === Testing Suite ==="
    @echo "  - Unit tests: apps/*/test/*"
    @echo "  - Integration: harness/*"
    @echo "  - E2E: frontend/test/*"
    @echo "  - Status: $(find . -name 'test*' -o -name '*test.js' 2>/dev/null | wc -l | xargs echo 'Found: ')"

# =========================
# API BACKEND
# =========================

api-backend:
    @echo "🔌 === API Backend ==="
    @echo "  - Services: services/*"
    @echo "  - Location: apps/*"
    @echo "  - Config: .env"

ui-components:
    @echo "🖥️  === UI Components ==="
    @echo "  - Location: frontend/components/"
    @echo "  - Status: Ready for deployment"

integration:
    @echo "🔗 === Integration ==="
    @echo "  - Inter-agent: Council → Services"
    @echo "  - External: API, Database"

database:
    @echo "🗄️  === Database ==="
    @echo "  - Type: SQLite/PostgreSQL (configurable)"
    @echo "  - Location: .codepos/database/"
    @echo "  - Connection: From .env"

frontend:
    @echo "🌐 === Frontend ==="
    @echo "  - Location: frontend/"
    @echo "  - Components: React/Vue (configurable)"
    @echo "  - Status: Ready"

planning:
    @echo "📋 === Planning ==="
    @echo "  - Tools: .codepos/tools/"
    @echo "  - Status: Ready"

setup:
    @echo "🔧 === Setup ==="
    @echo "  - Init: yes"
    @echo "  - Extensions: ~/.pi/extensions/"
    @echo "  - Skills: ~/.pi/skills/"
    @echo "  - Prompts: ~/.pi/prompts/"
    @echo "  - Models registry: ~/.pi/models.json"
    @echo "  - Status: System ready"

security-scan:
    @echo "🛡️  === Security Scan ==="
    @echo "  - Location: rules/*"
    @echo "  - Aegis: .codepos/aegis/"
    @echo "  - Tests: harness/*"
    @echo "  - Status: Ready"

# =========================
# PI TERMINAL UI
# =========================

pi-status:
    bun run .pi/multi-team/ui/terminal.mjs

pi-watch:
    bun run .pi/multi-team/ui/terminal.mjs watch

# =========================
# ADDITIONAL RECIPECES
# =========================

init: setup
    @echo "✅ ${blue}'CodepOS' init complete!"

clean:
    rm -rf ~/.pi/extensions
    rm -rf ~/.pi/skills
    rm -rf ~/.pi/prompts
    rm -rf .codepos/database/database.db
    @echo "🧹 Cleaned temporary files"

watch:
    @echo "👁️  Watching for changes..."
    @echo "  - Extensions: ~/.pi/extensions/"
    @echo "  - Skills: ~/.pi/skills/"
    @echo "  - Prompts: ~/.pi/prompts/"
