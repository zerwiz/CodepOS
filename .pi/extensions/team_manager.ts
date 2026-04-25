import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { execSync } from "child_process";

function safeNotify(ctx: any, message: string) {
    try {
        if (ctx?.ui?.notify) ctx.ui.notify(message);
    } catch {}
}

function safeInfo(ctx: any, message: string) {
    try {
        if (ctx?.ui?.info) ctx.ui.info(message);
    } catch {}
}

export default function (pi: ExtensionAPI) {
    pi.registerTool({
        name: "list_codepos_teams",
        description: "Lists all available CodepOS agent teams in the .pi/multi-team/agents directory.",
        parameters: {
            type: "object",
            properties: {
                filter: {
                    type: "string",
                    description: "Optional filter string to match team names (case-insensitive)",
                    default: ""
                }
            },
            required: [],
        },
        execute: async (args, ctx) => {
            try {
                let teams = execSync(`ls -1 .pi/multi-team/agents`, { encoding: "utf-8", cwd: pi.cwd });
                teams = teams.trim();

                if (!teams) {
                    return { content: [{ type: "text", text: "No teams found in .pi/multi-team/agents" }] };
                }

                if (args.filter && args.filter.length > 0) {
                    const filterLower = args.filter.toLowerCase();
                    teams = teams.split('\n')
                        .filter(team => team.toLowerCase().includes(filterLower))
                        .join('\n');
                }

                const teamList = teams || "No teams found";

                return { content: [{ type: "text", text: `📦 Available CodepOS Teams:\n\n${teamList}\n\n\nTip: Use \`pi deploy_codepos_team\` to deploy a specific team!` }] };
            } catch (error: any) {
                return { content: [{ type: "text", text: `Error listing teams: ${error.message}` }] };
            }
        }
    });

    pi.registerTool({
        name: "deploy_codepos_team",
        description: "Deploys a specialized CodepOS agent team.",
        parameters: {
            type: "object",
            properties: {
                teamName: {
                    type: "string",
                    description: "Name of the team to deploy (e.g., setup, validation-A, ui-gen-A, validation-B, validation-C, planning, design, frontend, testing, database, api-backend, integration, orchestrator)",
                    enum: ["setup", "validation-A", "validation-B", "validation-C", "planning", "design", "frontend", "testing", "database", "api-backend", "integration", "orchestrator", "ui-gen-A"],
                },
                args: {
                    type: "string",
                    description: "Optional additional arguments to pass to the team (e.g., --init, --reset, --env VAR=value)",
                    default: ""
                }
            },
            required: ["teamName"],
        },
        execute: async (args, ctx) => {
            safeNotify(ctx, "Deploying CodepOS Team: " + args.teamName);

            try {
                const teamName = args.teamName;
                const additionalArgs = args.args || "";

                const command = `just team ${teamName}${additionalArgs.length > 0 ? " " + additionalArgs : ""}`;

                safeInfo(ctx, "Executing: " + command);

                const output = execSync(command, { encoding: "utf-8", cwd: pi.cwd });

                return { content: [{ type: "text", text: "✅ Team " + teamName + " deployed successfully!\n\n📋 Output:\n" + output + "\n\n🎯 Next steps: Check the results above. Use pi list_codepos_teams to see all available teams." }] };
            } catch (error: any) {
                return { content: [{ type: "text", text: "❌ Error deploying team " + args.teamName + ":\n" + error.message + "\n\n💡 Tip: Make sure you're in the CodepOS root directory before deploying a team." }] };
            }
        }
    });

    pi.registerTool({
        name: "manage_codepos_team",
        description: "Performs management operations on CodepOS teams (reset, init, clean, etc.).",
        parameters: {
            type: "object",
            properties: {
                teamName: {
                    type: "string",
                    description: "Name of the team to manage",
                    default: ""
                },
                operation: {
                    type: "string",
                    description: "Operation to perform: init, reset, clean, health, help",
                    enum: ["init", "reset", "clean", "health", "help", "status", "list"]
                },
                args: {
                    type: "string",
                    description: "Additional arguments (e.g., --reset for setup team)",
                    default: ""
                }
            },
            required: ["operation"],
        },
        execute: async (args, ctx) => {
            safeNotify(ctx, "Managing CodepOS Team: " + args.operation + " on " + (args.teamName || "all"));

            try {
                const operation = args.operation;
                const teamName = args.teamName || "";
                const additionalArgs = args.args || "";

                let command: string;

                switch (operation) {
                    case "init":
                        command = `just team setup --init`;
                        break;
                    case "reset":
                        command = `just team setup --reset`;
                        break;
                    case "clean":
                        command = `just clean`;
                        break;
                    case "health":
                        command = `bun run .pi/multi-team/ui/terminal.mjs health`;
                        break;
                    case "help":
                        command = `just help`;
                        break;
                    case "status":
                        command = `bun run .pi/multi-team/ui/terminal.mjs`;
                        break;
                    case "list":
                        command = `just teams list`;
                        break;
                    default:
                        command = `just team ${teamName}${additionalArgs}`;
                }

                safeInfo(ctx, "Executing: " + command);

                const output = execSync(command, { encoding: "utf-8", cwd: pi.cwd });

                return { content: [{ type: "text", text: "✅ Operation '" + operation + "' completed successfully!\n\n📋 Output:\n" + output + "\n\n🎯 Available operations: init, reset, clean, health, help, status" }] };
            } catch (error: any) {
                return { content: [{ type: "text", text: "❌ Error performing operation '" + args.operation + "':\n" + error.message + "\n\n💡 Tip: Make sure you're in the CodepOS root directory." }] };
            }
        }
    });

    pi.registerTool({
        name: "check_codepos_status",
        description: "Checks the overall status and health of the CodepOS system.",
        parameters: {
            type: "object",
            properties: {
                depth: {
                    type: "string",
                    description: "Depth of status check: quick (default), detailed, verbose",
                    enum: ["quick", "detailed", "verbose"],
                    default: "quick"
                }
            },
            required: [],
        },
        execute: async (args, ctx) => {
            try {
                let status = "📊 CodepOS System Status (Quick)\n\n📦 Agent Teams:\n";

                const teams = execSync("ls -1 .pi/multi-team/agents", { encoding: "utf-8", cwd: pi.cwd });
                if (teams) {
                    status += teams.split('\n').map(team => "   - 🟢 " + team).join('\n');
                }

                status += "\n\n📋 Ready to deploy! Use:\n   - pi list_codepos_teams - See all teams\n   - pi deploy_codepos_team <team> - Deploy a team\n   - pi check_codepos_status <detailed|verbose> - More details";

                return { content: [{ type: "text", text: status }] };
            } catch (error: any) {
                return { content: [{ type: "text", text: "❌ Error checking status: " + error.message }] };
            }
        }
    });

    pi.registerTool({
        name: "discover_teams",
        description: "Discovers and analyzes CodepOS teams, showing their manifest information.",
        parameters: {
            type: "object",
            properties: {
                teamName: {
                    type: "string",
                    description: "Optional specific team name to analyze",
                    default: ""
                }
            },
            required: [],
        },
        execute: async (args, ctx) => {
            try {
                const teamName = args.teamName || "";

                if (!teamName) {
                    return { content: [{ type: "text", text: "🔍 Team Discovery Mode\n\n📦 Available teams:\n" + (execSync("ls -1 .pi/multi-team/agents", { encoding: "utf-8", cwd: pi.cwd }) || "No teams found") + "\n\n💡 Use pi discover_teams <teamName> to analyze a specific team." }] };
                }

                const manifestPath = ".pi/multi-team/agents/" + teamName + "/manifest.yaml";
                let manifest = "No manifest found for this team.";

                try {
                    manifest = execSync(`cat "${manifestPath}"`, { encoding: "utf-8", cwd: pi.cwd });
                } catch (e: any) {
                    manifest = "Team " + teamName + " doesn't have a manifest.yaml or it's not in the agents folder.";
                }

                return { content: [{ type: "text", text: "📋 Team: " + teamName + "\n\n📄 Manifest:\n" + manifest + "\n\n🚀 Use pi deploy_codepos_team " + teamName + " to deploy this team." }] };
            } catch (error: any) {
                return { content: [{ type: "text", text: "❌ Error discovering teams: " + error.message }] };
            }
        }
    });
}