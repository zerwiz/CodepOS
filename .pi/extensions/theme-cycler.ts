import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

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

function getCurrentTheme(): ThemeDefinition {
  return THEMES[currentThemeIndex];
}

export default function (pi: ExtensionAPI): void {
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
    execute: async (args) => {
      if (args.themeName && args.themeName.length > 0) {
        const found = THEMES.find((t) => t.name === args.themeName);
        if (!found) {
          return { message: `Theme not found: ${args.themeName}` };
        }
        currentThemeIndex = THEMES.findIndex((t) => t.name === args.themeName);
        return { message: `Applied theme: ${found.name}` };
      }

      const direction = args.direction || "next";
      if (direction === "random") {
        currentThemeIndex = Math.floor(Math.random() * THEMES.length);
      } else if (direction === "next") {
        currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
      } else if (direction === "prev") {
        currentThemeIndex = (currentThemeIndex - 1 + THEMES.length) % THEMES.length;
      }

      const theme = getCurrentTheme();
      return { message: `Switched to theme: ${theme.name}` };
    },
  });

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
    execute: async (args) => {
      const theme = getCurrentTheme();
      let status = `Current Theme: ${theme.name}`;

      if (args.detailed) {
        status += `\n  Accent: ${theme.accent}`;
        status += `\n  Background: ${theme.bg}`;
      }

      status += `\n\nAvailable themes: ${THEMES.length}`;
      return { message: status };
    },
  });

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
    execute: async (args) => {
      let themes = THEMES;
      if (args.filter && args.filter.length > 0) {
        themes = themes.filter((t) =>
          t.name.toLowerCase().includes(args.filter.toLowerCase()),
        );
      }

      let list = `Available Themes:\n`;
      themes.forEach((theme, index) => {
        list += `${index + 1}. ${theme.name}\n`;
      });

      if (themes.length > 0) {
        list += `\nUse codepos_cycle_theme to switch.`;
      }

      return { message: list };
    },
  });

  pi.on("session_start", async () => {
    currentThemeIndex = 2;
  });

  pi.registerShortcut("ctrl+'", {
    description: "Next theme",
    handler: async () => {
      currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
    },
  });

  pi.registerShortcut("ctrl+;", {
    description: "Previous theme",
    handler: async () => {
      currentThemeIndex = (currentThemeIndex - 1 + THEMES.length) % THEMES.length;
    },
  });
}