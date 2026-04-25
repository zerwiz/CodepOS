#!/usr/bin/env bun
/**
 * Main Team - Coordinates scanner + agents
 * scout -> indexer -> planning -> dokumenter
 */

import { spawn, execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';

function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    const proc = spawn('bash', ['-c', cmd], {
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

async function runScanner(name) {
  return runCommand(`bun run .pi/multi-team/scanners/${name}/index.mjs`);
}

async function runAgent(name, args = '') {
  return runCommand(`bun run .pi/multi-team/council/${name}/index.mjs ${args}`);
}

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'full';
  
  console.log("\n🚀 Main Team - Multi-Agent Pipeline\n" + "─".repeat(40));
  console.log(`Mode: ${mode}\n`);
  
  mkdirSync(".pi/state", { recursive: true });
  
  const results = {};
  
  switch (mode) {
    case 'scout': {
      console.log("📡 Step 1: Running Scout (scanner)...\n");
      try {
        results.scout = await runScanner('scout');
        console.log(results.scout);
      } catch (e) {
        console.log(`Scout error: ${e.message}`);
      }
      break;
    }
    
    case 'indexer': {
      console.log("📡 Step 1: Running Scout...\n");
      try {
        await runScanner('scout');
      } catch {}
      
      console.log("\n📇 Step 2: Running Indexer (agent)...\n");
      try {
        results.indexer = await runCommand(`bun run .pi/multi-team/scanners/indexer/index.mjs`);
        console.log("Indexer complete - see .pi/state/codebase-index.json");
      } catch (e) {
        console.log(`Indexer error: ${e.message}`);
      }
      break;
    }
    
    case 'planning': {
      console.log("📡 Step 1: Running Scout...\n");
      try {
        await runScanner('scout');
      } catch {}
      
      console.log("\n📇 Step 2: Running Indexer...\n");
      try {
        await runCommand(`bun run .pi/multi-team/scanners/indexer/index.mjs`);
      } catch {}
      
      console.log("\n📋 Step 3: Running Planning Agent (agent)...\n");
      try {
        results.planning = await runAgent('planning', args.slice(1).join(' ') || 'general');
        console.log(results.planning);
      } catch (e) {
        console.log(`Planning error: ${e.message}`);
      }
      break;
    }
    
    case 'full': {
      console.log("📡 Step 1: Running Scout (scanner)...\n");
      try {
        results.scout = await runScanner('scout');
        console.log(results.scout);
      } catch (e) {
        console.log(`Scout error: ${e.message}`);
      }
      
      console.log("\n📇 Step 2: Running Indexer (agent)...\n");
      try {
        await runCommand(`bun run .pi/multi-team/scanners/indexer/index.mjs`);
        console.log("✅ Index complete\n");
      } catch (e) {
        console.log(`Indexer error: ${e.message}`);
      }
      
      console.log("📋 Step 3: Running Planning Agent (agent)...\n");
      try {
        results.planning = await runAgent('planning');
        console.log(results.planning);
      } catch (e) {
        console.log(`Planning error: ${e.message}`);
      }
      
      console.log("📚 Step 4: Running Dokumenter Agent (agent)...\n");
      try {
        results.dokumenter = await runAgent('dokumenter', 'README');
        console.log(results.dokumenter);
      } catch (e) {
        console.log(`Dokumenter error: ${e.message}`);
      }
      break;
    }
    
    default: {
      console.log("Available modes:");
      console.log("  just team main full      - Full pipeline (scout + indexer + planning + dokumenter)");
      console.log("  just team main scout     - Scout only");
      console.log("  just team main indexer  - Scout + Indexer");
      console.log("  just team main planning - Scout + Indexer + Planning");
    }
  }
  
  console.log("\n✅ Main team pipeline complete!");
  console.log("\n📁 Output files:");
  console.log("   .pi/state/codebase-index.json  - Full index");
  console.log("   .pi/state/file-tree.md         - File tree");
  console.log("   .pi/state/planning-output.md   - Task plan");
  console.log("   .pi/state/docs-generated/      - Generated docs");
}

main();