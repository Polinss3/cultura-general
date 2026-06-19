import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthCallbackScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <ActivityIndicator size="large" color="#e8a030" />
        <Text style={{
          color: '#fff',
          fontSize: 20,
          fontFamily: 'Outfit_700Bold',
          marginTop: 20,
          marginBottom: 8,
        }}>
          Completando acceso
        </Text>
        <Text style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: 14,
          fontFamily: 'Outfit_400Regular',
          textAlign: 'center',
        }}>
          Estamos cerrando el inicio de sesión de forma segura.
        </Text>
      </View>
    </SafeAreaView>
  );
}
