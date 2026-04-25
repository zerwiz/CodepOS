#!/usr/bin/env bun
export async function* load() {
  yield { name: 'setup', status: 'ready', team: 'setup' };
}
