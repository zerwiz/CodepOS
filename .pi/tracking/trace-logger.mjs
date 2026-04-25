/**
 * @file trace-logger.mjs - Distributed tracing for council communication
 * Adds trace_id/span_id to all council messages for debugging
 */

import { randomUUID } from 'crypto'

export function createTraceContext() {
  return {
    traceId: randomUUID(),
    spanId: randomUUID(),
    startTime: Date.now(),
    agents: []
  }
}

export function addTraceToMessage(message, context = null) {
  const traceContext = context || createTraceContext()
  return {
    ...message,
    trace_id: traceContext.traceId,
    span_id: traceContext.spanId,
    start_time: traceContext.startTime,
    _traceData: traceContext
  }
}

export async function broadcastWithTrace(channel, message, context) {
  const tracedMessage = addTraceToMessage(message, context)
  console.log(`[TRACE ${tracedMessage.trace_id}] ${channel}: ${message}`)
  return await global.__pi_team_manager?.multiagent.council.broadcast(tracedMessage)
}

export function debugTrace(traceId) {
  const grepCmd = `grep -r "${traceId}" .pi/teams/`
  return { traceId, grepCommand: grepCmd }
}
