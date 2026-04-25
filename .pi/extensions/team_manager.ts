import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { execSync } from "child_process";

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "list_codepos_teams",
    description: "Lists all available CodepOS agent teams",
    parameters: { type: "object", properties: {}, required: [] },
    execute: async () => {
      try {
        const teams = execSync("ls -1 .pi/multi-team/agents 2>/dev/null || echo 'No teams found'", {
          encoding: "utf-8",
        });
        return { message: `Available Teams:\n${teams}\nUse 'run_team teamName=<name>' to deploy` };
      } catch {
        return { message: "No teams found" };
      }
    },
  });

  pi.registerTool({
    name: "deploy_codepos_team",
    description: "Deploys a CodepOS agent team",
    parameters: {
      type: "object",
      properties: {
        teamName: { type: "string", description: "Team name" },
        args: { type: "string", description: "Additional args", default: "" },
      },
      required: ["teamName"],
    },
    execute: async (args) => {
      const teamName = args?.teamName;
      if (!teamName) {
        return { message: "teamName required. Usage: deploy_codepos_team teamName=<team>" };
      }
      try {
        const cmd = `just team ${teamName}${args?.args ? " " + args.args : ""}`;
        const output = execSync(cmd, { encoding: "utf-8" });
        return { message: `Team ${teamName} deployed:\n${output}` };
      } catch (error: any) {
        return { message: `Error: ${error.message}` };
      }
    },
  });

  pi.registerTool({
    name: "run_scout",
    description: "Runs the scout agent to analyze codebase",
    parameters: { type: "object", properties: {}, required: [] },
    execute: async () => {
      try {
        const output = execSync("just scanner scout", { encoding: "utf-8" });
        return { message: `Scout Report:\n${output}` };
      } catch (error: any) {
        return { message: `Error: ${error.message}` };
      }
    },
  });

  pi.registerTool({
    name: "run_sentinel",
    description: "Runs the sentinel security scanner",
    parameters: { type: "object", properties: {}, required: [] },
    execute: async () => {
      try {
        const output = execSync("just scanner sentinel", { encoding: "utf-8" });
        return { message: `Sentinel Report:\n${output}` };
      } catch (error: any) {
        return { message: `Error: ${error.message}` };
      }
    },
  });

  pi.registerTool({
    name: "run_mapper",
    description: "Runs the mapper agent for project architecture",
    parameters: { type: "object", properties: {}, required: [] },
    execute: async () => {
      try {
        const output = execSync("just scanner mapper", { encoding: "utf-8" });
        return { message: `Project Structure:\n${output}` };
      } catch (error: any) {
        return { message: `Error: ${error.message}` };
      }
    },
  });

  pi.registerTool({
    name: "run_librarian",
    description: "Runs the librarian to index documentation",
    parameters: { type: "object", properties: {}, required: [] },
    execute: async () => {
      try {
        const output = execSync("just scanner librarian", { encoding: "utf-8" });
        return { message: `Documentation Index:\n${output}` };
      } catch (error: any) {
        return { message: `Error: ${error.message}` };
      }
    },
  });
}