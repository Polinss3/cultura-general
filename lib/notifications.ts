import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import i18n from './i18n';
import {
  MORNING_NOTIFICATION_ID,
  NOTIFICATION_OWNER,
  buildEveningNotificationPlan,
  eveningNotificationId,
  isManagedNotificationIdentifier,
  localDayKey,
} from './notificationPlan';

const NOTIFICATIONS_ENABLED_KEY = 'notifications_enabled_v2';
const NOTIFICATION_CONTEXT_KEY = 'notification_schedule_context_v2';
const DAILY_ROUTE = '/(tabs)/daily';
const ADVENTURE_ROUTE = '/(tabs)/adventure';

export interface NotificationScheduleContext {
  scope?: string;
  streak?: number;
  adventureLevel?: number;
  completedDayKey?: string | null;
}

export type NotificationRoute = typeof DAILY_ROUTE | typeof ADVENTURE_ROUTE;

let operationQueue: Promise<void> = Promise.resolve();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function enqueue<T>(operation: () => Promise<T>): Promise<T> {
  const result = operationQueue.then(operation, operation);
  operationQueue = result.then(() => undefined, () => undefined);
  return result;
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: i18n.t('notifications.channelName'),
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') {
    await ensureAndroidChannel();
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;
  await ensureAndroidChannel();
  return true;
}

function isLegacyMorningReminder(request: Notifications.NotificationRequest): boolean {
  if (isManagedNotificationIdentifier(request.identifier)) return false;
  const trigger = request.trigger as { type?: string; hour?: number; minute?: number } | null;
  const data = request.content.data as Record<string, unknown> | null | undefined;
  return !data?.owner &&
    (trigger?.type === 'daily' || trigger?.type === 'calendar') &&
    trigger.hour === 9 && trigger.minute === 0;
}

async function cancelManagedNotifications(includeLegacy = false): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(scheduled
    .filter(request =>
      isManagedNotificationIdentifier(request.identifier) ||
      (includeLegacy && isLegacyMorningReminder(request)))
    .map(request => Notifications.cancelScheduledNotificationAsync(request.identifier).catch(() => {})));
}

function normalizeContext(value: unknown): NotificationScheduleContext {
  if (!value || typeof value !== 'object') return {};
  const raw = value as NotificationScheduleContext;
  return {
    scope: typeof raw.scope === 'string' && raw.scope.trim() ? raw.scope : undefined,
    streak: typeof raw.streak === 'number' && Number.isFinite(raw.streak)
      ? Math.max(0, Math.trunc(raw.streak))
      : undefined,
    adventureLevel: typeof raw.adventureLevel === 'number' && Number.isFinite(raw.adventureLevel)
      ? Math.max(1, Math.trunc(raw.adventureLevel))
      : undefined,
    completedDayKey: typeof raw.completedDayKey === 'string' || raw.completedDayKey === null
      ? raw.completedDayKey
      : undefined,
  };
}

async function loadContext(): Promise<NotificationScheduleContext> {
  try {
    const raw = await AsyncStorage.getItem(NOTIFICATION_CONTEXT_KEY);
    return raw ? normalizeContext(JSON.parse(raw)) : {};
  } catch {
    return {};
  }
}

async function mergeAndSaveContext(
  update?: NotificationScheduleContext,
): Promise<NotificationScheduleContext> {
  const stored = await loadContext();
  const definedUpdate = Object.fromEntries(
    Object.entries(update ?? {}).filter(([, value]) => value !== undefined),
  );
  const scopeChanged = typeof update?.scope === 'string' &&
    typeof stored.scope === 'string' && update.scope !== stored.scope;
  const merged = normalizeContext({ ...(scopeChanged ? {} : stored), ...definedUpdate });
  await AsyncStorage.setItem(NOTIFICATION_CONTEXT_KEY, JSON.stringify(merged));
  return merged;
}

async function readEnabledPreference(): Promise<boolean> {
  const stored = await AsyncStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
  if (stored === 'true') return true;
  if (stored === 'false') return false;

  // Migration from v1: notifications were considered active when the old 09:00
  // reminder existed, but there was no explicit application preference.
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const enabled = scheduled.some(request =>
    isManagedNotificationIdentifier(request.identifier) || isLegacyMorningReminder(request));
  await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(enabled));
  return enabled;
}

function notificationData(kind: string, route: NotificationRoute) {
  return { owner: NOTIFICATION_OWNER, kind, route };
}

