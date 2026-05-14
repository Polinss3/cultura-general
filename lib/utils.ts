import { Question } from '@/types';

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleIndexes(length: number, rand: () => number): number[] {
  const idxs = Array.from({ length }, (_, i) => i);
  for (let i = idxs.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
  }
  return idxs;
}

export interface ShuffledQuestion extends Question {
  // index map: position-in-displayed-opts -> position-in-original-opts
  originalIndexMap: number[];
}

export function shuffleQuestion(q: Question): ShuffledQuestion {
  const order = shuffleIndexes(q.opts.length, Math.random);
  return {
    ...q,
    opts: order.map(i => q.opts[i]),
    ans: order.indexOf(q.ans),
    originalIndexMap: order,
  };
}

// Deterministic 32-bit hash → seeded RNG (Mulberry32)
function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed || 1;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleQuestionSeeded(q: Question, seed: string): ShuffledQuestion {
  const rand = mulberry32(hashSeed(seed));
  const order = shuffleIndexes(q.opts.length, rand);
  return {
    ...q,
    opts: order.map(i => q.opts[i]),
    ans: order.indexOf(q.ans),
    originalIndexMap: order,
  };
}

// Pick up to `n` items from `pool` prioritizing those whose id is NOT in `recentIds`.
// Fresh ones come first (shuffled), stale ones fill the rest (shuffled).
// Items without an id are treated as fresh.
export function pickRandomFresh<T>(
  pool: T[],
  recentIds: string[],
  getId: (t: T) => string | undefined,
  n: number,
): T[] {
  if (pool.length === 0 || n <= 0) return [];
  const recent = new Set(recentIds);
  const fresh: T[] = [];
  const stale: T[] = [];
  for (const item of pool) {
    const id = getId(item);
    if (id && recent.has(id)) stale.push(item);
    else fresh.push(item);
  }
  const result = shuffle(fresh);
  if (result.length < n) result.push(...shuffle(stale));
  return result.slice(0, n);
}
