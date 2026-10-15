import assert from 'node:assert/strict';
import test from 'node:test';
import { createCityImageQueue } from './cityImageQueue';
import { cityImageLayout } from './cityImageLayout';
import framing from '../constants/cityDioramaFraming.json';
const tick = () => new Promise(resolve => setTimeout(resolve, 0));

test('preloads decode only once and immediately reuse the ready native object', async () => {
  let calls = 0;
  const queue = createCityImageQueue(async url => { calls++; return { url }; });
  const first = queue.ensure('a');
  assert.equal(queue.ensure('a'), first);
  const decoded = await first;
  assert.equal(await queue.ensure('a'), decoded);
  assert.equal(queue.get('a'), decoded);
  assert.equal(calls, 1);
});
test('limits concurrent work; a failed download can be retried', async () => {
  let running = 0, max = 0, attempts = 0;
  const queue = createCityImageQueue(async url => {
    running++; max = Math.max(max,running); await tick(); running--;
    if (url === 'bad' && attempts++ === 0) throw new Error('offline');
    return url;
  }, 8, 2);
  await Promise.all(['a','b','c','d'].map(url => queue.ensure(url)));
  assert.equal(max,2);
  await assert.rejects(queue.ensure('bad'));
  await tick();
  assert.equal(await queue.ensure('bad'),'bad');
});
test('the decoded cache evicts old images without invalidating objects already displayed', async () => {
  const queue = createCityImageQueue(async url => ({url}),2);
  const displayed = await queue.ensure('a');
  await queue.ensure('b'); queue.get('a'); await queue.ensure('c');
  assert.equal(queue.get('b'),undefined);
  assert.equal(queue.get('a'),displayed);
  assert.equal(displayed.url,'a');
});
test('a hung image times out, frees the slot and does not poison a later retry', async () => {
  let calls = 0;
  const queue = createCityImageQueue(async () => ++calls === 1 ? new Promise<string>(() => {}) : 'recovered', 2, 1, 15);
  await assert.rejects(queue.ensure('a'), /timed out/);
  await tick();
  assert.equal(await queue.ensure('a'),'recovered');
});
test('trimming empty canvas preserves city scale and the full source top in every registered city', () => {
  for (const [id, profile] of Object.entries(framing.images)) {
    const f = {...profile.normalized, background:framing.frame.background};
    const layout = cityImageLayout(f,300);
    assert.equal(layout.image.width, f.width * 300, id);
    assert.equal(layout.image.height, f.height * 300, id);
    assert(layout.image.top >= 0,id);
    assert(layout.height < 300,id);
    // The registered base baseline remains inside the new frame.
    const removed = f.top * 300 - layout.image.top;
    assert(0.92 * 300 - removed < layout.height,id);
  }
});

test('a round uses one frame height across all city profiles', () => {
  const profiles = Object.values(framing.images).map(p => ({...p.normalized, background:framing.frame.background}));
  const crop = Math.max(0, Math.min(0.18,...profiles.map(f => f.top - 0.01)));
  const heights = profiles.map(f => cityImageLayout(f,300,crop).height);
  assert.equal(new Set(heights).size,1);
});