function personalizedReturnContent(context: NotificationScheduleContext): {
  title: string;
  body: string;
  route: NotificationRoute;
  kind: string;
} {
  if ((context.streak ?? 0) > 0) {
    return {
      title: i18n.t('notifications.returnStreakTitle'),
      body: i18n.t('notifications.returnStreakBody', { count: context.streak }),
      route: DAILY_ROUTE,
      kind: 'return-streak',
    };
  }
  if (context.adventureLevel) {
    return {
      title: i18n.t('notifications.returnAdventureTitle'),
      body: i18n.t('notifications.returnAdventureBody', { level: context.adventureLevel }),
      route: ADVENTURE_ROUTE,
      kind: 'return-adventure',
    };
  }
  return {
    title: i18n.t('notifications.returnTitle'),
    body: i18n.t('notifications.returnBody'),
    route: DAILY_ROUTE,
    kind: 'return',
  };
}

async function rebuildSchedule(context: NotificationScheduleContext): Promise<void> {
  await ensureAndroidChannel();
  await cancelManagedNotifications(true);

  const channelId = Platform.OS === 'android' ? 'default' : undefined;
  await Notifications.scheduleNotificationAsync({
    identifier: MORNING_NOTIFICATION_ID,
    content: {
      title: i18n.t('notifications.dailyTitle'),
      body: i18n.t('notifications.dailyBody'),
      data: notificationData('daily-morning', DAILY_ROUTE),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
      channelId,
    },
  });

  const now = new Date();
  const completedDayKey = context.completedDayKey === localDayKey(now)
    ? context.completedDayKey
    : null;
  const eveningPlan = buildEveningNotificationPlan(now, completedDayKey);
  const returnContent = personalizedReturnContent(context);

  for (const item of eveningPlan) {
    const personalized = item.kind === 'return';
    await Notifications.scheduleNotificationAsync({
      identifier: item.id,
      content: personalized ? {
        title: returnContent.title,
        body: returnContent.body,
        data: notificationData(returnContent.kind, returnContent.route),
      } : {
        title: i18n.t('notifications.dailyEveningTitle'),
        body: i18n.t('notifications.dailyEveningBody'),
        data: notificationData('daily-evening', DAILY_ROUTE),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: item.date,
        channelId,
      },
    });
  }
}

async function canSchedule(): Promise<boolean> {
  const [{ status }, enabled] = await Promise.all([
    Notifications.getPermissionsAsync(),
    readEnabledPreference(),
  ]);
  return status === 'granted' && enabled;
}

/** Enables notifications and creates the complete 09:00/20:00 local plan. */
export function scheduleDailyReminder(
  context?: NotificationScheduleContext,
): Promise<void> {
  return enqueue(async () => {
    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'true');
    const merged = await mergeAndSaveContext(context);
    try {
      await rebuildSchedule(merged);
    } catch {
      // Expo Go on iOS doesn't support local notification scheduling.
      console.log('[Notifications] scheduling not available in this environment');
    }
  });
}

/** Refreshes dates, inactivity target, language and personalization if enabled. */
export function syncNotificationSchedule(
  context?: NotificationScheduleContext,
): Promise<void> {
  return enqueue(async () => {
    if (!await canSchedule()) return;
    const merged = await mergeAndSaveContext(context);
    try {
      await rebuildSchedule(merged);
    } catch {
      console.log('[Notifications] scheduling not available in this environment');
    }
  });
}

export function rescheduleDailyReminderIfActive(): Promise<void> {
  return syncNotificationSchedule();
}

/** Disables every notification owned by the app without a global OS wipe. */
export function cancelDailyReminder(): Promise<void> {
  return enqueue(async () => {
    await AsyncStorage.setItem(NOTIFICATIONS_ENABLED_KEY, 'false');
    try {
      await cancelManagedNotifications(true);
    } catch {
      // ignore in Expo Go
    }
  });
}

/** Marks today's local daily question done and cancels only today's 20:00 slot. */
export function markDailyQuestionCompleted(date = new Date()): Promise<void> {
  return enqueue(async () => {
    const completedDayKey = localDayKey(date);
    await mergeAndSaveContext({ completedDayKey });
    try {
      await Notifications.cancelScheduledNotificationAsync(eveningNotificationId(date));
    } catch {
      // It may already have fired or notifications may be unavailable.
    }
  });
}

export async function getNotificationsEnabled(): Promise<boolean> {
  try {
    const [{ status }, enabled] = await Promise.all([
      Notifications.getPermissionsAsync(),
      readEnabledPreference(),
    ]);
    return status === 'granted' && enabled;
  } catch {
    return false;
  }
}

export function getNotificationRoute(
  response: Notifications.NotificationResponse | null | undefined,
): NotificationRoute | null {
  const data = response?.notification.request.content.data as Record<string, unknown> | undefined;
  if (data?.owner !== NOTIFICATION_OWNER) return null;
  if (data.route === DAILY_ROUTE || data.route === ADVENTURE_ROUTE) return data.route;
  return null;
}
