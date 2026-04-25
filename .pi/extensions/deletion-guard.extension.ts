import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

const NO_DELETE = [".git/", ".pi/", "CLAUDE.md", "README.md", "LICENSE"];

function isProtected(path: string): boolean {
  return NO_DELETE.some((p) => path.includes(p));
}

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async () => {
    pi.notify("Deletion guard active", "info");
  });

  pi.registerTool({
    name: "block_file_deletion",
    description: "Check if a file can be deleted",
    parameters: {
      type: "object",
      properties: {
        filePath: { type: "string", description: "Path to file" },
      },
      required: ["filePath"],
    },
    execute: async (args) => {
      const { filePath } = args;
      if (isProtected(filePath)) {
        return { message: `BLOCKED: ${filePath} is protected` };
      }
      return { message: `OK: ${filePath} can be deleted` };
    },
  });
}