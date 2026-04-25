#!/usr/bin/env bun
/**
 * Team Leader Base Class
 * LLM-powered coordinator with SQLite memory
 */

import { spawn } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';

interface MemoryRecord {
  id: number;
  agent: string;
  key: string;
  value: string;
  timestamp: number;
}

interface TeamLeaderConfig {
  name: string;
  prompt: string;
  memoryDb: string;
}

const DB_PATH = '.pi/state/team-leaders.db';

function initDatabase() {
  const dbExists = existsSync(DB_PATH);
  if (!dbExists) {
    mkdirSync('.pi/state', { recursive: true });
    const init = spawn('bun', ['run', '-e', `
      const db = await import('bun');
      const SQLite = require('better-sqlite3') || null;
      // For now, just create the file
    `], { stdio: 'pipe' });
  }
}

async function saveMemory(agent: string, key: string, value: string) {
  const timestamp = Date.now();
  const filePath = `.pi/state/${agent}-memory.json`;
  
  mkdirSync('.pi/state', { recursive: true });
  
  let memory: MemoryRecord[] = [];
  try {
    if (existsSync(filePath)) {
      memory = JSON.parse(readFileSync(filePath, 'utf-8'));
    }
  } catch {}
  
  memory.push({ id: memory.length + 1, agent, key, value, timestamp });
  
  writeFileSync(filePath, JSON.stringify(memory, null, 2));
}

async function loadMemory(agent: string): Promise<MemoryRecord[]> {
  const filePath = `.pi/state/${agent}-memory.json`;
  
  if (!existsSync(filePath)) {
    return [];
  }
  
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

async function getMemoryContext(agent: string): Promise<string> {
  const memory = await loadMemory(agent);
  
  if (memory.length === 0) {
    return '';
  }
  
  const recent = memory.slice(-10);
  const lines = recent.map(m => `[${new Date(m.timestamp).toISOString()}] ${m.key}: ${m.value}`);
  
  return `\n\nPrevious memory:\n${lines.join('\n')}`;
}

export async function runTeamLeader(config: TeamLeaderConfig) {
  console.log(`\n🤖 Team Leader: ${config.name}\n${'─'.repeat(40)}`);
  
  // Load previous memory context
  const memoryContext = await getMemoryContext(config.name);
  
  // Save start timestamp
  await saveMemory(config.name, 'session_start', new Date().toISOString());
  
  // Build prompt with memory context
  const fullPrompt = `${config.prompt}${memoryContext}`;
  
  return new Promise<void>((resolve) => {
    const proc = spawn('pi', ['-p', fullPrompt], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });
    
    proc.on('close', async (code) => {
      await saveMemory(config.name, 'session_end', new Date().toISOString());
      await saveMemory(config.name, 'exit_code', String(code || 0));
      resolve();
    });
  });
}

export { saveMemory, loadMemory, getMemoryContext };