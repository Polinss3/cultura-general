// ─── Ruta diaria (hub "Hoy") ────────────────────────────────────────────────
//
// Define los pasos de la rutina diaria y gestiona la recompensa por completarla.
// Se apoya solo en señales que YA existen en servidor (pregunta del día, cofre,
// misiones); no introduce estado nuevo salvo un flag local por fecha que evita
// reclamar dos veces la recompensa de ruta en el mismo día. El servidor
// (award_progress) sigue siendo la fuente de la verdad y aplica sus topes.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { awardProgress, AwardResult } from './gamification';
import { REWARDS } from './economy';

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

const ROUTE_REWARD_KEY_PREFIX = 'daily_route_reward_';
const PLAYED_KEY_PREFIX = 'daily_played_';

// Pasos "core" que cuentan para la recompensa de ruta. Las misiones se muestran
// como capa extra pero no bloquean la recompensa (son un objetivo más profundo).
export interface RouteState {
  dailyAnswered: boolean; // respondió la pregunta del día
  chestClaimed: boolean;  // ya abrió el cofre de hoy
  played: boolean;        // practicó hoy (Contrarreloj o Aprender)
  coreDone: number;       // pasos core completados (0..3)
  coreTotal: number;      // total de pasos core (3)
  complete: boolean;      // ruta core completa
}

export function computeRouteState(
  dailyAnswered: boolean,
  chestClaimed: boolean,
  played: boolean,
): RouteState {
  const coreTotal = 3;
  const coreDone = (dailyAnswered ? 1 : 0) + (chestClaimed ? 1 : 0) + (played ? 1 : 0);
  return {
    dailyAnswered,
    chestClaimed,
    played,
    coreDone,
    coreTotal,
    complete: coreDone >= coreTotal,
  };
}

// ─── "Jugado hoy" (flag local por fecha) ────────────────────────────────────
// Se marca al terminar una partida de Contrarreloj o al responder en Aprender.
// No requiere estado en servidor: es un empujón de hábito, no economía.
export async function markDailyPlayed(date = todayStr()): Promise<void> {
  await AsyncStorage.setItem(PLAYED_KEY_PREFIX + date, 'true');
}

export async function getDailyPlayed(date = todayStr()): Promise<boolean> {
  return (await AsyncStorage.getItem(PLAYED_KEY_PREFIX + date)) === 'true';
}

export async function isRouteRewardClaimed(date = todayStr()): Promise<boolean> {
  return (await AsyncStorage.getItem(ROUTE_REWARD_KEY_PREFIX + date)) === 'true';
}

// Concede la recompensa de completar la ruta (una vez por día). Devuelve el
// AwardResult para celebrarlo, o null si ya estaba reclamada o no se pudo
// (invitado/offline): en ese caso el flag no se marca y podrá reintentarse.
export async function claimRouteReward(date = todayStr()): Promise<AwardResult | null> {
  if (await isRouteRewardClaimed(date)) return null;
  const award = await awardProgress(
    REWARDS.dailyRouteBonus.xp,
    REWARDS.dailyRouteBonus.coins,
    false, // recompensa fija, sin multiplicador de racha
    'daily_route',
  );
  if (award) await AsyncStorage.setItem(ROUTE_REWARD_KEY_PREFIX + date, 'true');
  return award;
}
