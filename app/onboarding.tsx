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
import { logTutorialCompletion, startAppsFlyerAfterConsent } from '@/lib/appsflyer';
import { setAppLanguage, AppLang } from '@/lib/i18n';
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
  // Primera pantalla: elección de idioma. Al elegir, aplicamos el idioma
  // (persistido) para que el resto del onboarding ya salga en ese idioma.
  const [langChosen, setLangChosen] = useState(false);
  const [step, setStep] = useState(0);
  const steps = getSteps(t);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleLanguage = async (lang: AppLang) => {
    await setAppLanguage(lang);
    setLangChosen(true);
  };

  const finish = async (skipped = false) => {
    await setOnboardingCompleted(true);
    if (await startAppsFlyerAfterConsent()) {
      await logTutorialCompletion(skipped);
    }
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
      await finish(false);
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSkip = async () => {
    const decision = await ensureTrackingPermission();
    await syncMetaAdvertiserTracking(decision === 'granted');
    await finish(true);
  };

  if (!langChosen) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 80, marginBottom: 32 }}>🌐</Text>
          <Text style={{
            color: '#fff',
            fontSize: 28,
            fontFamily: 'Outfit_800ExtraBold',
            textAlign: 'center',
            lineHeight: 36,
            marginBottom: 12,
          }}>
            {t('onboarding.language.title')}
          </Text>
          <Text style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 15,
            fontFamily: 'Outfit_400Regular',
            textAlign: 'center',
            lineHeight: 24,
            maxWidth: 300,
            marginBottom: 40,
          }}>
            {t('onboarding.language.subtitle')}
          </Text>

          <View style={{ width: '100%', gap: 12 }}>
            {(['es', 'en'] as AppLang[]).map(lang => (
              <Pressable
                key={lang}
                onPress={() => handleLanguage(lang)}
                style={{
                  borderRadius: 16,
                  padding: 18,
                  alignItems: 'center',
                  backgroundColor: '#151515',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>
                  {t(`onboarding.language.${lang}`)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
