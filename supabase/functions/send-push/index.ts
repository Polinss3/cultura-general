// Supabase Edge Function — send-push
//
// Envía las notificaciones push reales de la app a través del servicio de
// Expo. La llama pg_cron cada 15 minutos (ver supabase/push_cron_setup.sql);
// también se puede invocar a mano con la misma cabecera secreta.
//
// Qué hace en cada pasada:
//   1. Pregunta a Postgres a quién le toca ahora (push_due_*: 9:00 y 20:00
//      locales, domingo 18:00 y lunes 10:00 de liga, y la cola de eventos).
//   2. Redacta el texto en el idioma del dispositivo (es/en).
//   3. Manda a Expo en lotes de 100 y anota en push_log para no repetir hoy.
//   4. Da de baja los tokens que Expo marca como DeviceNotRegistered.
//
// Despliegue:
//   supabase functions deploy send-push --no-verify-jwt
//   supabase secrets set PUSH_CRON_SECRET=<mismo valor que en el vault>
//
// Secrets requeridos: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PUSH_CRON_SECRET.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type Locale = 'es' | 'en';
type Kind = 'morning' | 'evening' | 'league_closing' | 'league_result' | 'friend_overtaken';

interface Due {
  user_id: string;
  token: string;
  locale: string;
  payload: Record<string, unknown>;
  day_key: string;
  queue_id?: number;
  kind?: string;
}

interface Message {
  to: string;
  title: string;
  body: string;
  sound: 'default';
  data: { owner: 'cg-trivia'; kind: Kind; route: string };
  // Para el registro: a quién y qué día.
  _user: string;
  _day: string;
  _kind: Kind;
  _queue?: number;
}

const DAILY_ROUTE = '/(tabs)/daily';
const LEAGUES_ROUTE = '/leagues';

const DIVISIONS: Record<Locale, string[]> = {
  es: ['Bronce', 'Plata', 'Oro', 'Diamante'],
  en: ['Bronze', 'Silver', 'Gold', 'Diamond'],
};

function n(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : Number(v) || 0;
}

// Textos. Cortos, sin depender del sonido y con el dato que hace abrir la app.
function compose(kind: Kind, locale: Locale, p: Record<string, unknown>): { title: string; body: string; route: string } {
  const es = locale === 'es';
  switch (kind) {
    case 'morning':
      return {
        title: es ? 'Nueva pregunta del día' : 'New question of the day',
        body: es
          ? 'La misma pregunta para todo el mundo. ¿Te la sabes?'
          : 'The same question for everyone. Do you know it?',
        route: DAILY_ROUTE,
      };
    case 'evening': {
      const streak = n(p.streak);
      if (streak >= 2) {
        return {
          title: es ? `Tu racha de ${streak} días se pierde esta noche` : `Your ${streak}-day streak ends tonight`,
          body: es
            ? 'Responde la pregunta de hoy y sigue sumando.'
            : "Answer today's question and keep it going.",
          route: DAILY_ROUTE,
        };
      }
      return {
        title: es ? 'Aún no has jugado hoy' : "You haven't played today",
        body: es
          ? 'Un minuto para la pregunta del día antes de dormir.'
          : 'One minute for the question of the day before bed.',
        route: DAILY_ROUTE,
      };
    }
    case 'league_closing': {
      const rank = n(p.rank), count = n(p.count), gap = n(p.gap);
      const pos = es ? `Vas ${rank}.º de ${count}` : `You're #${rank} of ${count}`;
      const tail = gap > 0
        ? (es ? `, a ${gap} XP de la zona de ascenso.` : `, ${gap} XP from the promotion zone.`)
        : (es ? '. ¡Estás en zona de ascenso!' : ". You're in the promotion zone!");
      return {
        title: es ? 'Tu liga cierra mañana' : 'Your league closes tomorrow',
        body: pos + tail,
        route: LEAGUES_ROUTE,
      };
    }
    case 'league_result': {
      const result = String(p.result ?? 'stayed');
      const div = Math.max(0, Math.min(3, n(p.division)));
      const reward = n(p.reward);
      const names = DIVISIONS[locale];
      const coins = reward > 0 ? (es ? ` +${reward} 🪙` : ` +${reward} 🪙`) : '';
      if (result === 'promoted') {
        return {
          title: es ? `¡Has ascendido a ${names[div + 1] ?? names[3]}!` : `Promoted to ${names[div + 1] ?? names[3]}!`,
          body: (es ? `Acabaste ${n(p.rank)}.º la semana pasada.` : `You finished #${n(p.rank)} last week.`) + coins,
          route: LEAGUES_ROUTE,
        };
      }
      if (result === 'relegated') {
        return {
          title: es ? `Has bajado a ${names[div - 1] ?? names[0]}` : `Down to ${names[div - 1] ?? names[0]}`,
          body: (es ? 'Esta semana toca remontar.' : 'Time to bounce back this week.') + coins,
          route: LEAGUES_ROUTE,
        };
      }
      return {
        title: es ? 'Nueva semana de liga' : 'New league week',
        body: (es ? `Mantienes ${names[div]}: acabaste ${n(p.rank)}.º.` : `You stay in ${names[div]}: you finished #${n(p.rank)}.`) + coins,
        route: LEAGUES_ROUTE,
      };
    }
    case 'friend_overtaken': {
      const friend = String(p.friend ?? '?');
      return {
        title: es ? `${friend} te ha superado hoy` : `${friend} just passed you today`,
        body: es
          ? 'Mira el ranking del día y recupera tu puesto mañana.'
          : "Check today's ranking and take your spot back tomorrow.",
        route: DAILY_ROUTE,
      };
    }
  }
}

