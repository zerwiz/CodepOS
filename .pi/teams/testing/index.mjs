#!/usr/bin/env bun
export async function* load() {
  yield { name: 'testing', status: 'ready', team: 'qa' };
}
