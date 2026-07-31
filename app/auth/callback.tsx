import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { readableOn, useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow, highlightGradient, inkButton, tint, warmGradient } from '@/constants/theme';

export default function AuthCallbackScreen() {
  const { C, isDark } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <ActivityIndicator size="large" color={C.brand} />
        <Text style={{
          color: C.text,
          fontSize: 20,
          fontFamily: Font.bold,
          marginTop: 20,
          marginBottom: 8,
        }}>
          Completando acceso
        </Text>
        <Text style={{
          color: C.textMuted,
          fontSize: 14,
          fontFamily: Font.regular,
          textAlign: 'center',
        }}>
          Estamos cerrando el inicio de sesión de forma segura.
        </Text>
      </View>
    </SafeAreaView>
  );
}
