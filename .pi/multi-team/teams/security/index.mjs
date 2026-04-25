#!/usr/bin/env bun
/**
 * Security Team
 * Scanner + LLM Team Leader with learning memory
 */

import { spawn } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';

const TEAM_NAME = 'security';
const MEMORY_FILE = `.pi/state/${TEAM_NAME}-memory.json`;
const LEARNINGS_FILE = `.pi/state/${TEAM_NAME}-learnings.json`;

interface MemoryEntry {
  timestamp: number;
  action: string;
  result: 'success' | 'failure' | 'partial';
  details: string;
  issues_found?: number;
  issues_fixed?: number;
}

interface Learning {
  issue_type: string;
  attempts: number;
  successes: number;
  last_fix?: string;
  notes: string;
}

async function saveMemory(entry: MemoryEntry) {
  const timestamp = Date.now();
  mkdirSync('.pi/state', { recursive: true });
  
  let memory: MemoryEntry[] = [];
  try {
    if (existsSync(MEMORY_FILE)) {
      memory = JSON.parse(readFileSync(MEMORY_FILE, 'utf-8'));
    }
  } catch {}
  
  memory.push({ ...entry, timestamp });
  writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
  
  return memory;
}

async function saveLearning(issueType: string, success: boolean, fix?: string) {
  mkdirSync('.pi/state', { recursive: true });
  
  let learnings: Learning[] = [];
  try {
    if (existsSync(LEARNINGS_FILE)) {
      learnings = JSON.parse(readFileSync(LEARNINGS_FILE, 'utf-8'));
    }
  } catch {}
  
  const existing = learnings.find(l => l.issue_type === issueType);
  
  if (existing) {
    existing.attempts++;
    if (success) existing.successes++;
    if (fix) existing.last_fix = fix;
  } else {
    learnings.push({
      issue_type: issueType,
      attempts: 1,
      successes: success ? 1 : 0,
      last_fix: fix,
      notes: ''
    });
  }
  
  writeFileSync(LEARNINGS_FILE, JSON.stringify(learnings, null, 2));
}

async function loadLearnings(): Promise<Learning[]> {
  if (!existsSync(LEARNINGS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(LEARNINGS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

async function getLearningContext(): Promise<string> {
  const learnings = await loadLearnings();
  if (learnings.length === 0) return '';
  
  const lines = learnings.map(l => {
    const rate = l.attempts > 0 ? Math.round((l.successes / l.attempts) * 100) : 0;
    return `• ${l.issue_type}: ${l.successes}/${l.attempts} fixed (${rate}%) ${l.last_fix ? `| Last fix: ${l.last_fix}` : ''}`;
  });
  
  return `\n\n**Learning from past runs:**\n${lines.join('\n')}`;
}

async function getRecentHistory(): Promise<string> {
  let memory: MemoryEntry[] = [];
  try {
    if (existsSync(MEMORY_FILE)) {
      memory = JSON.parse(readFileSync(MEMORY_FILE, 'utf-8'));
    }
  } catch {}
  
  const recent = memory.slice(-5);
  if (recent.length === 0) return '';
  
  const lines = recent.map(m => `• [${new Date(m.timestamp).toLocaleDateString()}] ${m.action}: ${m.result} (${m.issues_found || 0} found)`);
  return `\n\n**Recent runs:**\n${lines.join('\n')}`;
}

console.log("\n🛡️ Security Team\n" + "─".repeat(40));

// Get context from past runs
const learningContext = await getLearningContext();
const historyContext = await getRecentHistory();

console.log("📡 Step 1: Running sentinel scanner...\n");

// Step 1: Run scanner
const scannerProc = spawn('bun', ['run', '.pi/multi-team/agents/sentinel/index.mjs'], {
  cwd: process.cwd(),
  stdio: 'inherit'
});

scannerProc.on('close', async (code) => {
  await saveMemory({
    action: 'scanner_run',
    result: code === 0 ? 'success' : 'failure',
    details: 'Sentinel scanner completed',
    issues_found: 0 // Would need to parse output
  });
  
  console.log("\n🤖 Step 2: LLM Team Leader analyzing...\n");
  
  const analysisPrompt = `You are the Security Team Leader with memory of past work.

Analyze the security scan results above. For each issue:
1. Identify the type (sql, hardcoded, dangerous, secrets)
2. Check if we have fixed this type before (see learnings below)
3. If we have, reference the previous fix approach
4. Provide actionable fixes with file paths

${learningContext}
${historyContext}

Provide a structured report:
- Critical issues first
- Suggested fixes (prefer approaches that worked before)
- Estimated effort`;

  const leaderProc = spawn('pi', ['-p', analysisPrompt], {
    cwd: process.cwd(),
    stdio: 'inherit'
  });
  
  leaderProc.on('close', async (code) => {
    await saveMemory({
      action: 'analysis_complete',
      result: 'success',
      details: 'LLM analysis finished'
    });
    
    console.log("\n✅ Security team task complete!");
    console.log("\n💡 To track a fix worked, run:");
    console.log("   just memory:track security '<issue-type>' '<what-you-did>'");
    
    process.exit(code || 0);
  });
});