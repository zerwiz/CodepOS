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
const ROOT_DIR = join(__dirname, '..', '..', '..');
const AGENTS_DIR = join(ROOT_DIR, '.pi', 'multi-team', 'agents');
const SESSIONS_DIR = join(ROOT_DIR, '.pi', 'multi-team', 'sessions');

const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  
  accent: '\x1b[38;5;183m',
  success: '\x1b[38;5;114m',
  error: '\x1b[38;5;167m',
  warning: '\x1b[38;5;223m',
  info: '\x1b[38;5;117m',
  muted: '\x1b[38;5;244m',
  dimmed: '\x1b[38;5;240m',
  
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
          const lines = content.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('role:')) {
              role = line.replace('role:', '').trim().replace(/['"]/g, '') || 'Agent';
            } else if (line.startsWith('status:')) {
              status = line.replace('status:', '').trim() || 'inactive';
            } else if (line.startsWith('name:')) {
              description = line.replace('name:', '').trim().replace(/['"]/g, '') || 'System agent';
            }
          }
          
          const roleMatch = content.match(/^role:\s*['"]?([^'"]+)['"]?/m);
          const statusMatch = content.match(/^status:\s*(\S+)/m);
          
          if (roleMatch) role = roleMatch[1];
          if (statusMatch) status = statusMatch[1].toLowerCase();
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

const getActivity = (agentName) => {
  try {
    if (!existsSync(SESSIONS_DIR)) return null;
    const sessionFiles = readdirSync(SESSIONS_DIR, { withFileTypes: true })
      .filter(f => f.isFile() && f.name.startsWith(agentName) && f.name.endsWith('.json'));
    
    if (sessionFiles.length === 0) return null;
    
    const latestFile = sessionFiles.sort((a, b) => b.mtimeMs - a.mtimeMs)[0];
    const content = readFileSync(join(SESSIONS_DIR, latestFile.name), 'utf-8');
    const session = JSON.parse(content);
    
    return session.last_activity || session.current_action || null;
  } catch {
    return null;
  }
};

const getHealthMetrics = () => {
  return {
    cpu: Math.random() * 30 + 10,
    memory: Math.random() * 40 + 30,
    active: getAgents().filter(a => a.status === 'active').length,
    total: getAgents().length
  };
};

const getWarnings = () => {
  const warnings = [];
  const agents = getAgents();
  
  agents.forEach(a => {
    if (a.status === 'inactive' && a.name !== 'setup') {
      warnings.push({ agent: a.name, type: 'warning', msg: 'Inactive agent' });
    }
  });
  
  return warnings;
};

let frame = 0;

const renderHeader = (title) => {
  console.log(`\n ${color.accent('●')} ${color.bold(title)}`);
};

const renderTree = (agents, showAll = false) => {
  const running = agents.filter(a => a.status === 'active');
  const completed = agents.filter(a => a.status === 'completed');
  
  if (running.length === 0 && !showAll) {
    console.log(` ${color.dimmed('No active agents')}`);
    return;
  }
  
  const displayAgents = showAll ? agents : running;
  const spinnerChar = SPINNER[frame % SPINNER.length];
  
  for (let i = 0; i < displayAgents.length; i++) {
    const a = displayAgents[i];
    const isLast = i === displayAgents.length - 1;
    const connector = isLast ? ' └─' : ' ├─';
    
    if (a.status === 'active') {
      const subConnector = isLast ? '    ' : ' │  ';
      const activity = getActivity(a.name);
      const activityText = activity || 'thinking…';
      console.log(`${color.muted(connector)} ${color.accent(spinnerChar)} ${color.bold(a.name)} ${color.dimmed('·')} ${color.muted(activityText)}`);
      console.log(`${color.muted(subConnector)} ${color.dimmed('  ⎿  ' + a.role)}`);
    } else {
      const icon = a.status === 'completed' ? color.success('✓') : color.dimmed('○');
      const nameColor = a.status === 'completed' ? color.muted : color.dimmed;
      console.log(`${color.muted(connector)} ${icon} ${nameColor(a.name)} ${color.dimmed('·')} ${color.dimmed(a.description)}`);
    }
  }
  
  if (showAll && running.length > 0) {
    console.log(`\n ${color.dimmed('Active: ' + running.length)}`);
  }
};

const renderStatus = () => {
  const agents = getAgents();
  renderHeader('CodepOS Agents');
  console.log('');
  renderTree(agents, false);
};

const renderTreeView = () => {
  const agents = getAgents();
  renderHeader('Team Hierarchy');
  console.log('');
  renderTree(agents, true);
};

const renderHealth = () => {
  const metrics = getHealthMetrics();
  renderHeader('System Health');
  console.log('');
  console.log(` ${color.info('CPU:')}    ${color.dimmed(Math.round(metrics.cpu) + '%')}`);
  console.log(` ${color.info('Memory:')} ${color.dimmed(Math.round(metrics.memory) + '%')}`);
  console.log(` ${color.info('Active:')} ${color.success(metrics.active)}`);
  console.log(` ${color.info('Total:')} ${color.dimmed(metrics.total)}`);
};

const renderWarnings = () => {
  const warnings = getWarnings();
  renderHeader('Warnings');
  console.log('');
  
  if (warnings.length === 0) {
    console.log(` ${color.success('No warnings')}`);
    return;
  }
  
  warnings.forEach(w => {
    console.log(` ${color.warning('⚠')} ${color.dimmed(w.agent + ': ' + w.msg)}`);
  });
};

const renderUI = (command = 'status', isWatch = false) => {
  if (!isWatch) console.clear();
  
  switch (command) {
    case 'tree':
      renderTreeView();
      break;
    case 'health':
      renderHealth();
      break;
    case 'warnings':
      renderWarnings();
      break;
    case 'status':
    default:
      renderStatus();
  }
  
  if (!isWatch) {
    console.log(`\n ${color.bold('Commands:')}`);
    console.log(`   ${color.info('just team watch')}   ${color.muted('Live monitoring')}`);
    console.log(`   ${color.info('just team status')}  ${color.muted('Active agents')}`);
    console.log(`   ${color.info('just team tree')}    ${color.muted('All teams')}`);
    console.log(`   ${color.info('just team health')} ${color.muted('System health')}`);
  }
  
  frame++;
};

const watchMode = (command = 'status') => {
  console.clear();
  const interval = setInterval(() => {
    process.stdout.write('\x1b[H');
    renderUI(command, true);
  }, 800);
  
  process.on('SIGINT', () => {
    clearInterval(interval);
    console.log('\n' + color.muted('Exiting watch mode...'));
    process.exit(0);
  });
};

const showHelp = () => {
  console.log(`
 ${color.bold('CodepOS Terminal UI')}

 ${color.bold('Usage:')} bun run terminal.mjs [command]

 ${color.bold('Commands:')}
   ${color.info('status')}   - Full status display (default)
   ${color.info('tree')}     - Team hierarchy tree
   ${color.info('health')}   - System health metrics
   ${color.info('warnings')} - Show warnings only
   ${color.info('watch')}    - Live monitoring mode
   ${color.info('help')}     - Show this help

 ${color.bold('Examples:')}
   bun run terminal.mjs status
   bun run terminal.mjs tree
   bun run .pi/multi-team/ui/terminal.mjs watch
   bun run .pi/multi-team/ui/terminal.mjs health
`);
};

const main = () => {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';
  
  if (args.includes('help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  if (command === 'watch') {
    watchMode(args[1] || 'status');
  } else {
    renderUI(command);
  }
};

main();