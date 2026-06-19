import { useState } from 'react';
import {
  View, Text, TextInput, Pressable,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { SocialButton } from '@/components/SocialButton';
import { reactivateAccount } from '@/lib/db';
import { setGuestMode } from '@/lib/guest';
import {
  getAuthCallbackUrl,
  getUpdatePasswordUrl,
  signInWithApple,
  signInWithGoogle,
} from '@/lib/auth';
import {
  normalizeEmail,
  normalizeUsername,
  validateEmail,
  validatePassword,
  validateUsername,
} from '@/lib/authValidation';

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
    const normalizedEmail = normalizeEmail(email);
    const emailError = validateEmail(email);

    if (emailError) { Alert.alert('Error', emailError); return; }
    if (!password) { Alert.alert('Error', 'Rellena email y contraseña'); return; }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
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
    const normalizedUsername = normalizeUsername(username);
    const normalizedEmail = normalizeEmail(email);
    const usernameError = validateUsername(normalizedUsername);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (usernameError) { Alert.alert('Error', usernameError); return; }
    if (emailError) { Alert.alert('Error', emailError); return; }
    if (passwordError) { Alert.alert('Error', passwordError); return; }

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', normalizedUsername)
      .maybeSingle();

    if (existingProfile) {
      Alert.alert('Error', 'Ese nombre ya está en uso.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          username: normalizedUsername,
          manual_username: true,
          needs_profile_completion: false,
        },
        emailRedirectTo: getAuthCallbackUrl(),
      },
    });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Revisa tu correo',
        'Te hemos enviado el enlace para confirmar la cuenta y completar el acceso.',
      );
    }
    setLoading(false);
  };

  const handleReset = async () => {
    const normalizedEmail = normalizeEmail(email);
    const emailError = validateEmail(email);

    if (emailError) { Alert.alert('Error', emailError); return; }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: getUpdatePasswordUrl(),
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

  const handleGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      if (result.cancelled) return;
    } catch (error: any) {
      Alert.alert('Error', error?.message ?? 'No se pudo iniciar sesión con Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleApple = async () => {
    Alert.alert(
      'Apple',
      'Para entrar en la misma cuenta existente, usa el mismo correo visible y no elijas "Ocultar mi correo".',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Continuar',
          onPress: async () => {
            try {
              setLoading(true);
              await signInWithApple();
            } catch (error: any) {
              if (error?.code === 'ERR_REQUEST_CANCELED') return;
              Alert.alert('Error', error?.message ?? 'No se pudo iniciar sesión con Apple.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
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
              placeholder="Nombre público"
              placeholderTextColor="rgba(255,255,255,0.3)"
              autoCapitalize="words"
              autoCorrect={false}
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
            autoCorrect={false}
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

          {mode !== 'reset' && (
            <View style={{ marginTop: 18 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
                <Text style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_400Regular', fontSize: 12 }}>o sigue con</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
              </View>

              <View style={{ gap: 10 }}>
                <SocialButton
                  provider="google"
                  label="Continuar con Google"
                  onPress={handleGoogle}
                  disabled={loading}
                />

                {Platform.OS === 'ios' && (
                  <SocialButton
                    provider="apple"
                    label="Continuar con Apple"
                    onPress={handleApple}
                    disabled={loading}
                  />
                )}
              </View>
            </View>
          )}

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
