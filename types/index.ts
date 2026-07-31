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
  id?: string;
  q: string;
  opts: string[];
  ans: number;
  ctx?: string;
  category?: Category;
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
