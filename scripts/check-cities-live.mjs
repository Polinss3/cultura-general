#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';
import { parseCityCatalog, buildCityRound, cityPool, CITY_CONTINENTS } from '../lib/cityCatalog.ts';
const ref = fs.readFileSync(new URL('../supabase/.temp/project-ref', import.meta.url), 'utf8').trim();
const keys = JSON.parse(execFileSync('supabase', ['projects','api-keys','--project-ref',ref,'--output','json'], { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }));
const anon = keys.find(k => k.name === 'anon')?.api_key;
assert(anon, 'Anonymous key unavailable');
const client = createClient(`https://${ref}.supabase.co`, anon, { auth: { persistSession: false } });
const { data, error } = await client.from('city_catalog').select('*').order('id');
assert.equal(error, null);
assert(data.length > 0);
assert(data.every(row => row.is_published), 'Unpublished row leaked');
const cities = parseCityCatalog(data);
assert.equal(cities.length, data.length, 'Malformed published row');
const questions = cityPool(cities,'all','all');
for (const c of questions) {
  assert.equal((await fetch(c.image_url, {method:'HEAD'})).status, 200, `Artwork inaccessible: ${c.id}`);
}
for (const scope of ['all',...CITY_CONTINENTS]) for (const difficulty of ['all',1,2,3]) {
  const round = buildCityRound(cities,scope,difficulty);
  for(const q of round) {
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(c=>c.id)).size,4);
    assert.equal(q.options.filter(c=>c.id===q.answer.id).length,1);
  }
}
const denied = await client.from('city_catalog').insert({id:'anonymous-write-must-fail'});
assert.equal(denied.error?.code, '42501', 'Anonymous catalog writes must fail for insufficient privileges');
console.log(`Anonymous read OK: ${cities.length} bilingual names, ${questions.length} playable dioramas, all images reachable. All scope/difficulty rounds valid; anonymous writes denied.`);
