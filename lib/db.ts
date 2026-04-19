import { supabase } from './supabase';
import { Question, Category } from '@/types';

// ─── Mapping ──────────────────────────────────────────────────

function mapQuestion(row: any): Question {
  return {
    id: row.id,
    q: row.question,
    opts: row.options,
    ans: row.answer_index,
    ctx: row.context ?? undefined,
    category: row.category,
  };
}

// ─── Questions ────────────────────────────────────────────────

export async function fetchQuestions(category?: Category): Promise<Question[]> {
  let query = supabase.from('questions').select('*').eq('active', true);
  if (category) query = query.eq('category', category);
  const { data } = await query.order('id');
  return data ? data.map(mapQuestion) : [];
}

// ─── Daily question ───────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export async function fetchOrAssignDailyQuestion(): Promise<Question | null> {
  const date = todayStr();

  // Try to find existing daily question
  const { data: existing } = await supabase
    .from('daily_questions')
    .select('questions(*)')
    .eq('date', date)
    .single();

  if (existing?.questions) return mapQuestion(existing.questions);

  // None assigned — pick one deterministically by day index
  const { data: ids } = await supabase
    .from('questions')
    .select('id')
    .eq('active', true)
    .order('id');

  if (!ids || ids.length === 0) return null;

  const dayIdx = Math.floor(Date.now() / 86400000);
  const picked = ids[dayIdx % ids.length];

  await supabase
    .from('daily_questions')
    .upsert({ question_id: picked.id, date }, { onConflict: 'date' });

  const { data: assigned } = await supabase
    .from('daily_questions')
    .select('questions(*)')
    .eq('date', date)
    .single();

  return assigned?.questions ? mapQuestion(assigned.questions) : null;
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
): Promise<void> {
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
      { user_id: userId, date, score },
      { onConflict: 'user_id,date' },
    ),
  ]);

  await supabase.rpc('update_streak', { p_user_id: userId });
  await incrementProfileStats(userId, 1, isCorrect ? 1 : 0);
}

export async function fetchDailyRanking(): Promise<
  Array<{ userId: string; username: string; score: number; streak: number }>
> {
  const { data } = await supabase
    .from('daily_rankings')
    .select('user_id, score, profiles(username, streak)')
    .eq('date', todayStr())
    .order('score', { ascending: false })
    .limit(50);

  return (data ?? []).map(r => ({
    userId: r.user_id,
    username: (r.profiles as any)?.username ?? 'Anónimo',
    score: r.score,
    streak: (r.profiles as any)?.streak ?? 0,
  }));
}

// ─── Speed game ───────────────────────────────────────────────

export async function saveSpeedGame(
  userId: string,
  score: number,
  totalAnswered: number,
  currentRecord: number,
): Promise<{ isNewRecord: boolean }> {
  const isNewRecord = score > currentRecord;
  await incrementProfileStats(
    userId,
    totalAnswered,
    score,
    isNewRecord ? score : undefined,
  );
  return { isNewRecord };
}

// ─── Profile stats ────────────────────────────────────────────

export async function incrementProfileStats(
  userId: string,
  answered: number,
  correct: number,
  newSpeedRecord?: number,
): Promise<void> {
  const { data } = await supabase
    .from('profiles')
    .select('total_answered, total_correct')
    .eq('id', userId)
    .single();

  if (!data) return;

  const updates: Record<string, number> = {
    total_answered: data.total_answered + answered,
    total_correct: data.total_correct + correct,
  };

  if (newSpeedRecord !== undefined) updates.speed_record = newSpeedRecord;

  await supabase.from('profiles').update(updates).eq('id', userId);
}
