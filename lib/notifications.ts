import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import i18n from './i18n';

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
      name: i18n.t('notifications.channelName'),
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
        title: i18n.t('notifications.dailyTitle'),
        body: i18n.t('notifications.dailyBody'),
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

// Si hay un recordatorio programado, lo vuelve a crear en el idioma actual.
// Se llama al cambiar de idioma y al arrancar (por si el usuario cambió el
// idioma del sistema con la app cerrada, dejando textos en el idioma anterior).
export async function rescheduleDailyReminderIfActive(): Promise<void> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    if (scheduled.length > 0) await scheduleDailyReminder();
  } catch {
    // ignore in Expo Go
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
