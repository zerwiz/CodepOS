#!/usr/bin/env bun
/**
 * Planning Agent - LLM-powered task planning
 */

import { spawn } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';

const OUTPUT_FILE = ".pi/state/planning-output.md";

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

async function main() {
  const args = process.argv.slice(2);
  const focus = args[0] || 'general improvements';
  
  console.log("\n📋 Planning Agent\n" + "─".repeat(40));
  console.log(`Focus: ${focus}\n`);
  
  const indexExists = existsSync(".pi/state/codebase-index.json");
  let context = "";
  
  if (indexExists) {
    try {
      const index = JSON.parse(readFileSync(".pi/state/codebase-index.json", "utf-8"));
      context = `Project has ${index.totalItems} items. LLM analysis:\n${index.analysis}\n`;
    } catch {}
  }
  
  const prompt = `You are the Planning Agent. Create a structured task plan.

${context}

Focus area: ${focus}

Provide a markdown task plan with:
1. ## Priority Tasks (top 3-5)
2. ## Implementation Steps
3. ## Estimated Time
4. ## Dependencies

Make it actionable and specific.`;

  try {
    const output = await runLLM(prompt);
    console.log(output);
    
    mkdirSync(".pi/state", { recursive: true });
    writeFileSync(OUTPUT_FILE, output);
    console.log(`\n✅ Plan saved to ${OUTPUT_FILE}`);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}

main();