import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { buildCityRound, cityDistractors, cityPool, cityRecordKey, isCity, parseCityCatalog,
  type City } from './cityCatalog';
const frame = { left: 0.05, top: 0.18, width: 0.88, height: 0.88, background: '#fef0d9' };
function city(id: string, tags = ['japanese'], extra: Partial<City> = {}): City {
  return { id, name: { es: id, en: id }, continent: 'asia', difficulty: 2,
    architecture_tags: tags, similar_city_ids: [], image_url: `https://example.com/${id}.webp`, framing: frame, ...extra };
}
const cities = [city('tokio'), city('osaka'), city('yokohama'), city('kioto'), city('madrid', ['iberian'], { continent: 'europa' })];
test('all questions show artwork and exactly four different city names', () => {
  for (let attempt = 0; attempt < 50; attempt++) {
    const round = buildCityRound(cities, 'all', 'all');
    assert.equal(round.length, 4);
    assert.equal(new Set(round.map(q => q.answer.id)).size, round.length);
    for (const q of round) {
      assert(q.answer.image_url);
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options.map(c => c.id)).size, 4);
      assert.equal(q.options.filter(c => c.id === q.answer.id).length, 1);
      assert(!q.options.some(c => c.id === 'madrid'));
    }
  }
});
test('names without artwork are distractors but never questions', () => {
  const catalog = [cities[0], ...cities.slice(1,4).map(c => ({ ...c, image_url: null, framing: null }))];
  const round = buildCityRound(catalog, 'all', 2);
  assert.equal(round.length, 1); assert.equal(round[0].options.length, 4);
});
test('curated visual similarities outrank geography and tag count', () => {
  const answer = city('a', ['japanese', 'modern'], { similar_city_ids: ['b', 'c', 'd'] });
  const catalog = [answer, city('same-country', ['japanese', 'modern']), ...['b','c','d'].map(id => city(id, ['other'], { continent: 'europa' }))];
  assert.deepEqual(cityDistractors(answer, catalog).map(c => c.id).sort(), ['b','c','d']);
});
test('scope and difficulty filter questions; distractors may come from elsewhere', () => {
  const catalog = cities.map((c,i) => ({ ...c, difficulty: i === 0 ? 1 as const : 3 as const }));
  assert.equal(buildCityRound(catalog, 'asia', 1).length, 1);
  assert.equal(buildCityRound(catalog, 'europa', 'all').length, 0);
  assert.equal(buildCityRound(catalog, 'all', 2).length, 0);
});
test('insufficient architectural matches do not produce easy random filler', () => {
  assert.equal(buildCityRound(cities.slice(0,3), 'all', 'all').length, 0);
  assert.equal(cityPool([], 'all', 'all').length, 0);
});
test('new remote id works without being compiled into the app', () => {
  const remote = city('newly-published-city', ['japanese']);
  assert(cityPool([...cities,remote], 'all', 'all').some(c => c.id === remote.id));
});
test('bad remote rows and duplicated ids are discarded', () => {
  const bad = [null, {}, { ...cities[0], image_url: 'javascript:alert(1)' }, { ...cities[0], name: { es: 'Tokyo' } },
    { ...cities[0], framing: { ...frame, width: -1 } }, { ...cities[0], framing: { ...frame, top: NaN } }];
  assert.deepEqual(parseCityCatalog([...bad,...cities,cities[0]]), cities);
  assert.throws(() => parseCityCatalog({}));
});
test('ambiguous translated names are never duplicate options', () => {
  const duplicate = city('tokio-duplicate', ['japanese'], { name: { es: 'Tókio', en: 'different' } });
  assert(!cityDistractors(cities[0], [...cities,duplicate]).some(c => c.id === duplicate.id));
});
test('round length is bounded, no question repeats, and input stays unchanged', () => {
  const before = JSON.stringify(cities);
  assert.equal(buildCityRound(cities, 'all', 'all', 2).length, 2);
  assert.equal(buildCityRound(cities, 'all', 'all', 0).length, 0);
  assert.equal(JSON.stringify(cities), before);
});
test('records do not mix shortened rounds, difficulties or scopes', () => {
  assert.notEqual(cityRecordKey('all','all',6), cityRecordKey('all','all',10));
  assert.notEqual(cityRecordKey('all',1,10), cityRecordKey('all',3,10));
  assert.notEqual(cityRecordKey('all',1,10), cityRecordKey('europa',1,10));
});
test('question profiles require an image and bilingual names', () => {
  assert(isCity(cities[0]));
  assert(!isCity({ ...cities[0], image_url: null }));
});

test('configured historic cities are playable and Chichen Itza can accompany Machu Picchu', () => {
  const proposed = JSON.parse(readFileSync(new URL('../docs/ciudades/catalogo-propuesto.json', import.meta.url), 'utf8'));
  const editorial = JSON.parse(readFileSync(new URL('../data/city-architecture.json', import.meta.url), 'utf8'));
  const tags = new Map<string, string[]>();
  for (const group of editorial.groups) for (const id of group.ids) {
    tags.set(id, [...(tags.get(id) ?? []), group.tag]);
  }
  const catalog = parseCityCatalog(proposed.cities.map((entry: { id: string; name: City['name']; continent: string; conceptImage?: string }) => {
    const override = editorial.overrides[entry.id] ?? {};
    return { id: entry.id, name: { ...entry.name, ...override.name }, continent: entry.continent,
      difficulty: override.difficulty ?? 2, architecture_tags: tags.get(entry.id) ?? [],
      similar_city_ids: override.similar ?? [], image_url: entry.conceptImage ? `https://example.com/${entry.id}.webp` : null,
      framing: entry.conceptImage ? frame : null };
  }));
  const machu = catalog.find(c => c.id === 'machu-picchu')!;
  const chichen = catalog.find(c => c.id === 'chichen-itza')!;
  assert(machu && chichen);
  const playable = cityPool(catalog, 'all', 'all');
  for (const id of ['machu-picchu', 'chichen-itza', 'petra', 'pompeya', 'teotihuacan', 'tikal', 'efeso', 'persepolis']) {
    assert(playable.some(c => c.id === id), id);
  }
  for (const id of ['sintra', 'bagan', 'san-miguel-de-allende', 'zanzibar', 'carcasona', 'luang-prabang', 'jiva', 'lalibela']) {
    assert(playable.some(c => c.id === id), id);
  }
  assert(cityDistractors(chichen, catalog).some(c => c.id === machu.id));
  let seed = 17;
  const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 2 ** 32; };
  const alternatives = new Set(Array.from({ length: 20 }, () => cityDistractors(machu, catalog, random)).flat().map(c => c.id));
  assert(alternatives.has(chichen.id), 'Chichen Itza must not be permanently outranked by the existing Andean alternatives');
});
