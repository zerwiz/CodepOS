#!/usr/bin/env bun
export async function* load() {
  yield { name: 'frontend', status: 'ready', team: 'web' };
}
