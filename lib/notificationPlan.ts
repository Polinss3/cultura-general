export const NOTIFICATION_OWNER = 'cg-trivia';
export const MORNING_NOTIFICATION_ID = 'cg-notification-morning-v2';
export const EVENING_NOTIFICATION_PREFIX = 'cg-notification-evening-v2-';
export const EVENING_HORIZON_DAYS = 60;
export const INACTIVITY_DAYS = 2;

export type EveningNotificationKind = 'daily-evening' | 'return';

export interface EveningNotificationPlanItem {
  id: string;
  kind: EveningNotificationKind;
  date: Date;
  dayKey: string;
}

function twoDigits(value: number): string {
  return String(value).padStart(2, '0');
}

/** Calendar key in the device's local timezone, not UTC. */
export function localDayKey(date: Date): string {
  return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`;
}

export function localDateAt(
  base: Date,
  dayOffset: number,
  hour: number,
  minute = 0,
): Date {
  return new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() + dayOffset,
    hour,
    minute,
    0,
    0,
  );
}

/**
 * Builds one (and only one) evening slot per local day. The inactivity message
 * replaces the generic daily reminder instead of being added to it.
 */
export function buildEveningNotificationPlan(
  now: Date,
  completedDayKey?: string | null,
  horizonDays = EVENING_HORIZON_DAYS,
  inactivityDays = INACTIVITY_DAYS,
): EveningNotificationPlanItem[] {
  const plan: EveningNotificationPlanItem[] = [];

  for (let offset = 0; offset < horizonDays; offset++) {
    const date = localDateAt(now, offset, 20);
    if (date.getTime() <= now.getTime()) continue;

    const dayKey = localDayKey(date);
    if (completedDayKey === dayKey) continue;

    plan.push({
      id: `${EVENING_NOTIFICATION_PREFIX}${dayKey}`,
      kind: offset === inactivityDays ? 'return' : 'daily-evening',
      date,
      dayKey,
    });
  }

  return plan;
}

export function isManagedNotificationIdentifier(identifier: string): boolean {
  return identifier === MORNING_NOTIFICATION_ID || identifier.startsWith(EVENING_NOTIFICATION_PREFIX);
}

export function eveningNotificationId(date = new Date()): string {
  return `${EVENING_NOTIFICATION_PREFIX}${localDayKey(date)}`;
}
