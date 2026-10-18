import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/constants/colors';
import { Font, Type } from '@/constants/theme';

/**
 * Cabecera de las hojas (ligas, capítulos). Va dentro del contenido y no en la
 * barra nativa: con barra, react-native-screens mete la hoja en un
 * UINavigationController y el contenido llega tarde a cada cambio de tamaño.
 * Pensada como cabecera fija de la lista (`stickyHeaderIndices={[0]}`), por eso
 * lleva fondo opaco.
 */
export function SheetHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { t } = useTranslation();
  const { C } = useTheme();
  const router = useRouter();
  return (
    <View style={{ backgroundColor: C.bg, paddingTop: 22, paddingBottom: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Text accessibilityRole="header" numberOfLines={1} style={{ flex: 1, color: C.text, fontFamily: Font.black, fontSize: 20 }}>
          {title}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          hitSlop={8}
          onPress={() => router.back()}
          style={({ pressed }) => ({
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: C.surface,
            borderWidth: 1,
            borderColor: C.border,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.65 : 1,
          })}
        >
          {[45, -45].map(deg => (
            <View key={deg} style={{ position: 'absolute', width: 12, height: 2, borderRadius: 1, backgroundColor: C.textBody, transform: [{ rotate: `${deg}deg` }] }} />
          ))}
        </Pressable>
      </View>
      {subtitle ? <Text style={{ color: C.textMuted, ...Type.bodyRegular, marginTop: 6 }}>{subtitle}</Text> : null}
    </View>
  );
}
