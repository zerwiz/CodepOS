#!/usr/bin/env bun
/**
 * Scout Agent - Intelligence Gathering
 * Explores codebase and delivers findings to team leaders
 */

import { readdir, stat, readFile } from 'fs/promises';
import { join, relative } from 'path';

const CONFIG = {
  exclude: ['node_modules', '.git', 'dist', 'build', 'coverage', '*.log', '.next'],
  maxDepth: 4
};

async function* walkDir(dir, depth = 0) {
  if (depth > CONFIG.maxDepth) return;
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (CONFIG.exclude.some(p => entry.name.includes(p))) continue;
      const fullPath = join(dir, entry.name);
      yield { path: fullPath, entry };
      if (entry.isDirectory()) {
        yield* walkDir(fullPath, depth + 1);
      }
    }
  } catch {}
}

async function search(pattern, cwd) {
  const results = [];
  const regex = new RegExp(pattern, 'i');
  for await (const { path: filePath, entry } of walkDir(cwd)) {
    if (!entry.isDirectory() && entry.name.match(regex)) {
      results.push(relative(cwd, filePath));
    }
  }
  return results;
}

async function findDocs(cwd) {
  const docs = [];
  for await (const { path: filePath, entry } of walkDir(cwd)) {
    if (!entry.isDirectory() && /\.(md|txt|rst)$/.test(entry.name)) {
      docs.push({ name: entry.name, path: relative(cwd, filePath) });
      if (docs.length >= 30) break;
    }
  }
  return docs;
}

async function analyzeStructure(cwd) {
  const structure = { dirs: [], files: 0, types: {} };
  for await (const { entry } of walkDir(cwd)) {
    if (entry.isDirectory()) {
      structure.dirs.push(entry.name);
    } else {
      structure.files++;
      const ext = extname(entry.name);
      structure.types[ext] = (structure.types[ext] || 0) + 1;
    }
  }
  return structure;
}

function extname(file) {
  const m = file.match(/\.[^.]+$/);
  return m ? m[0] : 'none';
}

const args = process.argv.slice(2);
const command = args[0] || 'report';
const query = args[1] || '*';
const cwd = process.cwd();

console.log(`\n🔍 Scout Agent - Intelligence Gathering\n${'─'.repeat(40)}`);

let result;

switch (command) {
  case 'search':
    console.log(`Searching for: ${query}`);
    result = await search(query, cwd);
    console.log(`\n📦 Found ${result.length} matches:\n`);
    result.forEach(r => console.log(`  • ${r}`));
    break;
    
  case 'docs':
    console.log('Finding documentation...');
    result = await findDocs(cwd);
    console.log(`\n📄 Found ${result.length} documentation files:\n`);
    result.forEach(d => console.log(`  • ${d.name} → ${d.path}`));
    break;
    
  case 'structure':
    console.log('Analyzing project structure...');
    result = await analyzeStructure(cwd);
    console.log('\n🏗️ Project Structure:');
    console.log(`  Directories: ${result.dirs.length}`);
    console.log(`  Files: ${result.files}`);
    console.log('  File types:', result.types);
    break;
    
  case 'report':
  default:
    console.log('Generating full intelligence report...\n');
    const [docs, structure, searchResults] = await Promise.all([
      findDocs(cwd),
      analyzeStructure(cwd),
      search('\\.(ts|tsx|js|jsx)$', cwd)
    ]);
    console.log(`📊 INTELLIGENCE REPORT - ${new Date().toISOString()}`);
    console.log('─'.repeat(40));
    console.log(`📁 Project: ${cwd.split('/').pop()}`);
    console.log(`📄 Documentation: ${docs.length} files`);
    console.log(`🏗️ Structure: ${structure.files} files, ${Object.keys(structure.types).length} types`);
    console.log(`🔍 Code files: ${searchResults.length}`);
    console.log('\n✅ Scout mission complete. Ready to deliver to team leader.');
}

process.exit(0);