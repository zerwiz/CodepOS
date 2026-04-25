#!/usr/bin/env bun
export async function* load() {
  yield { name: 'api-backend', status: 'ready', team: 'backend' };
}
