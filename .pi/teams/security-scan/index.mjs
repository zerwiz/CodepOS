#!/usr/bin/env bun
export async function* load() {
  yield { name: 'security-scan', status: 'ready', team: 'security' };
}
