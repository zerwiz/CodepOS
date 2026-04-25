#!/usr/bin/env bun
export async function* load() {
  yield { name: 'security-validate-all', status: 'ready', team: 'security' };
}
