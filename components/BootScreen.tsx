import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { readableOn, useTheme, type Palette } from '@/constants/colors';
import { Font, Radius, Space, Type, cardShadow, highlightGradient, inkButton, tint, warmGradient } from '@/constants/theme';

interface Props {
  // Si true, muestra el botón "Continuar sin conexión".
  showOfflineButton: boolean;
  onContinueOffline: () => void;
}

// Pantalla de carga propia (sustituye al `return null` mientras la app arranca).
// Mantiene la estética de la splash y, si el arranque se alarga, ofrece la
// entrada al modo sin conexión.
export function BootScreen({ showOfflineButton, onContinueOffline }: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <ActivityIndicator color={C.brand} size="large" />

      {showOfflineButton && (
        <View style={{ position: 'absolute', bottom: 60, left: 24, right: 24, alignItems: 'center' }}>
          <Text style={{ color: C.textMuted, fontSize: 13, fontFamily: Font.regular, textAlign: 'center', marginBottom: 14 }}>
            {t('components.bootScreen.slow')}
          </Text>
          <Pressable onPress={onContinueOffline} style={{ width: '100%', maxWidth: 320 }}>
            <LinearGradient
              colors={[C.streak, C.wrong]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 18, padding: 16, alignItems: 'center' }}
            >
              <Text style={{ color: C.text, fontSize: 16, fontFamily: Font.bold }}>
                {t('components.bootScreen.continueOffline')}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}
    </View>
  );
}
