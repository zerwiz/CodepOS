#!/usr/bin/env bun
/**
 * Council Leader - LLM-powered team coordinator
 * Real AI agent that coordinates scanners and teams
 */

import { spawn } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';

const AGENTS_FILE = ".pi/state/council-agents.json";

function getAgents() {
  try {
    if (existsSync(AGENTS_FILE)) {
      return JSON.parse(readFileSync(AGENTS_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

function saveAgents(agents) {
  mkdirSync(".pi/state", { recursive: true });
  writeFileSync(AGENTS_FILE, JSON.stringify(agents, null, 2));
}

function addAgent(name, type) {
  const id = `${type}-${Date.now()}`;
  const agents = getAgents();
  agents.push({ id, name, type, startTime: Date.now(), status: "running" });
  saveAgents(agents);
  return id;
}

function updateStatus(id, status) {
  const agents = getAgents().map(a => a.id === id ? { ...a, status } : a);
  saveAgents(agents);
}

function runScanner(name) {
  return new Promise((resolve, reject) => {
    const proc = spawn('bun', ['run', `.pi/multi-team/scanners/${name}/index.mjs`], {
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

console.log("\n🏛️ Council Leader\n" + "─".repeat(40));

const args = process.argv.slice(2);
const command = args[0] || 'help';

async function main() {
  switch (command) {
    case 'coordinator': {
      console.log("🤖 I am the Council Leader - coordinating the multi-team system\n");
      
      const agents = getAgents();
      const running = agents.filter(a => a.status === 'running');
      
      console.log(`📊 Active agents: ${running.length}`);
      running.forEach(a => console.log(`  • ${a.type}: ${a.name}`));
      
      const response = await runLLM(`You are the Council Leader for CodepOS multi-team system.

Current active agents: ${running.length}
${running.map(a => `- ${a.type}: ${a.name}`).join('\n')}

Provide guidance on what actions to take next. Be concise and actionable.`);
      
      console.log("\n💡 Council Decision:");
      console.log(response);
      break;
    }
    
    case 'analyze': {
      const scanner = args[1] || 'scout';
      console.log(`📡 Running scanner: ${scanner}...\n`);
      
      const scannerId = addAgent(scanner, 'scanner');
      try {
        const output = await runScanner(scanner);
        updateStatus(scannerId, 'done');
        console.log(output);
        
        console.log("\n🤖 Analyzing results...\n");
        const analyzeId = addAgent('council', 'agent');
        const analysis = await runLLM(`Analyze these scanner results and provide insights:\n\n${output}`);
        updateStatus(analyzeId, 'done');
        console.log(analysis);
      } catch (e) {
        updateStatus(scannerId, 'error');
        console.log(`Error: ${e.message}`);
      }
      break;
    }
    
    case 'security': {
      console.log("🛡️ Security Council\n");
      
      const scanId = addAgent('sentinel', 'scanner');
      try {
        const scanOutput = await runScanner('sentinel');
        updateStatus(scanId, 'done');
        console.log(scanOutput);
        
        console.log("\n🤖 Security Analysis...\n");
        const analyzeId = addAgent('security-leader', 'agent');
        const analysis = await runLLM(`You are the Security Council Leader. Analyze this security scan:

${scanOutput}

Provide:
1. Critical issues (top 3)
2. Suggested fixes
3. Priority ranking`);
        updateStatus(analyzeId, 'done');
        console.log(analysis);
      } catch (e) {
        updateStatus(scanId, 'error');
        console.log(`Error: ${e.message}`);
      }
      break;
    }
    
    case 'list': {
      const agents = getAgents();
      console.log("📊 Council Agents:\n");
      if (agents.length === 0) {
        console.log("  (none)");
      } else {
        agents.forEach(a => {
          const age = Math.round((Date.now() - a.startTime) / 1000);
          const icon = a.status === 'running' ? '⠹' : a.status === 'done' ? '✓' : '✗';
          console.log(`${icon} ${a.type}: ${a.name} (${age}s)`);
        });
      }
      break;
    }
    
    case 'clear': {
      saveAgents([]);
      console.log("✅ Council cleared");
      break;
    }
    
    default: {
      console.log("🏛️ Council Leader Commands:\n");
      console.log("  just council           - Help");
      console.log("  just council-coordinator - Run as team coordinator (LLM)");
      console.log("  just council-analyze   - Run scout + LLM analysis");
      console.log("  just council-security   - Security scan + LLM analysis");
      console.log("  just council-list      - List active agents");
      console.log("  just council-clear      - Clear agent list");
    }
  }
}

main();