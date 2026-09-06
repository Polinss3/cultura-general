import assert from 'node:assert/strict';
import test from 'node:test';
import {
  EXAM_PASS_MARK,
  EXAM_QUESTIONS,
  buildExam,
  examBand,
  examGrade,
  examPassed,
  examRewards,
  formatExamClock,
} from './exam';
import type { Category, Question } from '@/types';

const CATEGORIES: Category[] = [
  'historia', 'geografia', 'ciencia', 'arte', 'filosofia', 'deportes',
  'biologia', 'cine', 'musica', 'literatura', 'tecnologia', 'mitologia',
  'astronomia',
];

function pool(perCategory: Record<string, number>): Question[] {
  const questions: Question[] = [];
  for (const [category, amount] of Object.entries(perCategory)) {
    for (let i = 0; i < amount; i += 1) {
      questions.push({
        id: `${category}-${i}`,
        q: `${category} ${i}`,
        opts: ['a', 'b', 'c', 'd'],
        ans: 0,
        category: category as Category,
      });
    }
  }
  return questions;
}

// Barajado identidad: hace los tests deterministas sin tocar Math.random.
const noShuffle = <T,>(items: T[]): T[] => [...items];

test('the grade is the score out of ten with one decimal', () => {
  assert.equal(examGrade(40), 10);
  assert.equal(examGrade(0), 0);
  assert.equal(examGrade(20), 5);
  assert.equal(examGrade(31), 7.8);
  // Fuera de rango por arriba y por abajo se recorta en vez de desbordar.
  assert.equal(examGrade(99), 10);
  assert.equal(examGrade(-5), 0);
  assert.equal(examGrade(5, 0), 0);
});

test('grade bands follow the school scale', () => {
  assert.equal(examBand(0), 'fail');
  assert.equal(examBand(4.9), 'fail');
  assert.equal(examBand(EXAM_PASS_MARK), 'pass');
  assert.equal(examBand(6.9), 'pass');
  assert.equal(examBand(7), 'good');
  assert.equal(examBand(8.9), 'good');
  assert.equal(examBand(9), 'great');
  assert.equal(examBand(10), 'perfect');

  assert.equal(examPassed(4.9), false);
  assert.equal(examPassed(5), true);
});

test('rewards stay modest because the exam can be repeated at will', () => {
  const perfect = examRewards(EXAM_QUESTIONS);
  const failed = examRewards(10);

  assert.equal(failed.xp, 30);          // sin prima: 10 · 3
  assert.equal(perfect.xp, 160);        // 40 · 3 + 40 de prima
  assert.ok(perfect.coins < 50, 'a perfect exam must not pay for an expensive power-up');
  assert.ok(perfect.xp > failed.xp);
});

test('the exam spreads questions across categories instead of sampling blindly', () => {
  // Historia domina el banco diez a uno: un muestreo ciego lo llenaría casi
  // entero, y dos notas dejarían de ser comparables.
  const questions = buildExam(
    pool({ historia: 500, geografia: 50, ciencia: 50, arte: 50 }),
    EXAM_QUESTIONS,
    noShuffle,
  );

  assert.equal(questions.length, EXAM_QUESTIONS);
  const counts = new Map<string, number>();
  for (const question of questions) {
    counts.set(question.category!, (counts.get(question.category!) ?? 0) + 1);
  }
  assert.equal(counts.size, 4);
  assert.equal(counts.get('historia'), 10);
  assert.equal(counts.get('geografia'), 10);
});

test('a category that runs out does not block the rest of the exam', () => {
  const questions = buildExam(
    pool({ historia: 100, musica: 3 }),
    EXAM_QUESTIONS,
    noShuffle,
  );

  assert.equal(questions.length, EXAM_QUESTIONS);
  assert.equal(questions.filter(q => q.category === 'musica').length, 3);
  assert.equal(questions.filter(q => q.category === 'historia').length, 37);
});

test('a pool smaller than the exam is used whole and never repeats a question', () => {
  const small = pool({ historia: 12 });
  const questions = buildExam(small, EXAM_QUESTIONS, noShuffle);

  assert.equal(questions.length, 12);
  assert.equal(new Set(questions.map(q => q.id)).size, 12);
});

test('the exam never repeats a question', () => {
  const questions = buildExam(
    pool(Object.fromEntries(CATEGORIES.map(c => [c, 40]))),
    EXAM_QUESTIONS,
    noShuffle,
  );
  assert.equal(new Set(questions.map(q => q.id)).size, EXAM_QUESTIONS);
});

test('the clock reads as minutes and seconds and never goes negative', () => {
  assert.equal(formatExamClock(20 * 60 * 1000), '20:00');
  assert.equal(formatExamClock(61_000), '1:01');
  assert.equal(formatExamClock(1), '0:01');
  assert.equal(formatExamClock(0), '0:00');
  assert.equal(formatExamClock(-5_000), '0:00');
});
