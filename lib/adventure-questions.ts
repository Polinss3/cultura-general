import AsyncStorage from '@react-native-async-storage/async-storage';
import { ADVENTURE_MAX_LEVELS, ADVENTURE_QUESTIONS_PER_LEVEL, ADVENTURE_QUESTION_VERSION } from './adventure';
import { supabase } from './supabase';
import type { AppLang } from './i18n';
import type { Category, Question } from '@/types';

interface BilingualQuestionRow {
  id: string;
  category: Category;
  question: string;
  options: string[];
  answer_index: number;
  context: string | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  question_en: string | null;
  options_en: string[] | null;
  context_en: string | null;
}

interface AssignmentRow {
  slot: number;
  questions: BilingualQuestionRow | BilingualQuestionRow[] | null;
}

const cacheKey = (level: number) => `adventure_questions_v${ADVENTURE_QUESTION_VERSION}_${level}`;

function validLevel(level: number): boolean {
  return Number.isInteger(level) && level >= 1 && level <= ADVENTURE_MAX_LEVELS;
}

function completeEnglish(row: BilingualQuestionRow): boolean {
  return typeof row.question_en === 'string' && row.question_en.trim().length > 0 &&
    Array.isArray(row.options_en) && row.options_en.length === 4 &&
    row.options_en.every(option => typeof option === 'string' && option.trim().length > 0);
}

function mapRow(row: BilingualQuestionRow, lang: AppLang): Question {
  const english = lang === 'en' && completeEnglish(row);
  return {
    id: row.id,
    q: english ? row.question_en! : row.question,
    opts: english ? row.options_en! : row.options,
    ans: row.answer_index,
    ctx: english ? (row.context_en ?? row.context ?? undefined) : (row.context ?? undefined),
    category: row.category,
    difficulty: row.difficulty ?? 'medium',
  };
}

function unwrapAssignments(rows: AssignmentRow[]): BilingualQuestionRow[] {
  return rows
    .sort((left, right) => left.slot - right.slot)
    .flatMap(row => Array.isArray(row.questions) ? row.questions.slice(0, 1) : row.questions ? [row.questions] : []);
}

async function readCache(level: number): Promise<BilingualQuestionRow[] | null> {
  try {
    const value = await AsyncStorage.getItem(cacheKey(level));
    if (!value) return null;
    const rows = JSON.parse(value) as BilingualQuestionRow[];
    return rows.length === ADVENTURE_QUESTIONS_PER_LEVEL ? rows : null;
  } catch {
    return null;
  }
}

async function writeCache(level: number, rows: BilingualQuestionRow[]): Promise<void> {
  try {
    await AsyncStorage.setItem(cacheKey(level), JSON.stringify(rows));
  } catch {
    // La caché es una mejora offline; un fallo de almacenamiento no invalida la sesión online.
  }
}

export async function fetchAdventureLevelQuestions(level: number, lang: AppLang): Promise<Question[]> {
  if (!validLevel(level)) throw new Error(`Invalid adventure level: ${level}`);

  const cached = await readCache(level);
  if (cached) return cached.map(row => mapRow(row, lang));

  const { data, error } = await supabase
    .from('adventure_question_assignments')
    .select('slot, questions!inner(id, category, question, options, answer_index, context, difficulty, question_en, options_en, context_en)')
    .eq('version', ADVENTURE_QUESTION_VERSION)
    .eq('level', level)
    .order('slot');

  if (error) throw error;
  const rows = unwrapAssignments((data ?? []) as unknown as AssignmentRow[]);
  if (rows.length !== ADVENTURE_QUESTIONS_PER_LEVEL || new Set(rows.map(row => row.id)).size !== rows.length) {
    throw new Error(`Incomplete adventure level ${level}`);
  }
  await writeCache(level, rows);
  return rows.map(row => mapRow(row, lang));
}
