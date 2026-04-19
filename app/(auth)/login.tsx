import { useState } from 'react';
import {
  View, Text, TextInput, Pressable,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';

type Mode = 'login' | 'register';

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

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Rellena email y contraseña'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Error', error.message);
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!username.trim()) { Alert.alert('Error', 'Necesitas un nombre de usuario'); return; }
    if (!email || !password) { Alert.alert('Error', 'Rellena todos los campos'); return; }
    if (password.length < 6) { Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: username.trim() } },
    });
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('¡Cuenta creada!', 'Ya puedes iniciar sesión.');
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
          <Text style={{ fontSize: 40, marginBottom: 8 }}>🧠</Text>
          <Text style={{ color: '#fff', fontSize: 28, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>
            Cultura General
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Outfit_400Regular', marginBottom: 40 }}>
            {mode === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta gratis'}
          </Text>

          {mode === 'register' && (
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Nombre de usuario"
              placeholderTextColor="rgba(255,255,255,0.3)"
              autoCapitalize="none"
              style={INPUT}
            />
          )}

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.3)"
            keyboardType="email-address"
            autoCapitalize="none"
            style={INPUT}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            placeholderTextColor="rgba(255,255,255,0.3)"
            secureTextEntry
            style={{ ...INPUT, marginBottom: 24 }}
          />

          <Pressable onPress={mode === 'login' ? handleLogin : handleRegister} disabled={loading}>
            <LinearGradient
              colors={['#e8a030', '#e83060']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 14, padding: 16, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' }}>
                {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{ marginTop: 24, alignItems: 'center' }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_400Regular' }}>
              {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <Text style={{ color: '#e8a030', fontFamily: 'Outfit_600SemiBold' }}>
                {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
              </Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
