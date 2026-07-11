import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  requestNotificationPermission,
  scheduleDailyReminder,
} from '@/lib/notifications';
import {
  setOnboardingCompleted,
  setInterests,
  markWelcomeRewardPending,
} from '@/lib/onboarding';
import { ensureTrackingPermission } from '@/lib/tracking';
import { syncMetaAdvertiserTracking } from '@/lib/metaSdk';
import { logTutorialCompletion, startAppsFlyerAfterConsent } from '@/lib/appsflyer';
import { setAppLanguage, AppLang } from '@/lib/i18n';
import { feedback } from '@/lib/feedback';
import { CAT_COLORS, CAT_ICONS, ALL_CATEGORIES } from '@/constants/questions';
import { REWARDS } from '@/lib/economy';
import { Category } from '@/types';
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
  const [interestsChosen, setInterestsChosen] = useState(false);
  const [interests, setInterestsSel] = useState<Set<Category>>(new Set());
  const [step, setStep] = useState(0);
  const steps = getSteps(t);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleLanguage = async (lang: AppLang) => {
    await setAppLanguage(lang);
    setLangChosen(true);
  };

  const toggleInterest = (cat: Category) => {
    feedback.select();
    setInterestsSel(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // Confirmar intereses: persistir, marcar la recompensa de bienvenida como
  // pendiente (se concede al entrar a la home ya con sesión) y seguir.
  const confirmInterests = async () => {
    feedback.reward();
    await setInterests(Array.from(interests));
    await markWelcomeRewardPending();
    setInterestsChosen(true);
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

  if (!interestsChosen) {
    const canContinue = interests.size > 0;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
        <View style={{ flex: 1, padding: 24 }}>
          <View style={{ alignItems: 'center', paddingTop: 8, marginBottom: 20 }}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>✨</Text>
            <Text style={{
              color: '#fff',
              fontSize: 26,
              fontFamily: 'Outfit_800ExtraBold',
              textAlign: 'center',
              lineHeight: 34,
              marginBottom: 10,
            }}>
              {t('onboarding.interests.title')}
            </Text>
            <Text style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 15,
              fontFamily: 'Outfit_400Regular',
              textAlign: 'center',
              lineHeight: 22,
              maxWidth: 320,
            }}>
              {t('onboarding.interests.subtitle')}
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {ALL_CATEGORIES.map(c => {
                const active = interests.has(c);
                const col = CAT_COLORS[c];
                return (
                  <Pressable
                    key={c}
                    onPress={() => toggleInterest(c)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      borderRadius: 99,
                      backgroundColor: active ? col.bg : '#151515',
                      borderWidth: 1.5,
                      borderColor: active ? col.accent : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{CAT_ICONS[c]}</Text>
                    <Text style={{
                      color: active ? col.text : 'rgba(255,255,255,0.6)',
                      fontSize: 14,
                      fontFamily: active ? 'Outfit_700Bold' : 'Outfit_500Medium',
                    }}>
                      {t(`categories.${c}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View style={{ gap: 8, paddingTop: 12 }}>
            <Pressable onPress={confirmInterests} disabled={!canContinue}>
              <LinearGradient
                colors={canContinue ? ['#e8a030', '#e83060'] : ['#2a2a2a', '#2a2a2a']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ borderRadius: 16, padding: 18, alignItems: 'center' }}
              >
                <Text style={{
                  color: canContinue ? '#fff' : 'rgba(255,255,255,0.3)',
                  fontSize: 17,
                  fontFamily: 'Outfit_700Bold',
                }}>
                  {t('onboarding.interests.cta', { coins: REWARDS.welcomeBonus.coins })}
                </Text>
              </LinearGradient>
            </Pressable>
            <Text style={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: 13,
              fontFamily: 'Outfit_400Regular',
              textAlign: 'center',
            }}>
              {t('onboarding.interests.hint')}
            </Text>
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
