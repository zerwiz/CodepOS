#!/usr/bin/env bun
/**
 * CodepOS Terminal UI - pi-subagents style
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = process.cwd();
const THEMES_DIR = join(ROOT_DIR, '.pi', 'themes');
const STATE_DIR = join(ROOT_DIR, '.pi', 'state');

const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const SPINNER_FRAMES = 10;

const TOOL_DISPLAY = {
  read: 'reading', bash: 'running command', edit: 'editing',
  write: 'writing', grep: 'searching', find: 'finding files', ls: 'listing'
};

const loadTheme = () => {
  const path = join(THEMES_DIR, 'catppuccin-mocha.json');
  if (!existsSync(path)) return defaultTheme;
  try { return JSON.parse(readFileSync(path, 'utf-8')); } catch { return defaultTheme; }
};

const defaultTheme = {
  name: 'default', vars: {
    bg: '#1e1e2e', fg: '#cdd6f4', accent: '#cba6f7', success: '#a6e3a1',
    error: '#f38ba8', warning: '#f9e2af', muted: '#6c7086', dim: '#6c7086',
    cyan: '#94e2d5', blue: '#89b4fa', purple: '#cba6f7', pink: '#f5c2e7',
    comment: '#6c7086', green: '#a6e3a1', red: '#f38ba8', yellow: '#f9e2af'
  }
};

const resolveColor = (theme, name) => {
  const map = { muted: 'comment', dim: 'comment', dimmed: 'comment', text: 'fg' };
  return theme.vars?.[map[name] || name] || '#6c7086';
};

const c = (theme, name) => (text) => {
  const hex = resolveColor(theme, name);
  return `\x1b[38;2;${parseInt(hex.slice(1,3),16)};${parseInt(hex.slice(3,5),16)};${parseInt(hex.slice(5,7),16)}m${text}\x1b[0m`;
};

const bold = t => `\x1b[1m${t}\x1b[0m`;
const truncate = (s, n) => s.length > n ? s.slice(0, n-1) + '…' : s;

const formatTokens = c => c >= 1e6 ? `${(c/1e6).toFixed(1)}M token` : c >= 1e3 ? `${(c/1e3).toFixed(1)}k token` : `${c} token`;
const formatMs = ms => `${(ms/1000).toFixed(1)}s`;
const formatTurns = (c, m) => m != null ? `⟳${c}≤${m}` : `⟳${c}`;

const describeActivity = a => {
  if (!a) return 'thinking…';
  if (a.tools && a.tools.length > 0) {
    const g = {};
    for (const t of a.tools) g[TOOL_DISPLAY[t] || t] = (g[TOOL_DISPLAY[t] || t] || 0) + 1;
    return Object.entries(g).map(([k,v]) => v > 1 ? `${k} ${v} files` : k).join(', ') + '…';
  }
  return a.text || 'thinking…';
};

const COMPONENTS = {
  scanners: [
    { name: 'scout', role: 'Structure check' },
    { name: 'sentinel', role: 'Security scan' },
    { name: 'mapper', role: 'Architecture view' },
    { name: 'librarian', role: 'Docs index' },
    { name: 'indexer', role: 'Deep index' }
  ],
  council: [
    { name: 'planning', role: 'Task planning' },
    { name: 'dokumenter', role: 'Documentation' }
  ],
  teams: [
    { name: 'main', role: 'Full pipeline' },
    { name: 'security', role: 'Security analysis' }
  ]
};

const getComponentState = name => {
  const f = join(STATE_DIR, `${name}-activity.json`);
  let s = { status: 'idle', startedAt: null, completedAt: null, toolUses: 0, tokens: 0, activity: null, error: null };
  if (existsSync(f)) try { s = { ...s, ...JSON.parse(readFileSync(f, 'utf-8')) }; } catch {}
  return s;
};

const exists = (type, name) => {
  const typeMap = { scanners: 'scanner', council: 'council', teams: 'team' };
  const baseType = typeMap[type] || type;
  const paths = {
    scanner: join(ROOT_DIR, '.pi', 'multi-team', 'scanners', name),
    council: join(ROOT_DIR, '.pi', 'multi-team', 'council', name),
    team: join(ROOT_DIR, '.pi', 'multi-team', 'teams', name)
  };
  const p = paths[baseType];
  if (!p) return false;
  if (existsSync(p)) {
    try { return statSync(p).isDirectory(); } catch { return true; }
  }
  return existsSync(p + '.mjs');
};

const getComponents = () => {
  const r = { scanners: [], council: [], teams: [] };
  for (const [type, items] of Object.entries(COMPONENTS)) {
    for (const item of items) {
      if (exists(type, item.name)) r[type].push({ ...item, type, ...getComponentState(item.name) });
    }
  }
  return r;
};

let frame = 0;

const render = (theme, cmd = 'status') => {
  const fg = n => c(theme, n);
  const comps = getComponents();
  const all = [...comps.scanners, ...comps.council, ...comps.teams].filter(c => c.status === 'running');
  const spinner = SPINNER[frame % SPINNER_FRAMES];
  const icon = all.length > 0 ? '●' : '○';
  const color = all.length > 0 ? 'accent' : 'dim';
  
  console.log('');
  console.log(` ${fg(color)(icon)} ${bold('CodepOS')}`);
  
  if (cmd === 'tree') renderTree(theme, comps, spinner, fg, bold);
  else renderStatus(theme, comps, spinner, fg, bold);
  
  console.log('');
};

const renderStatus = (theme, comps, spinner, fg, bold) => {
  const renderSection = (label, items) => {
    console.log(`\n ${fg('purple')(label)}`);
    if (items.length === 0) { console.log(` ${fg('comment')('  (none)')}`); return; }
    items.forEach((item, i) => {
      const conn = i === items.length - 1 ? ' └─' : ' ├─';
      renderItem(item, conn, spinner, fg, bold);
    });
  };
  renderSection('Scanners', comps.scanners);
  renderSection('Council', comps.council);
  renderSection('Teams', comps.teams);
};

const renderItem = (item, conn, spinner, fg, bold) => {
  if (item.status === 'running') {
    const dur = item.startedAt ? formatMs(Date.now() - item.startedAt) : '0.0s';
    const parts = [];
    if (item.toolUses) parts.push(`${item.toolUses} tool use${item.toolUses===1?'':'s'}`);
    if (item.tokens) parts.push(formatTokens(item.tokens));
    parts.push(dur);
    const activity = describeActivity(item.activity);
    console.log(`${fg('comment')(conn)} ${fg('accent')(spinner)} ${bold(item.name)}  ${fg('comment')(item.role)} ${fg('comment')('·')} ${fg('fg')(parts.join(' · '))}`);
    console.log(`${fg('comment')('    ')} ${fg('comment')('  ⎿  ' + activity)}`);
  } else if (item.status === 'completed') {
    const dur = item.startedAt && item.completedAt ? formatMs(item.completedAt - item.startedAt) : '0.0s';
    const parts = item.toolUses ? [`${item.toolUses} tool use${item.toolUses===1?'':'s'}`, dur] : [dur];
    console.log(`${fg('comment')(conn)} ${fg('green')('✓')} ${fg('dim')(item.name)} ${fg('comment')('·')} ${fg('comment')(item.role)} ${fg('comment')('·')} ${fg('comment')(parts.join(' · '))}`);
  } else if (item.status === 'error') {
    const err = item.error ? `: ${truncate(item.error, 40)}` : '';
    console.log(`${fg('comment')(conn)} ${fg('error')('✗')} ${fg('dim')(item.name)} ${fg('comment')('·')} ${fg('error')('error' + err)}`);
  } else {
    console.log(`${fg('comment')(conn)} ${fg('comment')('○')} ${fg('dim')(item.name)} ${fg('comment')('·')} ${fg('comment')(item.role)}`);
  }
};

const renderTree = (theme, comps, spinner, fg, bold) => {
  console.log(`\n ${fg('accent')('●')} ${bold('CodepOS')}`);
  const branch = (label, items, indent = ' │  ') => {
    console.log(` ${fg('comment')('├─')} ${fg('purple')(label)}`);
    items.forEach((item, i) => {
      const conn = i === items.length - 1 ? ' └─' : ' ├─';
      const sub = i === items.length - 1 ? '    ' : indent;
      if (item.status === 'running') {
        console.log(` ${fg('comment')('│  ')}${fg('comment')(conn)} ${fg('accent')(spinner)} ${bold(item.name)}`);
        console.log(` ${fg('comment')('│  ')}${fg('comment')(sub)}${fg('comment')('  ⎿  ' + describeActivity(item.activity))}`);
      } else if (item.status === 'completed') {
        console.log(` ${fg('comment')('│  ')}${fg('comment')(conn)} ${fg('green')('✓')} ${fg('dim')(item.name)}`);
      } else if (item.status === 'error') {
        console.log(` ${fg('comment')('│  ')}${fg('comment')(conn)} ${fg('error')('✗')} ${fg('dim')(item.name)}`);
      } else {
        console.log(` ${fg('comment')('│  ')}${fg('comment')(conn)} ${fg('dim')(item.name)}`);
      }
    });
  };
  branch('Scanners', comps.scanners);
  branch('Council', comps.council);
  branch('Teams', comps.teams);
};

const showHelp = theme => {
  const fg = n => c(theme, n);
  const b = t => `\x1b[1m${t}\x1b[0m`;
  console.log(`
 ${b('CodepOS Terminal UI')}

 ${b('Usage:')} bun run terminal.mjs [command]

 ${b('Commands:')}
   ${fg('accent')('status')}  - Show component status (default)
   ${fg('accent')('tree')}    - Show tree view
   ${fg('accent')('watch')}   - Live monitoring mode
   ${fg('accent')('help')}    - Show this help

 ${b('Status Icons:')}
   ${fg('accent')('●')} Running   ${fg('comment')('○')} Idle   ${fg('green')('✓')} Completed   ${fg('error')('✗')} Error
`);
};

const watchMode = (theme, cmd = 'status') => {
  console.clear();
  let tick = 0;
  const i = setInterval(() => {
    process.stdout.write('\x1b[H');
    frame = tick;
    render(theme, cmd);
    tick++;
  }, 150);
  process.on('SIGINT', () => { clearInterval(i); console.log('\n'); process.exit(0); });
};

const main = () => {
  const args = process.argv.slice(2);
  const cmd = args[0] || 'status';
  const theme = loadTheme();
  if (cmd === 'help' || args.includes('-h')) { showHelp(theme); return; }
  if (cmd === 'watch') watchMode(theme, args[1] || 'status');
  else { console.clear(); render(theme, cmd); }
};

main();