/**
 * CodepOS Interactive UI Extension
 *
 * Integrates CodepOS tools into the pi session.
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { execSync } from "child_process";
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "fs";

const ACTIVE_AGENTS_FILE = ".pi/state/active-agents.json";

interface ActiveAgent {
  id: string;
  name: string;
  type: string;
  startTime: number;
  status: string;
}

function getActiveAgents(): ActiveAgent[] {
  try {
    if (existsSync(ACTIVE_AGENTS_FILE)) {
      return JSON.parse(readFileSync(ACTIVE_AGENTS_FILE, "utf-8"));
    }
    return [];
  } catch {
    return [];
  }
}

function saveActiveAgents(agents: ActiveAgent[]): void {
  mkdirSync(".pi/state", { recursive: true });
  writeFileSync(ACTIVE_AGENTS_FILE, JSON.stringify(agents));
}

function addActiveAgent(name: string, type: string): string {
  const id = `${type}-${Date.now()}`;
  const agents = getActiveAgents();
  agents.push({ id, name, type, startTime: Date.now(), status: "running" });
  saveActiveAgents(agents);
  return id;
}

function updateAgentStatus(id: string, status: string): void {
  const agents = getActiveAgents().map((a) =>
    a.id === id ? { ...a, status } : a,
  );
  saveActiveAgents(agents);
}

const AGENT_PROMPTS: Record<string, string> = {
  "scout-ai": "Analyze the codebase structure, identify key directories and technologies used",
  auditor: "Review the codebase for security vulnerabilities and suggest fixes",
  planner: "Create a task plan for improving this codebase",
  security: "Analyze the codebase for security issues and provide actionable fixes",
  analysis: "Analyze the codebase and provide insights on architecture and patterns",
  review: "Review the code and suggest improvements",
  default: "Provide comprehensive analysis and improvements",
};

export default function (pi: ExtensionAPI): void {
  pi.registerTool({
    name: "run_scanner",
    description: "Runs a scanner script (no LLM, fast analysis). Usage: run_scanner name=<scanner>",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Scanner: scout, sentinel, librarian, mapper",
        },
      },
      required: ["name"],
    },
    execute: async (args) => {
      const name = args.name;
      if (!name) {
        return { message: "Usage: run_scanner name=<scanner>\nScanners: scout, sentinel, librarian, mapper" };
      }

      const agentId = addActiveAgent(name, "scanner");
      const cwd = process.cwd();

      try {
        const output = execSync(`just scanner ${name}`, { encoding: "utf-8", cwd });
        updateAgentStatus(agentId, "done");
        return { message: output };
      } catch (error: any) {
        updateAgentStatus(agentId, "error");
        return { message: `Error running scanner ${name}: ${error.message}` };
      }
    },
  });

  pi.registerTool({
    name: "run_agent",
    description: "Run an LLM agent. Usage: run_agent name=<agent> [task=<task>]",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Agent: scout-ai, auditor, planner, security, analysis, review",
        },
        task: { type: "string", description: "Optional custom task" },
      },
      required: ["name"],
    },
    execute: async (args) => {
      const name = args.name;
      if (!name) {
        return { message: "Usage: run_agent name=<agent> [task=<task>]" };
      }

      const agentId = addActiveAgent(name, "agent");
      const prompt = AGENT_PROMPTS[name as keyof typeof AGENT_PROMPTS] || AGENT_PROMPTS["default"];
      const cwd = process.cwd();

      try {
        const output = execSync(`pi -p "${prompt}"`, { encoding: "utf-8", cwd });
        updateAgentStatus(agentId, "done");
        return { message: output };
      } catch (error: any) {
        updateAgentStatus(agentId, "error");
        return { message: `Error running agent ${name}: ${error.message}` };
      }
    },
  });

  pi.registerTool({
    name: "run_team",
    description: "Run a team workflow (scanner + LLM leader). Usage: run_team name=<team>",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Team: security" },
      },
      required: ["name"],
    },
    execute: async (args) => {
      const name = args.name;
      if (!name) {
        return { message: "Usage: run_team name=<team>\nTeams: security" };
      }

      const agentId = addActiveAgent(name, "team");
      const cwd = process.cwd();

      try {
        const prompt = AGENT_PROMPTS["security"] || "Default team prompt";
        const output = execSync(`pi -p "${prompt}"`, { encoding: "utf-8", cwd });
        updateAgentStatus(agentId, "done");
        return { message: output };
      } catch (error: any) {
        updateAgentStatus(agentId, "error");
        return { message: `Error running team ${name}: ${error.message}` };
      }
    },
  });

  pi.registerTool({
    name: "list_active_agents",
    description: "Lists currently running agents",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
    execute: async () => {
      const active = getActiveAgents();
      if (active.length === 0) {
        return { message: "No active agents" };
      }
      const lines = active.map((a) => {
        const duration = Math.round((Date.now() - a.startTime) / 1000);
        const icon = a.status === "running" ? "running" : a.status === "done" ? "done" : "error";
        return `${icon} ${a.type}: ${a.name} (${duration}s)`;
      });
      return { message: lines.join("\n") };
    },
  });

  pi.registerTool({
    name: "list_codepos",
    description: "Lists all CodepOS components (scanners, agents, teams)",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
    execute: async () => {
      const active = getActiveAgents();
      const activeList = active.length > 0
        ? active.map((a) => `  ${a.type}: ${a.name} [${a.status}]`).join("\n")
        : "  (none)";

      return {
        message: [
          `Active Agents:`,
          activeList,
          ``,
          `Scanners (no LLM):`,
          `  scout - File structure analysis`,
          `  sentinel - Security pattern scanning`,
          `  librarian - Documentation indexing`,
          `  mapper - Architecture visualization`,
          ``,
          `Agents (LLM via pi.dev):`,
          `  scout-ai - Analyze codebase with AI`,
          `  auditor - Security review with AI`,
          `  planner - Task planning with AI`,
          `  security - Security analysis leader`,
          `  analysis - Code analysis leader`,
          `  review - Code review leader`,
          ``,
          `Teams (scanner + LLM):`,
          `  security - Scanner + LLM analysis`,
        ].join("\n"),
      };
    },
  });

  pi.registerTool({
    name: "clear_agents",
    description: "Clears all active agent tracking",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
    execute: async () => {
      saveActiveAgents([]);
      return { message: "Active agents cleared" };
    },
  });
}