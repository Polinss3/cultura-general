import { Pressable, View, Text } from 'react-native';

interface Props {
  coins: number;
  onPress?: () => void;
  showPlus?: boolean;
  small?: boolean;
}

export function CoinPill({ coins, onPress, showPlus, small }: Props) {
  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(232,160,48,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(232,160,48,0.35)',
        borderRadius: 99,
        paddingVertical: small ? 4 : 6,
        paddingHorizontal: small ? 10 : 12,
      }}
    >
      <Text style={{ fontSize: small ? 13 : 15 }}>🪙</Text>
      <Text style={{ color: '#e8a030', fontFamily: 'Outfit_700Bold', fontSize: small ? 13 : 15 }}>
        {coins.toLocaleString('es-ES')}
      </Text>
      {showPlus && (
        <Text style={{ color: '#e8a030', fontFamily: 'Outfit_700Bold', fontSize: small ? 14 : 16, marginLeft: 2 }}>＋</Text>
      )}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}
