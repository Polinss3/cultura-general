import assert from 'node:assert/strict';
import test from 'node:test';
import {
  REVIEW_INTERVALS_DAYS,
  REVIEW_MAX_BOX,
  dueReviewItems,
  isReviewMastered,
  nextReviewBox,
  nextReviewDate,
  reviewIntervalDays,
  sortReviewQueue,
  type ReviewItem,
} from './review';

const NOW = new Date('2026-09-06T10:00:00.000Z');
const day = (offset: number) =>
  new Date(NOW.getTime() + offset * 24 * 60 * 60 * 1000).toISOString();

test('a correct answer moves up one box and a wrong one goes back to the first', () => {
  assert.equal(nextReviewBox(1, true), 2);
  assert.equal(nextReviewBox(4, true), 5);
  // Un fallo no baja una caja: vuelve a la primera, porque el intervalo largo
  // ya ha demostrado que era demasiado largo.
  assert.equal(nextReviewBox(5, false), 1);
  assert.equal(nextReviewBox(1, false), 1);
});

test('boxes never leave their range, whatever comes in', () => {
  assert.equal(nextReviewBox(REVIEW_MAX_BOX, true), REVIEW_MAX_BOX);
  assert.equal(nextReviewBox(0, true), 2);
  assert.equal(nextReviewBox(-3, true), 2);
  assert.equal(nextReviewBox(99, true), REVIEW_MAX_BOX);

  assert.equal(reviewIntervalDays(0), REVIEW_INTERVALS_DAYS[0]);
  assert.equal(reviewIntervalDays(99), REVIEW_INTERVALS_DAYS[REVIEW_MAX_BOX - 1]);
});

test('intervals grow with the box', () => {
  const intervals = Array.from({ length: REVIEW_MAX_BOX }, (_, i) => reviewIntervalDays(i + 1));
  for (let i = 1; i < intervals.length; i += 1) {
    assert.ok(intervals[i] > intervals[i - 1], 'each box spaces out further than the previous one');
  }
  assert.deepEqual(intervals, [...REVIEW_INTERVALS_DAYS]);
});

test('a question is mastered only by getting the last box right', () => {
  assert.equal(isReviewMastered(REVIEW_MAX_BOX, true), true);
  assert.equal(isReviewMastered(REVIEW_MAX_BOX, false), false);
  assert.equal(isReviewMastered(REVIEW_MAX_BOX - 1, true), false);
});

test('the next date follows the box the answer leads to', () => {
  // Acierto en caja 1 → caja 2 → tres días.
  assert.equal(nextReviewDate(1, true, NOW).toISOString(), day(3));
  // Fallo en caja 4 → vuelta a la caja 1 → un día.
  assert.equal(nextReviewDate(4, false, NOW).toISOString(), day(1));
});

test('only overdue items are due, and the boundary counts as due', () => {
  const items: ReviewItem[] = [
    { questionId: 'a', box: 1, dueAt: day(-2) },
    { questionId: 'b', box: 2, dueAt: NOW.toISOString() },
    { questionId: 'c', box: 3, dueAt: day(1) },
  ];
  const due = dueReviewItems(items, NOW);
  assert.deepEqual(due.map(i => i.questionId), ['a', 'b']);
});

test('the queue starts with the most overdue, then the weakest box', () => {
  const items: ReviewItem[] = [
    { questionId: 'reciente', box: 1, dueAt: day(-1) },
    { questionId: 'antigua-fuerte', box: 4, dueAt: day(-9) },
    { questionId: 'antigua-debil', box: 1, dueAt: day(-9) },
  ];
  assert.deepEqual(
    sortReviewQueue(items).map(i => i.questionId),
    ['antigua-debil', 'antigua-fuerte', 'reciente'],
  );
});
