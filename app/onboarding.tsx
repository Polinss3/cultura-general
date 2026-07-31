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
import { setAppLanguage, AppLang, getCurrentLang } from '@/lib/i18n';
import { useThemePreference, setThemePreference } from '@/lib/appearance';
import { ThemePreview } from '@/components/ThemePreview';
import { feedback } from '@/lib/feedback';
import { CAT_COLORS, CAT_ICONS, ALL_CATEGORIES } from '@/constants/questions';
import { REWARDS } from '@/lib/economy';
import { Category } from '@/types';
import type { TFunction } from 'i18next';
import { readableOn, useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow, highlightGradient, inkButton, tint, warmGradient } from '@/constants/theme';

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
  const { C, isDark } = useTheme();
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

  // Idioma elegido en esta pantalla. Se aplica al momento para que los textos
  // de aquí mismo cambien, pero no se avanza: el paso lo cierra "Continuar",
  // que da tiempo a elegir también el tema.
  const [pendingLang, setPendingLang] = useState<AppLang>(getCurrentLang());
  const themePref = useThemePreference();

  const handleLanguage = async (lang: AppLang) => {
    feedback.select();
    setPendingLang(lang);
    await setAppLanguage(lang);
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
    // El idioma se aplica al tocar, para que el resto de esta misma pantalla
    // ya cambie. El tema también: la pantalla entera adopta el elegido.
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <View style={{ flex: 1, overflow: 'hidden' }}>
          <View style={{ paddingHorizontal: 24, paddingTop: 12 }}>
            <Text style={{
              color: C.text, fontSize: 26, fontFamily: Font.black,
              textAlign: 'center', lineHeight: 34, marginBottom: 6,
            }}>
              {t('onboarding.language.title')}
            </Text>
            <Text style={{
              color: C.textMuted, fontSize: 15, fontFamily: Font.regular,
              textAlign: 'center', lineHeight: 23, marginBottom: 16,
            }}>
              {t('onboarding.language.subtitle')}
            </Text>

            {/* Idioma */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 18 }}>
              {(['es', 'en'] as AppLang[]).map(lang => {
                const active = pendingLang === lang;
                return (
                  <Pressable
                    key={lang}
                    onPress={() => handleLanguage(lang)}
                    style={{
                      flex: 1, borderRadius: Radius.card, paddingVertical: 14, alignItems: 'center',
                      backgroundColor: active ? C.brand : C.surface,
                      borderWidth: 1.5, borderColor: active ? C.brand : C.border,
                    }}
                  >
                    <Text style={{
                      color: active ? C.onBrand : C.text,
                      fontSize: 16, fontFamily: active ? Font.extra : Font.bold,
                    }}>
                      {t(`onboarding.language.${lang}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Tema */}
            <Text style={{
              color: C.text, fontSize: 18, fontFamily: Font.black,
              textAlign: 'center', marginBottom: 4,
            }}>
              {t('onboarding.theme.title')}
            </Text>
            <Text style={{
              color: C.textMuted, fontSize: 14, fontFamily: Font.regular,
              textAlign: 'center', marginBottom: 14,
            }}>
              {t('onboarding.theme.subtitle')}
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              {(['light', 'dark'] as const).map(opt => {
                const active = themePref === opt;
                return (
                  <Pressable
                    key={opt}
                    onPress={() => { feedback.select(); setThemePreference(opt); }}
                    style={{
                      flex: 1, borderRadius: Radius.card, paddingVertical: 12,
                      alignItems: 'center', gap: 3,
                      backgroundColor: active ? C.brand : C.surface,
                      borderWidth: 1.5, borderColor: active ? C.brand : C.border,
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>{opt === 'light' ? '☀️' : '🌙'}</Text>
                    <Text style={{
                      color: active ? C.onBrand : C.text,
                      fontSize: 14, fontFamily: active ? Font.extra : Font.bold,
                    }}>
                      {t(`onboarding.theme.${opt}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Muestra de la home, cortada por abajo: enseña cómo queda el tema
              elegido sin ocupar una pantalla entera. */}
          <View style={{
            flex: 1, marginHorizontal: 24,
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            borderWidth: 1, borderBottomWidth: 0, borderColor: C.border,
            overflow: 'hidden',
          }}>
            <ThemePreview dark={isDark} />
          </View>
        </View>

        {/* Continuar: fijo abajo, sobre la muestra. */}
        <View style={{
          paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24,
          backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border,
        }}>
          <Pressable onPress={() => setLangChosen(true)}>
            <View style={{
              borderRadius: 18, paddingVertical: 16, alignItems: 'center',
              backgroundColor: C.brand,
            }}>
              <Text style={{ color: C.onBrand, fontSize: 16, fontFamily: Font.extra }}>
                {t('common.continue')}
              </Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!interestsChosen) {
    const canContinue = interests.size > 0;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ flex: 1, padding: 24 }}>
          <View style={{ alignItems: 'center', paddingTop: 8, marginBottom: 20 }}>
            <Text style={{ fontSize: 64, marginBottom: 16 }}>✨</Text>
            <Text style={{
              color: C.text,
              fontSize: 26,
              fontFamily: Font.black,
              textAlign: 'center',
              lineHeight: 34,
              marginBottom: 10,
            }}>
              {t('onboarding.interests.title')}
            </Text>
            <Text style={{
              color: C.textMuted,
              fontSize: 15,
              fontFamily: Font.regular,
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
                      borderRadius: Radius.pill,
                      backgroundColor: active ? col.bg : C.surface,
                      borderWidth: 1.5,
                      borderColor: active ? col.accent : C.border,
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{CAT_ICONS[c]}</Text>
                    <Text style={{
                      color: active ? col.text : C.textBody,
                      fontSize: 14,
                      fontFamily: active ? Font.bold : Font.semi,
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
                colors={canContinue ? [C.streak, C.wrong] : [C.track, C.track]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ borderRadius: Radius.card, padding: 18, alignItems: 'center' }}
              >
                <Text style={{
                  color: canContinue ? C.text : C.textFaint,
                  fontSize: 17,
                  fontFamily: Font.bold,
                }}>
                  {t('onboarding.interests.cta', { coins: REWARDS.welcomeBonus.coins })}
                </Text>
              </LinearGradient>
            </Pressable>
            <Text style={{
              color: C.textMuted,
              fontSize: 13,
              fontFamily: Font.regular,
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
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
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
                backgroundColor: i === step ? C.streak : C.track,
              }}
            />
          ))}
        </View>

        {/* Content */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
          <Text style={{ fontSize: 80, marginBottom: 32 }}>{current.icon}</Text>
          <Text style={{
            color: C.text,
            fontSize: 28,
            fontFamily: Font.black,
            textAlign: 'center',
            lineHeight: 36,
            marginBottom: 20,
          }}>
            {current.title}
          </Text>
          <Text style={{
            color: C.textMuted,
            fontSize: 16,
            fontFamily: Font.regular,
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
              colors={[C.brand, C.brand]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: Radius.card, padding: 18, alignItems: 'center' }}
            >
              <Text style={{ color: C.onBrand, fontSize: 17, fontFamily: Font.bold }}>
                {current.cta}
              </Text>
            </LinearGradient>
          </Pressable>

          {current.skip && (
            <Pressable onPress={handleSkip} style={{ alignItems: 'center', padding: 12 }}>
              <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 15 }}>
                {t('onboarding.skip')}
              </Text>
            </Pressable>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}
