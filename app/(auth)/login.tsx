import { useState } from 'react';
import {
  View, Text, TextInput, Pressable,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { validateUsername, reactivateAccount } from '@/lib/db';
import { setGuestMode } from '@/lib/guest';

type Mode = 'login' | 'register' | 'reset';

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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('is_paused')
        .eq('id', data.user.id)
        .single();

      if (prof?.is_paused) {
        Alert.alert(
          'Cuenta pausada',
          'Tu cuenta está pausada. ¿Quieres reactivarla?',
          [
            {
              text: 'Cancelar',
              style: 'cancel',
              onPress: async () => { await supabase.auth.signOut(); },
            },
            {
              text: 'Reactivar',
              onPress: async () => {
                const { error: reErr } = await reactivateAccount();
                if (reErr) {
                  Alert.alert('Error', reErr);
                  await supabase.auth.signOut();
                }
              },
            },
          ],
        );
      }
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) { Alert.alert('Error', 'Necesitas un nombre de usuario'); return; }
    const usernameError = validateUsername(trimmedUsername);
    if (usernameError) { Alert.alert('Error', usernameError); return; }
    if (!email || !password) { Alert.alert('Error', 'Rellena todos los campos'); return; }
    if (password.length < 6) { Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: trimmedUsername },
        emailRedirectTo: 'culturalgeneral://login',
      },
    });
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('¡Cuenta creada!', 'Ya puedes iniciar sesión.');
    setLoading(false);
  };

  const handleReset = async () => {
    if (!email) { Alert.alert('Error', 'Introduce tu email para recuperar la contraseña'); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'culturalgeneral://update-password',
    });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Email enviado',
        'Revisa tu bandeja de entrada y sigue el enlace para restablecer tu contraseña.',
        [{ text: 'Volver al login', onPress: () => setMode('login') }]
      );
    }
    setLoading(false);
  };

  const handleGuest = async () => {
    await setGuestMode(true);
  };

  const getSubtitle = () => {
    if (mode === 'reset') return 'Recuperar contraseña';
    if (mode === 'register') return 'Crea tu cuenta gratis';
    return 'Inicia sesión para continuar';
  };

  const getButtonLabel = () => {
    if (loading) return 'Cargando...';
    if (mode === 'reset') return 'Enviar enlace';
    if (mode === 'register') return 'Crear cuenta';
    return 'Iniciar sesión';
  };

  const handleMainAction = () => {
    if (mode === 'login') return handleLogin();
    if (mode === 'register') return handleRegister();
    return handleReset();
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
            {getSubtitle()}
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

          {mode !== 'reset' && (
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              placeholderTextColor="rgba(255,255,255,0.3)"
              secureTextEntry
              style={{ ...INPUT, marginBottom: mode === 'login' ? 8 : 24 }}
            />
          )}

          {mode === 'login' && (
            <Pressable
              onPress={() => setMode('reset')}
              style={{ alignSelf: 'flex-end', marginBottom: 24 }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_400Regular', fontSize: 13 }}>
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>
          )}

          {mode === 'reset' && <View style={{ marginBottom: 24 }} />}

          <Pressable onPress={handleMainAction} disabled={loading}>
            <LinearGradient
              colors={['#e8a030', '#e83060']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 14, padding: 16, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' }}>
                {getButtonLabel()}
              </Text>
            </LinearGradient>
          </Pressable>

          {mode !== 'reset' ? (
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
          ) : (
            <Pressable
              onPress={() => setMode('login')}
              style={{ marginTop: 24, alignItems: 'center' }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_400Regular' }}>
                {'Volver a '}
                <Text style={{ color: '#e8a030', fontFamily: 'Outfit_600SemiBold' }}>
                  iniciar sesión
                </Text>
              </Text>
            </Pressable>
          )}

          {mode === 'login' && (
            <View style={{ marginTop: 32 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
                <Text style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_400Regular', fontSize: 12 }}>o</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
              </View>
              <Pressable onPress={handleGuest}>
                <View style={{
                  borderRadius: 14, padding: 16, alignItems: 'center',
                  backgroundColor: '#1a1a1a',
                  borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                }}>
                  <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'Outfit_600SemiBold' }}>
                    Continuar como invitado
                  </Text>
                </View>
              </Pressable>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit_400Regular', fontSize: 12, marginTop: 10, textAlign: 'center', paddingHorizontal: 12 }}>
                Sin cuenta no podrás participar en la pregunta del día ni en los rankings.
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
