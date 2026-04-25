/**
 * CodepOS Interactive UI Extension
 * 
 * Integrates the enhanced agent status widget into the pi session.
 */

import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";
import { truncateToWidth } from "@mariozechner/pi-tui";
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// Braille spinner frames
const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
let frameIndex = 0;

/**
 * Get all agent teams from the filesystem
 */
function getAgents(cwd: string) {
  const agentsDir = join(cwd, '.pi', 'multi-team', 'agents');
  try {
    if (!existsSync(agentsDir)) return [];
    return readdirSync(agentsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => {
        const manifestPath = join(agentsDir, dirent.name, 'manifest.yaml');
        let status = 'inactive';
        let description = 'System agent';

        if (existsSync(manifestPath)) {
          const content = readFileSync(manifestPath, 'utf-8');
          const statusMatch = content.match(/status:\s*(\S+)/);
          const descMatch = content.match(/description:\s*['"]?([^'"]+)['"]?/);
          
          if (statusMatch) status = statusMatch[1].toLowerCase();
          if (descMatch) description = descMatch[1];
        }

        return {
          name: dirent.name,
          status,
          description
        };
      });
  } catch (error) {
    return [];
  }
}

/**
 * Render the agent status widget
 */
function renderWidget(ctx: ExtensionContext, theme: any, width: number): string[] {
  const agents = getAgents(ctx.cwd);
  const running = agents.filter(a => a.status === 'active');
  const finished = agents.filter(a => a.status === 'completed' || a.status === 'inactive');
  
  const lines: string[] = [];
  const headingColor = running.length > 0 ? "accent" : "dim";
  const headingIcon = running.length > 0 ? "●" : "○";
  
  lines.push(truncateToWidth(theme.fg(headingColor, headingIcon) + " " + theme.fg(headingColor, "CodepOS Agents"), width));
  
  const spinnerChar = SPINNER[frameIndex % SPINNER.length];
  
  // Render Running Agents
  for (let i = 0; i < running.length; i++) {
    const a = running[i];
    const isLast = (i === running.length - 1) && (finished.length === 0);
    const connector = isLast ? ' └─' : ' ├─';
    const subConnector = isLast ? '    ' : ' │  ';
    
    lines.push(truncateToWidth(theme.fg("dim", connector) + " " + theme.fg("accent", spinnerChar) + " " + theme.bold(a.name) + " " + theme.fg("dim", "·") + " " + theme.fg("muted", a.description), width));
    lines.push(truncateToWidth(theme.fg("dim", subConnector) + " " + theme.fg("dim", '  ⎿  thinking…'), width));
  }
  
  // Render Finished/Inactive Agents
  // Limit to 5 finished agents to save space
  const displayFinished = finished.slice(0, 5);
  for (let i = 0; i < displayFinished.length; i++) {
    const a = displayFinished[i];
    const isLast = i === displayFinished.length - 1;
    const connector = isLast ? ' └─' : ' ├─';
    
    const icon = a.status === 'completed' ? theme.fg("success", "✓") : theme.fg("dim", "○");
    const nameColor = a.status === 'completed' ? "muted" : "dim";
    
    lines.push(truncateToWidth(theme.fg("dim", connector) + " " + icon + " " + theme.fg(nameColor, a.name) + " " + theme.fg("dim", "·") + " " + theme.fg("dim", a.description), width));
  }
  
  if (finished.length > 5) {
    lines.push(theme.fg("dim", `    + ${finished.length - 5} more...`));
  }

  return lines;
}

export default function (pi: ExtensionAPI): void {
  let widgetInterval: ReturnType<typeof setInterval> | null = null;

  pi.on("session_start", async (_event, ctx) => {
    if (!ctx.hasUI) return;

    // Set widget
    ctx.ui.setWidget("codepos-agents", (tui, theme) => {
      return {
        render: (width) => renderWidget(ctx, theme, width),
        invalidate: () => {}
      };
    }, { placement: "aboveEditor" });

    // Update interval for spinner
    widgetInterval = setInterval(() => {
      frameIndex++;
      if (ctx.hasUI) (ctx as any).ui._tui?.requestRender();
    }, 100);

    ctx.ui.notify("CodepOS Interactive UI Active", "info");
  });

  pi.on("session_shutdown", async () => {
    if (widgetInterval) clearInterval(widgetInterval);
  });

  // Re-register theme cycle commands
  pi.registerShortcut("ctrl+b", {
    description: "Next theme",
    handler: async (ctx) => {
      if (!ctx.hasUI) return;
      const themes = ctx.ui.getAllThemes();
      const current = ctx.ui.theme.name;
      const idx = themes.findIndex(t => t.name === current);
      const next = themes[(idx + 1) % themes.length];
      ctx.ui.setTheme(next.name);
    }
  });
}
