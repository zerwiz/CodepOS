export default {
  name: "council",
  members: [
    { name: "security-scan", role: "security", status: "active" },
    { name: "security-validate-all", role: "validation", status: "active" },
    { name: "council-overview", role: "overview", status: "active" },
    { name: "orchestrate", role: "orchestrator", status: "active" },
    { name: "ui-gen-A", role: "design", status: "available" },
    { name: "validation-A", role: "quality", status: "available" },
    { name: "validation-B", role: "quality", status: "available" },
    { name: "validation-C", role: "quality", status: "available" }
  ],
  functions: {
    broadcast: async (message) => {
      console.log("Council broadcast:", message);
    },
    request: async (member, request) => {
      return { request: request, from: member };
    }
  }
};
