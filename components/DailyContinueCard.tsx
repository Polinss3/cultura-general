import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { logFunnelEvent } from '@/lib/funnel';
import { feedback } from '@/lib/feedback';
import { useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, cardShadow, inkButton, tint } from '@/constants/theme';

type ContinueMode = 'speed' | 'ladder' | 'years';

const MODES: { id: ContinueMode; icon: string; accent: (C: Palette) => string }[] = [
  { id: 'speed', icon: '⚡', accent: C => C.speed },
  { id: 'ladder', icon: '🪜', accent: C => C.streak },
  { id: 'years', icon: '📅', accent: C => C.streak },
];

/**
 * Cambia cada día para que quien solo abre la diaria vaya descubriendo modos.
 * Ascenso y Años son los que más se asocian con volver al día siguiente
 * (análisis del 2026-10-18), y Contrarreloj es el más corto.
 */
function modeForToday(date = new Date()): (typeof MODES)[number] {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return MODES[day % MODES.length];
}

/**
 * "¿Otra ronda?" justo debajo del resultado de la pregunta del día. La diaria
 * es una sola pregunta: sin esto, la sesión de la mayoría acababa ahí.
 */
export function DailyContinueCard() {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const router = useRouter();
  const mode = modeForToday();
  const accent = mode.accent(C);
  // El acento de Ascenso y Años es ámbar: el blanco encima no se lee. El botón
  // va en tinta, como el de compartir del resultado.
  const ink = inkButton(isDark);

  const play = () => {
    feedback.tap();
    logFunnelEvent('daily_continue_tap', mode.id);
    if (mode.id === 'speed') router.push('/speed');
    else if (mode.id === 'ladder') router.push('/ladder');
    else router.push({ pathname: '/(tabs)/challenges', params: { mode: 'years' } });
  };

  return (
    <Pressable
      onPress={play}
      accessibilityRole="button"
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12,
        backgroundColor: C.surface, borderRadius: Radius.card, padding: 14,
        borderWidth: 1.5, borderColor: accent,
        opacity: pressed ? 0.9 : 1,
        ...cardShadow(isDark),
      })}
    >
      <View style={{
        width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
        backgroundColor: tint(accent, isDark),
      }}>
        <Text style={{ fontSize: 22 }}>{mode.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 16 }}>
          {t('daily.continue.title')}
        </Text>
        <Text style={{ color: C.textMuted, fontFamily: Font.regular, fontSize: 13, marginTop: 2 }}>
          {t(`daily.continue.${mode.id}`)}
        </Text>
      </View>
      <View style={{ backgroundColor: ink.backgroundColor, borderRadius: Radius.pill, paddingHorizontal: 14, paddingVertical: 9 }}>
        <Text style={{ color: ink.color, fontFamily: Font.extra, fontSize: 14 }}>
          {t('daily.continue.cta')}
        </Text>
      </View>
    </Pressable>
  );
}
