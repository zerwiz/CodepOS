#!/usr/bin/env bun
export async function* load() {
  yield { name: 'ui-components', status: 'ready', team: 'ui' };
}
