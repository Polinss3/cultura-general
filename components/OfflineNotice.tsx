import { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { probeConnection, setOffline } from '@/lib/offline';

interface Props {
  title?: string;
  description?: string;
}

// Aviso a pantalla completa para los modos que requieren conexión (Diario,
// Amigos). Espejo visual de `GuestGate`. El botón "Reintentar" vuelve a sondear
// la red y, si hay conexión, sale del modo sin conexión.
export function OfflineNotice({
  title = 'Sin conexión',
  description = 'Este modo necesita conexión a internet. Mientras tanto puedes jugar a Contrarreloj y Aprender.',
}: Props) {
  const [checking, setChecking] = useState(false);

  const retry = async () => {
    setChecking(true);
    const online = await probeConnection();
    setChecking(false);
    if (online) setOffline(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 64, marginBottom: 20 }}>📡</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 10, textAlign: 'center' }}>
          {title}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, fontFamily: 'Outfit_400Regular', lineHeight: 22, textAlign: 'center', marginBottom: 36, maxWidth: 300 }}>
          {description}
        </Text>

        <Pressable onPress={retry} disabled={checking} style={{ width: '100%', maxWidth: 320 }}>
          <LinearGradient
            colors={['#e8a030', '#e83060']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: 14, padding: 16, alignItems: 'center' }}
          >
            {checking ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' }}>
                Reintentar
              </Text>
            )}
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
