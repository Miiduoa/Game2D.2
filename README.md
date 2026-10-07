# Game2D.2｜Deterministic 2D Simulation Lab

[![ci](https://github.com/Miiduoa/Game2D.2/actions/workflows/ci.yml/badge.svg)](https://github.com/Miiduoa/Game2D.2/actions/workflows/ci.yml)

這個 repo 原本只是早期 Android 2D game 練習。與其保留一份只能代表「以前做過小遊戲」的程式，我把它改成一個比較值得檢查的題目：**同一組輸入，遊戲模擬能不能每次得到完全相同的結果？**

目前版本把 UI 拿掉，只留下 headless simulation core，專注在 fixed timestep、碰撞、seeded randomness、replay 與 deterministic checksum。

## 為什麼在意 deterministic

即時程式如果把 wall-clock time、隨機數與畫面更新綁在一起，bug 常常很難重現。

這版改成：

```text
seed + ordered inputs
        ↓
60 Hz fixed-step simulation
        ↓
movement / collision / pickup state
        ↓
canonical public state
        ↓
SHA-256 replay checksum
```

只要 seed 與 input sequence 相同，最後 state 與 checksum 就必須相同。這讓 replay、測試與 regression check 都有明確基準。

## 目前包含

- 60 Hz fixed timestep
- acceleration / damping / world bounds
- AABB obstacle collision
- seeded `xorshift32` PRNG
- deterministic pickup placement
- run-length replay segments
- canonical state snapshot
- SHA-256 replay checksum
- Node.js built-in test runner
- GitHub Actions CI

## Quick start

Node.js 22+，沒有第三方 runtime dependency。

```bash
npm test
npm run check
npm run demo
```

`demo` 會跑一段固定 replay，最後輸出 simulation state 與 checksum。

## Replay format

```js
const replay = {
  seed: 42,
  segments: [
    { ticks: 90, input: { x: 1 } },
    { ticks: 60, input: { y: -1 } },
    { ticks: 120, input: { x: 1, y: 0.25 } }
  ]
};
```

這裡不用「按下右鍵 1.5 秒」這種 wall-clock 表達，而是直接記錄 simulation ticks。測試因此不會受 CI runner 快慢影響。

## Tests

目前測試至少會確認：

- 同 seed + 同 input → 同 checksum
- input 多一個 tick → checksum 改變
- 玩家不會離開 world bounds
- 障礙物碰撞不會穿透

## Project structure

```text
src/
  prng.js       seeded xorshift32
  world.js      fixed-step world + collision
  replay.js     replay runner + checksum
test/
  world.test.js
demo.js
.github/workflows/ci.yml
```

## Scope

這不是完整 game engine，也沒有宣稱處理 networking、rollback netcode 或大型 physics。

現在這個版本只把一件事做清楚：**simulation core 必須可重現、可測試，而且 failure 可以被定位。** 如果之後要接 Canvas、Compose 或其他 renderer，renderer 應該只是 state 的消費者，不改變 simulation 規則。
