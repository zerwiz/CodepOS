#!/usr/bin/env bun
import { spawn } from 'child_process';

console.log("\n🛡️ Security Team\n" + "─".repeat(40));
console.log("📡 Running sentinel scanner...\n");

const proc = spawn('bun', ['run', '.pi/multi-team/tools/sentinel.mjs'], {
  cwd: process.cwd(),
  stdio: 'inherit'
});

proc.on('close', (code) => {
  console.log("\n💡 Next: Spawn auditor agent for deep analysis");
  console.log("   Agent({ subagent_type: 'auditor', prompt: 'Deep security audit' })");
  process.exit(code || 0);
});