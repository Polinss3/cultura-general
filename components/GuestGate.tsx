import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { setGuestMode } from '@/lib/guest';

interface Props {
  icon?: string;
  title: string;
  description: string;
}

export function GuestGate({ icon = '🔒', title, description }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  const goToAuth = async () => {
    await setGuestMode(false);
    // _layout reacciona al cambio y redirige a /(auth)/login.
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 64, marginBottom: 20 }}>{icon}</Text>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 10, textAlign: 'center' }}>
          {title}
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, fontFamily: 'Outfit_400Regular', lineHeight: 22, textAlign: 'center', marginBottom: 36, maxWidth: 300 }}>
          {description}
        </Text>

        <Pressable onPress={goToAuth} style={{ width: '100%', maxWidth: 320 }}>
          <LinearGradient
            colors={['#e8a030', '#e83060']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: 14, padding: 16, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Outfit_700Bold' }}>
              {t('components.guestGate.createAccount')}
            </Text>
          </LinearGradient>
        </Pressable>

        <Pressable onPress={goToAuth} style={{ marginTop: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Outfit_500Medium', fontSize: 14 }}>
            {t('components.guestGate.haveAccount')}<Text style={{ color: '#e8a030' }}>{t('components.guestGate.signIn')}</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
