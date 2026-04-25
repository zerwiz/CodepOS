export default function (pi: any) {
  pi.on('session_start', async () => {
    console.log('[deletion-guard] Protection active');
  });

  pi.registerTool({
    name: 'blockFileDeletion',
    description: 'Blocks deletion for non-safe files',
    parameters: {
      type: 'object',
      properties: {
        filePath: { type: 'string', description: 'Path to file' },
        reason: { type: 'string', description: 'Why deletion needed' }
      },
      required: ['filePath']
    },
    execute: async ({ filePath }: { filePath: string; reason?: string }) => {
      const ext = filePath.split('/').pop() || '';
      const isSafe = ['.log', '.tmp'].some(i => i === '.' + ext);
      
      if (!isSafe) {
        return { content: [{ type: "text", text: `❌ Deletion blocked for: ${filePath}` }] };
      }
      
      return { content: [{ type: "text", text: `✅ Safe to delete: ${filePath}` }] };
    }
  });
}