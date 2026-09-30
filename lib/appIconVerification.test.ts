import assert from 'node:assert/strict';
import { test } from 'node:test';
import { iconChangedDespiteError } from './appIconVerification';

test('accepts an icon change that completes after UIKit reports an error', async () => {
  let reads = 0;
  const changed = await iconChangedDespiteError('Oro', () => (++reads === 3 ? 'Oro' : null), async () => {});
  assert.equal(changed, true);
  assert.equal(reads, 3);
});

test('reports failure when the icon never changes', async () => {
  const changed = await iconChangedDespiteError('Oro', () => null, async () => {});
  assert.equal(changed, false);
});

test('does not mistake an unavailable icon query for a successful reset', async () => {
  const changed = await iconChangedDespiteError(null, () => { throw new Error('unavailable'); }, async () => {});
  assert.equal(changed, false);
});
