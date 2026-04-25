/**
 * CodepOS Interactive UI Extension
 *
 * Integrates the enhanced agent status widget into the pi session.
 */

import type {
  ExtensionAPI,
  ExtensionContext,
} from "@mariozechner/pi-coding-agent";
import { truncateToWidth } from "@mariozechner/pi-tui";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

// Braille spinner frames
const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
let frameIndex = 0;

/**
 * Get all agent teams from the filesystem
 */
const SINGLE_AGENTS = [
  "scout",
  "sentinel",
  "mapper",
  "librarian",
  "test-agent",
];

function getAgents(cwd: string) {
  const agentsDir = join(cwd, ".pi", "multi-team", "agents");
  try {
    if (!existsSync(agentsDir)) return [];
    return readdirSync(agentsDir, { withFileTypes: true })
      .filter(
        (dirent) =>
          dirent.isDirectory() && !SINGLE_AGENTS.includes(dirent.name),
      )
      .map((dirent) => {
        const manifestPath = join(agentsDir, dirent.name, "manifest.yaml");
        let status = "inactive";
        let description = "System agent";

        if (existsSync(manifestPath)) {
          const content = readFileSync(manifestPath, "utf-8");
          const statusMatch = content.match(/status:\s*(\S+)/);
          const descMatch = content.match(/description:\s*['"]?([^'"]+)['"]?/);

          if (statusMatch) status = statusMatch[1].toLowerCase();
          if (descMatch) description = descMatch[1];
        }

        return {
          name: dirent.name,
          status,
          description,
        };
      });
  } catch (error) {
    return [];
  }
}

/**
 * Render the agent status widget
 */
function renderWidget(
  ctx: ExtensionContext,
  theme: any,
  width: number,
): string[] {
  const agents = getAgents(ctx.cwd);
  const active = agents.filter((a) => a.status === "active");

  const lines: string[] = [];
  if (active.length === 0) {
    lines.push(truncateToWidth(theme.fg("dim", "○ CodepOS"), width));
    return lines;
  }

  lines.push(
    truncateToWidth(
      theme.fg("accent", "●") + " " + theme.fg("accent", "CodepOS"),
      width,
    ),
  );

  const spinnerChar = SPINNER[frameIndex % SPINNER.length];

  for (let i = 0; i < active.length; i++) {
    const a = active[i];
    const isLast = i === active.length - 1;
    const connector = isLast ? " └─" : " ├─";

    lines.push(
      truncateToWidth(
        theme.fg("dim", connector) +
          " " +
          theme.fg("accent", spinnerChar) +
          " " +
          theme.bold(a.name) +
          " " +
          theme.fg("dim", "·") +
          " " +
          theme.fg("muted", a.description),
        width,
      ),
    );
  }

  return lines;
}

export default function (pi: ExtensionAPI): void {
  let widgetInterval: ReturnType<typeof setInterval> | null = null;

  pi.on("session_start", async (_event, ctx) => {
    if (!ctx.hasUI) return;

    // Set widget
    ctx.ui.setWidget(
      "codepos-agents",
      (_tui, theme) => {
        frameIndex++;
        return {
          render: (width) => renderWidget(ctx, theme, width),
          invalidate: () => {},
        };
      },
      { placement: "aboveEditor" },
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
    },
  });
}
