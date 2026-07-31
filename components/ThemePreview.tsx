import { View, Text } from 'react-native';
import { LightColors, DarkColors, type Palette } from '@/constants/colors';
import { Font, Radius } from '@/constants/theme';

/**
 * Maqueta en miniatura de la home para la elección de tema del onboarding.
 * No es una captura: se dibuja con los mismos tokens que la app, así que
 * cualquier cambio de paleta se refleja aquí sin tener que regenerar nada.
 *
 * Está pensada para asomar por el borde inferior de la pantalla, así que no
 * lleva altura fija: se recorta con el `overflow: 'hidden'` del contenedor.
 */
export function ThemePreview({ dark }: { dark: boolean }) {
  const C: Palette = dark ? DarkColors : LightColors;

  return (
    <View style={{
      backgroundColor: C.bg,
      paddingHorizontal: 14,
      paddingTop: 16,
      gap: 10,
    }}>
      {/* Cabecera */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ height: 7, width: '45%', borderRadius: 4, backgroundColor: C.textFaint, opacity: 0.5 }} />
          <View style={{ height: 12, width: '70%', borderRadius: 5, backgroundColor: C.text, opacity: 0.85 }} />
        </View>
        <View style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: C.brand }} />
      </View>

      {/* Tarjeta destacada */}
      <View style={{
        backgroundColor: dark ? '#33240F' : '#FFF1DE',
        borderRadius: Radius.row, borderWidth: 1, borderColor: C.borderWarm,
        padding: 12, gap: 8,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
          <View style={{
            width: 26, height: 26, borderRadius: 8,
            backgroundColor: dark ? C.surfaceSunk : C.surface,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 13 }}>🏆</Text>
          </View>
          <View style={{ gap: 3 }}>
            <View style={{ height: 5, width: 28, borderRadius: 3, backgroundColor: C.brandDeep }} />
            <View style={{ height: 9, width: 96, borderRadius: 4, backgroundColor: C.text, opacity: 0.85 }} />
          </View>
        </View>
        <View style={{
          alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 14,
          borderRadius: Radius.pill, backgroundColor: dark ? '#F0E6D8' : '#2B2621',
        }}>
          <View style={{ height: 6, width: 42, borderRadius: 3, backgroundColor: dark ? '#2B2621' : '#FFF6E9' }} />
        </View>
      </View>

      {/* Rejilla de modos */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {[C.speed, C.streak].map((accent, i) => (
          <View key={i} style={{
            flex: 1, backgroundColor: C.surface, borderRadius: Radius.row,
            borderWidth: 1, borderColor: C.border, padding: 10, gap: 6,
          }}>
            <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: accent, opacity: 0.25 }} />
            <View style={{ height: 8, width: '75%', borderRadius: 4, backgroundColor: C.text, opacity: 0.8 }} />
            <View style={{ height: 6, width: '55%', borderRadius: 3, backgroundColor: C.textFaint, opacity: 0.6 }} />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {[C.correct, C.social].map((accent, i) => (
          <View key={i} style={{
            flex: 1, backgroundColor: C.surface, borderRadius: Radius.row,
            borderWidth: 1, borderColor: C.border, padding: 10, gap: 6,
          }}>
            <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: accent, opacity: 0.25 }} />
            <View style={{ height: 8, width: '75%', borderRadius: 4, backgroundColor: C.text, opacity: 0.8 }} />
            <View style={{ height: 6, width: '55%', borderRadius: 3, backgroundColor: C.textFaint, opacity: 0.6 }} />
          </View>
        ))}
      </View>

      {/* Sección de estadísticas. Está aquí sobre todo para que la maqueta
          siempre sea más alta que su hueco y se corte por abajo, en vez de
          dejar un rectángulo vacío al final. */}
      <View style={{ height: 6, width: 90, borderRadius: 3, backgroundColor: C.textFaint, opacity: 0.6, marginTop: 4 }} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {[0, 1, 2].map(i => (
          <View key={i} style={{
            flex: 1, backgroundColor: C.surface, borderRadius: Radius.row,
            borderWidth: 1, borderColor: C.border, paddingVertical: 12, alignItems: 'center', gap: 5,
          }}>
            <View style={{ height: 11, width: 30, borderRadius: 4, backgroundColor: C.text, opacity: 0.8 }} />
            <View style={{ height: 6, width: 42, borderRadius: 3, backgroundColor: C.textFaint, opacity: 0.6 }} />
          </View>
        ))}
      </View>
      <View style={{
        backgroundColor: C.surface, borderRadius: Radius.row,
        borderWidth: 1, borderColor: C.border, padding: 12,
        flexDirection: 'row', alignItems: 'center', gap: 10,
      }}>
        <View style={{ width: 20, height: 20, borderRadius: 6, backgroundColor: C.streak, opacity: 0.3 }} />
        <View style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: C.text, opacity: 0.75 }} />
      </View>
    </View>
  );
}
