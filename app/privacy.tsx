import { ScrollView, View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { readableOn, useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow, highlightGradient, inkButton, tint, warmGradient } from '@/constants/theme';

// Las secciones legales viven en i18n bajo `privacy.sections.sN`, y son las
// mismas —mismo número, mismo orden y mismo contenido— que las de
// cg-trivia.pablobrasero.com/privacy. Si se toca una hay que tocar la otra: que
// la política dentro de la app diga algo distinto de la publicada es
// exactamente el problema que esta lista evita.
const SECTION_KEYS = [
  's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13',
] as const;

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const router = useRouter();
  const appName = t('common.appName');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, marginBottom: 8 }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Text style={{ color: C.textMuted, fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={{ color: C.text, fontSize: 20, fontFamily: Font.bold }}>{t('privacy.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Text style={{ color: C.textFaint, fontSize: 13, fontFamily: Font.regular, marginBottom: 28 }}>
          {t('privacy.updatedAt')}
        </Text>

        <Text style={{ color: C.textBody, fontSize: 14, fontFamily: Font.regular, lineHeight: 22, marginBottom: 32 }}>
          {t('privacy.intro', { appName })}
        </Text>

        {SECTION_KEYS.map(k => (
          <View key={k} style={{ marginBottom: 28 }}>
            <Text style={{ color: C.brandDeep, fontSize: 15, fontFamily: Font.bold, marginBottom: 10 }}>
              {t(`privacy.sections.${k}.title`)}
            </Text>
            <Text style={{ color: C.textBody, fontSize: 14, fontFamily: Font.regular, lineHeight: 22 }}>
              {t(`privacy.sections.${k}.body`, { appName })}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
