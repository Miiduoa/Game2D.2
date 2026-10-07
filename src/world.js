import { createPrng } from './prng.js';

export const FIXED_DT = 1 / 60;
const EPS = 1e-9;

function q(value) {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function overlaps(a, b) {
  return (
    a.x < b.x + b.w - EPS &&
    a.x + a.w > b.x + EPS &&
    a.y < b.y + b.h - EPS &&
    a.y + a.h > b.y + EPS
  );
}

function makePickups(seed) {
  const next = createPrng(seed);
  const points = [];
  for (let i = 0; i < 5; i += 1) {
    points.push({
      id: `p${i + 1}`,
      x: q(1.2 + next() * 9.6),
      y: q(1.0 + next() * 6.0),
      collected: false,
    });
  }
  return points;
}

export function createWorld(seed = 2026) {
  return {
    seed,
    tick: 0,
    width: 12,
    height: 8,
    score: 0,
    collisions: 0,
    player: { x: 0.8, y: 3.7, w: 0.6, h: 0.6, vx: 0, vy: 0 },
    obstacles: [
      { x: 3.2, y: 1.2, w: 0.8, h: 3.2 },
      { x: 6.0, y: 4.0, w: 0.8, h: 2.8 },
      { x: 8.7, y: 1.0, w: 0.9, h: 3.0 },
    ],
    pickups: makePickups(seed),
  };
}

function moveAxis(world, axis, delta) {
  const player = world.player;
  const positionKey = axis === 'x' ? 'x' : 'y';
  const sizeKey = axis === 'x' ? 'w' : 'h';
  const limit = axis === 'x' ? world.width : world.height;
  const before = player[positionKey];

  player[positionKey] = clamp(q(before + delta), 0, limit - player[sizeKey]);

  for (const obstacle of world.obstacles) {
    if (!overlaps(player, obstacle)) continue;

    world.collisions += 1;
    if (delta > 0) {
      player[positionKey] = q(obstacle[positionKey] - player[sizeKey]);
    } else if (delta < 0) {
      player[positionKey] = q(obstacle[positionKey] + obstacle[sizeKey]);
    }

    if (axis === 'x') player.vx = 0;
    if (axis === 'y') player.vy = 0;
  }
}

function collectPickups(world) {
  const p = world.player;
  const cx = p.x + p.w / 2;
  const cy = p.y + p.h / 2;

  for (const pickup of world.pickups) {
    if (pickup.collected) continue;
    const distance = Math.hypot(cx - pickup.x, cy - pickup.y);
    if (distance <= 0.45) {
      pickup.collected = true;
      world.score += 1;
    }
  }
}

export function step(world, input = {}) {
  const x = clamp(Number(input.x || 0), -1, 1);
  const y = clamp(Number(input.y || 0), -1, 1);
  const acceleration = 14;
  const maxSpeed = 4.5;
  const damping = 0.82;

  world.player.vx = q(clamp((world.player.vx + x * acceleration * FIXED_DT) * damping, -maxSpeed, maxSpeed));
  world.player.vy = q(clamp((world.player.vy + y * acceleration * FIXED_DT) * damping, -maxSpeed, maxSpeed));

  moveAxis(world, 'x', world.player.vx * FIXED_DT);
  moveAxis(world, 'y', world.player.vy * FIXED_DT);
  collectPickups(world);
  world.tick += 1;
  return world;
}

export function publicState(world) {
  return {
    seed: world.seed,
    tick: world.tick,
    score: world.score,
    collisions: world.collisions,
    player: {
      x: q(world.player.x),
      y: q(world.player.y),
      vx: q(world.player.vx),
      vy: q(world.player.vy),
    },
    pickups: world.pickups.map(({ id, collected }) => ({ id, collected })),
  };
}
