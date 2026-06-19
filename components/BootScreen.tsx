import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  // Si true, muestra el botón "Continuar sin conexión".
  showOfflineButton: boolean;
  onContinueOffline: () => void;
}

// Pantalla de carga propia (sustituye al `return null` mientras la app arranca).
// Mantiene la estética de la splash y, si el arranque se alarga, ofrece la
// entrada al modo sin conexión.
export function BootScreen({ showOfflineButton, onContinueOffline }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <ActivityIndicator color="#e8a030" size="large" />

      {showOfflineButton && (
        <View style={{ position: 'absolute', bottom: 60, left: 24, right: 24, alignItems: 'center' }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'Outfit_400Regular', textAlign: 'center', marginBottom: 14 }}>
            Esto está tardando más de lo normal. ¿Sin conexión?
          </Text>
          <Pressable onPress={onContinueOffline} style={{ width: '100%', maxWidth: 320 }}>
            <LinearGradient
              colors={['#e8a030', '#e83060']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 14, padding: 16, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' }}>
                Continuar sin conexión
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}
    </View>
  );
}
