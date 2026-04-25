# CodepOS Multi-Agent System

# =========================
# GENERIC TEAM RUNNER
# =========================

team name *args:
    @echo "🚀 Deploying team: {{name}}..."
    @if [ -f ".pi/multi-team/agents/{{name}}" ]; then \
        bun run .pi/multi-team/agents/{{name}} {{args}}; \
    elif [ -d ".pi/multi-team/agents/{{name}}" ]; then \
        if [ -f ".pi/multi-team/agents/{{name}}/index.mjs" ]; then \
            bun run .pi/multi-team/agents/{{name}}/index.mjs {{args}}; \
        else \
            echo "⚠️ No index.mjs found for team {{name}}, running generic setup..."; \
            just {{name}} {{args}} || echo "No recipe found for {{name}}"; \
        fi \
    else \
        echo "❌ Team {{name}} not found in .pi/multi-team/agents/"; \
        exit 1; \
    fi

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
