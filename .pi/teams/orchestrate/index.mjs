#!/usr/bin/env bun
export async function* load() {
  yield { name: 'orchestrate', status: 'running', team: 'orchestrator' };
}
