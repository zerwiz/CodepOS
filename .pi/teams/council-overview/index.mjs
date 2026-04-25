#!/usr/bin/env bun
export async function* load() {
  yield { name: 'council-overview', status: 'active', team: 'council' };
}
