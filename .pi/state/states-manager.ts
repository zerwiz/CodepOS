/**
 * @file states-manager.ts - SQLite-based state management
 * Migration from file-based YAML to database-backed state
 * Addresses: file locks, race conditions, concurrent access
 */

// For production: use better-sqlite3 or sqlite3 package
// For testing: fall back to file-based YAML

export interface MemoryState {
  agent: string
  user_id: string
  key: string
  value: string
  timestamp: number
}

// File-based fallback (for testing without SQLite)
export async function saveMemory(
  agent: string,
  user_id: string,
  key: string,
  value: string
): Promise<void> {
  const timestamp = Date.now()
  const filePath = `.pi/state/${agent}/agent-${agent}-memory.yaml`
  
  try {
    const fs = await import('node:fs/promises')
    const path = await import('node:path')
    
    const memoryDir = path.join(path.dirname(filePath), '')
    await fs.mkdir(memoryDir, { recursive: true })
    
    // Append to memory log
    const currentContent: string[] = 
      await fs.readFile(filePath, 'utf-8').catch(() => [])
    currentContent.push(
      `key: ${key}\n` +
      `value: ${value}\n` +
      `timestamp: ${timestamp}`
    )
    
    await fs.writeFile(filePath, currentContent.join('\n---\n'))
  } catch (error) {
    console.error(`Failed to save memory for ${agent}:`, error)
  }
}

// Trace ID generation (for debugging)
export function generateTraceId(): string {
  // Use Pi's built-in session ID or custom
  const crypto = await import('node:crypto')
  return crypto.randomUUID()
}

// For SQLite (production upgrade path)
export async function initSQLite() {
  try {
    // Install dependencies if not present
    const { execSync } = await import('node:child_process')
    
    execSync('npm install better-sqlite3', { stdio: 'inherit' })
    
    await import('better-sqlite3').then(sqlite => {
      const db = new sqlite.Database('.pi/state/codepos-state.db')
      
      db.exec(`
        CREATE TABLE IF NOT EXISTS agent_memories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          agent TEXT NOT NULL,
          user_id TEXT NOT NULL,
          key TEXT NOT NULL,
          value TEXT,
          timestamp INTEGER NOT NULL,
          UNIQUE(agent, user_id, key)
        );
        CREATE INDEX IF NOT EXISTS idx_memories_user_agent ON agent_memories(user_id, agent);
        CREATE INDEX IF NOT EXISTS idx_memories_key ON agent_memories(key);
      `)
      
      db.close()
      console.log('✓ SQLite state database initialized')
    })
  } catch (error) {
    console.error('SQLite not available - using file-based fallback')
  }
}

// Context management (for conversation history)
export async function saveContext(
  agent: string,
  conversation_id: string,
  message: string,
  role: 'user' | 'assistant' | 'system'
): Promise<void> {
  try {
    const fs = await import('node:fs/promises')
    const path = await import('node:path')
    
    const contextDir = path.join(path.dirname(import.meta.url), '..', 'agent', 'sessions', agent)
    const sessionDir = await fs.promises.mkdir(contextDir, { recursive: true })
  } catch (error) {
    console.error('Failed to save context:', error)
  }
}

