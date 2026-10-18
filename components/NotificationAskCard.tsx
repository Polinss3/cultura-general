import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestNotificationPermission, scheduleDailyReminder } from '@/lib/notifications';
import { syncPushRegistration } from '@/lib/push';
import { logFunnelEvent, logFunnelEventOnce } from '@/lib/funnel';
import { feedback } from '@/lib/feedback';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/constants/colors';
import { Font, Radius, cardShadow } from '@/constants/theme';

const DISMISSED_KEY = 'notif_ask_dismissed_v1';

/**
 * Pide el permiso de avisos después de responder la pregunta del día, en vez
 * de en el onboarding (2.4.0). Ahí era una pantalla más antes de jugar; aquí
 * "te aviso mañana con la siguiente" se entiende solo. Solo aparece si el
 * sistema todavía puede preguntar y no se ha descartado antes.
 */
export function NotificationAskCard({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const { showToast } = useToast();
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [perm, dismissed] = await Promise.all([
          Notifications.getPermissionsAsync(),
          AsyncStorage.getItem(DISMISSED_KEY),
        ]);
        if (cancelled || dismissed || perm.status === 'granted' || !perm.canAskAgain) return;
        setVisible(true);
        logFunnelEventOnce('notif_ask_shown');
      } catch {
        // Sin módulo de avisos (web, Expo Go): no hay nada que pedir.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    logFunnelEvent('notif_ask_dismiss');
    void AsyncStorage.setItem(DISMISSED_KEY, '1').catch(() => {});
  };

  const accept = async () => {
    if (busy) return;
    feedback.tap();
    setBusy(true);
    const granted = await requestNotificationPermission().catch(() => false);
    logFunnelEvent('notif_ask_accept', granted ? 'granted' : 'denied');
    if (granted) {
      await scheduleDailyReminder();
      void syncPushRegistration(userId);
      showToast({ type: 'success', message: t('daily.notifyAsk.done') });
    }
    // Aceptado o denegado en el diálogo del sistema: no se vuelve a ofrecer.
    void AsyncStorage.setItem(DISMISSED_KEY, '1').catch(() => {});
    setBusy(false);
    setVisible(false);
  };

  return (
    <View style={{
      marginTop: 12, backgroundColor: C.surface, borderRadius: Radius.card, padding: 16,
      borderWidth: 1, borderColor: C.border, gap: 12,
      ...cardShadow(isDark),
    }}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Text style={{ fontSize: 28 }}>🔔</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 16 }}>
            {t('daily.notifyAsk.title')}
          </Text>
          <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 13, marginTop: 2, lineHeight: 18 }}>
            {t('daily.notifyAsk.body')}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable
          onPress={dismiss}
          accessibilityRole="button"
          style={({ pressed }) => ({
            flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: Radius.pill,
            backgroundColor: C.surfaceSunk, opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 14 }}>{t('daily.notifyAsk.later')}</Text>
        </Pressable>
        <Pressable
          onPress={accept}
          disabled={busy}
          accessibilityRole="button"
          style={({ pressed }) => ({
            flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: Radius.pill,
            backgroundColor: C.brand, opacity: pressed || busy ? 0.85 : 1,
          })}
        >
          <Text style={{ color: C.onBrand, fontFamily: Font.extra, fontSize: 14 }}>{t('daily.notifyAsk.cta')}</Text>
        </Pressable>
      </View>
    </View>
  );
}
