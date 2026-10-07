import { runReplay } from './src/replay.js';

const replay = {
  seed: 20261007,
  segments: [
    { ticks: 150, input: { x: 1, y: 0 } },
    { ticks: 90, input: { x: 0, y: -1 } },
    { ticks: 180, input: { x: 1, y: 0.45 } },
    { ticks: 120, input: { x: 0, y: 1 } },
  ],
};

const result = runReplay(replay);
console.log(JSON.stringify(result, null, 2));
