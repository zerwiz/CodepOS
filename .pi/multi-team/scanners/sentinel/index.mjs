#!/usr/bin/env bun
/**
 * Sentinel Agent - Security Scanner
 * Scans for security issues and vulnerabilities
 */

import { readdir, stat, readFile } from 'fs/promises';
import { join, relative } from 'path';

const PATTERNS = {
  secrets: /(api_key|secret|password|token|auth|bearer)\s*[:=]\s*['"][^'"]+['"]/gi,
  hardcoded: /hardcoded|HARDCODED|password\s*=\s*['"][^'"]+['"]/gi,
  sql: /SELECT|INSERT|UPDATE|DELETE.*WHERE|exec\(|eval\(/gi,
  dangerous: /dangerouslySetInnerHTML|innerHTML\s*=/gi
};

const EXCLUDE = ['node_modules', '.git', 'dist', 'build'];

async function* walkDir(dir, depth = 0) {
  if (depth > 3) return;
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (EXCLUDE.some(e => entry.name.includes(e))) continue;
      const fullPath = join(dir, entry.name);
      yield { path: fullPath, entry };
      if (entry.isDirectory()) yield* walkDir(fullPath, depth + 1);
    }
  } catch {}
}

async function scanFile(filePath) {
  const issues = [];
  try {
    const content = await readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, i) => {
      for (const [type, pattern] of Object.entries(PATTERNS)) {
        if (line.match(pattern)) {
          issues.push({ type, line: i + 1, text: line.trim().slice(0, 80) });
        }
      }
    });
  } catch {}
  return issues;
}

const cwd = process.cwd();
console.log(`\n🛡️ Sentinel Agent - Security Scanner\n${'─'.repeat(40)}`);

const allIssues = [];
let filesScanned = 0;

for await (const { path: filePath, entry } of walkDir(cwd)) {
  if (entry.isDirectory()) continue;
  if (/\.(ts|tsx|js|jsx|mjs|py|sh)$/.test(entry.name)) {
    filesScanned++;
    const issues = await scanFile(filePath);
    if (issues.length > 0) {
      allIssues.push({ file: relative(cwd, filePath), issues });
    }
  }
}

console.log(`📁 Scanned: ${filesScanned} files`);
console.log(`⚠️  Issues found: ${allIssues.reduce((a, f) => a + f.issues.length, 0)}`);

if (allIssues.length > 0) {
  console.log('\n🚨 Security Report:\n');
  allIssues.slice(0, 20).forEach(({ file, issues }) => {
    console.log(`  📄 ${file}`);
    issues.slice(0, 3).forEach(i => console.log(`     Line ${i.line}: [${i.type}]`));
  });
} else {
  console.log('\n✅ No security issues detected!');
}

process.exit(0);