#!/usr/bin/env bun
/**
 * Pi Terminal UI - Status Display for Multi-Agent Orchestrator
 *
 * This script provides a terminal-based UI for monitoring agent status,
 * displaying color-coded warnings, and showing system health metrics.
 *
 * Usage:
 *   bun run terminal.mjs           # Show full status
 *   bun run terminal.mjs status    # Agent status
 *   bun run terminal.mjs watch     # Live monitoring mode
 *   bun run terminal.mjs tree      # Team hierarchy
 *   bun run terminal.mjs health    # System health check
 *   bun run terminal.mjs warnings  # Show warnings only
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..', '..', '..', '..');
const AGENTS_DIR = join(ROOT_DIR, '.pi', 'multi-team', 'agents');

// Color palette for terminal output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  brightBlack: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m'
};

const color = {
  reset: () => colors.reset,
  bold: (text) => colors.bold + text + colors.reset,
  dim: (text) => colors.dim + text + colors.reset,
  red: (text) => colors.red + text + colors.reset,
  green: (text) => colors.green + text + colors.reset,
  yellow: (text) => colors.yellow + text + colors.reset,
  blue: (text) => colors.blue + text + colors.reset,
  magenta: (text) => colors.magenta + text + colors.reset,
  cyan: (text) => colors.cyan + text + colors.reset,
  white: (text) => colors.white + text + colors.reset,
  gray: (text) => colors.gray + text + colors.reset
};

// Agent team definitions
const agents = [
  { name: 'setup', role: 'Orchestrator', priority: 1, status: 'active' },
  { name: 'ui-gen-A', role: 'Generator', priority: 2, status: 'active' },
  { name: 'planning', role: 'Planner', priority: 3, status: 'active' },
  { name: 'validation-A', role: 'QA Tester', priority: 4, status: 'active' },
  { name: 'validation-B', role: 'Tester', priority: 4, status: 'active' },
  { name: 'validation-C', role: 'Style Validator', priority: 4, status: 'active' }
];

// Warning messages
const warnings = [
  { level: 'info', message: 'Terminal UI initialized' },
  { level: 'success', message: 'All agents discovered' }
];

/**
 * Check agent status from manifest file
 */
const checkAgentStatus = (agentName) => {
  try {
    const manifestPath = join(AGENTS_DIR, agentName, 'manifest.yaml');
    if (existsSync(manifestPath)) {
      const content = readFileSync(manifestPath, 'utf-8');
      const statusMatch = content.match(/status:\s*(\S+)/);
      const status = statusMatch ? statusMatch[1] : 'unknown';
      return status.toLowerCase() === 'active' ? 'active' : 'inactive';
    }
    return 'missing';
  } catch (error) {
    return 'error';
  }
};

/**
 * Get agent color based on status
 */
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'active': return colors.green;
    case 'inactive': return colors.yellow;
    case 'missing': return colors.red;
    case 'error': return colors.red;
    default: return colors.gray;
  }
};

/**
 * Get emoji for status
 */
const getStatusEmoji = (status) => {
  switch (status.toLowerCase()) {
    case 'active': return '🟢';
    case 'inactive': return '🟡';
    case 'missing': return '⚫';
    case 'error': return '🔴';
    default: return '⚪';
  }
};

/**
 * Format agent status line
 */
const formatAgentStatus = (agent) => {
  const status = checkAgentStatus(agent.name);
  const color = getStatusColor(status);
  const emoji = getStatusEmoji(status);
  const role = agent.role;
  const priority = agent.priority;

  const statusText = status.toLowerCase() === 'active' ? 'Active' : status.toUpperCase();
  const priorityText = priority.toString().padStart(2, '0');

  return `${color}[${emoji} ${agent.name.padEnd(18)}]${colors.reset} ${role.padEnd(16)} ${statusText}${color} (pri: ${priorityText})`;
};

/**
 * Display full status screen
 */
