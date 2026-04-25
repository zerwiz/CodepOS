import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { execSync } from "child_process";

export default function (pi: ExtensionAPI) {
    pi.registerTool({
        name: "list_codepos_teams",
        description: "Lists all available CodepOS agent teams",
        parameters: { type: "object", properties: {}, required: [] },
        execute: async () => {
            try {
                const teams = execSync("ls -1 .pi/multi-team/agents", { encoding: "utf-8", cwd: pi.cwd });
                return { content: [{ type: "text", text: `📦 Available Teams:\n\n${teams}\n\nUse pi deploy_codepos_team teamName=<team>` }] };
            } catch (e: any) {
                return { content: [{ type: "text", text: "Error: " + e.message }] };
            }
        }
    });

    pi.registerTool({
        name: "deploy_codepos_team",
        description: "Deploys a CodepOS agent team",
        parameters: {
            type: "object",
            properties: {
                teamName: { type: "string", description: "Team name" },
                args: { type: "string", description: "Additional args", default: "" }
            },
            required: ["teamName"],
        },
        execute: async (args: any) => {
            const teamName = args?.teamName || args?.name;
            if (!teamName) {
                return { content: [{ type: "text", text: "❌ teamName required. Usage: pi deploy_codepos_team teamName=<team>" }] };
            }
            try {
                const cmd = `just team ${teamName}${args?.args ? " " + args.args : ""}`;
                const output = execSync(cmd, { encoding: "utf-8", cwd: pi.cwd });
                return { content: [{ type: "text", text: `✅ Team ${teamName} deployed!\n\n${output}` }] };
            } catch (e: any) {
                return { content: [{ type: "text", text: `❌ Error: ${e.message}` }] };
            }
        }
    });

    pi.registerTool({
        name: "run_scout",
        description: "Runs the scout agent to analyze codebase",
        parameters: { type: "object", properties: {}, required: [] },
        execute: async () => {
            try {
                const output = execSync("just agent scout report", { encoding: "utf-8", cwd: pi.cwd });
                return { content: [{ type: "text", text: `🔍 Scout Report:\n\n${output}` }] };
            } catch (e: any) {
                return { content: [{ type: "text", text: `❌ Error: ${e.message}` }] };
            }
        }
    });

    pi.registerTool({
        name: "run_sentinel",
        description: "Runs the sentinel security scanner",
        parameters: { type: "object", properties: {}, required: [] },
        execute: async () => {
            try {
                const output = execSync("just agent sentinel", { encoding: "utf-8", cwd: pi.cwd });
                return { content: [{ type: "text", text: `🛡️ Sentinel Report:\n\n${output}` }] };
            } catch (e: any) {
                return { content: [{ type: "text", text: `❌ Error: ${e.message}` }] };
            }
        }
    });

    pi.registerTool({
        name: "run_mapper",
        description: "Runs the mapper agent for project architecture",
        parameters: { type: "object", properties: {}, required: [] },
        execute: async () => {
            try {
                const output = execSync("just agent mapper", { encoding: "utf-8", cwd: pi.cwd });
                return { content: [{ type: "text", text: `🗺️ Project Structure:\n\n${output}` }] };
            } catch (e: any) {
                return { content: [{ type: "text", text: `❌ Error: ${e.message}` }] };
            }
        }
    });

    pi.registerTool({
        name: "run_librarian",
        description: "Runs the librarian to index documentation",
        parameters: { type: "object", properties: {}, required: [] },
        execute: async () => {
            try {
                const output = execSync("just agent librarian", { encoding: "utf-8", cwd: pi.cwd });
                return { content: [{ type: "text", text: `📚 Documentation Index:\n\n${output}` }] };
            } catch (e: any) {
                return { content: [{ type: "text", text: `❌ Error: ${e.message}` }] };
            }
        }
    });
}