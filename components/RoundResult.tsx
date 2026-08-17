import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Confetti } from '@/components/Confetti';
import { Pop } from '@/components/Pop';
import { useTheme } from '@/constants/colors';
import { Font, Space, cardShadow, highlightGradient } from '@/constants/theme';

interface Props {
  correct: number;
  total: number;
  /** Nombre del ámbito jugado, bajo el marcador. */
  scopeLabel: string;
  newRecord: boolean;
  confetti: boolean;
  onChangeScope: () => void;
  onPlayAgain: () => void;
}

/** Pantalla de resultado de una ronda. Compartida por Banderas y Años. */
export function RoundResult({
  correct, total, scopeLabel, newRecord, confetti, onChangeScope, onPlayAgain,
}: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const perfect = correct === total;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <Confetti active={confetti} />
      <View style={{ flex: 1, padding: Space.screen, alignItems: 'center', justifyContent: 'center' }}>
        <Pop>
          <LinearGradient
            colors={highlightGradient(isDark)}
            locations={[0, 0.7]}
            start={{ x: 0, y: 0 }} end={{ x: 0.4, y: 1 }}
            style={{
              alignItems: 'center', gap: 8, borderRadius: 26,
              paddingVertical: 28, paddingHorizontal: 24, width: '100%',
              borderWidth: 1.5, borderColor: C.borderWarm, ...cardShadow(isDark),
            }}
          >
            <Text style={{ fontSize: 52 }}>
              {perfect ? '🏆' : correct >= total / 2 ? '🎉' : '💪'}
            </Text>
            <Text style={{ color: C.text, fontSize: 30, fontFamily: Font.black }}>
              {correct} / {total}
            </Text>
            <Text style={{ color: C.textMuted, fontSize: 14, fontFamily: Font.regular, textAlign: 'center' }}>
              {scopeLabel}
            </Text>
            {newRecord && (
              <Text style={{ color: C.brandDeep, fontSize: 14, fontFamily: Font.extra, marginTop: 4 }}>
                {t('round.newRecord')}
              </Text>
            )}
          </LinearGradient>
        </Pop>

        <View style={{ flexDirection: 'row', gap: 10, width: '100%', marginTop: 24 }}>
          <Pressable onPress={onChangeScope} style={{ flex: 1 }}>
            <View style={{
              backgroundColor: C.surface, borderRadius: 18, padding: 15, alignItems: 'center',
              borderWidth: 1, borderColor: C.borderStrong,
            }}>
              <Text style={{ color: C.textBody, fontSize: 15, fontFamily: Font.extra }}>
                {t('round.changeScope')}
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={onPlayAgain} style={{ flex: 2 }}>
            <View style={{ backgroundColor: C.brand, borderRadius: 18, padding: 15, alignItems: 'center' }}>
              <Text style={{ color: C.onBrand, fontSize: 15, fontFamily: Font.extra }}>
                {t('round.playAgain')}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
