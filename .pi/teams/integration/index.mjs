#!/usr/bin/env bun
export async function* load() {
  yield { name: 'integration', status: 'ready', team: 'integrations' };
}
