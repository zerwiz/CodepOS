/**
 * CodepOS Theme Cycler Extension
 *
 * Provides theme switching functionality for the pi CLI terminal UI.
 * Allows cycling through available themes and applying theme presets.
 *
 * Usage:
 *   pi cycle_theme [next|prev|<theme_name>]
 *   pi theme_status
 *
 * @version 1.0.0
 * @author CodepOS Team
 * @license MIT
 */

import type {
  ExtensionAPI,
  ExtensionContext,
} from "@mariozechner/pi-coding-agent";

interface ThemeDefinition {
  name: string;
  fg: string;
  bg: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  dim: string;
  muted: string;
  border: string;
  borderMuted: string;
  separator: string;
  highlight: string;
  activeBorder: string;
  statusBar: string;
}

/**
 * Available theme list
 */
const THEMES: ThemeDefinition[] = [
  {
    name: "catppuccin-mocha",
    fg: "#f5e0dc",
    bg: "#1e1e2e",
    accent: "#cba6f7",
    success: "#a6e3a1",
    warning: "#f9e2af",
    error: "#f38ba8",
    info: "#89b4fa",
    dim: "#6c7086",
    muted: "#717d8a",
    border: "#313244",
    borderMuted: "#45475a",
    separator: "#313244",
    highlight: "#cba6f7",
    activeBorder: "#cba6f7",
    statusBar: "#313244",
  },
  {
    name: "cyberpunk",
    fg: "#f0f0f0",
    bg: "#0d1117",
    accent: "#d0d6f9",
    success: "#00e676",
    warning: "#ffeb3b",
    error: "#ff1744",
    info: "#2979ff",
    dim: "#8b949e",
    muted: "#6e7681",
    border: "#30363d",
    borderMuted: "#21262d",
    separator: "#30363d",
    highlight: "#79c0ff",
    activeBorder: "#d0d6f9",
    statusBar: "#161b22",
  },
  {
    name: "dracula",
    fg: "#f8f8f2",
    bg: "#282a36",
    accent: "#bd93f9",
    success: "#50fa7b",
    warning: "#f1fa8c",
    error: "#ff5555",
    info: "#8be9fd",
    dim: "#6272a4",
    muted: "#6272a4",
    border: "#44475a",
    borderMuted: "#3b4055",
    separator: "#44475a",
    highlight: "#50fa7b",
    activeBorder: "#bd93f9",
    statusBar: "#44475a",
  },
  {
    name: "everforest",
    fg: "#d3c6aa",
    bg: "#2d2520",
    accent: "#73dce8",
    success: "#4b8b3d",
    warning: "#e6ac30",
    error: "#902e41",
    info: "#55b5c5",
    dim: "#607d8b",
    muted: "#6c84a4",
    border: "#3b3630",
    borderMuted: "#3e3631",
    separator: "#3b3630",
    highlight: "#73dce8",
    activeBorder: "#73dce8",
    statusBar: "#3b3630",
  },
  {
    name: "gruvbox",
    fg: "#ebdbb2",
    bg: "#282828",
    accent: "#fb4934",
    success: "#b8bb26",
    warning: "#fe8019",
    error: "#fb4934",
    info: "#83a598",
    dim: "#928374",
    muted: "#928374",
    border: "#3c3836",
    borderMuted: "#4c443b",
    separator: "#3c3836",
    highlight: "#fb4934",
    activeBorder: "#fb4934",
    statusBar: "#3c3836",
  },
  {
    name: "midnight-ocean",
    fg: "#e0e0e0",
    bg: "#1a1a2e",
    accent: "#4fc3f7",
    success: "#00e676",
    warning: "#ffeb3b",
    error: "#ff5252",
    info: "#2196f3",
    dim: "#757575",
    muted: "#616161",
    border: "#333333",
    borderMuted: "#2c2c2c",
    separator: "#333333",
    highlight: "#4fc3f7",
    activeBorder: "#4fc3f7",
    statusBar: "#1a1a2e",
  },
  {
    name: "nord",
    fg: "#e0e0e0",
    bg: "#2e3440",
    accent: "#88c0d0",
    success: "#a3be8c",
    warning: "#ebcb8b",
    error: "#bf616a",
    info: "#81a1c1",
    dim: "#4c566a",
    muted: "#586069",
    border: "#3b4252",
    borderMuted: "#2e3440",
    separator: "#3b4252",
    highlight: "#81a1c1",
    activeBorder: "#88c0d0",
    statusBar: "#3b4252",
  },
  {
    name: "ocean-breeze",
    fg: "#e0f4e8",
    bg: "#0f1e2c",
    accent: "#4fc3f7",
    success: "#00e676",
    warning: "#ffeb3b",
    error: "#f44336",
    info: "#2196f3",
    dim: "#78909c",
    muted: "#546e7a",
    border: "#263238",
    borderMuted: "#1e272c",
    separator: "#263238",
    highlight: "#4fc3f7",
    activeBorder: "#4fc3f7",
    statusBar: "#263238",
  },
  {
    name: "rose-pine",
    fg: "#e0def4",
    bg: "#191724",
    accent: "#eb6f92",
    success: "#33ff57",
    warning: "#f9e04a",
    error: "#ff3f6e",
    info: "#74c4ec",
    dim: "#6e6a86",
    muted: "#6e6a86",
    border: "#44475a",
    borderMuted: "#3b4055",
    separator: "#44475a",
    highlight: "#eb6f92",
    activeBorder: "#eb6f92",
    statusBar: "#44475a",
  },
  {
    name: "synthwave",
    fg: "#cccccc",
    bg: "#1a0f2e",
    accent: "#ff00ff",
    success: "#00ff00",
    warning: "#ffff00",
    error: "#ff0000",
    info: "#00ffff",
    dim: "#6b6b6b",
    muted: "#808080",
    border: "#404040",
    borderMuted: "#303030",
    separator: "#404040",
    highlight: "#ff00ff",
    activeBorder: "#ff00ff",
    statusBar: "#404040",
  },
  {
    name: "tokyo-night",
    fg: "#a9b1d6",
    bg: "#1a1b26",
    accent: "#7aa2f7",
    success: "#9ece6a",
    warning: "#e0af68",
    error: "#f7768e",
    info: "#7dcfff",
    dim: "#565f89",
    muted: "#49576e",
    border: "#24283b",
    borderMuted: "#1f2335",
    separator: "#24283b",
    highlight: "#7aa2f7",
    activeBorder: "#7aa2f7",
    statusBar: "#1a1b26",
  },
  {
    name: "dark-pro",
    fg: "#ffffff",
    bg: "#0d1117",
    accent: "#58a6ff",
    success: "#3fb950",
    warning: "#d29922",
    error: "#f85149",
    info: "#007fd4",
    dim: "#8b949e",
    muted: "#6e7681",
    border: "#30363d",
    borderMuted: "#21262d",
    separator: "#30363d",
    highlight: "#58a6ff",
    activeBorder: "#58a6ff",
    statusBar: "#161b22",
  },
  {
    name: "monokai",
    fg: "#f8f8f2",
    bg: "#272822",
    accent: "#a6e22e",
    success: "#a8ff78",
    warning: "#e6db74",
    error: "#f92672",
    info: "#66d9ef",
    dim: "#75715e",
    muted: "#8b949e",
    border: "#3e3d32",
    borderMuted: "#2d2d24",
    separator: "#49483e",
    highlight: "#a6e22e",
    activeBorder: "#a6e22e",
    statusBar: "#3e3d32",
  },
];

