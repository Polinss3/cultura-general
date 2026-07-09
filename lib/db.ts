import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { Question, Category } from '@/types';
import { normalizeUsername, validateUsername } from './authValidation';
import { awardProgress, bumpMissions, AwardResult } from './gamification';
import { REWARDS } from './economy';
import i18n, { getCurrentLang, AppLang } from './i18n';

// ─── Error handling ───────────────────────────────────────────

export class NetworkError extends Error {
  constructor(message = i18n.t('errors.network')) {
    super(message);
    this.name = 'NetworkError';
  }
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      if (i < retries) await new Promise(r => setTimeout(r, 600 * (i + 1)));
    }
  }
  throw lastError;
}

// ─── Mapping ──────────────────────────────────────────────────

// Fila cruda de `questions` con ambos idiomas (lo que cacheamos).
interface QuestionRow {
  id: string;
  category: Category;
  question: string;
  options: string[];
  answer_index: number;
  context: string | null;
  question_en: string | null;
  options_en: string[] | null;
  context_en: string | null;
}

// La traducción EN se usa como bloque atómico: solo si hay pregunta EN y 4
// opciones EN no vacías. Así nunca mostramos una pregunta medio traducida.
function hasCompleteEn(row: QuestionRow): boolean {
  return (
    typeof row.question_en === 'string' && row.question_en.trim().length > 0 &&
    Array.isArray(row.options_en) && row.options_en.length === 4 &&
    row.options_en.every(o => typeof o === 'string' && o.trim().length > 0)
  );
}

function mapQuestion(row: QuestionRow, lang: AppLang = getCurrentLang()): Question {
  const en = lang === 'en' && hasCompleteEn(row);
  return {
    id: row.id,
    q: en ? row.question_en! : row.question,
    opts: en ? row.options_en! : row.options,
    ans: row.answer_index, // el índice es el mismo: el pipeline preserva el orden de opciones
    ctx: en ? (row.context_en ?? row.context ?? undefined) : (row.context ?? undefined),
    category: row.category,
  };
}

// ─── Questions (with offline cache) ───────────────────────────

const ALL_DB_CATEGORIES: Category[] = [
  'historia', 'geografia', 'ciencia', 'arte', 'filosofia', 'deportes',
  'biologia', 'cine', 'musica', 'literatura', 'tecnologia', 'mitologia', 'astronomia',
];

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

// v2: cacheamos las filas crudas (ambos idiomas). Cambiar de idioma mapea la
// caché existente sin necesidad de refetch (funciona offline).
function cacheKey(category?: Category) {
  return `questions_cache_${category ?? 'all'}_v2`;
}

async function getCachedRows(category?: Category): Promise<QuestionRow[] | null> {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(category));
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return data as QuestionRow[];
  } catch {
    return null;
  }
}

async function setCache(rows: QuestionRow[], category?: Category): Promise<void> {
  try {
    await AsyncStorage.setItem(
      cacheKey(category),
      JSON.stringify({ data: rows, ts: Date.now() }),
    );
  } catch {
    // ignore storage errors
  }
}

// Limpia la caché v1 (mapeada, monolingüe) que quedó de versiones anteriores.
export async function purgeLegacyQuestionCache(): Promise<void> {
  try {
    const cats: (Category | undefined)[] = [undefined, ...ALL_DB_CATEGORIES];
    await AsyncStorage.multiRemove(cats.map(c => `questions_cache_${c ?? 'all'}_v1`));
  } catch {
    // ignore
  }
}

export async function fetchQuestions(category?: Category): Promise<Question[]> {
  const cached = await getCachedRows(category);
  if (cached) return cached.map(r => mapQuestion(r));

  return withRetry(async () => {
    let query = supabase.from('questions').select('*').eq('active', true);
    if (category) query = query.eq('category', category);
    const { data, error } = await query.order('id');
    if (error) throw new NetworkError();
    const rows = (data ?? []) as QuestionRow[];
    if (rows.length > 0) await setCache(rows, category);
    return rows.map(r => mapQuestion(r));
  });
}

// ─── Daily question ───────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getMondayStr(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().slice(0, 10);
}

export async function fetchOrAssignDailyQuestion(): Promise<Question | null> {
  const date = todayStr();

  const { data: existing } = await supabase
    .from('daily_questions')
    .select('questions(*)')
    .eq('date', date)
    .single();

  if (existing?.questions) return mapQuestion(existing.questions as unknown as QuestionRow);

  // No admin-assigned question for today — pick deterministically by date.
  // (Clients can't INSERT into daily_questions due to RLS, so we skip the upsert.)
  const { data: allQuestions } = await supabase
    .from('questions')
    .select('*')
    .eq('active', true)
    .order('id');

  if (!allQuestions || allQuestions.length === 0) return null;

  const dayIdx = Math.floor(Date.now() / 86400000);
  return mapQuestion(allQuestions[dayIdx % allQuestions.length] as QuestionRow);
}

