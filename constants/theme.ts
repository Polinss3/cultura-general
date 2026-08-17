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

/** Gradiente ámbar de las llamadas a la acción: cofre y modo protagonista. */
export function warmGradient(isDark: boolean): [string, string] {
  return isDark ? ['#33240F', '#291D0F'] : ['#FFF1DE', '#FFE4CA'];
}

/**
 * Botón principal. Centralizado a propósito: el relleno de marca con texto
 * blanco se queda en 3,0:1, por debajo del 4,5:1 que cumple el resto de la
 * app. Cambiar aquí `backgroundColor` a un terracota más oscuro (#B26131) o
 * el texto a tinta sube el par a 4,5:1 sin tocar ninguna pantalla.
 */
export function primaryFill(C: { brand: string; onBrand: string }) {
  return { backgroundColor: C.brand, color: C.onBrand };
}

/**
 * Botón de tinta: relleno oscuro sobre crema y al revés en oscuro. Es el
 * secundario fuerte de las tarjetas destacadas ("Jugar ahora", "Compartir").
 */
export function inkButton(isDark: boolean): { backgroundColor: string; color: string } {
  return isDark
    ? { backgroundColor: '#F0E6D8', color: '#2B2621' }
    : { backgroundColor: '#2B2621', color: '#FFF6E9' };
}

/**
 * Halo de color alrededor de una tarjeta, como si la iluminaran por detrás.
 * A diferencia de `cardShadow`, va sin desplazamiento: la sombra sale por los
 * cuatro lados por igual y se lee como luz, no como relieve.
 *
 * Ojo al montarlo: el recorte y el halo no pueden vivir en la misma vista. Si
 * la que lleva el `overflow: 'hidden'` (para clipar el degradado) es también la
 * que lleva la sombra, iOS no pinta nada. Va una envoltura fuera.
 *
 * Y el radio tiene que caber en el margen que rodea a la tarjeta. Si el halo
 * llega al borde del contenedor, este lo recorta en línea recta y lo que se ve
 * es un rectángulo de luz cortado a cuchillo, no un degradado. Con 12 se queda
 * holgado dentro de los 20 de padding de pantalla que usan Ligas y compañía.
 */
export function glow(color: string, isDark: boolean): ViewStyle {
  return {
    shadowColor: color,
    shadowOpacity: isDark ? 0.6 : 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 9,
  };
}

/** Tinte suave de un color de acento, para cuadrados de icono y píldoras. */
export function tint(color: string, isDark: boolean): string {
  const h = color.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(full.slice(0, 6), 16);
  const a = isDark ? 0.18 : 0.13;
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
