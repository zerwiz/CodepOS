#!/usr/bin/env bun
/**
 * Dokumenter Agent - LLM-powered documentation generator
 */

import { spawn, execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';

const OUTPUT_DIR = ".pi/state/docs-generated";

function runLLM(prompt) {
  return new Promise((resolve, reject) => {
    const proc = spawn('pi', ['-p', prompt], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });
    
    let output = '';
    proc.stdout.on('data', (data) => { output += data.toString(); });
    proc.stderr.on('data', (data) => { output += data.toString(); });
    
    proc.on('close', (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(output));
    });
  });
}

function runCommand(cmd) {
  try {
    return execSync(cmd, { encoding: "utf-8" });
  } catch {
    return "";
  }
}

async function main() {
  const args = process.argv.slice(2);
  const target = args[0] || 'README';
  
  console.log("\n📚 Dokumenter Agent\n" + "─".repeat(40));
  console.log(`Generating documentation for: ${target}\n`);
  
  let codeContext = "";
  
  if (target === 'README') {
    const indexExists = existsSync(".pi/state/codebase-index.json");
    if (indexExists) {
      try {
        const index = JSON.parse(readFileSync(".pi/state/codebase-index.json", "utf-8"));
        codeContext = `Project structure:\n${index.analysis}\n`;
        
        const files = index.tree.slice(0, 50).map(f => `${f.type === "dir" ? "📁" : "📄"} ${f.path}`).join("\n");
        codeContext += `\nFile tree (partial):\n${files}\n`;
      } catch {}
    }
  } else {
    const targetFile = target.replace(/^target:/, '');
    if (existsSync(targetFile)) {
      try {
        codeContext = `File: ${targetFile}\n\nContent:\n${readFileSync(targetFile, "utf-8").slice(0, 2000)}`;
      } catch {
        codeContext = `Could not read file: ${targetFile}`;
      }
    }
  }
  
  const prompt = `You are the Dokumenter Agent. Generate clear documentation.

${codeContext}

Generate a ${target === 'README' ? 'project README.md' : `documentation for ${target}`} with:
1. Clear description
2. Usage instructions
3. Key features
4. Structure overview

Use markdown format. Be concise but complete.`;

  try {
    const output = await runLLM(prompt);
    console.log(output);
    
    mkdirSync(OUTPUT_DIR, { recursive: true });
    const filename = target === 'README' ? 'README-generated.md' : `${target.replace(/\//g, '-')}-doc.md`;
    writeFileSync(`${OUTPUT_DIR}/${filename}`, output);
    console.log(`\n✅ Saved to ${OUTPUT_DIR}/${filename}`);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}

main();