import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { setGuestMode } from '@/lib/guest';
import { readableOn, useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow, highlightGradient, inkButton, tint, warmGradient } from '@/constants/theme';

interface Props {
  icon?: string;
  title: string;
  description: string;
}

export function GuestGate({ icon = '🔒', title, description }: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const router = useRouter();

  const goToAuth = async () => {
    await setGuestMode(false);
    // _layout reacciona al cambio y redirige a /(auth)/login.
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 64, marginBottom: 20 }}>{icon}</Text>
        <Text style={{ color: C.text, fontSize: 22, fontFamily: Font.black, marginBottom: 10, textAlign: 'center' }}>
          {title}
        </Text>
        <Text style={{ color: C.textMuted, fontSize: 14, fontFamily: Font.regular, lineHeight: 22, textAlign: 'center', marginBottom: 36, maxWidth: 300 }}>
          {description}
        </Text>

        <Pressable onPress={goToAuth} style={{ width: '100%', maxWidth: 320 }}>
          <LinearGradient
            colors={[C.streak, C.wrong]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: 18, padding: 16, alignItems: 'center' }}
          >
            <Text style={{ color: C.text, fontSize: 16, fontFamily: Font.bold }}>
              {t('components.guestGate.createAccount')}
            </Text>
          </LinearGradient>
        </Pressable>

        <Pressable onPress={goToAuth} style={{ marginTop: 16 }}>
          <Text style={{ color: C.textMuted, fontFamily: Font.semi, fontSize: 14 }}>
            {t('components.guestGate.haveAccount')}<Text style={{ color: C.streak }}>{t('components.guestGate.signIn')}</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
