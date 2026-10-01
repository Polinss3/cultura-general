import { useRef, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useIsPro } from '@/hooks/usePremium';
import { ProBadge } from '@/components/ProBadge';
import { useToast } from '@/context/ToastContext';
import { feedback } from '@/lib/feedback';
import {
  APP_ICONS, appIconsSupported, getCurrentAppIcon, setAppIcon, type AppIconOption,
} from '@/lib/appIcon';
import { alpha, useTheme } from '@/constants/colors';
import { Font, Radius, Space, Type } from '@/constants/theme';

const TILE_ICON = 72;

export default function AppIconScreen() {
  const { t } = useTranslation();
  const { C } = useTheme();
  const router = useRouter();
  const isPro = useIsPro();
  const { showToast } = useToast();

  const supported = appIconsSupported();
  const [current, setCurrent] = useState(getCurrentAppIcon);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const choose = async (option: AppIconOption) => {
    if (busyRef.current || option.id === current) return;
    if (option.pro && !isPro) {
      feedback.tap();
      router.push('/paywall?source=app_icon' as any);
      return;
    }
    feedback.select();
    busyRef.current = true;
    setBusy(true);
    try {
      const ok = await setAppIcon(option.id);
      if (ok) setCurrent(option.id);
      else {
        setCurrent(getCurrentAppIcon());
        showToast({ type: 'error', message: t('appIcon.error') });
      }
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 14,
        paddingHorizontal: Space.screen, paddingTop: 16, paddingBottom: 8,
      }}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button">
          <Text style={{ color: C.textMuted, fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={{ color: C.text, ...Type.navTitle, flex: 1 }}>{t('appIcon.title')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: Space.screen, paddingTop: 8, paddingBottom: 40, gap: 18 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: C.textMuted, ...Type.secondary }}>
          {supported ? t('appIcon.subtitle') : t('appIcon.unsupported')}
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {APP_ICONS.map(option => {
            const selected = option.id === current;
            const locked = option.pro && !isPro;
            return (
              <Pressable
                key={option.id}
                onPress={() => choose(option)}
                disabled={!supported || busy}
                accessibilityRole="button"
                accessibilityState={{ selected, disabled: !supported || busy }}
                accessibilityLabel={t(`appIcon.names.${option.id}`)}
                style={({ pressed }) => ({
                  width: '31%', flexGrow: 1,
                  alignItems: 'center', gap: 8,
                  paddingVertical: 14, paddingHorizontal: 6,
                  borderRadius: Radius.card,
                  backgroundColor: selected ? alpha(C.brand, 0.1) : C.surface,
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected ? C.brand : C.border,
                  opacity: !supported ? 0.5 : pressed ? 0.85 : 1,
                })}
              >
                <View>
                  <Image
                    source={option.preview}
                    style={{
                      width: TILE_ICON, height: TILE_ICON,
                      borderRadius: TILE_ICON * 0.225,
                      opacity: locked ? 0.55 : 1,
                    }}
                  />
                  {locked && (
                    <Text style={{ position: 'absolute', right: -6, bottom: -6, fontSize: 18 }}>🔒</Text>
                  )}
                </View>
                <Text
                  numberOfLines={1}
                  style={{ color: selected ? C.text : C.textBody, fontFamily: selected ? Font.bold : Font.semi, fontSize: 13 }}
                >
                  {t(`appIcon.names.${option.id}`)}
                </Text>
                {option.pro ? <ProBadge /> : (
                  <Text style={{ color: C.textFaint, ...Type.tiny }}>{t('appIcon.classic')}</Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {supported && Platform.OS === 'ios' && (
          <Text style={{ color: C.textFaint, ...Type.tiny, textAlign: 'center' }}>
            {t('appIcon.iosNotice')}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
