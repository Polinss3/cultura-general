import assert from 'node:assert/strict';
import test from 'node:test';
import { interestWeight } from './interests';
import { weightedShuffle } from './utils';
import type { Category } from '@/types';

test('weight is 2 for favourite categories and 1 otherwise', () => {
  const w = interestWeight(['historia', 'cine'] as Category[]);
  assert.equal(w({ category: 'historia' as Category }), 2);
  assert.equal(w({ category: 'ciencia' as Category }), 1);
  assert.equal(w({}), 1);
  assert.equal(interestWeight([])({ category: 'historia' as Category }), 1);
});

test('weighted shuffle keeps every item and favours heavy ones', () => {
  const items = Array.from({ length: 130 }, (_, i) => ({ id: i, fav: i % 13 < 4 }));
  const runs = 400;
  let favInTopHalf = 0;
  for (let r = 0; r < runs; r += 1) {
    const out = weightedShuffle(items, it => (it.fav ? 2 : 1));
    assert.equal(out.length, items.length);
    assert.equal(new Set(out.map(it => it.id)).size, items.length);
    favInTopHalf += out.slice(0, 65).filter(it => it.fav).length;
  }
  // 40 favoritos de 130 con peso 2 → ≈ 47 % de la primera mitad (≈ 30 de 65)
  // frente al 31 % (20 de 65) de un barajado plano. Margen amplio para que la
  // aleatoriedad no haga el test frágil.
  const avg = favInTopHalf / runs;
  assert.ok(avg > 25 && avg < 36, `favoritos en la primera mitad: ${avg}`);
});
