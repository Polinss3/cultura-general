import { Modal, View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Confetti } from './Confetti';
import { rankForLevel } from '@/lib/leveling';
import { REWARDS } from '@/lib/economy';

interface Props {
  visible: boolean;
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ visible, level, onClose }: Props) {
  const { t } = useTranslation();
  const rank = rankForLevel(level);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
        <Confetti active={visible} />
        <View
          style={{
            width: '100%',
            maxWidth: 340,
            backgroundColor: '#151515',
            borderRadius: 24,
            padding: 28,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: rank.color + '55',
          }}
        >
          <Text style={{ fontSize: 56, marginBottom: 8 }}>🎉</Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Outfit_600SemiBold', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
            {t('components.levelUp.title')}
          </Text>
          <Text style={{ color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 40, marginVertical: 4 }}>
            {t('components.levelUp.level', { level })}
          </Text>
          <View style={{ backgroundColor: rank.color + '22', borderRadius: 99, paddingVertical: 4, paddingHorizontal: 14, marginBottom: 16 }}>
            <Text style={{ color: rank.color, fontFamily: 'Outfit_700Bold', fontSize: 14 }}>{t(`ranks.${rank.id}`)}</Text>
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Outfit_500Medium', fontSize: 14, marginBottom: 22 }}>
            {t('components.levelUp.reward', { coins: REWARDS.levelUpBonus })}
          </Text>
          <Pressable onPress={onClose} style={{ width: '100%' }}>
            <LinearGradient
              colors={[rank.color, rank.color + 'aa']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 14, padding: 15, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 16 }}>{t('components.levelUp.cta')}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
