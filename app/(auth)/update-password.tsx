import { useState } from 'react';
import {
  View, Text, TextInput, Pressable,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

const INPUT = {
  backgroundColor: '#151515',
  color: '#fff' as const,
  borderRadius: 14,
  padding: 16,
  marginBottom: 12,
  fontFamily: 'Outfit_400Regular',
  fontSize: 15,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.08)',
};

export default function UpdatePasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    if (!password || !confirm) { Alert.alert('Error', 'Rellena ambos campos'); return; }
    if (password !== confirm) { Alert.alert('Error', 'Las contraseñas no coinciden'); return; }
    if (password.length < 6) { Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres'); return; }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        '¡Contraseña actualizada!',
        'Tu contraseña se ha cambiado correctamente.',
        [{ text: 'Continuar', onPress: () => router.replace('/(tabs)') }]
      );
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
          <Text style={{ fontSize: 40, marginBottom: 8 }}>🔑</Text>
          <Text style={{ color: '#fff', fontSize: 28, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>
            Nueva contraseña
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Outfit_400Regular', marginBottom: 40 }}>
            Elige una contraseña segura para tu cuenta
          </Text>

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Nueva contraseña"
            placeholderTextColor="rgba(255,255,255,0.3)"
            secureTextEntry
            style={INPUT}
          />

          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Confirmar contraseña"
            placeholderTextColor="rgba(255,255,255,0.3)"
            secureTextEntry
            style={{ ...INPUT, marginBottom: 24 }}
          />

          <Pressable onPress={handleUpdate} disabled={loading}>
            <LinearGradient
              colors={['#e8a030', '#e83060']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 14, padding: 16, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' }}>
                {loading ? 'Guardando...' : 'Guardar contraseña'}
              </Text>
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
