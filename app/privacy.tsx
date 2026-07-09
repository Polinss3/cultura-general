import { ScrollView, View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Las 9 secciones legales viven en i18n bajo `privacy.sections.sN`.
const SECTION_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9'] as const;

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const appName = t('common.appName');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, marginBottom: 8 }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold' }}>{t('privacy.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'Outfit_400Regular', marginBottom: 28 }}>
          {t('privacy.updatedAt')}
        </Text>

        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: 'Outfit_400Regular', lineHeight: 22, marginBottom: 32 }}>
          {t('privacy.intro', { appName })}
        </Text>

        {SECTION_KEYS.map(k => (
          <View key={k} style={{ marginBottom: 28 }}>
            <Text style={{ color: '#e8a030', fontSize: 15, fontFamily: 'Outfit_700Bold', marginBottom: 10 }}>
              {t(`privacy.sections.${k}.title`)}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, fontFamily: 'Outfit_400Regular', lineHeight: 22 }}>
              {t(`privacy.sections.${k}.body`, { appName })}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
