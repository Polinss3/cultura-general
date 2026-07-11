import { supabase } from './supabase';
import { pickDailyMissions, todayStr, Mission, MissionKind } from './missions';
import i18n from './i18n';

// ─── Resultado de una recompensa ──────────────────────────────
export interface AwardResult {
  xp: number;
  level: number;
  leveledUp: boolean;
  levelsGained: number;
  coins: number;
  gainedXp: number;
  gainedCoins: number;
  ladderBest?: number;
  newBest?: boolean;
}

function mapAward(data: any): AwardResult {
  return {
    xp: data?.xp ?? 0,
    level: data?.level ?? 1,
    leveledUp: !!data?.leveled_up,
    levelsGained: data?.levels_gained ?? 0,
    coins: data?.coins ?? 0,
    gainedXp: data?.gained_xp ?? 0,
    gainedCoins: data?.gained_coins ?? 0,
    ladderBest: data?.ladder_best,
    newBest: data?.new_best,
  };
}

// ─── Primitiva de recompensa ──────────────────────────────────
export async function awardProgress(
  baseXp: number,
  baseCoins: number,
  applyMultiplier = true,
  source?: string,
): Promise<AwardResult | null> {
  const { data, error } = await supabase.rpc('award_progress', {
    p_base_xp: Math.round(baseXp),
    p_base_coins: Math.round(baseCoins),
    p_apply_multiplier: applyMultiplier,
    p_source: source ?? null,
  });
  if (error) return null;
  return mapAward(data);
}

// ─── Cofre diario ─────────────────────────────────────────────
export async function claimDailyChest(): Promise<{ reward?: number; error?: string }> {
  const { data, error } = await supabase.rpc('claim_daily_chest');
  if (error) {
    if ((error.message || '').includes('already claimed')) return { error: i18n.t('errors.chestAlreadyClaimed') };
    return { error: i18n.t('errors.chestFailed') };
  }
  return { reward: (data as any)?.reward };
}

// ─── Logros ───────────────────────────────────────────────────
export async function fetchClaimedAchievements(userId: string): Promise<Set<string>> {
  const { data } = await supabase
    .from('user_achievements')
    .select('achievement_id, claimed')
    .eq('user_id', userId)
    .eq('claimed', true);
  return new Set((data ?? []).map((r: any) => r.achievement_id));
}

export async function claimAchievement(achievementId: string): Promise<AwardResult | null> {
  const { data, error } = await supabase.rpc('claim_achievement', { p_achievement_id: achievementId });
  if (error) return null;
  return mapAward(data);
}

// ─── Modo Ascenso ─────────────────────────────────────────────
export async function saveLadderRun(floor: number, coins: number): Promise<AwardResult | null> {
  const { data, error } = await supabase.rpc('save_ladder_run', { p_floor: floor, p_coins: coins });
  if (error) return null;
  return mapAward(data);
}

export interface LadderRankRow {
  userId: string;
  username: string;
  ladderBest: number;
  level: number;
}

export async function fetchLadderRanking(): Promise<LadderRankRow[]> {
  const { data } = await supabase.rpc('get_ladder_ranking');
  return (data ?? []).map((r: any) => ({
    userId: r.user_id,
    username: r.username ?? i18n.t('common.anonymous'),
    ladderBest: r.ladder_best ?? 0,
    level: r.level ?? 1,
  }));
}

// ─── Misiones ─────────────────────────────────────────────────
export interface MissionState extends Mission {
  progress: number;
  claimed: boolean;
}

export async function fetchMissionState(userId: string): Promise<MissionState[]> {
  const missions = pickDailyMissions();
  const { data } = await supabase
    .from('user_missions')
    .select('mission_id, progress, claimed')
    .eq('user_id', userId)
    .eq('date', todayStr());

  const byId = new Map((data ?? []).map((r: any) => [r.mission_id, r]));
  return missions.map(m => {
    const row = byId.get(m.id) as any;
    return {
      ...m,
      progress: Math.min(m.goal, row?.progress ?? 0),
      claimed: !!row?.claimed,
    };
  });
}

export async function claimMission(missionId: string): Promise<AwardResult | null> {
  const { data, error } = await supabase.rpc('claim_mission', { p_mission_id: missionId });
  if (error) return null;
  return mapAward(data);
}

// Suma progreso a todas las misiones del día del tipo indicado.
export async function bumpMissions(kind: MissionKind, amount: number): Promise<void> {
  if (amount <= 0) return;
  const missions = pickDailyMissions().filter(m => m.kind === kind);
  await Promise.all(
    missions.map(m =>
      supabase.rpc('increment_mission', { p_mission_id: m.id, p_amount: amount, p_goal: m.goal }),
    ),
  );
}
