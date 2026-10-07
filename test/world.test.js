import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorld, step } from '../src/world.js';
import { runReplay } from '../src/replay.js';

const replay = {
  seed: 42,
  segments: [
    { ticks: 90, input: { x: 1 } },
    { ticks: 60, input: { y: -1 } },
    { ticks: 120, input: { x: 1, y: 0.25 } },
  ],
};

test('same seed and input sequence produce the same checksum', () => {
  const a = runReplay(replay);
  const b = runReplay(replay);
  assert.equal(a.digest, b.digest);
  assert.deepEqual(a.state, b.state);
});

test('a changed input sequence changes the replay checksum', () => {
  const a = runReplay(replay);
  const b = runReplay({
    ...replay,
    segments: [...replay.segments, { ticks: 1, input: { x: -1 } }],
  });
  assert.notEqual(a.digest, b.digest);
});

test('world bounds keep the player inside the simulation area', () => {
  const world = createWorld(7);
  for (let i = 0; i < 1500; i += 1) step(world, { x: -1, y: -1 });
  assert.equal(world.player.x, 0);
  assert.equal(world.player.y, 0);
});

test('obstacle collision stops horizontal penetration', () => {
  const world = createWorld(7);
  world.player.x = 2.4;
  world.player.y = 2.0;
  world.player.vx = 4.5;
  for (let i = 0; i < 30; i += 1) step(world, { x: 1 });
  assert.ok(world.player.x + world.player.w <= 3.2 + 1e-6);
  assert.ok(world.collisions > 0);
});
