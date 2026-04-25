#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     💙 CODEPOS MULTI-AGENT SYSTEM BOOTING                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "🔧 Loading extensions.

"

# Load all multi-agent extensions
for agent in design testing api-backend ui-components integration database frontend planning setup security-scan council-overview security-validate-all security-scan; do
  if [ -f .pi/multi-team/agents/$agent/index.mjs ]; then
    echo "  ✅ $agent extension loaded"
  fi
done

echo ""
echo "🚀 Orchestrator initializing.

"

echo "📊 System Status:"
echo "  • Extensions loaded: $(ls .pi/multi-team/agents | wc -l)"
echo "  • Council members: 4"
echo "  • Security agents: 2"
echo "  • Triggers monitored: 6"
echo ""

echo "⚙️  Orchestration active"
echo ""
