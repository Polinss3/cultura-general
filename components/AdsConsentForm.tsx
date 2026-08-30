import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ADS_MIN_AGE, type AdsAgeBracket, type AdsConsentDecision } from '@/stores/adsConsentStore';
import { openAppodealPrivacyOptions } from '@/lib/ads';
import { getCurrentLang } from '@/lib/i18n';
import { Font, Radius, Space } from '@/constants/theme';
import { useTheme } from '@/constants/colors';

const PRIVACY_URL_ES = 'https://cg-trivia.pablobrasero.com/privacy';
const PRIVACY_URL_EN = 'https://cg-trivia.pablobrasero.com/en/privacy';

function privacyUrl() {
  return getCurrentLang() === 'en' ? PRIVACY_URL_EN : PRIVACY_URL_ES;
}

export type AdsConsentInput = {
  ageBracket: AdsAgeBracket;
};

type Props = {
  initialDecision: AdsConsentDecision | null;
  onSave: (input: AdsConsentInput) => Promise<void>;
  /** Solo lo pasa la revisión desde Ajustes; en el onboarding no hay salida. */
  onCancel?: () => void;
  /** Se reinicia el tramo cuando el contenedor vuelve a mostrarse. */
  resetKey?: unknown;
};

/**
 * Aviso propio de edad previo al CMP oficial de Appodeal:
 * lo usan tanto el onboarding (obligatorio, sin salida) como la revisión de
 * preferencias desde Ajustes.
 */
export function AdsConsentForm({ initialDecision, onSave, onCancel, resetKey }: Props) {
  const { t } = useTranslation();
  const { C } = useTheme();
  const [ageBracket, setAgeBracket] = useState<AdsAgeBracket | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAgeBracket(initialDecision?.ageBracket ?? null);
  }, [initialDecision, resetKey]);

  const save = async () => {
    if (!ageBracket || saving) return;
    setSaving(true);
    try {
      await onSave({ ageBracket });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: Space.screen, justifyContent: 'center' }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 26, marginBottom: 10 }}>
        {t('adsConsent.title')}
      </Text>
      <Text style={{ color: C.textBody, fontFamily: Font.regular, fontSize: 15, lineHeight: 22, marginBottom: 24 }}>
        {t('adsConsent.intro')}
      </Text>

      <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 16, marginBottom: 12 }}>
        {t('adsConsent.ageQuestion')}
      </Text>
      <View style={{ gap: 10, marginBottom: 22 }}>
        {(['adult', 'minor'] as AdsAgeBracket[]).map(value => {
          const selected = ageBracket === value;
          return (
            <Pressable
              key={value}
              onPress={() => setAgeBracket(value)}
              style={{
                padding: 15,
                borderRadius: Radius.card,
                borderWidth: 1.5,
                borderColor: selected ? C.brand : C.border,
                backgroundColor: selected ? C.surfaceSunk : C.surface,
              }}
            >
              <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 15 }}>
                {t(`adsConsent.age.${value}`, { age: ADS_MIN_AGE })}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {ageBracket === 'minor' ? (
        <>
          <Text style={{ color: C.textBody, fontFamily: Font.regular, fontSize: 14, lineHeight: 21, marginBottom: 18 }}>
            {t('adsConsent.minorExplanation')}
          </Text>
          <PrimaryButton label={t('adsConsent.continue')} disabled={saving} onPress={save} />
        </>
      ) : ageBracket === 'adult' ? (
        <>
          <Text style={{ color: C.textBody, fontFamily: Font.regular, fontSize: 14, lineHeight: 21, marginBottom: 18 }}>
            {t('adsConsent.adultExplanation')}
          </Text>
          <PrimaryButton label={t('adsConsent.continue')} disabled={saving} onPress={save} />
        </>
      ) : null}

      {initialDecision?.ageBracket === 'adult' && (
        <Pressable onPress={() => { void openAppodealPrivacyOptions(); }} style={{ paddingTop: 16 }}>
          <Text style={{ color: C.brandDeep, fontFamily: Font.bold, fontSize: 13, textAlign: 'center' }}>
            {t('adsConsent.providerPrivacy')}
          </Text>
        </Pressable>
      )}

      <Pressable onPress={() => Linking.openURL(privacyUrl())} style={{ paddingVertical: 16 }}>
        <Text style={{ color: C.brandDeep, fontFamily: Font.bold, fontSize: 13, textAlign: 'center' }}>
          {t('adsConsent.privacyLink')}
        </Text>
      </Pressable>
      {onCancel && (
        <Pressable onPress={onCancel} style={{ paddingVertical: 10 }}>
          <Text style={{ color: C.textMuted, fontFamily: Font.semi, textAlign: 'center' }}>
            {t('common.cancel')}
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );

  function PrimaryButton({ label, disabled, onPress }: { label: string; disabled: boolean; onPress: () => void }) {
    return (
      <Pressable
        disabled={disabled}
        onPress={onPress}
        style={{ padding: 16, borderRadius: Radius.card, backgroundColor: C.brand, alignItems: 'center' }}
      >
        <Text style={{ color: C.onBrand, fontFamily: Font.bold, fontSize: 15 }}>{label}</Text>
      </Pressable>
    );
  }
}
