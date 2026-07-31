import type { TextStyle, ViewStyle } from 'react-native';

// ─── Tipografía ──────────────────────────────────────────────────────────────
// Nunito. La app la usa gente mayor: 12 px es el suelo absoluto y nada baja
// de ahí. Los pesos se nombran por uso, no por número, para que el mapeo viva
// en un solo sitio.

export const Font = {
  regular: 'Nunito_400Regular',
  medium:  'Nunito_600SemiBold',
  semi:    'Nunito_600SemiBold',
  bold:    'Nunito_700Bold',
  extra:   'Nunito_800ExtraBold',
  black:   'Nunito_900Black',
} as const;

export const Type = {
  /** Título de pantalla: 26 / 900 */
  screenTitle: { fontSize: 26, fontFamily: Font.black, letterSpacing: -0.3 },
  /** Cabecera de pantalla secundaria (con flecha atrás) */
  navTitle:    { fontSize: 20, fontFamily: Font.black },
  /** Título de tarjeta: 18-19 / 900 */
  cardTitle:   { fontSize: 18, fontFamily: Font.black },
  cardTitleLg: { fontSize: 19, fontFamily: Font.black },
  /** Enunciado de pregunta: 23-24 / 900, lineHeight ×1.35 */
  question:    { fontSize: 23, fontFamily: Font.black, lineHeight: 31 },
  questionLg:  { fontSize: 24, fontFamily: Font.black, lineHeight: 32 },
  /** Cuerpo y opciones de respuesta: 15-16 / 600 */
  option:      { fontSize: 16, fontFamily: Font.semi },
  body:        { fontSize: 15, fontFamily: Font.semi },
  bodyRegular: { fontSize: 15, fontFamily: Font.regular, lineHeight: 23 },
  /** Secundario: 13-14 */
  secondary:   { fontSize: 14, fontFamily: Font.regular, lineHeight: 21 },
  small:       { fontSize: 13, fontFamily: Font.regular },
  smallBold:   { fontSize: 13, fontFamily: Font.bold },
  /** Suelo absoluto */
  tiny:        { fontSize: 12, fontFamily: Font.regular },
  tinyBold:    { fontSize: 12, fontFamily: Font.bold },
  /** Etiqueta de sección: 13, mayúsculas, tracking amplio, textFaint */
  sectionLabel: {
    fontSize: 13,
    fontFamily: Font.extra,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  } as TextStyle,
} satisfies Record<string, TextStyle>;

// ─── Forma ───────────────────────────────────────────────────────────────────

export const Radius = {
  cardLg: 22,
  card:   20,
  row:    16,
  icon:   14,
  iconSm: 12,
  pill:   999,
} as const;

export const Space = {
  /** Padding lateral de pantalla */
  screen:  18,
  /** Separación entre bloques */
  block:   15,
  /** Gap interno de tarjeta */
  card:    12,
} as const;

/** Área táctil mínima. Nada por debajo. */
export const HIT_MIN = 44;

/**
 * Sombra de tarjeta protagonista. Muy suave y cálida, y solo en claro: en
 * oscuro las tarjetas se separan por el borde, no por sombra.
 */
export function cardShadow(isDark: boolean): ViewStyle {
  if (isDark) return {};
  return {
    shadowColor: '#785A3C',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  };
}

/** Gradiente crema de las tarjetas destacadas (ruta de hoy, pregunta del día). */
export function highlightGradient(isDark: boolean): [string, string] {
  return isDark ? ['#231C14', '#1D1813'] : ['#FFF6E9', '#FFFFFF'];
}

/** Gradiente ámbar de las llamadas a la acción (cofre, hero de "A qué jugamos"). */
export function warmGradient(isDark: boolean): [string, string] {
  return isDark ? ['#33240F', '#291D0F'] : ['#FFF1DE', '#FFE4CA'];
}
