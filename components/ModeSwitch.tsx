import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { feedback } from '@/lib/feedback';
import { useTheme } from '@/constants/colors';
import { Font, Radius, cardShadow, warmGradient } from '@/constants/theme';

export interface ModeCard {
  id: string;
  icon: string;
  title: string;
  /** Línea de apoyo: el récord, o cuántas preguntas tiene el modo. */
  meta: string;
}

interface Props {
  cards: ModeCard[];
  activeId: string;
  onSelect: (id: string) => void;
}

/**
 * Conmutador entre los modos de la pestaña. Dos tarjetas al mismo ancho que la
 * rejilla que viene debajo, en vez de un segmentado de texto: los dos modos
 * tienen que pesar lo mismo de un vistazo, y una píldora los degradaría a
 * filtro. La activa se enciende con el gradiente cálido; la otra se apaga pero
 * se queda entera a la vista, que es lo que hace que se descubra el segundo
 * modo sin buscarlo.
 */
export function ModeSwitch({ cards, activeId, onSelect }: Props) {
  const { C, isDark } = useTheme();

  return (
    <View style={{
      flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 16,
    }}>
      {cards.map(card => {
        const active = card.id === activeId;

        const content = (
          <>
            <Text style={{ fontSize: 28 }}>{card.icon}</Text>
            <View style={{ gap: 1 }}>
              <Text numberOfLines={1} style={{
                color: C.text, fontSize: 16, fontFamily: Font.black,
              }}>
                {card.title}
              </Text>
              <Text numberOfLines={1} style={{
                color: active ? C.brandDeep : C.textMuted,
                fontSize: 12,
                fontFamily: active ? Font.bold : Font.regular,
              }}>
                {card.meta}
              </Text>
            </View>
          </>
        );

        return (
          <Pressable
            key={card.id}
            onPress={() => { if (!active) { feedback.tap(); onSelect(card.id); } }}
            style={{ flex: 1 }}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            {active ? (
              <LinearGradient
                colors={warmGradient(isDark)}
                start={{ x: 0, y: 0 }} end={{ x: 0.7, y: 1 }}
                style={{
                  borderRadius: Radius.cardLg, padding: 14, gap: 8, minHeight: 110,
                  justifyContent: 'center',
                  borderWidth: 1.5, borderColor: C.borderWarm, ...cardShadow(isDark),
                }}
              >
                {content}
              </LinearGradient>
            ) : (
              // Mismo borde (1,5) que la activa: con 1 pt la inactiva encogía
              // un pelo y las dos tarjetas dejaban de alinearse.
              <View style={{
                borderRadius: Radius.cardLg, padding: 14, gap: 8, minHeight: 110,
                justifyContent: 'center', backgroundColor: C.surface,
                borderWidth: 1.5, borderColor: C.border, opacity: 0.55,
              }}>
                {content}
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
