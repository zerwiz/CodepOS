export default {
  name: "security-team",
  description: "Security scanning and analysis team",
  
  async run(context) {
    console.log("\n🛡️ Security Team\n" + "─".repeat(40));
    
    // Step 1: Run quick scanner
    console.log("📡 Running sentinel scanner...");
    const { spawn } = await import('child_process');
    
    return new Promise((resolve) => {
      const proc = spawn('bun', ['run', '.pi/multi-team/tools/sentinel.mjs'], {
        cwd: process.cwd(),
        stdio: 'inherit'
      });
      
      proc.on('close', (code) => {
        console.log("\n💡 Next: Spawn auditor agent for deep analysis");
        console.log("   Agent({ subagent_type: 'auditor', prompt: 'Deep security audit' })");
        resolve({ code, team: 'security' });
      });
    });
  }
};