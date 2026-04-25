#!/bin/bash

# pi alias - boots the harness
if [ -x .pi/boot ]; then
  # Run boot
  bash .pi/boot
else
  # Check if justfile exists and use that
  if [ -f justfile ]; then
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║     CODEPOS MULTI-AGENT SYSTEM ACTIVE                       ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    echo "🚀 Orchestrator active"
    
    # Load all agents
    for agent in design testing api-backend ui-components integration database frontend planning setup security-scan security-validate-all orchestrate council-overview; do
      echo ""
      echo "## Agent: $agent ##"
      bun run .pi/multi-team/agents/$agent/index.mjs
    done
    
  fi
fi
