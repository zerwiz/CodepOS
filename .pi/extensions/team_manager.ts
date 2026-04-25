import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { execSync } from "child_process";

export default function (pi: ExtensionAPI) {

    pi.registerTool({
        name: "run_scanner",
        description: "Runs a scanner script (no LLM, fast analysis)",
        parameters: {
            type: "object",
            properties: {
                name: { type: "string", description: "Scanner name: scout, sentinel, librarian, mapper" }
            },
            required: ["name"]
        },
        execute: async (args: any) => {
            const name = args?.name;
            if (!name) {
                return { content: [{ type: "text", text: "❌ name required. Usage: run_scanner name=<scanner>\nScanners: scout, sentinel, librarian, mapper" }] };
            }
            try {
                const output = execSync(`just scanner ${name}`, { encoding: "utf-8", cwd: pi.cwd });
                return { content: [{ type: "text", text: output }] };
            } catch (e: any) {
                return { content: [{ type: "text", text: `❌ Error: ${e.message}` }] };
            }
        }
    });

    pi.registerTool({
        name: "run_agent",
        description: "Run an LLM agent with a specific task. Use predefined agents or provide your own task.",
        parameters: {
            type: "object",
            properties: {
                name: { type: "string", description: "Agent name: scout-ai, auditor, planner, security, analysis, review" },
                task: { type: "string", description: "Task for the agent (or leave blank to use predefined prompt)" }
            },
            required: []
        },
        execute: async (args: any) => {
            const { name, task } = args;
            
            // Predefined agent prompts
            const predefinedAgents: Record<string, string> = {
                'scout-ai': 'Analyze the codebase structure, identify key directories and technologies used',
                'auditor': 'Review the codebase for security vulnerabilities and best practices',
                'planner': 'Create a task plan for improving this codebase',
                'security': 'You are the Security Team Leader. Analyze the codebase for security issues and suggest fixes',
                'analysis': 'Analyze the codebase and provide insights on architecture and patterns',
                'review': 'Review the code and suggest improvements'
            };
            
            const agentPrompt = task || predefinedAgents[name] || predefinedAgents['analysis'];
            const agentName = name || 'agent';
            
            if (!task && !predefinedAgents[name]) {
                return { content: [{ type: "text", text: `Available agents:\n${Object.keys(predefinedAgents).map(a => `  • ${a}`).join('\n')}\n\nUsage: run_agent name=<agent> [task=<task>]` }] };
            }
            
            try {
                const output = execSync(`pi -p "${agentPrompt}"`, { encoding: "utf-8", cwd: pi.cwd });
                return { content: [{ type: "text", text: output }] };
            } catch (e: any) {
                return { content: [{ type: "text", text: `❌ Error: ${e.message}` }] };
            }
        }
    });

    pi.registerTool({
        name: "run_team",
        description: "Runs a team workflow (scanner + agent combination)",
        parameters: {
            type: "object",
            properties: {
                name: { type: "string", description: "Team name: security" }
            },
            required: ["name"]
        },
        execute: async (args: any) => {
            const name = args?.name;
            if (!name) {
                return { content: [{ type: "text", text: "❌ name required. Usage: run_team name=<team>\nTeams: security" }] };
            }
            try {
                const output = execSync(`just team ${name}`, { encoding: "utf-8", cwd: pi.cwd });
                return { content: [{ type: "text", text: output }] };
            } catch (e: any) {
                return { content: [{ type: "text", text: `❌ Error: ${e.message}` }] };
            }
        }
    });

    pi.registerTool({
        name: "list_codepos_components",
        description: "Lists all available scanners, agents, teams, and memory",
        execute: async () => {
            const text = [
                "**Scanners (fast, no LLM):**",
                "  scout - File structure analysis",
                "  sentinel - Security pattern scanning",
                "  librarian - Documentation indexing",
                "  mapper - Architecture visualization",
                "",
                "**Agents (LLM-powered via pi.dev):**",
                "  scout-ai - Analyze codebase with AI",
                "  auditor - Security review with AI",
                "  planner - Task planning with AI",
                "  security - Security analysis leader",
                "  analysis - Code analysis leader",
                "  review - Code review leader",
                "",
                "**Teams (scanner + LLM leader):**",
                "  security - sentinel scanner + security leader",
                "",
                "**Memory:**",
                "  security - View/track what worked",
                "",
                "Usage:",
                "  run_scanner name=scout",
                "  run_agent name=scout-ai",
                "  run_agent name=security (uses predefined prompt)",
                "  run_team name=security",
                "  run_agent name=scout-ai task='custom task'"
            ].join("\n");
            return { content: [{ type: "text", text }] };
        }
    });
}