import assert from 'node:assert/strict';
import test from 'node:test';
import {
  accuracy,
  accuracyTrend,
  bestCategory,
  fillWeeks,
  sortByDifficulty,
  startOfWeek,
  type WeeklyStat,
} from './stats';

test('accuracy is a percentage with one decimal, and null without answers', () => {
  assert.equal(accuracy(1, 3), 33.3);
  assert.equal(accuracy(50, 50), 100);
  assert.equal(accuracy(0, 10), 0);
  assert.equal(accuracy(0, 0), null);
  assert.equal(accuracy(5, -1), null);
});

test('difficulties are ordered by difficulty, not alphabetically', () => {
  // Alfabéticamente sería easy, hard, medium: justo el orden equivocado.
  const sorted = sortByDifficulty([
    { difficulty: 'hard', answered: 1, correct: 1 },
    { difficulty: 'easy', answered: 1, correct: 1 },
    { difficulty: 'medium', answered: 1, correct: 1 },
  ]);
  assert.deepEqual(sorted.map(s => s.difficulty), ['easy', 'medium', 'hard']);
});

test('the week starts on Monday in UTC', () => {
  // Domingo 6 de septiembre de 2026 pertenece a la semana del lunes 31 de agosto.
  assert.equal(startOfWeek(new Date('2026-09-06T23:00:00Z')).toISOString().slice(0, 10), '2026-08-31');
  assert.equal(startOfWeek(new Date('2026-08-31T00:00:00Z')).toISOString().slice(0, 10), '2026-08-31');
  assert.equal(startOfWeek(new Date('2026-09-01T12:00:00Z')).toISOString().slice(0, 10), '2026-08-31');
});

test('weeks without activity are filled in instead of being collapsed', () => {
  // El servidor solo manda semanas con respuestas. Pintarlas tal cual dibuja
  // una racha continua donde en realidad hubo un mes sin abrir la app.
  const weekly: WeeklyStat[] = [
    { week: '2026-08-31', answered: 20, correct: 15 },
    { week: '2026-07-27', answered: 10, correct: 5 },
  ];
  const filled = fillWeeks(weekly, 6, new Date('2026-09-06T12:00:00Z'));

  assert.equal(filled.length, 6);
  assert.equal(filled.at(-1)!.week, '2026-08-31');
  assert.equal(filled.at(-1)!.answered, 20);
  assert.equal(filled.filter(w => w.answered === 0).length, 4);
  // Y salen en orden cronológico, sin huecos entre semanas consecutivas.
  for (let i = 1; i < filled.length; i += 1) {
    const gap = new Date(filled[i].week).getTime() - new Date(filled[i - 1].week).getTime();
    assert.equal(gap, 7 * 24 * 60 * 60 * 1000);
  }
});

test('the trend needs enough answers on both sides before it says anything', () => {
  const week = (answered: number, correct: number, i: number): WeeklyStat =>
    ({ week: `w${i}`, answered, correct });

  // Ocho semanas, pero con cuatro respuestas: cualquier variación es ruido.
  const thin = Array.from({ length: 8 }, (_, i) => week(1, i > 3 ? 1 : 0, i));
  assert.equal(accuracyTrend(thin).trend, 'unknown');

  // Historial demasiado corto para comparar dos tramos.
  assert.equal(accuracyTrend([week(100, 90, 0)]).trend, 'unknown');
});

test('the trend only moves when the change is worth reporting', () => {
  const flatWeeks = Array.from({ length: 8 }, (_, i) => ({ week: `w${i}`, answered: 30, correct: 20 }));
  assert.equal(accuracyTrend(flatWeeks).trend, 'flat');

  const improving = [
    ...Array.from({ length: 4 }, (_, i) => ({ week: `w${i}`, answered: 30, correct: 15 })),
    ...Array.from({ length: 4 }, (_, i) => ({ week: `w${i + 4}`, answered: 30, correct: 27 })),
  ];
  const up = accuracyTrend(improving);
  assert.equal(up.trend, 'up');
  assert.equal(up.delta, 40);

  const worsening = [...improving].reverse();
  assert.equal(accuracyTrend(worsening).trend, 'down');
});

test('the best category ignores those without enough of a track record', () => {
  const stats = [
    { category: 'cine', total: 3, correct: 3 },        // 100 % con tres respuestas
    { category: 'historia', total: 80, correct: 64 },  // 80 % con recorrido
    { category: 'arte', total: 40, correct: 20 },
  ];
  assert.equal(bestCategory(stats)!.category, 'historia');
  assert.equal(bestCategory([{ category: 'x', total: 2, correct: 2 }]), null);
  assert.equal(bestCategory([]), null);
});
