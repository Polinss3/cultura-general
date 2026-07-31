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
import { readableOn, useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow, highlightGradient, inkButton, tint, warmGradient } from '@/constants/theme';

const inputStyle = (C: Palette) => ({
  backgroundColor: C.surface,
  color: C.text,
  borderRadius: 18,
  padding: 16,
  marginBottom: 12,
  fontFamily: Font.regular,
  fontSize: 15,
  borderWidth: 1,
  borderColor: C.border,
});

export default function UpdatePasswordScreen() {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
          <Text style={{ fontSize: 40, marginBottom: 8 }}>🔑</Text>
          <Text style={{ color: C.text, fontSize: 28, fontFamily: Font.black, marginBottom: 4 }}>
            {t('auth.updatePassword.title')}
          </Text>
          <Text style={{ color: C.textMuted, fontSize: 15, fontFamily: Font.regular, marginBottom: 40 }}>
            {t('auth.updatePassword.subtitle')}
          </Text>

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.updatePassword.newPlaceholder')}
            placeholderTextColor={C.textFaint}
            secureTextEntry
            style={inputStyle(C)}
          />

          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            placeholder={t('auth.updatePassword.confirmPlaceholder')}
            placeholderTextColor={C.textFaint}
            secureTextEntry
            style={{ ...inputStyle(C), marginBottom: 24 }}
          />

          <Pressable onPress={handleUpdate} disabled={loading}>
            <LinearGradient
              colors={[C.streak, C.wrong]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 18, padding: 16, alignItems: 'center' }}
            >
              <Text style={{ color: C.text, fontSize: 16, fontFamily: Font.bold }}>
                {loading ? t('auth.updatePassword.saving') : t('auth.updatePassword.save')}
              </Text>
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
