import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildEveningNotificationPlan,
  eveningNotificationId,
  localDayKey,
} from './notificationPlan';

test('the evening plan has at most one notification per local day', () => {
  const now = new Date(2026, 7, 28, 10, 30);
  const plan = buildEveningNotificationPlan(now);
  const days = plan.map(item => item.dayKey);

  assert.equal(plan.length, 60);
  assert.equal(new Set(days).size, plan.length);
  assert.equal(plan.filter(item => item.kind === 'return').length, 1);
  assert.equal(plan.find(item => item.kind === 'return')?.dayKey, '2026-08-30');
});

test('the personalized return message replaces that evening daily reminder', () => {
  const now = new Date(2026, 7, 28, 10, 30);
  const plan = buildEveningNotificationPlan(now, null, 5, 2);
  const returnItem = plan.find(item => item.kind === 'return');

  assert.ok(returnItem);
  assert.equal(plan.filter(item => item.dayKey === returnItem.dayKey).length, 1);
});

test('a completed daily question removes only its local evening slot', () => {
  const now = new Date(2026, 7, 28, 10, 30);
  const plan = buildEveningNotificationPlan(now, '2026-08-28', 5, 2);

  assert.equal(plan.length, 4);
  assert.equal(plan.some(item => item.dayKey === '2026-08-28'), false);
  assert.equal(plan.some(item => item.dayKey === '2026-08-29'), true);
});

test('today is omitted when 20:00 has already passed', () => {
  const now = new Date(2026, 7, 28, 20, 1);
  const plan = buildEveningNotificationPlan(now, null, 3, 2);

  assert.deepEqual(plan.map(item => item.dayKey), ['2026-08-29', '2026-08-30']);
});

test('identifiers use the same local calendar key as the plan', () => {
  const date = new Date(2026, 11, 3, 12);
  assert.equal(localDayKey(date), '2026-12-03');
  assert.equal(eveningNotificationId(date), 'cg-notification-evening-v2-2026-12-03');
});