let currentThemeIndex = 0;

/**
 * Update status bar with current theme info
 */
function updateStatus(ctx: ExtensionContext, themeName: string): void {
  if (!ctx.hasUI) return;

  const swatch = `\n  🎨 Theme: ${themeName}`;
  ctx.ui.setStatus("theme", `${themeName}`);
}

/**
 * Show theme swatch visualization
 */
function showSwatch(ctx: ExtensionContext, theme: ThemeDefinition): void {
  if (!ctx.hasUI) return;

  const combined = `Theme: ${theme.name}\nAccent: ${theme.accent}`;
  ctx.ui.notify(combined, "info");
}

/**
 * Get list of all available themes
 */
function getThemeList(): ThemeDefinition[] {
  return THEMES;
}

/**
 * Find current theme index
 */
function findCurrentIndex(themeName: string): number {
  const themes = getThemeList();
  const current = themes.findIndex((t) => t.name === themeName);
  return current >= 0 ? current : 0;
}

/**
 * Cycle to next or previous theme
 */
function cycleTheme(
  ctx: ExtensionContext,
  direction: "next" | "prev" | number,
): string {
  const themes = getThemeList();
  let index = currentThemeIndex;

  if (typeof direction === "number") {
    index = direction;
  } else {
    if (direction === "next") {
      index = (index + 1) % themes.length;
    } else if (direction === "prev") {
      index = (index - 1 + themes.length) % themes.length;
    }
  }

  const theme = themes[index];
  const result = `Switched to theme: ${theme.name}`;

  updateStatus(ctx, theme.name);
  showSwatch(ctx, theme);

  return result;
}

/**
 * Set specific theme by name
 */
function setTheme(ctx: ExtensionContext, themeName: string): string {
  const themes = getThemeList();
  const found = themes.find((t) => t.name === themeName);

  if (!found) {
    return `Theme not found: ${themeName}`;
  }

  currentThemeIndex = themes.findIndex((t) => t.name === themeName);
  updateStatus(ctx, found.name);
  showSwatch(ctx, found);

  return `Applied theme: ${found.name}`;
}