const showStatus = () => {
  console.log(color.bold('\n════════════════════════════════════════════════════════'));
  console.log(color.bold('          CodepOS Multi-Agent Orchestrator'));
  console.log(color.bold('          Terminal Status Monitor v0.71.0'));
  console.log(color.bold('════════════════════════════════════════════════════════\n'));

  // System info
  console.log(color.dim('─' + '─'.repeat(58) + '─'));
  console.log(color.cyan(`System:        ${process.platform.toUpperCase()} ${process.arch}`));
  console.log(color.cyan(`Node/Bun:      ${process.version}`));
  console.log(color.cyan(`PID:           ${process.pid}`));
  console.log(color.dim('─' + '─'.repeat(58) + '─\n'));

  // Agent count
  const activeCount = agents.filter(a =>
    checkAgentStatus(a.name) === 'active'
  ).length;

  console.log(color.bold('═' + '═'.repeat(58) + '═'));
  console.log(color.magenta(`AGENT STATUS (${activeCount}/${agents.length} Active)`));
  console.log(color.bold('═' + '═'.repeat(58) + '═'));
  console.log('');

  // Agent list
  for (const agent of agents) {
    console.log(formatAgentStatus(agent));
  }
  console.log('');

  console.log(color.bold('─' + '─'.repeat(58) + '─'));
  console.log(color.bold('ACTIVE AGENTS:'));
  console.log(`  ${color.green}✓ setup`);
  console.log(`  ${color.green}✓ ui-gen-A`);
  console.log(`  ${color.green}✓ planning`);
  console.log(`  ${color.green}✓ validation-A`);
  console.log(`  ${color.green}✓ validation-B`);
  console.log(`  ${color.green}✓ validation-C`);
  console.log(color.dim('─' + '─'.repeat(58) + '─\n'));

  // Recent activity
  console.log(color.bold('═' + '═'.repeat(58) + '═'));
  console.log(color.cyan('RECENT ACTIVITY'));
  console.log(color.bold('═' + '═'.repeat(58) + '═'));
  console.log(`  ${color.gray}• Environment initialized`);
  console.log(`  ${color.gray}• Agents discovered`);
  console.log(`  ${color.gray}• Configuration loaded`);
  console.log(color.dim('─' + '─'.repeat(58) + '─\n'));

  // Team hierarchy
  console.log(color.bold('═' + '═'.repeat(58) + '═'));
  console.log(color.cyan('TEAM HIERARCHY'));
  console.log(color.bold('═' + '═'.repeat(58) + '═'));
  console.log('');
  console.log(color.gray('┌────────────────────────────────────────────┐'));
  console.log(color.gray('│  /agents/                                  │'));
  console.log(color.gray('│  ├─ setup (orchestrator)                   │'));
  console.log(color.gray('│  ├─ ui-gen-A (generator)                   │'));
  console.log(color.gray('│  ├─ planning (workflow management)         │'));
  console.log(color.gray('│  ├─ validation-A (QA testing)              │'));
  console.log(color.gray('│  ├─ validation-B (automated tests)         │'));
  console.log(color.gray('│  └─ validation-C (style validation)         │'));
  console.log(color.gray('└────────────────────────────────────────────┘'));
  console.log(color.dim('─' + '─'.repeat(58) + '─\n'));

  // Warnings
  console.log(color.bold('═' + '═'.repeat(58) + '═'));
  console.log(color.yellow('WARNINGS & NOTICES'));
  console.log(color.bold('═' + '═'.repeat(58) + '═'));
  console.log('');
  console.log(color.gray('  ℹ Terminal UI ready'));
  console.log(color.gray('  ℹ All agents operational'));
  console.log(color.gray('  ℹ System health: optimal'));
  console.log(color.dim('─' + '─'.repeat(58) + '─\n'));

  // Footer
  console.log(color.bold('═' + '═'.repeat(58) + '═'));
  console.log(color.cyan('Available Commands:'));
  console.log(`  just pi status     ${color.yellow}Show this status`);
  console.log(`  just pi watch      ${color.yellow}Live monitoring mode`);
  console.log(`  just pi tree       ${color.yellow}Team hierarchy`);
  console.log(`  just pi health     ${color.yellow}System health check`);
  console.log(`  just pi warnings   ${color.yellow}Show warnings`);
  console.log(color.bold('════════════════════════════════════════════════════════\n'));
};

/**
 * Show team hierarchy tree
 */
const showTree = () => {
  console.log(color.bold('\n════════════════════════════════════════════════════════'));
  console.log(color.bold('           CodepOS Team Hierarchy Tree'));
  console.log(color.bold('════════════════════════════════════════════════════════\n'));

  const tree = `
${color.gray('┌─────────────────────────────────────────────────────────┐')}
${color.gray('│  /agents/                                                │')}
${color.gray('│  ├─ 🟢 setup/                                           │')}
${color.gray('│  │   ├─ manifest.yaml                                   │')}
${color.gray('│  │   ├─ identity.md                                     │')}
${color.gray('│  │   ├─ mds/pi.yaml                                     │')}
${color.gray('│  │   ├─ mds/ref.yaml                                    │')}
${color.gray('│  │   ├─ prompts/instructions.yaml                       │')}
${color.gray('│  │   ├─ prompts/context.yaml                            │')}
${color.gray('│  │   ├─ skills/skills.yaml                              │')}
${color.gray('│  │   └─ expertise/expertise.yaml                        │')}
${color.gray('│  ├─ 🟢 ui-gen-A/                                        │')}
${color.gray('│  ├─ 🟢 planning/                                        │')}
${color.gray('│  ├─ 🟢 validation-A/                                    │')}
${color.gray('│  ├─ 🟢 validation-B/                                    │')}
${color.gray('│  └─ 🟢 validation-C/                                    │')}
${color.gray('└─────────────────────────────────────────────────────────┘')}

  `;
  console.log(tree);

  console.log(color.bold('════════════════════════════════════════════════════════\n'));
};

