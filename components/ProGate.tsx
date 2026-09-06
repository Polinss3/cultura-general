import { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { alpha, useTheme } from '@/constants/colors';
import { Font, Radius, Type } from '@/constants/theme';
import { PRO_ACCENT } from '@/lib/pro';

interface Props {
  /** Contenido real. Se sigue montando: es lo que se ve difuminado detrás. */
  children: ReactNode;
  /** `true` = mostrar el contenido tal cual, sin candado. */
  unlocked: boolean;
  title: string;
  description?: string;
  /** Texto del botón. Por defecto, el CTA genérico de PRO. */
  cta?: string;
  /** Altura mínima del bloque cuando el contenido es corto. */
  minHeight?: number;
  /** Origen de la pulsación, para saber qué superficie convierte mejor. */
  source?: string;
}

/**
 * El lenguaje de paywall de la app: el contenido se ve, pero desenfocado, con
 * un mensaje y un CTA encima.
 *
 * Se usa igual en métricas, en el mapa de Aventura y en la Sala PRO — que sea
 * el mismo gesto visual en los tres sitios es deliberado: el usuario aprende de
 * un vistazo qué significa. Enseñar lo que te pierdes convierte bastante mejor
 * que un candado opaco.
 *
 * `pointerEvents="none"` sobre el contenido evita que se pueda interactuar con
 * lo bloqueado, y `accessibilityElementsHidden` lo saca del lector de pantalla
 * para que no se lea información que el usuario no tiene.
 */
export function ProGate({
  children, unlocked, title, description, cta, minHeight, source,
}: Props) {
  const { t } = useTranslation();
  const { C, isDark } = useTheme();
  const router = useRouter();

  if (unlocked) return <>{children}</>;

  return (
    <View style={{ minHeight, borderRadius: Radius.card, overflow: 'hidden' }}>
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ opacity: isDark ? 0.3 : 0.26 }}
      >
        {children}
      </View>

      {/* Velo: React Native no tiene blur sin dependencia nativa, así que el
          desenfoque se simula con opacidad baja + un velo del color de fondo.
          El efecto leído es el mismo y no añade un módulo nativo más. */}
      <LinearGradient
        colors={[alpha(C.bg, 0.5), alpha(C.bg, 0.9), C.bg]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center', padding: 20 }]}>
        <Text style={{ fontSize: 30, marginBottom: 8 }}>🔒</Text>
        <Text style={{ color: C.text, ...Type.cardTitle, textAlign: 'center' }}>{title}</Text>
        {description ? (
          <Text style={{
            color: C.textMuted, ...Type.secondary, textAlign: 'center',
            marginTop: 6, maxWidth: 280,
          }}>
            {description}
          </Text>
        ) : null}

        <Pressable
          onPress={() => router.push(
            (source ? `/paywall?source=${encodeURIComponent(source)}` : '/paywall') as any,
          )}
          accessibilityRole="button"
          style={{ marginTop: 14 }}
        >
          <LinearGradient
            colors={[PRO_ACCENT, alpha(PRO_ACCENT, 0.82)]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: Radius.pill, paddingVertical: 11, paddingHorizontal: 22 }}
          >
            <Text style={{ color: '#FFFFFF', fontFamily: Font.bold, fontSize: 15 }}>
              {cta ?? t('pro.gate.cta')}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
