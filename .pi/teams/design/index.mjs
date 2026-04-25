#!/usr/bin/env bun
export async function* load() {
  yield { name: 'design', status: 'ready', team: 'ui' };
}
