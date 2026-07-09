import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { updateUsername } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { getOnboardingCompleted } from '@/lib/onboarding';
import { normalizeUsername, validateUsername } from '@/lib/authValidation';

const INPUT = {
  backgroundColor: '#151515',
  color: '#fff' as const,
  borderRadius: 14,
  padding: 16,
  marginBottom: 16,
  fontFamily: 'Outfit_400Regular',
  fontSize: 15,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.08)',
};

export default function CompleteProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const nextUsername = normalizeUsername(
      String(
        user?.user_metadata?.username ??
        user?.user_metadata?.full_name ??
        user?.user_metadata?.name ??
        '',
      ),
    );

    if (!validateUsername(nextUsername)) {
      setUsername(nextUsername);
    }
  }, [user?.id, user?.user_metadata]);

  const handleSave = async () => {
    if (!user) return;

    const validationError = validateUsername(username);
    if (validationError) {
      Alert.alert(t('common.error'), validationError);
      return;
    }

    setLoading(true);
    const { error } = await updateUsername(user.id, username);

    if (error) {
      setLoading(false);
      Alert.alert(t('common.error'), error);
      return;
    }

    const { error: userError } = await supabase.auth.updateUser({
      data: {
        ...(user.user_metadata ?? {}),
        needs_profile_completion: false,
      },
    });

    setLoading(false);

    if (userError) {
      Alert.alert(t('common.error'), userError.message);
      return;
    }

    const onboarded = await getOnboardingCompleted();
    router.replace(onboarded ? '/(tabs)' : '/onboarding');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
          <Text style={{ fontSize: 40, marginBottom: 8 }}>✨</Text>
          <Text style={{ color: '#fff', fontSize: 28, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 }}>
            {t('auth.completeProfile.title')}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Outfit_400Regular', marginBottom: 32 }}>
            {t('auth.completeProfile.subtitle')}
          </Text>

          <TextInput
            value={username}
            onChangeText={value => setUsername(normalizeUsername(value))}
            placeholder={t('auth.completeProfile.placeholder')}
            placeholderTextColor="rgba(255,255,255,0.3)"
            autoCapitalize="words"
            autoCorrect={false}
            style={INPUT}
          />

          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontFamily: 'Outfit_400Regular', marginBottom: 24 }}>
            {t('auth.completeProfile.hint')}
          </Text>

          <Pressable onPress={handleSave} disabled={loading}>
            <LinearGradient
              colors={['#e8a030', '#e83060']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 14, padding: 16, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' }}>
                {loading ? t('auth.completeProfile.saving') : t('auth.completeProfile.save')}
              </Text>
            </LinearGradient>
          </Pressable>

          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Pressable onPress={() => supabase.auth.signOut()} disabled={loading}>
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Outfit_400Regular' }}>
                {t('profile.signOut')}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
