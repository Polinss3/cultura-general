// ─── Ligas semanales (cliente) ──────────────────────────────────────────────
// Consume el RPC get_league (ver supabase/leagues.sql). Si el RPC no existe aún
// (migración sin aplicar) o falla, fetchLeague devuelve null y la UI lo maneja.

import { supabase } from './supabase';
import i18n from './i18n';

export interface LeagueEntry {
  userId: string;
  username: string;
  xp: number;
  level: number;
  rank: number;
  cosmetics: Record<string, string> | null;
}

export type LeagueResult = 'promoted' | 'relegated' | 'stayed';

export interface LeagueState {
  division: number;                 // 0=Bronce..3=Diamante
  weekStart: string;                // 'YYYY-MM-DD' (lunes ISO)
  myXp: number;
  myRank: number | null;
  memberCount: number;              // jugadores en tu división esta semana
  promoteZone: number;              // nº de puestos que ascienden (top N)
  relegateZone: number;             // nº de puestos que descienden (bottom N)
  lastResult: LeagueResult | null;  // resultado de la semana pasada (para banner)
  lastReward: number;               // monedas ganadas por el puesto de la semana pasada
  leaderboard: LeagueEntry[];
}

export const DIVISIONS = [
  { id: 'bronce',   emoji: '🥉', color: '#c08040' },
  { id: 'plata',    emoji: '🥈', color: '#c0c8d0' },
  { id: 'oro',      emoji: '🥇', color: '#e8c030' },
  { id: 'diamante', emoji: '💎', color: '#30c8e8' },
] as const;

export const TOP_DIVISION = DIVISIONS.length - 1; // Diamante

export function divisionMeta(division: number) {
  return DIVISIONS[Math.max(0, Math.min(division, DIVISIONS.length - 1))];
}

// Días que faltan para el reset (fin de la semana ISO = weekStart + 7).
export function daysUntilReset(weekStart: string): number {
  const start = new Date(`${weekStart}T00:00:00Z`);
  const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
  const diff = end.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}

export async function fetchLeague(): Promise<LeagueState | null> {
  const { data, error } = await supabase.rpc('get_league');
  if (error || !data) return null;
  return {
    division: data.division ?? 0,
    weekStart: data.week_start,
    myXp: data.my_xp ?? 0,
    myRank: data.my_rank ?? null,
    memberCount: data.member_count ?? 0,
    promoteZone: data.promote_zone ?? 5,
    relegateZone: data.relegate_zone ?? 5,
    lastResult: (data.last_result as LeagueResult) ?? null,
    lastReward: data.last_reward ?? 0,
    leaderboard: (data.leaderboard ?? []).map((e: any) => ({
      userId: e.user_id,
      username: e.username ?? i18n.t('common.anonymous'),
      xp: e.xp ?? 0,
      level: e.level ?? 1,
      rank: e.rank,
      cosmetics: e.cosmetics ?? null,
    })),
  };
}
