import { createHash } from 'node:crypto';
import { createWorld, publicState, step } from './world.js';

export function runReplay({ seed = 2026, segments = [] } = {}) {
  const world = createWorld(seed);

  for (const segment of segments) {
    const ticks = Math.max(0, Math.trunc(segment.ticks || 0));
    const input = segment.input || {};
    for (let i = 0; i < ticks; i += 1) step(world, input);
  }

  const state = publicState(world);
  const digest = createHash('sha256')
    .update(JSON.stringify(state))
    .digest('hex');

  return { state, digest };
}
