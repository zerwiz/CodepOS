#!/usr/bin/env bun
export async function* load() {
  yield { name: 'planning', status: 'ready', team: 'planning' };
}
