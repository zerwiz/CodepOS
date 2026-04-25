#!/usr/bin/env bun
export async function* load() {
  yield { name: 'database', status: 'ready', team: 'data' };
}
