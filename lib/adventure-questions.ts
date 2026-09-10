import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ADVENTURE_LEGACY_MAX_LEVEL,
  ADVENTURE_MAX_LEVELS,
  ADVENTURE_PRO_QUESTION_VERSION,
  ADVENTURE_QUESTIONS_PER_LEVEL,
  ADVENTURE_QUESTION_VERSION,
} from './adventure';
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

const isProLevel = (level: number) => level > ADVENTURE_LEGACY_MAX_LEVEL;
const cacheKey = (level: number) => isProLevel(level)
  ? `adventure_pro_questions_v${ADVENTURE_PRO_QUESTION_VERSION}_${level}`
  : `adventure_questions_v${ADVENTURE_QUESTION_VERSION}_${level}`;
const coreCompleteCacheKey = `adventure_questions_v${ADVENTURE_QUESTION_VERSION}_complete`;
const proCompleteCacheKey = `adventure_pro_questions_v${ADVENTURE_PRO_QUESTION_VERSION}_complete`;
const ADVENTURE_BANK_PAGE_SIZE = 1000;
let corePrefetchPromise: Promise<void> | null = null;
let proPrefetchPromise: Promise<void> | null = null;

function validLevel(level: number): boolean {
  return Number.isInteger(level) && level >= 1 && level <= ADVENTURE_MAX_LEVELS;
}

function completeEnglish(row: BilingualQuestionRow): boolean {
  return typeof row.question_en === 'string' && row.question_en.trim().length > 0 &&
    Array.isArray(row.options_en) && row.options_en.length === 4 &&
    row.options_en.every(option => typeof option === 'string' && option.trim().length > 0);
}

function mapRow(row: BilingualQuestionRow, lang: AppLang, catalog: 'core' | 'pro'): Question {
  const english = lang === 'en' && completeEnglish(row);
  return {
    id: row.id,
    catalog,
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

async function prefetchAssignmentRange(
  table: 'adventure_question_assignments' | 'pro_adventure_question_assignments',
  version: number,
  startLevel: number,
  endLevel: number,
  completeKey: string,
): Promise<void> {
  if (await AsyncStorage.getItem(completeKey) === 'true') return;

  const assignments: BankAssignmentRow[] = [];
  const expected = (endLevel - startLevel + 1) * ADVENTURE_QUESTIONS_PER_LEVEL;
  const questionRelation = table === 'pro_adventure_question_assignments'
    ? 'questions:pro_questions!inner(id, category, question, options, answer_index, context, difficulty, question_en, options_en, context_en)'
    : 'questions!inner(id, category, question, options, answer_index, context, difficulty, question_en, options_en, context_en)';
  for (let from = 0; from < expected; from += ADVENTURE_BANK_PAGE_SIZE) {
    const { data, error } = await supabase
      .from(table)
      .select(`level, slot, ${questionRelation}`)
      .eq('version', version)
      .order('level')
      .order('slot')
      .range(from, from + ADVENTURE_BANK_PAGE_SIZE - 1);
    if (error) throw error;
    assignments.push(...((data ?? []) as unknown as BankAssignmentRow[]));
  }

  if (assignments.length !== expected) {
    throw new Error(`Incomplete adventure bank ${startLevel}-${endLevel}: ${assignments.length}/${expected}`);
  }

  const allQuestionIds = new Set<string>();
  const cacheEntries: [string, string][] = [];
  const assignmentsByLevel = new Map<number, BankAssignmentRow[]>();
  for (const assignment of assignments) {
    const rows = assignmentsByLevel.get(assignment.level) ?? [];
    rows.push(assignment);
    assignmentsByLevel.set(assignment.level, rows);
  }
  for (let level = startLevel; level <= endLevel; level += 1) {
    const rows = unwrapAssignments(assignmentsByLevel.get(level) ?? []);
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
  await AsyncStorage.setItem(completeKey, 'true');
}

function prefetchCoreAdventureBank(): Promise<void> {
  if (!corePrefetchPromise) {
    corePrefetchPromise = prefetchAssignmentRange(
      'adventure_question_assignments',
      ADVENTURE_QUESTION_VERSION,
      1,
      ADVENTURE_LEGACY_MAX_LEVEL,
      coreCompleteCacheKey,
    ).finally(() => {
      corePrefetchPromise = null;
    });
  }
  return corePrefetchPromise;
}

function prefetchProAdventureBank(): Promise<void> {
  if (!proPrefetchPromise) {
    proPrefetchPromise = prefetchAssignmentRange(
      'pro_adventure_question_assignments',
      ADVENTURE_PRO_QUESTION_VERSION,
      ADVENTURE_LEGACY_MAX_LEVEL + 1,
      ADVENTURE_MAX_LEVELS,
      proCompleteCacheKey,
    ).finally(() => {
      proPrefetchPromise = null;
    });
  }
  return proPrefetchPromise;
}

/**
 * Descarga silenciosamente la campaña publicada. El paquete adicional nunca
 * se pide a un usuario gratuito o legacy: solo una suscripción PRO activa lo
 * incorpora a la caché offline.
 */
export async function prefetchAdventureQuestionBank(includePro = false): Promise<void> {
  await prefetchCoreAdventureBank();
  if (includePro) await prefetchProAdventureBank();
}

export async function fetchAdventureLevelQuestions(level: number, lang: AppLang): Promise<Question[]> {
  if (!validLevel(level)) throw new Error(`Invalid adventure level: ${level}`);

  const cached = await readCache(level);
  if (cached) return cached.map(row => mapRow(row, lang, isProLevel(level) ? 'pro' : 'core'));

  const proLevel = isProLevel(level);
  const questionRelation = proLevel
    ? 'questions:pro_questions!inner(id, category, question, options, answer_index, context, difficulty, question_en, options_en, context_en)'
    : 'questions!inner(id, category, question, options, answer_index, context, difficulty, question_en, options_en, context_en)';
  const { data, error } = await supabase
    .from(proLevel ? 'pro_adventure_question_assignments' : 'adventure_question_assignments')
    .select(`slot, ${questionRelation}`)
    .eq('version', proLevel ? ADVENTURE_PRO_QUESTION_VERSION : ADVENTURE_QUESTION_VERSION)
    .eq('level', level)
    .order('slot');

  if (error) throw error;
  const rows = unwrapAssignments((data ?? []) as unknown as AssignmentRow[]);
  if (rows.length !== ADVENTURE_QUESTIONS_PER_LEVEL || new Set(rows.map(row => row.id)).size !== rows.length) {
    throw new Error(`Incomplete adventure level ${level}`);
  }
  await writeCache(level, rows);
  return rows.map(row => mapRow(row, lang, proLevel ? 'pro' : 'core'));
}
