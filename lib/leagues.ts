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
}

export interface LeagueState {
  division: number;                 // 0=Bronce..3=Diamante
  weekStart: string;                // 'YYYY-MM-DD' (lunes ISO)
  myXp: number;
  myRank: number | null;
  promoteThreshold: number | null;  // null si ya está en la división máxima
  relegateThreshold: number | null; // null si no puede descender (Bronce)
  leaderboard: LeagueEntry[];
}

export const DIVISIONS = [
  { id: 'bronce',   emoji: '🥉', color: '#c08040' },
  { id: 'plata',    emoji: '🥈', color: '#c0c8d0' },
  { id: 'oro',      emoji: '🥇', color: '#e8c030' },
  { id: 'diamante', emoji: '💎', color: '#30c8e8' },
] as const;

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
    promoteThreshold: data.promote_threshold ?? null,
    relegateThreshold: data.relegate_threshold ?? null,
    leaderboard: (data.leaderboard ?? []).map((e: any) => ({
      userId: e.user_id,
      username: e.username ?? i18n.t('common.anonymous'),
      xp: e.xp ?? 0,
      level: e.level ?? 1,
      rank: e.rank,
    })),
  };
}
