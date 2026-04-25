/**
 * Multi-Agent System Extension
 * Provides skills to spawn sub-agents and manage council communications
 */

export default {
  skills: {
    "spawn-subagents": {
      type: "function",
      description: "Spawn sub-agents (supagents) from multi-team agents",
      execute: async (agent) => {
        return new Promise(async (resolve, reject) => {
          try {
            // Load multi-team agents from .pi/multi-team/agents
            const agentsList = await fs.promises.readdir(".pi/multi-team/agents");
            
            const subagents = await Promise.all(
              agentsList.map(async (agent) => {
                const teamPath = path.join(".pi/multi-team", agent);
                const agentsPath = path.join(teamPath, "agents");
                
                if (await fs.promises.access(agentsPath).catch(() => false)) {
                  const agentFiles = await fs.promises.readdir(agentsPath);
                  await Promise.all(agentFiles.map((ag) => {
                    const agentPath = path.join(agentsPath, ag);
                    let content = "";
                    try {
                      content = await fs.promises.readFile(agentPath, "utf8");
                      resolve({
                        name: `multi-agent:${agent}/${ag}`,
                        code: content.trim(),
                        id: `subagent=${agent}-${ag}`
                      });
                    } catch (e) {
                      reject("Unable to read agent file");
                    }
                  }));
                }
              })
            );
            
            return subagents;
          } catch (e) {
            reject(e);
          }
        });
      }
    },
    
    "spawn-supagents": {
      type: "function",
      description: "Spawn supagents from .pi/multi-team/agents directory",
      execute: async (agent) => {
        const agentsPath = path.join(".pi/multi-team", agent, "agents");
        const agents = fs.readdirSync(agentsPath);
        promises = await Promise.all(agents.map((ag) => {
          const agentPath = path.join(agentsPath, ag);
          let content = "";
          try {
            content = fs.readFileSync(agentPath, "utf8");
            return {
              name: `multi-agent:${agent}/${ag}`.trim(),
              code: content.trim(),
              id: `subagent=${agent}-${ag}`
            };
          } catch (e) {
            console.error("Error reading agent:", e);
          }
        }));
        return promises;
      }
    },
    
    "manage-council": {
      type: "function",
      description: "Enable council communication between sub-agents",
      members: [
        { name: "security-scan", role: "security" },
        { name: "security-validate-all", role: "validation" },
        { name: "council-overview", role: "overview" },
        { name: "orchestrate", role: "orchestrator" },
        { name: "ui-gen-A", role: "design" },
        { name: "validation-A", role: "quality" }
      ]
    }
  }
};