function toLocale(v: string): Locale {
  return v === 'en' ? 'en' : 'es';
}

async function sendToExpo(messages: Message[]): Promise<{ deadTokens: string[]; sent: number }> {
  const deadTokens: string[] = [];
  let sent = 0;
  for (let i = 0; i < messages.length; i += 100) {
    const chunk = messages.slice(i, i + 100);
    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(chunk.map(({ to, title, body, sound, data }) => ({ to, title, body, sound, data }))),
    });
    if (!res.ok) {
      console.error('[send-push] expo status', res.status, await res.text());
      continue;
    }
    const json = await res.json() as { data?: Array<{ status: string; details?: { error?: string } }> };
    (json.data ?? []).forEach((ticket, idx) => {
      if (ticket.status === 'ok') { sent += 1; return; }
      if (ticket.details?.error === 'DeviceNotRegistered') deadTokens.push(chunk[idx].to);
      else console.warn('[send-push] ticket error', ticket.details?.error, chunk[idx]._kind);
    });
  }
  return { deadTokens, sent };
}

Deno.serve(async (req) => {
  const secret = Deno.env.get('PUSH_CRON_SECRET') ?? '';
  const given = req.headers.get('x-push-secret') ?? '';
  if (!secret || given !== secret) {
    return new Response('unauthorized', { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  );

  const messages: Message[] = [];
  const push = (kind: Kind, rows: Due[]) => {
    for (const r of rows) {
      if (!r.token || !r.token.startsWith('ExponentPushToken')) continue;
      const locale = toLocale(r.locale);
      const c = compose(kind, locale, r.payload ?? {});
      messages.push({
        to: r.token, title: c.title, body: c.body, sound: 'default',
        data: { owner: 'cg-trivia', kind, route: c.route },
        _user: r.user_id, _day: r.day_key, _kind: kind, _queue: r.queue_id,
      });
    }
  };

  const timed: Kind[] = ['morning', 'evening', 'league_closing', 'league_result'];
  for (const kind of timed) {
    const { data, error } = await supabase.rpc(`push_due_${kind}`);
    if (error) { console.error(`[send-push] push_due_${kind}`, error.message); continue; }
    push(kind, (data ?? []) as Due[]);
  }
  {
    const { data, error } = await supabase.rpc('push_due_queue');
    if (error) console.error('[send-push] push_due_queue', error.message);
    for (const r of (data ?? []) as Due[]) {
      if (r.kind === 'friend_overtaken') push('friend_overtaken', [r]);
    }
  }

  if (messages.length === 0) {
    return Response.json({ sent: 0 });
  }

  // Un mismo usuario con dos dispositivos recibe dos mensajes pero un solo
  // registro por día y tipo; el on conflict lo absorbe.
  const { deadTokens, sent } = await sendToExpo(messages);

  const logged = new Set<string>();
  for (const m of messages) {
    const key = `${m._user}|${m._kind}|${m._day}`;
    if (logged.has(key)) continue;
    logged.add(key);
    const { error } = await supabase.rpc('push_mark_sent', { p_user_id: m._user, p_kind: m._kind, p_day: m._day });
    if (error) console.error('[send-push] push_mark_sent', error.message);
  }

  const queueIds = messages.map(m => m._queue).filter((id): id is number => typeof id === 'number');
  if (queueIds.length > 0) {
    const { error } = await supabase.rpc('push_queue_done', { p_ids: [...new Set(queueIds)] });
    if (error) console.error('[send-push] push_queue_done', error.message);
  }

  if (deadTokens.length > 0) {
    const { error } = await supabase.rpc('push_disable_tokens', { p_tokens: deadTokens });
    if (error) console.error('[send-push] push_disable_tokens', error.message);
  }

  return Response.json({ sent, attempted: messages.length, disabled: deadTokens.length });
});
