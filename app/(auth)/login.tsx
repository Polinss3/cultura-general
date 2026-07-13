import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Traduce errores de Supabase a mensajes claros para el usuario.
  const authErrorMessage = (error: any): string => {
    const code = error?.code as string | undefined;
    const msg = (error?.message ?? '').toLowerCase();
    if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit'
      || msg.includes('rate limit') || msg.includes('security purposes')) {
      return t('auth.login.errRateLimit');
    }
    if (code === 'invalid_credentials' || msg.includes('invalid login')) return t('auth.login.errInvalid');
    if (code === 'email_not_confirmed' || msg.includes('not confirmed')) return t('auth.login.errNotConfirmed');
    if (code === 'user_already_exists' || code === 'email_exists' || msg.includes('already registered')) {
      return t('auth.login.errAlready');
    }
    return error?.message ?? t('errors.authFailed');
  };

  // Reenvía el email de verificación de una cuenta sin confirmar.
  const resendVerification = async (targetEmail: string) => {
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: targetEmail,
      options: { emailRedirectTo: getAuthCallbackUrl() },
    });
    setLoading(false);
    if (error) Alert.alert(t('common.error'), authErrorMessage(error));
    else Alert.alert(t('auth.login.checkEmailTitle'), t('auth.login.resentBody'));
  };

  // Ofrece pasar a iniciar sesión (email ya registrado).
  const offerSignIn = () => {
    Alert.alert(
      t('auth.login.alreadyRegisteredTitle'),
      t('auth.login.alreadyRegisteredBody'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('auth.login.signInAction'), onPress: () => { setMode('login'); setPassword(''); } },
      ],
    );
  };

  const handleLogin = async () => {
    const normalizedEmail = normalizeEmail(email);
    const emailError = validateEmail(email);

    if (emailError) { Alert.alert(t('common.error'), emailError); return; }
    if (!password) { Alert.alert(t('common.error'), t('auth.login.fillBoth')); return; }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    if (error) {
      setLoading(false);
      const code = (error as any).code as string | undefined;
      const msg = (error.message ?? '').toLowerCase();

      // Correo sin verificar → ofrecer reenviar el email.
      if (code === 'email_not_confirmed' || msg.includes('not confirmed')) {
        Alert.alert(
          t('auth.login.notConfirmedTitle'),
          t('auth.login.notConfirmedBody'),
          [
            { text: t('common.cancel'), style: 'cancel' },
            { text: t('auth.login.resendEmail'), onPress: () => resendVerification(normalizedEmail) },
          ],
        );
        return;
      }

      // Credenciales inválidas → puede que no tenga cuenta: ofrecer registrarse.
      if (code === 'invalid_credentials' || msg.includes('invalid login')) {
        Alert.alert(
          t('auth.login.invalidTitle'),
          t('auth.login.invalidBody'),
          [
            { text: t('auth.login.tryAgain'), style: 'cancel' },
            { text: t('auth.login.createAccount'), onPress: () => setMode('register') },
          ],
        );
        return;
      }

      Alert.alert(t('common.error'), authErrorMessage(error));
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
          t('auth.login.pausedTitle'),
          t('auth.login.pausedBody'),
          [
            {
              text: t('common.cancel'),
              style: 'cancel',
              onPress: async () => { await supabase.auth.signOut(); },
            },
            {
              text: t('auth.login.reactivate'),
              onPress: async () => {
                const { error: reErr } = await reactivateAccount();
                if (reErr) {
                  Alert.alert(t('common.error'), reErr);
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

    if (usernameError) { Alert.alert(t('common.error'), usernameError); return; }
    if (emailError) { Alert.alert(t('common.error'), emailError); return; }
    if (passwordError) { Alert.alert(t('common.error'), passwordError); return; }

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', normalizedUsername)
      .maybeSingle();

    if (existingProfile) {
      Alert.alert(t('common.error'), t('errors.usernameTaken'));
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
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
    setLoading(false);

    if (error) {
      const code = (error as any).code as string | undefined;
      const msg = (error.message ?? '').toLowerCase();
      if (code === 'user_already_exists' || code === 'email_exists' || msg.includes('already registered')) {
        offerSignIn();
        return;
      }
      Alert.alert(t('common.error'), authErrorMessage(error));
      return;
    }

    // Protección anti-enumeración de Supabase: si el email ya existe y está
    // confirmado, signUp devuelve un usuario con `identities` vacío y sin error.
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      offerSignIn();
      return;
    }

    // Registro correcto: hay que verificar el correo. Al aceptar, a iniciar sesión.
    Alert.alert(
      t('auth.login.checkEmailTitle'),
      t('auth.login.registeredBody'),
      [{ text: t('auth.login.goToSignIn'), onPress: () => { setMode('login'); setPassword(''); } }],
    );
  };

  const handleReset = async () => {
    const normalizedEmail = normalizeEmail(email);
    const emailError = validateEmail(email);

    if (emailError) { Alert.alert(t('common.error'), emailError); return; }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: getUpdatePasswordUrl(),
    });
    if (error) {
      Alert.alert(t('common.error'), error.message);
    } else {
      Alert.alert(
        t('auth.login.emailSentTitle'),
        t('auth.login.emailSentBody'),
        [{ text: t('auth.login.backToLogin'), onPress: () => setMode('login') }]
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
      Alert.alert(t('common.error'), error?.message ?? t('auth.login.googleFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleApple = async () => {
    Alert.alert(
      t('auth.login.appleTitle'),
      t('auth.login.appleBody'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.continue'),
          onPress: async () => {
            try {
              setLoading(true);
              await signInWithApple();
            } catch (error: any) {
              if (error?.code === 'ERR_REQUEST_CANCELED') return;
              Alert.alert(t('common.error'), error?.message ?? t('auth.login.appleFailed'));
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const getSubtitle = () => {
    if (mode === 'reset') return t('auth.login.subtitleReset');
    if (mode === 'register') return t('auth.login.subtitleRegister');
    return t('auth.login.subtitleLogin');
  };

  const getButtonLabel = () => {
    if (loading) return t('auth.login.loading');
    if (mode === 'reset') return t('auth.login.btnReset');
    if (mode === 'register') return t('auth.login.btnRegister');
    return t('auth.login.btnLogin');
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
            {t('common.appName')}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Outfit_400Regular', marginBottom: 40 }}>
            {getSubtitle()}
          </Text>

          {mode === 'register' && (
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder={t('auth.login.placeholderUsername')}
              placeholderTextColor="rgba(255,255,255,0.3)"
              autoCapitalize="words"
              autoCorrect={false}
              style={INPUT}
            />
          )}

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.login.placeholderEmail')}
            placeholderTextColor="rgba(255,255,255,0.3)"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={INPUT}
          />

          {mode !== 'reset' && (
            <View style={{ marginBottom: mode === 'login' ? 8 : 24 }}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={t('auth.login.placeholderPassword')}
                placeholderTextColor="rgba(255,255,255,0.3)"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={{ ...INPUT, marginBottom: 0, paddingRight: 48 }}
              />
              <Pressable
                onPress={() => setShowPassword(s => !s)}
                hitSlop={8}
                style={{ position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center', paddingHorizontal: 4 }}
              >
                <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
              </Pressable>
            </View>
          )}

          {mode === 'login' && (
            <Pressable
              onPress={() => setMode('reset')}
              style={{ alignSelf: 'flex-end', marginBottom: 24 }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_400Regular', fontSize: 13 }}>
                {t('auth.login.forgotPassword')}
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
                <Text style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_400Regular', fontSize: 12 }}>{t('auth.login.orContinueWith')}</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
              </View>

              <View style={{ gap: 10 }}>
                <SocialButton
                  provider="google"
                  label={t('auth.login.continueGoogle')}
                  onPress={handleGoogle}
                  disabled={loading}
                />

                {Platform.OS === 'ios' && (
                  <SocialButton
                    provider="apple"
                    label={t('auth.login.continueApple')}
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
                {mode === 'login' ? t('auth.login.noAccount') : t('auth.login.haveAccount')}
                <Text style={{ color: '#e8a030', fontFamily: 'Outfit_600SemiBold' }}>
                  {mode === 'login' ? t('auth.login.register') : t('auth.login.signIn')}
                </Text>
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => setMode('login')}
              style={{ marginTop: 24, alignItems: 'center' }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Outfit_400Regular' }}>
                {t('auth.login.backTo')}
                <Text style={{ color: '#e8a030', fontFamily: 'Outfit_600SemiBold' }}>
                  {t('auth.login.signInLower')}
                </Text>
              </Text>
            </Pressable>
          )}

          {mode === 'login' && (
            <View style={{ marginTop: 32 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
                <Text style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit_400Regular', fontSize: 12 }}>{t('auth.login.or')}</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' }} />
              </View>
              <Pressable onPress={handleGuest}>
                <View style={{
                  borderRadius: 14, padding: 16, alignItems: 'center',
                  backgroundColor: '#1a1a1a',
                  borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                }}>
                  <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'Outfit_600SemiBold' }}>
                    {t('auth.login.continueGuest')}
                  </Text>
                </View>
              </Pressable>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit_400Regular', fontSize: 12, marginTop: 10, textAlign: 'center', paddingHorizontal: 12 }}>
                {t('auth.login.guestWarning')}
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
