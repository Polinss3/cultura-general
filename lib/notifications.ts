import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { supabase } from './supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Cultura General',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return true;
}

export async function scheduleDailyReminder(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🧠 ¡Tu pregunta del día te espera!',
        body: 'Responde hoy para mantener tu racha.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
      },
    });
  } catch {
    // Expo Go on iOS doesn't support local notification scheduling
    console.log('[Notifications] scheduling not available in this environment');
  }
}

export async function cancelDailyReminder(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // ignore in Expo Go
  }
}

export async function getNotificationsEnabled(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

// ─── Push token registration ──────────────────────────────────

function getProjectId(): string | undefined {
  const easId = Constants.expoConfig?.extra?.eas?.projectId;
  if (typeof easId === 'string') return easId;
  const fallback = (Constants as any).easConfig?.projectId;
  return typeof fallback === 'string' ? fallback : undefined;
}

async function getExpoPushToken(): Promise<string | null> {
  const projectId = getProjectId();
  if (!projectId) return null;
  try {
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    return data ?? null;
  } catch (err) {
    // Expo Go on real devices and simulators routinely fail here — that's
    // expected. Only report to Sentry to keep an eye on dev-build issues.
    Sentry.addBreadcrumb({ category: 'notifications', level: 'info', message: 'getExpoPushTokenAsync failed', data: { err: String(err) } });
    return null;
  }
}

export async function registerPushToken(userId: string): Promise<void> {
  const token = await getExpoPushToken();
  if (!token) return;
  const platform = Platform.OS === 'ios' || Platform.OS === 'android' ? Platform.OS : 'web';
  const { error } = await supabase
    .from('push_tokens')
    .upsert(
      { user_id: userId, token, platform, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,token' },
    );
  if (error) {
    Sentry.captureException(error, { tags: { area: 'push_tokens' } });
  }
}

export async function unregisterPushTokens(userId: string): Promise<void> {
  const token = await getExpoPushToken();
  if (!token) return;
  await supabase.from('push_tokens').delete().eq('user_id', userId).eq('token', token);
}
