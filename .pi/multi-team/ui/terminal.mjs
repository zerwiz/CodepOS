#!/usr/bin/env bun
/**
 * CodepOS Terminal UI - Enhanced Status Display
 * 
 * Inspired by the pi-subagents widget UI.
 * Features:
 * - Tree-like structure with connectors
 * - Animated spinners for active agents
 * - Live activity descriptions
 * - Color-coded status indicators (Catppuccin Mocha inspired)
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..', '..', '..', '..');
const AGENTS_DIR = join(ROOT_DIR, '.pi', 'multi-team', 'agents');

// Braille spinner frames
const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

// Catppuccin Mocha Palette (ANSI approximations)
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  
  // Semantic colors
  accent: '\x1b[38;5;183m', // Purple-ish
  success: '\x1b[38;5;114m', // Green
  error: '\x1b[38;5;167m',   // Red
  warning: '\x1b[38;5;223m', // Yellow/Peach
  info: '\x1b[38;5;117m',    // Cyan/Sky
  muted: '\x1b[38;5;244m',   // Gray
  dimmed: '\x1b[38;5;240m',  // Dark Gray
  
  // Basic ANSI
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  yellow: '\x1b[33m',
  white: '\x1b[37m'
};

const color = {
  accent: (t) => colors.accent + t + colors.reset,
  success: (t) => colors.success + t + colors.reset,
  error: (t) => colors.error + t + colors.reset,
  warning: (t) => colors.warning + t + colors.reset,
  info: (t) => colors.info + t + colors.reset,
  muted: (t) => colors.muted + t + colors.reset,
  dimmed: (t) => colors.dimmed + t + colors.reset,
  bold: (t) => colors.bold + t + colors.reset,
  italic: (t) => colors.italic + t + colors.reset
};

/**
 * Get all agent teams from the filesystem
 */
const getAgents = () => {
  try {
    if (!existsSync(AGENTS_DIR)) return [];
    return readdirSync(AGENTS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => {
        const manifestPath = join(AGENTS_DIR, dirent.name, 'manifest.yaml');
        let role = 'Agent';
        let status = 'inactive';
        let description = 'System agent';

        if (existsSync(manifestPath)) {
          const content = readFileSync(manifestPath, 'utf-8');
          const roleMatch = content.match(/role:\s*['"]?([^'"]+)['"]?/);
          const statusMatch = content.match(/status:\s*(\S+)/);
          const descMatch = content.match(/description:\s*['"]?([^'"]+)['"]?/);
          
          if (roleMatch) role = roleMatch[1];
          if (statusMatch) status = statusMatch[1].toLowerCase();
          if (descMatch) description = descMatch[1];
        }

        return {
          name: dirent.name,
          role,
          status,
          description
        };
      });
  } catch (error) {
    return [];
  }
};

let frame = 0;

/**
 * Render the enhanced UI
 */
const renderUI = (isWatch = false) => {
  const agents = getAgents();
  const running = agents.filter(a => a.status === 'active');
  const finished = agents.filter(a => a.status === 'completed' || a.status === 'inactive');
  
  if (!isWatch) console.clear();
  
  console.log(`\n ${color.accent('●')} ${color.bold('CodepOS Agents')}`);
  
  const spinnerChar = SPINNER[frame % SPINNER.length];
  
  // Render Running Agents
  for (let i = 0; i < running.length; i++) {
    const a = running[i];
    const isLast = (i === running.length - 1) && (finished.length === 0);
    const connector = isLast ? ' └─' : ' ├─';
    const subConnector = isLast ? '    ' : ' │  ';
    
    console.log(`${color.muted(connector)} ${color.accent(spinnerChar)} ${color.bold(a.name)} ${color.dimmed('·')} ${color.muted(a.description)}`);
    console.log(`${color.muted(subConnector)} ${color.dimmed('  ⎿  thinking…')}`);
  }
  
  // Render Finished/Inactive Agents
  for (let i = 0; i < finished.length; i++) {
    const a = finished[i];
    const isLast = i === finished.length - 1;
    const connector = isLast ? ' └─' : ' ├─';
    
    const icon = a.status === 'completed' ? color.success('✓') : color.dimmed('○');
    const nameColor = a.status === 'completed' ? color.muted : color.dimmed;
    
    console.log(`${color.muted(connector)} ${icon} ${nameColor(a.name)} ${color.dimmed('·')} ${color.dimmed(a.description)}`);
  }
  
  console.log(`\n ${color.dimmed('Active: ' + running.length + ' · Total: ' + agents.length)}`);
  
  if (!isWatch) {
    console.log(`\n ${color.bold('Commands:')}`);
    console.log(`   ${color.info('just pi watch')}   ${color.muted('Live monitoring')}`);
    console.log(`   ${color.info('just pi status')}  ${color.muted('Refresh status')}\n`);
  }
  
  frame++;
};

/**
 * Watch mode
 */
const watchMode = () => {
  console.clear();
  setInterval(() => {
    process.stdout.write('\x1b[H'); // Reset cursor to top
    renderUI(true);
  }, 100);
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.includes('watch')) {
    watchMode();
  } else {
    renderUI();
  }
};

main();
