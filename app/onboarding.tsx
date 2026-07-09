import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  requestNotificationPermission,
  scheduleDailyReminder,
} from '@/lib/notifications';
import { setOnboardingCompleted } from '@/lib/onboarding';
import { ensureTrackingPermission } from '@/lib/tracking';
import { syncMetaAdvertiserTracking } from '@/lib/metaSdk';
import type { TFunction } from 'i18next';

// Iconos y flag skip por paso; el texto vive en i18n (`onboarding.stepN`).
const STEP_META = [
  { icon: '🧠', key: 'step0', skip: false },
  { icon: '🏆', key: 'step1', skip: false },
  { icon: '🔔', key: 'step2', skip: true },
] as const;

function getSteps(t: TFunction) {
  return STEP_META.map(m => ({
    icon: m.icon,
    skip: m.skip,
    title: t(`onboarding.${m.key}.title`, { appName: t('common.appName') }),
    body: t(`onboarding.${m.key}.body`),
    cta: t(`onboarding.${m.key}.cta`),
  }));
}

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const steps = getSteps(t);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  const finish = async () => {
    await setOnboardingCompleted(true);
    router.replace('/(tabs)');
  };

  const handleCta = async () => {
    if (isLast) {
      const granted = await requestNotificationPermission();
      if (granted) await scheduleDailyReminder();
      // Pedimos ATT aquí (no en el splash) para que iOS encuentre la app
      // en estado Active tras un gesto explícito del usuario, antes de
      // entrar a pantallas con AdMob.
      const decision = await ensureTrackingPermission();
      await syncMetaAdvertiserTracking(decision === 'granted');
      await finish();
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSkip = async () => {
    const decision = await ensureTrackingPermission();
    await syncMetaAdvertiserTracking(decision === 'granted');
    await finish();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>

        {/* Progress dots */}
        <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', paddingTop: 8 }}>
          {steps.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === step ? 20 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === step ? '#e8a030' : '#2a2a2a',
              }}
            />
          ))}
        </View>

        {/* Content */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
          <Text style={{ fontSize: 80, marginBottom: 32 }}>{current.icon}</Text>
          <Text style={{
            color: '#fff',
            fontSize: 28,
            fontFamily: 'Outfit_800ExtraBold',
            textAlign: 'center',
            lineHeight: 36,
            marginBottom: 20,
          }}>
            {current.title}
          </Text>
          <Text style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 16,
            fontFamily: 'Outfit_400Regular',
            textAlign: 'center',
            lineHeight: 26,
            maxWidth: 300,
          }}>
            {current.body}
          </Text>
        </View>

        {/* Actions */}
        <View style={{ gap: 12 }}>
          <Pressable onPress={handleCta}>
            <LinearGradient
              colors={['#e8a030', '#e83060']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 16, padding: 18, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>
                {current.cta}
              </Text>
            </LinearGradient>
          </Pressable>

          {current.skip && (
            <Pressable onPress={handleSkip} style={{ alignItems: 'center', padding: 12 }}>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit_400Regular', fontSize: 15 }}>
                {t('onboarding.skip')}
              </Text>
            </Pressable>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}
