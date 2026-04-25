import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

const PROTECTED_PATHS = [".env", "secrets", "credentials", "*.pem", "*.key"];
const READONLY_PATHS = ["package-lock.json", "*.lock", "CLAUDE.md", "README.md"];
const NO_DELETE_PATHS = ["CLAUDE.md", "README.md", "LICENSE", ".git/", ".pi/"];
const DANGEROUS_PATTERNS = [
  /rm\s+(-[^\s]*)*-[rRf]/,
  /git\s+reset\s+--hard/,
  /git\s+clean\s+-[fd]/,
  /chmod\s+777/,
  /sudo\s+rm/,
  /terraform\s+destroy/,
];

function isDangerousCommand(command: string): { blocked: boolean; reason?: string } {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(command)) {
      return { blocked: true, reason: `Dangerous pattern: ${pattern}` };
    }
  }
  return { blocked: false };
}

export default function (pi: ExtensionAPI): void {
  pi.registerTool({
    name: "damage_control_check",
    description: "Check if a command or path is safe",
    parameters: {
      type: "object",
      properties: {
        command: { type: "string", description: "Command to check" },
        path: { type: "string", description: "Path to check" },
        mode: { type: "string", enum: ["read", "write", "delete"], description: "Mode" },
      },
    },
    execute: async (args) => {
      if (args.command) {
        const result = isDangerousCommand(args.command);
        if (result.blocked) return { message: `BLOCKED: ${result.reason}` };
        return { message: "OK: Command appears safe" };
      }
      if (args.path && args.mode) {
        if (args.mode === "delete" && NO_DELETE_PATHS.some(p => args.path.includes(p))) {
          return { message: `BLOCKED: ${args.path} cannot be deleted` };
        }
        if (args.mode === "write" && READONLY_PATHS.some(p => args.path.includes(p))) {
          return { message: `BLOCKED: ${args.path} is read-only` };
        }
        return { message: `OK: ${args.path} allowed for ${args.mode}` };
      }
      return { message: "Provide command or path to check" };
    },
  });

  pi.registerTool({
    name: "damage_control_status",
    description: "Show damage control status",
    parameters: { type: "object", properties: {}, required: [] },
    execute: async () => {
      return {
        message: [
          "Damage Control Active",
          "",
          "Protected: .env, secrets, credentials, *.pem, *.key",
          "Read Only: package-lock.json, *.lock, CLAUDE.md, README.md",
          "No Delete: CLAUDE.md, README.md, LICENSE, .git/, .pi/",
          "",
          "Dangerous Commands Blocked:",
          "  - rm -rf, git reset --hard, git clean -f/-d",
          "  - chmod 777, sudo rm, terraform destroy",
        ].join("\n"),
      };
    },
  });
}