#!/usr/bin/env bun
/**
 * Orchestrator - Project coordinator that talks to Council
 * Main entry point that coordinates everything
 */

import { spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';

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
  return new Promise((resolve, reject) => {
    const proc = spawn('bash', ['-c', cmd], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });
    
    let output = '';
    proc.stdout.on('data', (data) => { output += data.toString(); });
    proc.stderr.on('data', (data) => { output += data.toString(); });
    
    proc.on('close', (code) => {
      resolve(output);
    });
  });
}

async function getProjectContext() {
  let context = {
    name: "Unknown",
    structure: "",
    recent: "",
    memory: ""
  };
  
  const cwd = process.cwd();
  context.name = cwd.split("/").pop();
  
  if (existsSync(".pi/state/codebase-index.json")) {
    try {
      const index = JSON.parse(readFileSync(".pi/state/codebase-index.json", "utf-8"));
      context.structure = index.analysis || "";
    } catch {}
  }
  
  if (existsSync(".pi/state/planning-output.md")) {
    try {
      context.recent = readFileSync(".pi/state/planning-output.md", "utf-8").slice(0, 500);
    } catch {}
  }
  
  if (existsSync(".pi/state/security-learnings.json")) {
    try {
      context.memory = readFileSync(".pi/state/security-learnings.json", "utf-8");
    } catch {}
  }
  
  return context;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';
  
  console.log("\n🎯 Orchestrator\n" + "─".repeat(40));
  
  const context = await getProjectContext();
  
  switch (command) {
    case 'status': {
      console.log(`📁 Project: ${context.name}\n`);
      
      const prompt = `You are the Orchestrator's Council Advisor. Help the user understand the project.

Project: ${context.name}
${context.structure ? `Analysis:\n${context.structure}\n` : ''}
${context.recent ? `Recent work:\n${context.recent}\n` : ''}
${context.memory ? `Security learnings:\n${context.memory}\n` : ''}

Provide a brief status update and suggest next actions. Be concise.`;
      
      try {
        const advice = await runLLM(prompt);
        console.log(advice);
      } catch (e) {
        console.log("Council unavailable - showing basic status");
        console.log(`\nProject: ${context.name}`);
        console.log("Run `just team main full` to analyze project");
      }
      break;
    }
    
    case 'help': {
      console.log("\n📋 Orchestrator Commands:\n");
      console.log("  just orchestrate status     - Project status + Council advice");
      console.log("  just orchestrate analyze    - Quick project analysis");
      console.log("  just orchestrate plan        - Create task plan");
      console.log("  just orchestrate security    - Security check");
      console.log("  just orchestrate full        - Run full pipeline\n");
      console.log("Or use teams directly:");
      console.log("  just team main full          - Scout + Indexer + Planning + Dokumenter");
      console.log("  just team security           - Security scan + analysis");
      console.log("  just scanner scout           - Quick structure check");
      console.log("  just scanner sentinel        - Security scan");
      break;
    }
    
    case 'analyze': {
      console.log("📊 Quick analysis...\n");
      
      await runCommand("just team main indexer");
      
      const prompt = `You are the Council. Review this analysis and provide actionable insights.

${context.structure}

Give 3-5 key insights and recommended actions.`;
      
      try {
        const insights = await runLLM(prompt);
        console.log("\n💡 Council Insights:");
        console.log(insights);
      } catch {}
      break;
    }
    
    case 'security': {
      console.log("🛡️ Security check...\n");
      
      await runCommand("just team security");
      break;
    }
    
    case 'plan': {
      console.log("📋 Creating task plan...\n");
      
      await runCommand("just plan-task");
      break;
    }
    
    case 'full': {
      console.log("🚀 Running full analysis pipeline...\n");
      
      await runCommand("just team main full");
      
      const prompt = `You are the Council. After this full analysis:

${context.structure}

Provide a summary of the project state and top 3 priority tasks.`;
      
      try {
        const summary = await runLLM(prompt);
        console.log("\n🎯 Council Summary:");
        console.log(summary);
      } catch {}
      break;
    }
    
    default: {
      console.log(`Unknown command: ${command}`);
      console.log("Run `just orchestrate help` for available commands");
    }
  }
}

main();