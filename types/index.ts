export type Category =
  | 'historia'
  | 'geografia'
  | 'ciencia'
  | 'arte'
  | 'filosofia'
  | 'deportes'
  | 'biologia'
  | 'cine'
  | 'musica'
  | 'literatura'
  | 'tecnologia'
  | 'mitologia'
  | 'astronomia';
export type GameMode = 'daily' | 'speed' | 'learn';
export type AnswerState = null | 'selected' | 'correct' | 'wrong';

export interface Question {
  /** UUID en la BD. Ausente en las de bandera/año, que son catálogo local. */
  id?: string;
  q: string;
  opts: string[];
  ans: number;
  ctx?: string;
  category?: Category;
  difficulty?: 'easy' | 'medium' | 'hard';
  // ─ Campos que solo usa Aprender, al mezclar banderas y años con la trivia.
  // El resto de modos los ignora.
  /** Token grande sobre el enunciado: la bandera, o el año en cifras. */
  media?: { kind: 'flag' | 'year'; value: string };
  /** Línea pequeña por encima del enunciado ("¿Cuál es su bandera?"). */
  lead?: string;
  /** Rejilla 2×2 en vez de lista, para opciones cortas. */
  layout?: 'flags' | 'years';
  /** Id estable para el historial de "ya vistas" cuando no hay `id` de BD. */
  localId?: string;
}

export interface RankingEntry {
  name: string;
  score: number;
  avatar: string;
  streak: number;
  isMe?: boolean;
}

export interface CategoryMeta {
  /** Identidad de la categoría. No cambia entre esquemas. */
  accent: string;
  /** Fondo del chip/icono en oscuro. */
  bg: string;
  /** Texto sobre `bg`. */
  text: string;
  /** Fondo del chip/icono en claro. */
  bgLight: string;
  /** Texto sobre crema: el acento oscurecido hasta 4,5:1, mismo tono. */
  textLight: string;
}
