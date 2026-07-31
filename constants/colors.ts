import { useColorScheme } from 'react-native';

// ─── Papel cálido ────────────────────────────────────────────────────────────
// Dos paletas gemelas: crema/tinta en claro, tinta cálida en oscuro. Ni negro
// puro ni blanco puro en ninguna de las dos. Los tonos de texto están elegidos
// para cumplir 4,5:1 sobre su fondo; `textFaint` es el suelo, no bajar de ahí.

export const LightColors = {
  bg:          '#F7F2EA',  // fondo de pantalla (crema papel)
  surface:     '#FFFFFF',  // tarjetas
  surface2:    '#FFFDF9',  // tab bar / cabeceras
  surfaceSunk: '#F4EFE7',  // celdas apagadas, estados bloqueados
  border:      '#EFE5D7',
  borderStrong:'#EADFD0',
  borderWarm:  '#F2DDBC',  // borde de tarjetas destacadas (ruta, diario)
  track:       '#F0E7DA',  // fondo de barras de progreso
  text:        '#2B2621',  // tinta
  textBody:    '#4A443D',
  textMuted:   '#6E665E',  // ≥13 px  (5,1:1 sobre bg)
  textFaint:   '#796D61',  // etiquetas 12 px (5,2:1) — NO bajar de aquí
  onBrand:     '#FFFFFF',  // texto sobre los rellenos de color
  brand:       '#E07A3E',  // terracota, acción principal
  brandDeep:   '#A9591E',  // texto/iconos sobre crema y sobre brandTint
  brandTint:   '#FDF0DC',
  streak:      '#F0A93B',
  streakText:  '#C97F1E',  // solo cifras grandes (≥20 px)
  coinText:    '#94661F',  // monedas a tamaño de texto
  coinTint:    '#FDF3E0',
  levelText:   '#3F71A9',  // nombre de rango junto al nivel
  correct:     '#3F9E6C',
  correctText: '#237049',
  correctTint: '#EAF7F0',
  wrong:       '#C43A5C',
  wrongText:   '#A82A4C',
  wrongTint:   '#FDEEF2',
  speed:       '#7B57BE',  // Contrarreloj
  speedText:   '#6E4BA8',
  social:      '#3E77B4',  // Amigos
  level:       '#4A86C8',
} as const;

export const DarkColors = {
  bg:          '#191512',
  surface:     '#211D18',
  surface2:    '#1D1813',
  surfaceSunk: '#2C261F',
  border:      '#2C261F',
  borderStrong:'#332C25',
  borderWarm:  '#4A3721',
  track:       '#2C261F',
  text:        '#F7F0E6',
  textBody:    '#CFC4B7',
  textMuted:   '#B8ADA0',
  textFaint:   '#A2958A',  // 6,2:1 sobre bg — NO bajar de aquí
  onBrand:     '#FFFFFF',
  brand:       '#E07A3E',
  brandDeep:   '#F0A93B',
  brandTint:   '#2E2419',
  streak:      '#F0A93B',
  streakText:  '#F0A93B',
  coinText:    '#E5B564',
  coinTint:    '#2E2419',
  levelText:   '#7FB6E6',
  correct:     '#4FB183',
  correctText: '#7FD6AA',
  correctTint: 'rgba(79,177,131,0.13)',
  wrong:       '#E8607F',
  wrongText:   '#F08CA3',
  wrongTint:   'rgba(232,96,127,0.13)',
  speed:       '#8A63D8',
  speedText:   '#B99AE8',
  social:      '#6FA8DC',
  level:       '#6FA8DC',
} as const;

// Las dos paletas comparten claves; el tipo las ensancha a `string` para que
// ambas encajen (con `as const` cada hex sería un tipo literal distinto).
export type Palette = Record<keyof typeof LightColors, string>;

/** Paleta activa según el ajuste de apariencia del sistema. */
export function useColors(): Palette {
  return useColorScheme() === 'dark' ? DarkColors : LightColors;
}

/** Paleta + esquema de una vez, que es lo que suele hacer falta en pantalla. */
export function useTheme(): { C: Palette; isDark: boolean } {
  const isDark = useColorScheme() === 'dark';
  return { C: isDark ? DarkColors : LightColors, isDark };
}

/**
 * Aplica alpha a un color sólido. Para tintes puntuales de un color de estado
 * sobre una superficie, sin tener que fijar un hex nuevo.
 */
export function alpha(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(full.slice(0, 6), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

// ─── Colores que son datos ───────────────────────────────────────────────────
// RANKS, DIVISIONS y las zonas del Ascenso definen identidad, no tema, así que
// no se tocan. Pero varios de esos tonos son claros y no se leen sobre crema.
// `readableOn` los oscurece lo justo para llegar a 4,5:1 conservando el tono,
// y en oscuro los devuelve tal cual.

const toRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(full.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const luminance = ([r, g, b]: [number, number, number]): number => {
  const ch = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
};

const contrast = (a: [number, number, number], b: [number, number, number]): number => {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
};

const LIGHT_BG = toRgb(LightColors.bg);
const readableCache = new Map<string, string>();

/**
 * Color legible sobre la crema de fondo. En oscuro devuelve el original; en
 * claro lo multiplica hacia el negro hasta alcanzar 4,5:1, lo que baja la
 * luminosidad sin desplazar el tono.
 */
export function readableOn(color: string, isDark: boolean): string {
  if (isDark || !color.startsWith('#')) return color;
  const cached = readableCache.get(color);
  if (cached) return cached;

  const rgb = toRgb(color);
  let result = color;
  for (let k = 1; k >= 0; k -= 0.02) {
    const scaled: [number, number, number] = [rgb[0] * k, rgb[1] * k, rgb[2] * k];
    if (contrast(scaled, LIGHT_BG) >= 4.5) {
      result =
        '#' +
        scaled
          .map(v => Math.round(v).toString(16).padStart(2, '0'))
          .join('');
      break;
    }
  }
  readableCache.set(color, result);
  return result;
}
