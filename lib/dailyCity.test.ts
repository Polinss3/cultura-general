import assert from 'node:assert/strict';
import test from 'node:test';
import type { City } from './cityCatalog';
import { dailyCityQuestion, isCityDay, utcDayIndex } from './dailyCity';

const frame = { left: 0.05, top: 0.18, width: 0.88, height: 0.88, background: '#fef0d9' };
const city = (id: string): City => ({ id, name: { es: id, en: id }, continent: 'asia', difficulty: 2,
  architecture_tags: ['japanese'], similar_city_ids: [], image_url: `https://example.com/${id}.webp`, framing: frame });
const catalog = ['tokio', 'osaka', 'kioto', 'nara', 'kobe', 'sapporo'].map(city);
const sundays = Array.from({ length: 12 }, (_, i) => utcDayIndex(Date.UTC(2026, 9, 18)) + i * 7);

test('cities take the daily on Sundays (UTC) and on no other day', () => {
  assert.equal(new Date(Date.UTC(2026, 9, 18)).getUTCDay(), 0);
  assert(isCityDay(utcDayIndex(Date.UTC(2026, 9, 18, 0, 0))));
  assert(isCityDay(utcDayIndex(Date.UTC(2026, 9, 18, 23, 59))));
  for (let d = 12; d <= 17; d++) assert(!isCityDay(utcDayIndex(Date.UTC(2026, 9, d, 12))));
  assert.equal(dailyCityQuestion(catalog, sundays[0] + 1), null);
});

test('every phone gets the same city and options, whatever order the catalog arrives in', () => {
  for (const day of sundays) {
    const a = dailyCityQuestion(catalog, day)!;
    const b = dailyCityQuestion([...catalog].reverse(), day)!;
    assert.deepEqual(a.options.map(c => c.id), b.options.map(c => c.id));
    assert.equal(a.options[0].id, a.answer.id);
    assert.equal(new Set(a.options.map(c => c.id)).size, 4);
  }
});

test('consecutive Sundays go through the catalog without repeating', () => {
  const ids = sundays.slice(0, catalog.length).map(day => dailyCityQuestion(catalog, day)!.answer.id);
  assert.equal(new Set(ids).size, catalog.length);
});

test('without a playable catalog there is no city question', () => {
  assert.equal(dailyCityQuestion([], sundays[0]), null);
  assert.equal(dailyCityQuestion(catalog.slice(0, 3), sundays[0]), null);
});
