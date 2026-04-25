/**
 * CodepOS UI Extension
 * 
 * Shows CodepOS components in pi's terminal UI.
 * Displays scanners, council agents, and teams with status.
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { defineTool, ExtensionContext } from "@mariozechner/pi-coding-agent";

const ROOT_DIR = process.cwd();
const STATE_DIR = join(ROOT_DIR, ".pi", "state");

const COMPONENTS = {
  scanners: [
    { name: "scout", role: "Structure check" },
    { name: "sentinel", role: "Security scan" },
    { name: "mapper", role: "Architecture view" },
    { name: "librarian", role: "Docs index" },
    { name: "indexer", role: "Deep index" }
  ],
  council: [
    { name: "planning", role: "Task planning" },
    { name: "dokumenter", role: "Documentation" }
  ],
  teams: [
    { name: "main", role: "Full pipeline" },
    { name: "security", role: "Security analysis" }
  ]
};

const getComponentState = (name: string) => {
  const f = join(STATE_DIR, `${name}-activity.json`);
  let s = { status: "idle", startedAt: null, completedAt: null, toolUses: 0, tokens: 0 };
  if (existsSync(f)) {
    try { s = { ...s, ...JSON.parse(readFileSync(f, "utf-8")) }; } catch {}
  }
  return s;
};

const exists = (type: string, name: string) => {
  const paths: Record<string, string> = {
    scanner: join(ROOT_DIR, ".pi", "multi-team", "scanners", name),
    council: join(ROOT_DIR, ".pi", "multi-team", "council", name),
    team: join(ROOT_DIR, ".pi", "multi-team", "teams", name)
  };
  return existsSync(paths[type]);
};

const getComponents = () => {
  const r: any = { scanners: [], council: [], teams: [] };
  for (const [type, items] of Object.entries(COMPONENTS)) {
    for (const item of items as any[]) {
      if (exists(type, item.name)) {
        r[type].push({ ...item, ...getComponentState(item.name) });
      }
    }
  }
  return r;
};

export default function (ctx: ExtensionContext) {
  let frame = 0;
  const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

  const renderWidget = (tui: any, theme: any) => {
    const fg = (color: string, text: string) => theme.fg(color, text);
    const bold = (text: string) => theme.bold(text);
    const truncate = (str: string, len: number) => str.length > len ? str.slice(0, len - 1) + "…" : str;

    const comps = getComponents();
    const all = [...comps.scanners, ...comps.council, ...comps.teams].filter((c: any) => c.status === "running");
    const spinner = SPINNER[frame % SPINNER.length];
    const hasActive = all.length > 0;
    const icon = hasActive ? "●" : "○";
    const color = hasActive ? "accent" : "dim";

    const lines: string[] = [
      truncate(fg(color, icon) + " " + fg(color, "CodepOS"), tui.terminal.columns)
    ];

    const renderSection = (label: string, items: any[]) => {
      if (items.length === 0) return;
      lines.push(truncate(fg("muted", "├─") + " " + fg("purple", label), tui.terminal.columns));
      items.forEach((item, i) => {
        const conn = i === items.length - 1 ? " └─" : " ├─";
        const sub = i === items.length - 1 ? "    " : " │  ";
        
        if (item.status === "running") {
          lines.push(truncate(fg("muted", "│  ") + fg("muted", conn) + " " + fg("accent", spinner) + " " + bold(item.name), tui.terminal.columns));
          lines.push(truncate(fg("muted", "│  ") + fg("muted", sub) + " " + fg("muted", "⎿ thinking…"), tui.terminal.columns));
        } else if (item.status === "completed") {
          lines.push(truncate(fg("muted", "│  ") + fg("muted", conn) + " " + fg("success", "✓") + " " + fg("dim", item.name), tui.terminal.columns));
        } else if (item.status === "error") {
          lines.push(truncate(fg("muted", "│  ") + fg("muted", conn) + " " + fg("error", "✗") + " " + fg("dim", item.name), tui.terminal.columns));
        } else {
          lines.push(truncate(fg("muted", "│  ") + fg("muted", conn) + " " + fg("muted", "○") + " " + fg("dim", item.name), tui.terminal.columns));
        }
      });
    };

    renderSection("Scanners", comps.scanners);
    renderSection("Council", comps.council);
    renderSection("Teams", comps.teams);

    return lines;
  };

  ctx.setWidget("codepos", (tui, theme) => ({
    render: () => {
      frame++;
      return renderWidget(tui, theme);
    },
    invalidate: () => {}
  }), { placement: "aboveEditor" });

  ctx.setStatus("codepos", "CodepOS ready");
}