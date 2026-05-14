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
  bg: string;
  accent: string;
  text: string;
}
