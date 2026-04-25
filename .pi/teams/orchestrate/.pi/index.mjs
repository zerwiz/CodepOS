#!/usr/bin/env node
/**
 * Orchestrator Extension - Boot Multi-System
 * Loads sub-agents and council members
 */
import { spawn, agents, council } from "../../multi-team/agents";

// Create a simple extension that spawns sub-agents and council
export async function* load() {
  // Spawn all multi-agents
  try {
    const multiAgents = await spawn();
    const councilMembers = await council();
    
    // Yield sub-agents and council
    yield {
      name: "multi-agent-system",
      subAgents: multiAgents,
      council: councilMembers,
      status: "active",
      description: "Multi-agent orchestrator with council spawning"
    };
  } catch (error) {
    console.error("Error loading multi-agent system:", error);
    yield {
      name: "multi-agent-system",
      subAgents: [],
      council: [],
      status: "initializing",
      description: "Multi-agent system initializing"
    };
  }
}
