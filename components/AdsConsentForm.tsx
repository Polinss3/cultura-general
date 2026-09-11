import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  ADS_MIN_AGE,
  type AdsAgeBracket,
  type AdsConsentDecision,
} from '@/stores/adsConsentStore';
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
  /** Se reinicia la selección cuando el contenedor vuelve a mostrarse. */
  resetKey?: unknown;
};

/**
 * Aviso de edad. Es la única fuente de la copia legal: lo usan tanto el
 * onboarding (obligatorio, sin salida) como la revisión desde Ajustes.
 *
 * Una sola pregunta desde que la publicidad es propia: los anuncios no tratan
 * identificadores ni datos personales, así que no hay consentimiento que pedir.
 * Solo el tramo de edad, porque el SDK exige `adult` y no lo determina solo.
 * La segunda pregunta (medición con ATT, AppsFlyer y Meta) se retiró junto con
 * esos SDKs: sin campañas de captación no había nada que medir.
 *
 * Los insets se aplican aquí y no en un `SafeAreaView` del contenedor: dentro
 * de un `Modal` a pantalla completa el nativo devolvía 0 y el título quedaba
 * bajo la barra de estado.
 */
export function AdsConsentForm({ initialDecision, onSave, onCancel, resetKey }: Props) {
  const { t } = useTranslation();
  const { C } = useTheme();
  const insets = useSafeAreaInsets();
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
      contentContainerStyle={{
        flexGrow: 1,
        padding: Space.screen,
        paddingTop: Math.max(insets.top, Space.screen),
        paddingBottom: Math.max(insets.bottom, Space.screen),
        justifyContent: 'center',
      }}
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

      {ageBracket && (
        <>
          <Text style={{ color: C.textBody, fontFamily: Font.regular, fontSize: 14, lineHeight: 21, marginBottom: 18 }}>
            {t(ageBracket === 'minor' ? 'adsConsent.minorExplanation' : 'adsConsent.adsExplanation')}
          </Text>
          <PrimaryButton
            label={t(ageBracket === 'minor' ? 'adsConsent.continueWithoutAds' : 'adsConsent.continue')}
            disabled={saving}
            onPress={save}
          />
        </>
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
