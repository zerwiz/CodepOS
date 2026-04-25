/**
 * CodepOS Interactive UI Extension
 *
 * Integrates CodepOS tools + enhanced agent status widget into the pi session.
 */

import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";
import { execSync } from "child_process";
import { existsSync, readFileSync, mkdirSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const ACTIVE_AGENTS_FILE = ".pi/state/active-agents.json";
const ROOT = process.cwd();

const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
let frameIndex = 0;

interface ActiveAgent {
  id: string;
  name: string;
  type: string;
  startTime: number;
  status: string;
}

interface Manifest {
  agent?: { name: string; description: string; status?: string };
  team?: { name: string; description?: string };
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

function loadManifests(dir: string): { name: string; description: string; status: string }[] {
  const results: { name: string; description: string; status: string }[] = [];
  const base = join(ROOT, dir);
  if (!existsSync(base)) return results;
  
  try {
    const entries = readdirSync(base);
    for (const entry of entries) {
      const manifestPath = join(base, entry, "manifest.yaml");
      if (existsSync(manifestPath)) {
        try {
          const content = readFileSync(manifestPath, "utf-8");
          const match = content.match(/name:\s*(\S+)/);
          const descMatch = content.match(/description:\s*(.+)/);
          const statusMatch = content.match(/status:\s*(\S+)/);
          if (match) {
            results.push({
              name: match[1],
              description: descMatch ? descMatch[1].trim() : entry,
              status: statusMatch ? statusMatch[1] : "idle",
            });
          }
        } catch {}
      }
    }
  } catch {}
  return results;
}

function getScanners() {
  return loadManifests(".pi/multi-team/scanners");
}

function getAgents() {
  return loadManifests(".pi/multi-team/agents");
}

function getTeams() {
  const results: { name: string; description: string; status: string }[] = [];
  const base = join(ROOT, ".pi/multi-team/teams");
  if (!existsSync(base)) return results;
  
  try {
    const entries = readdirSync(base);
    for (const entry of entries) {
      if (entry.endsWith(".yaml") || entry.endsWith(".yml")) {
        const name = entry.replace(/\.(yaml|yml)$/, "");
        results.push({ name, description: name, status: "idle" });
      }
    }
  } catch {}
  return results;
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

function renderWidget(ctx: ExtensionContext, theme: any, width: number): string[] {
  const agents = getActiveAgents();
  const active = agents.filter((a) => a.status === "running");

  const lines: string[] = [];
  if (active.length === 0) {
    lines.push(theme.fg("dim", "○ CodepOS"));
    return lines;
  }

  const spinnerChar = SPINNER[frameIndex % SPINNER.length];

  lines.push(theme.fg("accent", "●") + " " + theme.fg("accent", "CodepOS"));

  for (let i = 0; i < active.length; i++) {
    const a = active[i];
    const isLast = i === active.length - 1;
    const connector = isLast ? " └─" : " ├─";

    const duration = Math.round((Date.now() - a.startTime) / 1000);
    
    lines.push(
      theme.fg("dim", connector) +
        " " +
        theme.fg("accent", spinnerChar) +
        " " +
        theme.bold(a.name) +
        " " +
        theme.fg("dim", "·") +
        " " +
        theme.fg("muted", `${a.type} (${duration}s)`)
    );
  }

  return lines;
}

export default function (pi: ExtensionAPI): void {
  let widgetInterval: ReturnType<typeof setInterval> | null = null;

  pi.on("session_start", async (_event, ctx) => {
    if (!ctx.hasUI) return;

    ctx.ui.setWidget(
      "codepos-agents",
      (_tui, theme) => {
        frameIndex++;
        return {
          render: (width: number) => renderWidget(ctx, theme, width),
          invalidate: () => {},
        };
      },
      { placement: "aboveEditor" },
    );

    ctx.ui.setWidget(
      "codepos-footer",
      (_tui, theme) => {
        return {
          render: (width: number) => [
            theme.fg("accent", "CodepOS") + " " + theme.fg("dim", "·") + " " + theme.fg("muted", ctx.ui.theme.name)
          ],
          invalidate: () => {},
        };
      },
      { placement: "footer" },
    );

    ctx.ui.notify("CodepOS Interactive UI Active", "info");
  });

  pi.on("session_replace", async () => {
    if (widgetInterval) clearInterval(widgetInterval);
    widgetInterval = null;
  });

  pi.registerShortcut("ctrl+x", {
    description: "Next theme",
    handler: async (ctx) => {
      if (!ctx.hasUI) return;
      const themes = ctx.ui.getAllThemes();
      const current = ctx.ui.theme.name;
      const idx = themes.findIndex((t) => t.name === current);
      const next = themes[(idx + 1) % themes.length];
      ctx.ui.setTheme(next.name);
      ctx.ui.notify(`Theme: ${next.name}`, "info");
    },
  });

  pi.registerTool({
    name: "run_scanner",
    description: "Runs a scanner script (no LLM, fast analysis)",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Scanner name" },
      },
      required: ["name"],
    },
    execute: async (args) => {
      const name = args.name;
      if (!name) {
        const scanners = getScanners();
        return { content: [{ type: "text", text: "Usage: run_scanner name=<scanner>\nScanners: " + scanners.map(s => s.name).join(", ") }] };
      }

      const agentId = addActiveAgent(name, "scanner");
      try {
        const output = execSync(`just scanner ${name}`, { encoding: "utf-8" });
        updateAgentStatus(agentId, "done");
        return { content: [{ type: "text", text: output }] };
      } catch (error: any) {
        updateAgentStatus(agentId, "error");
        return { content: [{ type: "text", text: `Error: ${error.message}` }] };
      }
    },
  });

  pi.registerTool({
    name: "run_agent",
    description: "Run an LLM agent",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Agent name" },
        task: { type: "string", description: "Optional custom task" },
      },
      required: ["name"],
    },
    execute: async (args) => {
      const name = args.name;
      if (!name) {
        const agents = getAgents();
        return { content: [{ type: "text", text: "Usage: run_agent name=<agent>\nAgents: " + agents.map(a => a.name).join(", ") }] };
      }

      const agentId = addActiveAgent(name, "agent");
      const prompt = AGENT_PROMPTS[name as keyof typeof AGENT_PROMPTS] || AGENT_PROMPTS["default"];

      try {
        const output = execSync(`pi -p "${prompt}"`, { encoding: "utf-8" });
        updateAgentStatus(agentId, "done");
        return { content: [{ type: "text", text: output }] };
      } catch (error: any) {
        updateAgentStatus(agentId, "error");
        return { content: [{ type: "text", text: `Error: ${error.message}` }] };
      }
    },
  });

  pi.registerTool({
    name: "run_team",
    description: "Run a team workflow",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Team name" },
      },
      required: ["name"],
    },
    execute: async (args) => {
      const name = args.name;
      if (!name) {
        const teams = getTeams();
        return { content: [{ type: "text", text: "Usage: run_team name=<team>\nTeams: " + teams.map(t => t.name).join(", ") }] };
      }

      const agentId = addActiveAgent(name, "team");
      try {
        const output = execSync(`just team ${name}`, { encoding: "utf-8" });
        updateAgentStatus(agentId, "done");
        return { content: [{ type: "text", text: output }] };
      } catch (error: any) {
        updateAgentStatus(agentId, "error");
        return { content: [{ type: "text", text: `Error: ${error.message}` }] };
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
        return { content: [{ type: "text", text: "No active agents" }] };
      }
      const lines = active.map((a) => {
        const duration = Math.round((Date.now() - a.startTime) / 1000);
        const icon = a.status === "running" ? "running" : a.status === "done" ? "done" : "error";
        return `${icon} ${a.type}: ${a.name} (${duration}s)`;
      });
      return { content: [{ type: "text", text: lines.join("\n") }] };
    },
  });

  pi.registerTool({
    name: "list_codepos",
    description: "Lists all CodepOS components",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
    execute: async () => {
      const scanners = getScanners();
      const agents = getAgents();
      const teams = getTeams();
      const active = getActiveAgents();
      const activeMap = new Map(active.map(a => [a.name, a.status]));

      let out = "CodepOS Components\n";
      out += "══════════════════\n\n";
      
      out += "Scanners:\n";
      for (const s of scanners) {
        const status = activeMap.get(s.name) || s.status;
        out += `  ○ ${s.name}: ${s.description} [${status}]\n`;
      }

      out += "\nAgents:\n";
      for (const a of agents) {
        out += `  ○ ${a.name}: ${a.description}\n`;
      }

      out += "\nTeams:\n";
      for (const t of teams) {
        out += `  ○ ${t.name}: ${t.description}\n`;
      }

      return { content: [{ type: "text", text: out }] };
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
      return { content: [{ type: "text", text: "Active agents cleared" }] };
    },
  });

  pi.registerTool({
    name: "codepos_status",
    description: "Show CodepOS status tree view",
    parameters: {
      type: "object",
      properties: {
        view: { type: "string", enum: ["status", "tree", "activity"], default: "status" },
      },
    },
    execute: async (args) => {
      const view = args?.view || "status";
      const scanners = getScanners();
      const agents = getAgents();
      const teams = getTeams();
      const active = getActiveAgents();
      const activeMap = new Map(active.map(a => [a.name, a.status]));

      const statusOf = (name: string) => activeMap.get(name) || "idle";

      if (view === "tree") {
        let tree = " ○ CodepOS\n";
        tree += " ├─ Scanners\n";
        for (let i = 0; i < scanners.length; i++) {
          const s = scanners[i];
          const status = statusOf(s.name);
          const icon = status === "running" ? "●" : status === "done" ? "✓" : status === "error" ? "✗" : "○";
          const prefix = i === scanners.length - 1 ? " │  └─ " : " │  ├─ ";
          const connector = i === scanners.length - 1 ? "   " : " │  ";
          tree += `${prefix}${icon} ${s.name} · ${s.description}\n`;
          if (i === scanners.length - 1 && agents.length > 0) {
            tree += ` ├─ Agents\n`;
            for (let j = 0; j < agents.length; j++) {
              const a = agents[j];
              const prefix2 = j === agents.length - 1 ? " └─ " : " ├─ ";
              tree += `${prefix2}○ ${a.name} · ${a.description}\n`;
            }
          }
        }
        return { content: [{ type: "text", text: tree }] };
      }

      let status = "CodepOS Status\n";
      status += "══════════════════\n\n";
      status += "Scanners:\n";
      for (const s of scanners) {
        status += `  ○ ${s.name}: ${s.description} [${statusOf(s.name)}]\n`;
      }
      status += "\nAgents:\n";
      for (const a of agents) {
        status += `  ○ ${a.name}: ${a.description}\n`;
      }
      status += "\nTeams:\n";
      for (const t of teams) {
        status += `  ○ ${t.name}: ${t.description}\n`;
      }
      status += "\n---\nUse codepos_status view=tree for tree view";

      return { content: [{ type: "text", text: status }] };
    },
  });
}