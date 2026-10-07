export function createPrng(seed = 1) {
  let state = (Number(seed) >>> 0) || 0x9e3779b9;

  return function next() {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0x100000000;
  };
}
