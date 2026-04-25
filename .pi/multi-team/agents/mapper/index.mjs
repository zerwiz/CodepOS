#!/usr/bin/env bun
/**
 * Mapper Agent - Architecture Mapper
 * Creates visual maps of project architecture
 */

import { readdir } from 'fs/promises';
import { join } from 'path';

const EXCLUDE = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage'];

async function buildTree(dir, depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return { name: '...', type: 'truncated' };
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const filtered = entries.filter(e => !EXCLUDE.some(x => e.name.includes(x)));
    const sorted = filtered.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });
    
    const children = {};
    for (const entry of sorted) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        children[entry.name + '/'] = await buildTree(path, depth + 1, maxDepth);
      } else {
        const ext = entry.name.match(/\.([^.]+)$/)?.[1] || '';
        children[entry.name] = { type: ext, size: 'file' };
      }
    }
    return children;
  } catch {
    return { name: 'error', type: 'error' };
  }
}

function printTree(tree, prefix = '', isLast = true) {
  const lines = [];
  const connector = isLast ? '└── ' : '├── ';
  
  if (typeof tree === 'object' && !Array.isArray(tree)) {
    for (const [name, value] of Object.entries(tree)) {
      if (name === 'type' || name === 'size') continue;
      const isLastEntry = Object.keys(tree).length === 1 || 
        Object.keys(tree).indexOf(name) === Object.keys(tree).length - 1;
      lines.push(prefix + (name === Object.keys(tree)[0] ? '' : prefix.slice(0, -4)) + connector + name);
      
      if (typeof value === 'object' && value !== null) {
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        lines.push(...printTree(value, newPrefix, isLastEntry));
      }
    }
  }
  return lines;
}

const cwd = process.cwd();
const projectName = cwd.split('/').pop();

console.log(`\n🗺️ Mapper Agent - Architecture Mapper\n${'─'.repeat(40)}`);
console.log(`📁 Project: ${projectName}\n`);

const tree = await buildTree(cwd, 0, 3);
console.log(`${projectName}/`);
console.log(printTree(tree).join('\n'));

process.exit(0);