#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';
import { parseCityCatalog, buildCityRound, cityPool, cityDistractors, citySimilarity, CITY_CONTINENTS } from '../lib/cityCatalog.ts';
const read = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
const local = read('../docs/ciudades/catalogo-propuesto.json').cities;
const framing = read('../constants/cityDioramaFraming.json');
const editorial = read('../data/city-architecture.json');
const ref = fs.readFileSync(new URL('../supabase/.temp/project-ref', import.meta.url), 'utf8').trim();
const keys = JSON.parse(execFileSync('supabase', ['projects','api-keys','--project-ref',ref,'--output','json'], { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }));
const anon = keys.find(k => k.name === 'anon')?.api_key;
assert(anon, 'Anonymous key unavailable');
const client = createClient(`https://${ref}.supabase.co`, anon, { auth: { persistSession: false } });
const data = [];
for (let offset = 0; ; offset += 500) {
  const page = await client.from('city_catalog').select('*').order('id').range(offset, offset + 499);
  assert.equal(page.error, null);
  data.push(...page.data);
  if (page.data.length < 500) break;
}
assert(data.length > 0);
assert(data.every(row => row.is_published), 'Unpublished row leaked');
const cities = parseCityCatalog(data);
assert.equal(cities.length, data.length, 'Malformed published row');
const questions = cityPool(cities,'all','all');
for (const c of local.filter(c => c.conceptImage && framing.images[c.id])) {
  const remote = cities.find(row => row.id === c.id);
  assert(remote, `Completed city not published: ${c.id}`);
  assert(questions.some(q => q.id === c.id), `Published city not playable: ${c.id}`);
  assert.deepEqual(remote.name, { ...c.name, ...editorial.overrides[c.id]?.name }, `Stale translation: ${c.id}`);
  assert.deepEqual(remote.framing, { ...framing.images[c.id].normalized, background: framing.frame.background }, `Stale framing: ${c.id}`);
}
for (const c of questions) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const options = [c, ...cityDistractors(c, cities)];
    assert.equal(options.length, 4, `Missing distractors: ${c.id}`);
    assert.equal(new Set(options.map(o => o.name.es)).size, 4);
    assert.equal(new Set(options.map(o => o.name.en)).size, 4);
    assert(options.slice(1).every(o => citySimilarity(c, o) >= 10), `Unrelated distractor: ${c.id}`);
  }
}
for (let offset = 0; offset < questions.length; offset += 3) {
  await Promise.all(questions.slice(offset, offset + 3).map(async c => {
    let response;
    for (let attempt = 0; attempt < 6; attempt++) {
      response = await fetch(c.image_url, { method: 'HEAD', signal: AbortSignal.timeout(15000) });
      if (response.status !== 429 && response.status < 500) break;
      const retryAfter = Number(response.headers.get('retry-after'));
      await new Promise(resolve => setTimeout(resolve, Math.max(retryAfter * 1000, 1000 * 2 ** attempt)));
    }
    assert.equal(response.status, 200, `Artwork inaccessible: ${c.id}`);
    assert(response.headers.get('content-type')?.includes('image/webp'), `Wrong artwork type: ${c.id}`);
  }));
  // Keep the operator's full-catalog check below the storage request burst limit.
  await new Promise(resolve => setTimeout(resolve, 250));
}
for (const scope of ['all',...CITY_CONTINENTS]) for (const difficulty of ['all',1,2,3]) {
  const round = buildCityRound(cities,scope,difficulty);
  assert.equal(round.length, Math.min(10, cityPool(cities, scope, difficulty).length));
  for(const q of round) {
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(c=>c.id)).size,4);
    assert.equal(q.options.filter(c=>c.id===q.answer.id).length,1);
  }
}
const denied = await client.from('city_catalog').insert({id:'anonymous-write-must-fail'});
assert.equal(denied.error?.code, '42501', 'Anonymous catalog writes must fail for insufficient privileges');
console.log(`Anonymous read OK: ${cities.length} bilingual names, ${questions.length} playable dioramas, all images reachable. All scope/difficulty rounds valid; anonymous writes denied.`);
console.log('Continents:', Object.fromEntries(CITY_CONTINENTS.map(scope => [scope, cityPool(cities,scope,'all').length])));