export async function checkDailyAnswered(
  userId: string,
): Promise<{ answered: boolean; score: number }> {
  const { data } = await supabase
    .from('daily_rankings')
    .select('score')
    .eq('user_id', userId)
    .eq('date', todayStr())
    .single();
  return { answered: !!data, score: data?.score ?? 0 };
}

export async function saveDailyAnswer(
  userId: string,
  questionId: string,
  selectedIdx: number,
  isCorrect: boolean,
  timeMs: number,
): Promise<AwardResult | null> {
  const score = isCorrect ? 100 : 0;
  const date = todayStr();

  await Promise.all([
    supabase.from('user_answers').insert({
      user_id: userId,
      question_id: questionId,
      selected_index: selectedIdx,
      is_correct: isCorrect,
      mode: 'daily',
    }),
    supabase.from('daily_rankings').upsert(
      {
        user_id: userId,
        date,
        score,
        is_correct: isCorrect,
        time_ms: timeMs,
        answered_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,date' },
    ),
  ]);

  // La racha debe actualizarse antes del award para que el multiplicador
  // refleje la racha del día.
  await supabase.rpc('update_streak', { p_user_id: userId });
  await incrementProfileStats(userId, 1, isCorrect ? 1 : 0);

  const r = isCorrect ? REWARDS.dailyCorrect : REWARDS.dailyWrong;
  const award = await awardProgress(r.xp, r.coins, true, 'daily');
  await bumpMissions('daily_play', 1);
  if (award?.gainedCoins) await bumpMissions('coins_earned', award.gainedCoins);
  return award;
}

// ─── Rankings ─────────────────────────────────────────────────

export type RankRow = {
  userId: string;
  username: string;
  score: number;
  streak: number;
  isCorrect: boolean;
  timeMs: number | null;
};

export async function fetchDailyRanking(): Promise<RankRow[]> {
  const { data: rows } = await supabase
    .from('daily_rankings')
    .select('user_id, score, is_correct, time_ms, answered_at')
    .eq('date', todayStr())
    .limit(50);

  if (!rows || rows.length === 0) return [];

  const userIds = rows.map(r => r.user_id);
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, streak')
    .in('id', userIds);

  const profileMap = new Map(
    (profiles ?? []).map(p => [p.id, p]),
  );

  return rows
    .map(r => {
      const p = profileMap.get(r.user_id) as any;
      return {
        userId: r.user_id,
        username: p?.username ?? i18n.t('common.anonymous'),
        score: r.score ?? 0,
        streak: p?.streak ?? 0,
        isCorrect: r.is_correct ?? r.score > 0,
        timeMs: r.time_ms ?? null,
      };
    })
    .sort((a, b) => {
      // Correct first; within each group, fastest time first.
      if (a.isCorrect !== b.isCorrect) return a.isCorrect ? -1 : 1;
      const at = a.timeMs ?? Number.MAX_SAFE_INTEGER;
      const bt = b.timeMs ?? Number.MAX_SAFE_INTEGER;
      return at - bt;
    });
}

export type WeeklyRow = { userId: string; username: string; streak: number; weekScore: number };

export async function fetchWeeklyRanking(): Promise<WeeklyRow[]> {
  const { data } = await supabase.rpc('get_weekly_ranking');
  return (data ?? []).map((r: any) => ({
    userId: r.user_id,
    username: r.username ?? i18n.t('common.anonymous'),
    streak: r.streak ?? 0,
    weekScore: Number(r.week_score ?? 0),
  }));
}

export type GlobalRow = { userId: string; username: string; totalCorrect: number; streak: number; speedRecord: number };

export async function fetchAllTimeRanking(): Promise<GlobalRow[]> {
  const { data } = await supabase
    .from('profiles')
    .select('id, username, total_correct, streak, speed_record')
    .order('total_correct', { ascending: false })
    .limit(50);

  return (data ?? []).map(r => ({
    userId: r.id,
    username: r.username ?? i18n.t('common.anonymous'),
    totalCorrect: r.total_correct ?? 0,
    streak: r.streak ?? 0,
    speedRecord: r.speed_record ?? 0,
  }));
}

// ─── Friend rankings ──────────────────────────────────────────

async function getFriendIds(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from('friendships')
    .select('user_id, friend_id')
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .eq('status', 'accepted');

  return (data ?? []).map(r =>
    r.user_id === userId ? r.friend_id : r.user_id,
  );
}

export async function fetchFriendDailyRanking(userId: string): Promise<RankRow[]> {
  const friendIds = await getFriendIds(userId);
  const allIds = [...friendIds, userId];

  const { data: rows } = await supabase
    .from('daily_rankings')
    .select('user_id, score, is_correct, time_ms, answered_at')
    .eq('date', todayStr())
    .in('user_id', allIds);

  if (!rows || rows.length === 0) return [];

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, streak')
    .in('id', allIds);

  const profileMap = new Map(
    (profiles ?? []).map(p => [p.id, p]),
  );

  return rows
    .map(r => {
      const p = profileMap.get(r.user_id) as any;
      return {
        userId: r.user_id,
        username: p?.username ?? i18n.t('common.anonymous'),
        score: r.score ?? 0,
        streak: p?.streak ?? 0,
        isCorrect: r.is_correct ?? r.score > 0,
        timeMs: r.time_ms ?? null,
      };
    })
    .sort((a, b) => {
      if (a.isCorrect !== b.isCorrect) return a.isCorrect ? -1 : 1;
      const at = a.timeMs ?? Number.MAX_SAFE_INTEGER;
      const bt = b.timeMs ?? Number.MAX_SAFE_INTEGER;
      return at - bt;
    });
}

// ─── Friend management ────────────────────────────────────────

export interface FriendProfile {
  id: string;
  username: string;
  streak: number;
  totalCorrect: number;
  friendshipId?: string;
  status?: 'pending_sent' | 'pending_received' | 'accepted';
}

export async function searchUsers(query: string, currentUserId: string): Promise<FriendProfile[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  // Escape ILIKE wildcards so the user's literal % and _ aren't interpreted.
  const escaped = trimmed.replace(/[\\%_]/g, m => `\\${m}`);

  const { data } = await supabase
    .from('profiles')
    .select('id, username, streak, total_correct')
    .ilike('username', `%${escaped}%`)
    .neq('id', currentUserId)
    .limit(10);

  return (data ?? []).map(r => ({
    id: r.id,
    username: r.username,
    streak: r.streak ?? 0,
    totalCorrect: r.total_correct ?? 0,
  }));
}

export async function fetchFriends(userId: string): Promise<FriendProfile[]> {
  const { data } = await supabase
    .from('friendships')
    .select('id, user_id, friend_id, status, profiles!friendships_friend_id_fkey(id, username, streak, total_correct), sender:profiles!friendships_user_id_fkey(id, username, streak, total_correct)')
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .eq('status', 'accepted');

  return (data ?? []).map((r: any) => {
    const isRequester = r.user_id === userId;
    const other = isRequester ? r.profiles : r.sender;
    return {
      id: other?.id,
      username: other?.username ?? i18n.t('common.anonymous'),
      streak: other?.streak ?? 0,
      totalCorrect: other?.total_correct ?? 0,
      friendshipId: r.id,
      status: 'accepted' as const,
    };
  });
}

export async function fetchPendingRequests(userId: string): Promise<FriendProfile[]> {
  // Requests sent TO me (I am friend_id)
  const { data } = await supabase
    .from('friendships')
    .select('id, user_id, sender:profiles!friendships_user_id_fkey(id, username, streak, total_correct)')
    .eq('friend_id', userId)
    .eq('status', 'pending');

  return (data ?? []).map((r: any) => ({
    id: r.sender?.id,
    username: r.sender?.username ?? i18n.t('common.anonymous'),
    streak: r.sender?.streak ?? 0,
    totalCorrect: r.sender?.total_correct ?? 0,
    friendshipId: r.id,
    status: 'pending_received' as const,
  }));
}

export async function sendFriendRequest(fromId: string, toId: string): Promise<{ error?: string }> {
  const { error } = await supabase
    .from('friendships')
    .insert({ user_id: fromId, friend_id: toId, status: 'pending' });
  if (error) return { error: error.message };
  return {};
}

export async function acceptFriendRequest(friendshipId: string): Promise<void> {
  await supabase
    .from('friendships')
    .update({ status: 'accepted' })
    .eq('id', friendshipId);
}

export async function removeFriend(friendshipId: string): Promise<void> {
  await supabase.from('friendships').delete().eq('id', friendshipId);
}

// Check relationship status between two users
export async function getFriendshipStatus(
  userId: string,
  otherId: string,
): Promise<{ status: 'none' | 'pending_sent' | 'pending_received' | 'accepted'; friendshipId?: string }> {
  const { data } = await supabase
    .from('friendships')
    .select('id, user_id, friend_id, status')
    .or(`and(user_id.eq.${userId},friend_id.eq.${otherId}),and(user_id.eq.${otherId},friend_id.eq.${userId})`);

  if (!data || data.length === 0) return { status: 'none' };
  const row = data[0];
  if (row.status === 'accepted') return { status: 'accepted', friendshipId: row.id };
  if (row.user_id === userId) return { status: 'pending_sent', friendshipId: row.id };
  return { status: 'pending_received', friendshipId: row.id };
}

// ─── Answer history ───────────────────────────────────────────

export interface AnswerHistoryItem {
  id: string;
  questionText: string;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  mode: string;
  category: string;
  answeredAt: string;
}

export async function fetchAnswerHistory(userId: string, limit = 20): Promise<AnswerHistoryItem[]> {
  const { data } = await supabase
    .from('user_answers')
    .select('id, selected_index, is_correct, mode, answered_at, questions(question, question_en, answer_index, category)')
    .eq('user_id', userId)
    .order('answered_at', { ascending: false })
    .limit(limit);

  const en = getCurrentLang() === 'en';
  return (data ?? []).map((r: any) => ({
    id: r.id,
    questionText: (en && r.questions?.question_en ? r.questions.question_en : r.questions?.question) ?? '—',
    selectedIndex: r.selected_index,
    correctIndex: r.questions?.answer_index ?? 0,
    isCorrect: r.is_correct,
    mode: r.mode,
    category: r.questions?.category ?? '—',
    answeredAt: r.answered_at,
  }));
}

// ─── Category stats ───────────────────────────────────────────

export interface CategoryStat {
  category: string;
  total: number;
  correct: number;
}

export async function fetchCategoryStats(userId: string): Promise<CategoryStat[]> {
  const { data } = await supabase
    .from('user_answers')
    .select('is_correct, questions(category)')
    .eq('user_id', userId);

  const map = new Map<string, { total: number; correct: number }>();
  for (const row of data ?? []) {
    const cat = (row.questions as any)?.category ?? 'otro';
    const cur = map.get(cat) ?? { total: 0, correct: 0 };
    cur.total += 1;
    if (row.is_correct) cur.correct += 1;
    map.set(cat, cur);
  }

  return [...map.entries()]
    .map(([category, stats]) => ({ category, ...stats }))
    .sort((a, b) => b.total - a.total);
}

// ─── Question reports ─────────────────────────────────────────

export async function reportQuestion(
  userId: string,
  questionId: string,
  reason: 'incorrect' | 'confusing' | 'duplicate' | 'other',
): Promise<void> {
  await supabase
    .from('question_reports')
    .upsert({ user_id: userId, question_id: questionId, reason }, { onConflict: 'user_id,question_id' });
}

// ─── Speed game ───────────────────────────────────────────────

export async function saveSpeedGame(
  userId: string,
  score: number,
  totalAnswered: number,
  currentRecord: number,
): Promise<{ isNewRecord: boolean; award: AwardResult | null }> {
  const isNewRecord = score > currentRecord;
  await incrementProfileStats(
    userId,
    totalAnswered,
    score,
    isNewRecord ? score : undefined,
  );

  // Monedas y XP proporcionales a los aciertos de los 30 segundos.
  const award = score > 0
    ? await awardProgress(score * REWARDS.speedPerCorrect.xp, score * REWARDS.speedPerCorrect.coins, true, 'speed')
    : null;
  await bumpMissions('speed_play', 1);
  if (score > 0) await bumpMissions('speed_correct', score);
  if (award?.gainedCoins) await bumpMissions('coins_earned', award.gainedCoins);

  return { isNewRecord, award };
}

// ─── Profile stats ────────────────────────────────────────────

export async function incrementProfileStats(
  _userId: string,
  answered: number,
  correct: number,
  newSpeedRecord?: number,
): Promise<void> {
  // Server-side atomic increment (avoids races between concurrent games).
  await supabase.rpc('increment_profile_stats', {
    p_answered: answered,
    p_correct: correct,
    p_speed_record: newSpeedRecord ?? null,
  });
}

// ─── Account management ──────────────────────────────────────

export async function pauseAccount(): Promise<{ error: string | null }> {
  const { error } = await supabase.rpc('pause_account');
  if (error) return { error: error.message };
  await supabase.auth.signOut();
  return { error: null };
}

export async function reactivateAccount(): Promise<{ error: string | null }> {
  const { error } = await supabase.rpc('reactivate_account');
  return { error: error?.message ?? null };
}

export async function deleteAccount(): Promise<{ error: string | null }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: i18n.t('errors.noSession') };
  const { error } = await supabase.functions.invoke('delete-account', {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (error) return { error: error.message ?? i18n.t('errors.deleteAccountFailed') };
  await supabase.auth.signOut();
  return { error: null };
}

export async function updateUsername(userId: string, username: string): Promise<{ error?: string }> {
  const normalized = normalizeUsername(username);
  const validationError = validateUsername(normalized);
  if (validationError) return { error: validationError };

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, username: normalized });

  if (error) {
    // Username unique violation surfaces here.
    if (error.code === '23505') return { error: i18n.t('errors.usernameTaken') };
    return { error: error.message };
  }
  return {};
}
