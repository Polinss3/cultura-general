import { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, Linking, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { noteNudgeOutcome, subscribeReviewNudge } from '@/lib/reviewGate';
import { feedback } from '@/lib/feedback';
import { useTheme } from '@/constants/colors';
import { Font, Radius, cardShadow } from '@/constants/theme';
import { sheetWidth } from '@/constants/layout';

// La app en la App Store; `action=write-review` abre directamente el
// formulario de reseña, sin el límite de 3 al año del diálogo del sistema.
const APP_STORE_ID = '6766927114';
const WRITE_REVIEW_URL = `itms-apps://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`;
const WRITE_REVIEW_WEB = `https://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`;
const FEEDBACK_MAIL = 'mailto:pablobrasero@gmail.com?subject=Cultura%20General';

// Hoja propia de valoración. Se monta una vez en el root y espera al portero
// (lib/reviewGate.ts), que la dispara en los mismos momentos buenos que el
// diálogo nativo cuando a este ya no le quedan intentos.
export function ReviewNudgeSheet() {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => subscribeReviewNudge(() => setVisible(true)), []);

  const close = (outcome: 'positive' | 'feedback' | 'dismissed') => {
    setVisible(false);
    void noteNudgeOutcome(outcome);
  };

  const onLove = async () => {
    feedback.reward();
    close('positive');
    // `canOpenURL` con itms-apps exige declararlo en Info.plist; abrir
    // directamente y caer a la web si falla evita esa dependencia.
    try {
      await Linking.openURL(Platform.OS === 'ios' ? WRITE_REVIEW_URL : WRITE_REVIEW_WEB);
    } catch {
      try { await Linking.openURL(WRITE_REVIEW_WEB); } catch { /* sin tienda (simulador) */ }
    }
  };

  const onFeedback = async () => {
    feedback.tap();
    close('feedback');
    try { await Linking.openURL(FEEDBACK_MAIL); } catch { /* sin cliente de correo */ }
  };

  const button = (label: string, onPress: () => void, primary = false) => (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: primary ? C.brand : C.surfaceSunk,
        borderRadius: Radius.pill,
        paddingVertical: 13,
        alignItems: 'center',
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text style={{ color: primary ? C.onBrand : C.text, fontFamily: Font.extra, fontSize: 15 }}>{label}</Text>
    </Pressable>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => close('dismissed')}>
      <Pressable onPress={() => close('dismissed')} style={{ flex: 1, backgroundColor: 'rgba(43,38,33,0.55)', justifyContent: 'flex-end' }}>
        <Pressable onPress={() => {}} style={{
          ...sheetWidth, backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
          padding: 24, paddingBottom: 36, borderWidth: 1, borderColor: C.border, gap: 10, ...cardShadow(isDark),
        }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.textFaint, alignSelf: 'center', marginBottom: 8 }} />
          <Text style={{ fontSize: 40, textAlign: 'center' }}>🧠</Text>
          <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 20, textAlign: 'center' }}>
            {t('reviewNudge.title')}
          </Text>
          <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 8 }}>
            {t('reviewNudge.body')}
          </Text>
          {button(t('reviewNudge.love'), onLove, true)}
          {button(t('reviewNudge.feedback'), onFeedback)}
          <Pressable accessibilityRole="button" onPress={() => close('dismissed')} style={{ paddingVertical: 10, alignItems: 'center' }}>
            <Text style={{ color: C.textMuted, fontFamily: Font.semi, fontSize: 14 }}>{t('reviewNudge.later')}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
