import { Pressable, View, Text } from 'react-native';
import { useColors } from '@/constants/colors';
import { Font, Radius } from '@/constants/theme';

interface Props {
  coins: number;
  onPress?: () => void;
  showPlus?: boolean;
  small?: boolean;
}

export function CoinPill({ coins, onPress, showPlus, small }: Props) {
  const C = useColors();

  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: C.coinTint,
        borderRadius: Radius.pill,
        paddingVertical: small ? 6 : 8,
        paddingHorizontal: small ? 12 : 14,
      }}
    >
      <Text style={{ fontSize: small ? 13 : 15 }}>🪙</Text>
      <Text style={{ color: C.coinText, fontFamily: Font.extra, fontSize: small ? 13 : 15 }}>
        {coins.toLocaleString('es-ES')}
      </Text>
      {showPlus && (
        <Text style={{ color: C.coinText, fontFamily: Font.extra, fontSize: small ? 14 : 16, marginLeft: 2 }}>
          ＋
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}