export default function (pi: ExtensionAPI): void {
  // Register theme cycling tool
  pi.registerTool({
    name: "codepos_cycle_theme",
    description: "Cycle through available themes or set a specific theme",
    parameters: {
      type: "object",
      properties: {
        direction: {
          type: "string",
          enum: ["next", "prev", "random"],
          description: "Direction to cycle or 'random' for random theme",
          default: "next",
        },
        themeName: {
          type: "string",
          description: "Specific theme name to apply",
          enum: THEMES.map((t) => t.name),
          default: "",
        },
      },
      required: [],
    },
    execute: async (args, ctx) => {
      if (!ctx.hasUI)
        return { message: "UI not available for theme switching" };

      if (args.themeName && args.themeName.length > 0) {
        const result = setTheme(ctx, args.themeName);
        return { message: result };
      }

      const direction = args.direction || "next";

      if (direction === "random") {
        const randomIndex = Math.floor(Math.random() * THEMES.length);
        const randomTheme = THEMES[randomIndex];
        currentThemeIndex = randomIndex;
        updateStatus(ctx, randomTheme.name);
        showSwatch(ctx, randomTheme);
        return {
          message: `Random theme applied: ${randomTheme.name}`,
        };
      }

      const result = cycleTheme(ctx, direction);
      return { message: result };
    },
  });

  // Register theme status tool
  pi.registerTool({
    name: "codepos_theme_status",
    description: "Get current theme information",
    parameters: {
      type: "object",
      properties: {
        detailed: {
          type: "boolean",
          description: "Show detailed theme colors",
          default: false,
        },
      },
      required: [],
    },
    execute: async (args, ctx) => {
      if (!ctx.hasUI) return { message: "UI not available" };

      const currentTheme = getThemeList()[currentThemeIndex];
      let status = `🎨 Current Theme: ${currentTheme.name}\n`;

      if (args.detailed) {
        status += `  Foreground: ${currentTheme.fg}\n`;
        status += `  Background: ${currentTheme.bg}\n`;
        status += `  Accent: ${currentTheme.accent}\n`;
        status += `  Success: ${currentTheme.success}\n`;
        status += `  Warning: ${currentTheme.warning}\n`;
        status += `  Error: ${currentTheme.error}\n`;
        status += `  Info: ${currentTheme.info}\n`;
        status += `  Dim: ${currentTheme.dim}\n`;
        status += `  Muted: ${currentTheme.muted}\n`;
        status += `  Border: ${currentTheme.border}\n`;
        status += `  Highlight: ${currentTheme.highlight}\n`;
        status += `  Active Border: ${currentTheme.activeBorder}\n`;
        status += `  Status Bar: ${currentTheme.statusBar}\n`;
      }

      status += `\nAvailable themes: ${getThemeList().length}`;

      return { message: status };
    },
  });

  // Register list themes tool
  pi.registerTool({
    name: "codepos_list_themes",
    description: "List all available themes",
    parameters: {
      type: "object",
      properties: {
        filter: {
          type: "string",
          description: "Filter themes by name pattern",
          default: "",
        },
      },
      required: [],
    },
    execute: async (args, ctx) => {
      if (!ctx.hasUI) return { message: "UI not available" };

      let themes = getThemeList();

      if (args.filter && args.filter.length > 0) {
        themes = themes.filter((t) =>
          t.name.toLowerCase().includes(args.filter.toLowerCase()),
        );
      }

      let list = `📦 Available CodepOS Themes:\n`;
      themes.forEach((theme, index) => {
        list += `  ${index + 1}. ${theme.name}\n`;
      });

      if (themes.length > 0) {
        list += `\nUse 'codepos_cycle_theme' to switch themes.`;
        list += `\nOr use 'codepos_set_theme' with theme name.`;
      }

      return { message: list };
    },
  });

  // Session lifecycle - apply default theme on start
  pi.on("session_start", async (_event, ctx) => {
    // Apply default theme (dracula - index 2)
    currentThemeIndex = 2;
    updateStatus(ctx, THEMES[2].name);

    // Show welcome message with theme
    if (ctx.hasUI) {
      ctx.ui.notify(`CodepOS: ${THEMES[currentThemeIndex].name}`, "info");
    }
  });

  // Keyboard shortcuts - Ctrl+Left/Right for theme cycling
  pi.on("key_press", async (event, ctx) => {
    if (!ctx.hasUI) return;

    const key = event.key;

    // Ctrl + Left: Previous theme
    if (key === "ArrowLeft" && event.ctrlKey) {
      const result = cycleTheme(ctx, "prev");
      ctx.ui.notify(result, "info");
    }

    // Ctrl + Right: Next theme
    if (key === "ArrowRight" && event.ctrlKey) {
      const result = cycleTheme(ctx, "next");
      ctx.ui.notify(result, "info");
    }

    // Ctrl + Space: Random theme
    if (key === " " && event.ctrlKey) {
      const result = cycleTheme(ctx, "next");
      const randomIndex = Math.floor(Math.random() * THEMES.length);
      THEMES[randomIndex];
      currentThemeIndex = randomIndex;
      updateStatus(ctx, THEMES[randomIndex].name);
      showSwatch(ctx, THEMES[randomIndex]);
      ctx.ui.notify(`Random theme: ${THEMES[randomIndex].name}`, "info");
    }
  });

  // Session shutdown - cleanup
  pi.on("session_shutdown", async () => {
    // Cleanup on shutdown
    // Optionally persist theme choice to a file
  });
}
