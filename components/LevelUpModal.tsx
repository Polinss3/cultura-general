import { Modal, View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Confetti } from './Confetti';
import { rankForLevel } from '@/lib/leveling';
import { REWARDS } from '@/lib/economy';
import { readableOn, useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow, highlightGradient, inkButton, tint, warmGradient } from '@/constants/theme';

interface Props {
  visible: boolean;
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ visible, level, onClose }: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const rank = rankForLevel(level);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(43,38,33,0.55)' /* velo en tinta cálida */, alignItems: 'center', justifyContent: 'center', padding: 28 }}>
        <Confetti active={visible} />
        <View
          style={{
            width: '100%',
            maxWidth: 340,
            backgroundColor: C.surface,
            borderRadius: 24,
            padding: 28,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: rank.color + '55',
          }}
        >
          <Text style={{ fontSize: 56, marginBottom: 8 }}>🎉</Text>
          <Text style={{ color: C.textMuted, fontFamily: Font.semi, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
            {t('components.levelUp.title')}
          </Text>
          <Text style={{ color: C.text, fontFamily: Font.black, fontSize: 40, marginVertical: 4 }}>
            {t('components.levelUp.level', { level })}
          </Text>
          <View style={{ backgroundColor: rank.color + '22', borderRadius: Radius.pill, paddingVertical: 4, paddingHorizontal: 14, marginBottom: 16 }}>
            <Text style={{ color: rank.color, fontFamily: Font.bold, fontSize: 14 }}>{t(`ranks.${rank.id}`)}</Text>
          </View>
          <Text style={{ color: C.textMuted, fontFamily: Font.semi, fontSize: 14, marginBottom: 22 }}>
            {t('components.levelUp.reward', { coins: REWARDS.levelUpBonus })}
          </Text>
          <Pressable onPress={onClose} style={{ width: '100%' }}>
            <LinearGradient
              colors={[rank.color, rank.color + 'aa']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 18, padding: 15, alignItems: 'center' }}
            >
              <Text style={{ color: C.text, fontFamily: Font.bold, fontSize: 16 }}>{t('components.levelUp.cta')}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
