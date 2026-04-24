import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AnswerState } from '@/types';

interface Props {
  text: string;
  letter: string;
  state: AnswerState;
  onPress: () => void;
}

export function OptionBtn({ text, letter, state, onPress }: Props) {
  // Haptic feedback when answer is revealed
  useEffect(() => {
    if (state === 'correct') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (state === 'wrong') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [state]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const borderColor =
    state === 'correct' ? '#2ec87a' :
    state === 'wrong'   ? '#e83060' :
    state === 'selected'? '#fff'    : 'rgba(255,255,255,0.12)';

  const bg =
    state === 'correct' ? 'rgba(46,200,122,0.1)'  :
    state === 'wrong'   ? 'rgba(232,48,96,0.1)'   :
    state === 'selected'? 'rgba(255,255,255,0.08)' : 'transparent';

  const color =
    state === 'correct' ? '#2ec87a' :
    state === 'wrong'   ? '#e83060' : '#fff';

  const badgeBg =
    state === 'correct' ? 'rgba(46,200,122,0.2)'  :
    state === 'wrong'   ? 'rgba(232,48,96,0.2)'   :
    state === 'selected'? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)';

  const badgeColor =
    state === 'correct' ? '#2ec87a' :
    state === 'wrong'   ? '#e83060' : 'rgba(255,255,255,0.6)';

  return (
    <Pressable
      onPress={handlePress}
      style={{
        borderWidth: 1.5,
        borderColor,
        backgroundColor: bg,
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <View style={{
        width: 26, height: 26, borderRadius: 8,
        backgroundColor: badgeBg,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ color: badgeColor, fontSize: 12, fontFamily: 'Outfit_700Bold' }}>
          {letter}
        </Text>
      </View>
      <Text style={{ color, fontSize: 15, fontFamily: 'Outfit_500Medium', flex: 1 }}>
        {text}
      </Text>
    </Pressable>
  );
}