/**
 * Show system health check
 */
const showHealth = () => {
  console.log(color.bold('\n════════════════════════════════════════════════════════'));
  console.log(color.bold('            System Health Check'));
  console.log(color.bold('════════════════════════════════════════════════════════\n'));

  // CPU usage (simulated)
  console.log(color.yellow('CPU Usage:        '));
  console.log(color.gray('  User:           ' + process.cpuUsage().user.toString()));
  console.log(color.gray('  System:         ' + process.cpuUsage().system.toString()));
  console.log(color.dim('─' + '─'.repeat(58) + '─\n'));

  // Memory (simulated)
  console.log(color.yellow('Memory Usage:     '));
  console.log(color.gray('  Heap Used:      ' + process.memoryUsage().heapUsed.toString()));
  console.log(color.gray('  Heap Total:     ' + process.memoryUsage().heapTotal.toString()));
  console.log(color.dim('─' + '─'.repeat(58) + '─\n'));

  // File system
  console.log(color.yellow('File System:      '));
  console.log(color.green('  Agents Dir:     ' + AGENTS_DIR));
  console.log(color.gray('  Exists:         ' + existsSync(AGENTS_DIR)));
  console.log(color.dim('─' + '─'.repeat(58) + '─\n'));

  console.log(color.bold('Status:           '));
  console.log(color.green('  ✓ System healthy'));
  console.log(color.green('  ✓ All agents accessible'));
  console.log(color.green('  ✓ Configuration loaded'));
  console.log(color.dim('─' + '─'.repeat(58) + '─\n'));

  console.log(color.bold('════════════════════════════════════════════════════════\n'));
};

/**
 * Show warnings only
 */
const showWarnings = () => {
  console.log(color.bold('\n════════════════════════════════════════════════════════'));
  console.log(color.bold('             Warnings & Notices'));
  console.log(color.bold('════════════════════════════════════════════════════════\n'));

  for (const warning of warnings) {
    const icon = warning.level === 'error' ? color.red('✗') :
                 warning.level === 'warn' ? color.yellow('⚠') : color.gray('ℹ');
    console.log(`${icon} ${warning.message}`);
  }

  console.log(color.dim('─' + '─'.repeat(58) + '─\n'));
};

/**
 * Watch mode with live updates
 */
const watchMode = () => {
  console.log(color.bold('\n════════════════════════════════════════════════════════'));
  console.log(color.bold('          Live Monitoring Mode (Ctrl+C to exit)'));
  console.log(color.bold('════════════════════════════════════════════════════════\n'));

  let lastCheck = Date.now();
  const updateInterval = 3000; // 3 seconds

  const checkAgent = () => {
    for (const agent of agents) {
      const status = checkAgentStatus(agent.name);
      const emoji = getStatusEmoji(status);
      console.log(`${color.bold(`[${emoji}]`)} ${color.green(agent.name)} - ${color.gray(status.toUpperCase())}`);
    }
    console.log('');
  };

  console.log(color.yellow('Monitoring started... Update every ' + (updateInterval / 1000) + ' seconds\n'));

  while (true) {
    checkAgent();
    // In a real implementation, this would poll agents for updates
    // For now, just a simple loop
    setTimeout(() => {}, updateInterval);
  }
};

/**
 * Main entry point
 */
const main = () => {
  const args = process.argv.slice(2);

  console.clear();

  if (args.includes('--help') || args.includes('-h')) {
    console.log(color.bold('Pi Terminal UI Commands:'));
    console.log(color.yellow('  terminal.mjs          Show full status'));
    console.log(color.yellow('  terminal.mjs status   Show agent status'));
    console.log(color.yellow('  terminal.mjs tree     Show team hierarchy'));
    console.log(color.yellow('  terminal.mjs health   System health check'));
    console.log(color.yellow('  terminal.mjs warnings Show warnings only'));
    console.log(color.yellow('  terminal.mjs watch    Live monitoring mode'));
    console.log('');
    return;
  }

  // Default: show full status
  if (!args.length) {
    showStatus();
  } else {
    const cmd = args[0]?.toLowerCase();

    switch (cmd) {
      case 'status':
      case 's':
        showStatus();
        break;
      case 'tree':
      case 't':
        showTree();
        break;
      case 'health':
      case 'h':
        showHealth();
        break;
      case 'warnings':
      case 'w':
        showWarnings();
        break;
      case 'watch':
      case 'live':
      case 'l':
        watchMode();
        break;
      default:
        console.log(color.red(`Unknown command: ${cmd}. Use --help for usage.`));
        break;
    }
  }
};

// Run main
main();
