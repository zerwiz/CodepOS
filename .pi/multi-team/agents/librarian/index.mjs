#!/usr/bin/env bun
/**
 * Librarian Agent - Documentation Indexer
 * Indexes and searches project documentation
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, extname } from 'path';

const EXCLUDE = ['node_modules', '.git', 'node_modules'];

async function* walkDocs(dir, depth = 0) {
  if (depth > 4) return;
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (EXCLUDE.some(e => entry.name.includes(e))) continue;
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        yield { type: 'dir', name: entry.name, path: fullPath };
        yield* walkDocs(fullPath, depth + 1);
      } else if (/\.(md|txt|rst|json|yaml|yml)$/.test(entry.name)) {
        yield { type: 'file', name: entry.name, path: fullPath };
      }
    }
  } catch {}
}

async function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : 'Untitled';
}

async function indexDocs(cwd) {
  const index = [];
  for await (const doc of walkDocs(cwd)) {
    if (doc.type === 'file') {
      try {
        const content = await readFile(doc.path, 'utf-8');
        const title = await extractTitle(content);
        const s = await stat(doc.path);
        index.push({
          name: doc.name,
          path: doc.path.replace(cwd + '/', ''),
          title,
          size: s.size,
          lines: content.split('\n').length
        });
      } catch {}
    }
  }
  return index;
}

const cwd = process.cwd();
const args = process.argv.slice(2);
const action = args[0] || 'index';

console.log(`\n📚 Librarian Agent - Documentation Indexer\n${'─'.repeat(40)}`);

const docs = await indexDocs(cwd);
docs.sort((a, b) => a.path.localeCompare(b.path));

console.log(`Found ${docs.length} documentation files:\n`);

docs.forEach(doc => {
  const size = doc.size > 1024 ? `${(doc.size/1024).toFixed(1)}KB` : `${doc.size}B`;
  console.log(`📄 ${doc.path}`);
  console.log(`   └─ "${doc.title}" [${size}, ${doc.lines} lines]`);
});

console.log(`\n✅ Indexed ${docs.length} documents`);

process.exit(0);