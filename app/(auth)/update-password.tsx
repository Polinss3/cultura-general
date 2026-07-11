import { useState } from 'react';
import {
  View, Text, TextInput, Pressable,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { validatePassword } from '@/lib/authValidation';

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
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    if (!password || !confirm) { Alert.alert(t('common.error'), t('auth.updatePassword.fillBoth')); return; }
    if (password !== confirm) { Alert.alert(t('common.error'), t('auth.updatePassword.noMatch')); return; }
    const passwordError = validatePassword(password);
    if (passwordError) { Alert.alert(t('common.error'), passwordError); return; }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      Alert.alert(t('common.error'), error.message);
    } else {
      Alert.alert(
        t('auth.updatePassword.successTitle'),
        t('auth.updatePassword.successBody'),
        [{ text: t('common.continue'), onPress: () => router.replace('/(tabs)') }]
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
            {t('auth.updatePassword.title')}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Outfit_400Regular', marginBottom: 40 }}>
            {t('auth.updatePassword.subtitle')}
          </Text>

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.updatePassword.newPlaceholder')}
            placeholderTextColor="rgba(255,255,255,0.3)"
            secureTextEntry
            style={INPUT}
          />

          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            placeholder={t('auth.updatePassword.confirmPlaceholder')}
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
                {loading ? t('auth.updatePassword.saving') : t('auth.updatePassword.save')}
              </Text>
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
