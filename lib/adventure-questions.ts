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

interface BankAssignmentRow extends AssignmentRow {
  level: number;
}

const cacheKey = (level: number) => `adventure_questions_v${ADVENTURE_QUESTION_VERSION}_${level}`;
const completeCacheKey = `adventure_questions_v${ADVENTURE_QUESTION_VERSION}_complete`;
const ADVENTURE_BANK_PAGE_SIZE = 1000;
let prefetchPromise: Promise<void> | null = null;

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

async function prefetchCompleteAdventureBank(): Promise<void> {
  if (await AsyncStorage.getItem(completeCacheKey) === 'true') return;

  const assignments: BankAssignmentRow[] = [];
  for (let from = 0; from < ADVENTURE_MAX_LEVELS * ADVENTURE_QUESTIONS_PER_LEVEL; from += ADVENTURE_BANK_PAGE_SIZE) {
    const { data, error } = await supabase
      .from('adventure_question_assignments')
      .select('level, slot, questions!inner(id, category, question, options, answer_index, context, difficulty, question_en, options_en, context_en)')
      .eq('version', ADVENTURE_QUESTION_VERSION)
      .order('level')
      .order('slot')
      .range(from, from + ADVENTURE_BANK_PAGE_SIZE - 1);
    if (error) throw error;
    assignments.push(...((data ?? []) as unknown as BankAssignmentRow[]));
  }

  const expected = ADVENTURE_MAX_LEVELS * ADVENTURE_QUESTIONS_PER_LEVEL;
  if (assignments.length !== expected) {
    throw new Error(`Incomplete adventure bank: ${assignments.length}/${expected}`);
  }

  const allQuestionIds = new Set<string>();
  const cacheEntries: [string, string][] = [];
  for (let level = 1; level <= ADVENTURE_MAX_LEVELS; level += 1) {
    const rows = unwrapAssignments(assignments.filter(row => row.level === level));
    if (rows.length !== ADVENTURE_QUESTIONS_PER_LEVEL ||
        new Set(rows.map(row => row.id)).size !== ADVENTURE_QUESTIONS_PER_LEVEL) {
      throw new Error(`Incomplete adventure level ${level}`);
    }
    rows.forEach(row => allQuestionIds.add(row.id));
    cacheEntries.push([cacheKey(level), JSON.stringify(rows)]);
  }
  if (allQuestionIds.size !== expected) throw new Error('Adventure bank contains repeated questions');

  // Escrituras pequenas: si el sistema interrumpe la tarea, los bloques ya
  // guardados siguen siendo utilizables y el marcador fuerza un reintento.
  for (let index = 0; index < cacheEntries.length; index += 20) {
    await AsyncStorage.multiSet(cacheEntries.slice(index, index + 20));
  }
  await AsyncStorage.setItem(completeCacheKey, 'true');
}

/** Descarga silenciosamente el banco bilingue completo para juego offline. */
export function prefetchAdventureQuestionBank(): Promise<void> {
  if (!prefetchPromise) {
    prefetchPromise = prefetchCompleteAdventureBank().finally(() => {
      prefetchPromise = null;
    });
  }
  return prefetchPromise;
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
