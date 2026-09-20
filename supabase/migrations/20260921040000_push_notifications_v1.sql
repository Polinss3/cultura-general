-- Notificaciones push reales (2.3.0). Aditiva e idempotente.
--
-- Piezas:
--  · push_tokens: el token de Expo de cada dispositivo con sesión, con su
--    idioma y zona horaria (para avisar a las 9:00 y 20:00 LOCALES).
--  · push_log: qué aviso se mandó a quién y qué día, para no repetir
--    (máximo uno por tipo y día).
--  · push_queue: avisos por evento (hoy solo "un amigo te ha superado"),
--    encolados por trigger y vaciados por la Edge Function.
--  · push_due_*(): consultas de "a quién le toca ahora" que llama la Edge
--    Function `send-push` cada 15 minutos con la clave de servicio.
--
-- Nada de esto lo usa la 2.2.0; la app antigua simplemente no registra token.
-- La programación del cron (pg_cron + pg_net) va aparte en
-- supabase/push_cron_setup.sql porque lleva la URL y el secreto del proyecto.
begin;

-- ─── 1. Tokens ───────────────────────────────────────────────────────────────
create table if not exists public.push_tokens (
  token       text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  platform    text not null default 'ios',
  locale      text not null default 'es',        -- 'es' | 'en'
  timezone    text not null default 'Europe/Madrid',
  app_version text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  disabled_at timestamptz                          -- DeviceNotRegistered, baja…
);
create index if not exists push_tokens_user_idx on public.push_tokens (user_id);

alter table public.push_tokens enable row level security;
do $$ begin
  drop policy if exists "Users manage own push_tokens" on public.push_tokens;
end $$;
create policy "Users manage own push_tokens" on public.push_tokens
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Alta/actualización desde la app. Un token es de un solo usuario: si cambia
-- la sesión en el mismo dispositivo, pasa al nuevo.
create or replace function public.register_push_token(
  p_token text, p_platform text, p_locale text, p_timezone text, p_app_version text
) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if auth.uid() is null then raise exception 'unauthorized'; end if;
  if p_token is null or length(p_token) < 10 then raise exception 'bad token'; end if;
  insert into public.push_tokens (token, user_id, platform, locale, timezone, app_version)
  values (p_token, auth.uid(), coalesce(p_platform, 'ios'),
          case when p_locale in ('es', 'en') then p_locale else 'es' end,
          coalesce(nullif(p_timezone, ''), 'Europe/Madrid'), p_app_version)
  on conflict (token) do update set
    user_id     = excluded.user_id,
    platform    = excluded.platform,
    locale      = excluded.locale,
    timezone    = excluded.timezone,
    app_version = excluded.app_version,
    updated_at  = now(),
    disabled_at = null;
end;
$$;
grant execute on function public.register_push_token(text, text, text, text, text) to authenticated;

create or replace function public.unregister_push_token(p_token text)
returns void language sql security definer set search_path = public, pg_temp as $$
  delete from public.push_tokens where token = p_token and user_id = auth.uid();
$$;
grant execute on function public.unregister_push_token(text) to authenticated;

-- ─── 2. Registro y cola ──────────────────────────────────────────────────────
create table if not exists public.push_log (
  user_id  uuid not null references auth.users(id) on delete cascade,
  kind     text not null,
  day_key  date not null,
  sent_at  timestamptz not null default now(),
  primary key (user_id, kind, day_key)
);
alter table public.push_log enable row level security;   -- solo servicio

create table if not exists public.push_queue (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  kind       text not null,
  payload    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  sent_at    timestamptz
);
create index if not exists push_queue_pending_idx on public.push_queue (created_at) where sent_at is null;
alter table public.push_queue enable row level security;  -- solo servicio

-- ─── 3. Ayudas de hora local ─────────────────────────────────────────────────
-- Zona horaria inválida → Madrid, para que un token raro no rompa la consulta.
create or replace function public.push_local_now(p_tz text)
returns timestamp language plpgsql stable as $$
begin
  return now() at time zone p_tz;
exception when others then
  return now() at time zone 'Europe/Madrid';
end;
$$;

-- El "día" de la pregunta es UTC en toda la app (todayStr), así que la marca
-- de "respondido hoy" se mira en UTC aunque la hora de envío sea local.
create or replace function public.push_utc_today()
returns date language sql stable as $$ select (now() at time zone 'UTC')::date $$;

-- ─── 4. A quién le toca (las llama la Edge Function) ─────────────────────────
-- Devuelven (user_id, token, locale, payload). Cada una excluye a quien ya
-- recibió ese tipo hoy (push_log) y a los tokens dados de baja.

-- 9:00 local: nueva pregunta del día, solo a quien no la ha respondido.
create or replace function public.push_due_morning()
returns table (user_id uuid, token text, locale text, payload jsonb, day_key date)
language sql security definer set search_path = public, pg_temp as $$
  select pt.user_id, pt.token, pt.locale, jsonb_build_object('streak', coalesce(p.streak, 0)),
         public.push_local_now(pt.timezone)::date
    from public.push_tokens pt
    join public.profiles p on p.id = pt.user_id
   where pt.disabled_at is null
     and extract(hour from public.push_local_now(pt.timezone)) = 9
     and not exists (select 1 from public.daily_rankings dr
                      where dr.user_id = pt.user_id and dr.date = public.push_utc_today())
     and not exists (select 1 from public.push_log pl
                      where pl.user_id = pt.user_id and pl.kind = 'morning'
                        and pl.day_key = public.push_local_now(pt.timezone)::date);
$$;

-- 20:00 local: racha en peligro (racha ≥ 2) o recordatorio de tarde, a quien
-- no ha respondido. El payload lleva la racha para elegir el texto.
create or replace function public.push_due_evening()
returns table (user_id uuid, token text, locale text, payload jsonb, day_key date)
language sql security definer set search_path = public, pg_temp as $$
  select pt.user_id, pt.token, pt.locale, jsonb_build_object('streak', coalesce(p.streak, 0)),
         public.push_local_now(pt.timezone)::date
    from public.push_tokens pt
    join public.profiles p on p.id = pt.user_id
   where pt.disabled_at is null
     and extract(hour from public.push_local_now(pt.timezone)) = 20
     and not exists (select 1 from public.daily_rankings dr
                      where dr.user_id = pt.user_id and dr.date = public.push_utc_today())
     and not exists (select 1 from public.push_log pl
                      where pl.user_id = pt.user_id and pl.kind = 'evening'
                        and pl.day_key = public.push_local_now(pt.timezone)::date);
$$;

-- Puesto de un usuario en su grupo de liga de una semana, con el tamaño del
-- grupo. Misma ordenación que get_league(). Sin grupo (semanas anteriores a
-- v3) se mira la división entera.
create or replace function public.push_league_rank(p_uid uuid, p_week date)
returns table (rank int, member_count int, xp int, division int)
language sql stable security definer set search_path = public, pg_temp as $$
  with me as (
    select division, group_id from public.league_members
     where user_id = p_uid and week_start = p_week
  ), grp as (
    select lm.user_id,
           row_number() over (order by coalesce(wx.xp, 0) desc, lm.user_id) as rnk,
           count(*) over () as cnt,
           coalesce(wx.xp, 0) as xp
      from public.league_members lm
      join me on true
      left join public.weekly_xp wx on wx.user_id = lm.user_id and wx.week_start = p_week
     where lm.week_start = p_week and lm.division = me.division
       and (me.group_id is null or lm.group_id = me.group_id)
  )
  select g.rnk::int, g.cnt::int, g.xp::int, me.division
    from grp g, me where g.user_id = p_uid;
$$;

-- Domingo 18:00 local: la liga cierra mañana. Payload: puesto, tamaño,
-- XP que faltan para la zona de ascenso (0 si ya está dentro).
create or replace function public.push_due_league_closing()
returns table (user_id uuid, token text, locale text, payload jsonb, day_key date)
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_week date := date_trunc('week', current_date)::date;
  r record;
  lr record;
  v_zone int;
  v_gap int;
  v_zone_xp int;
begin
  for r in
    select pt.user_id, pt.token, pt.locale, pt.timezone
      from public.push_tokens pt
     where pt.disabled_at is null
       and extract(isodow from public.push_local_now(pt.timezone)) = 7
       and extract(hour from public.push_local_now(pt.timezone)) = 18
       and exists (select 1 from public.league_members lm
                    where lm.user_id = pt.user_id and lm.week_start = v_week)
       and not exists (select 1 from public.push_log pl
                        where pl.user_id = pt.user_id and pl.kind = 'league_closing'
                          and pl.day_key = public.push_local_now(pt.timezone)::date)
  loop
    select * into lr from public.push_league_rank(r.user_id, v_week);
    if lr.rank is null then continue; end if;
    v_zone := public.league_promote_zone(lr.member_count);
    if lr.division >= 3 or lr.rank <= v_zone then
      v_gap := 0;
    else
      -- XP del último de la zona de ascenso en su grupo.
      select g.xp into v_zone_xp from (
        select lm.user_id, coalesce(wx.xp, 0) as xp,
               row_number() over (order by coalesce(wx.xp, 0) desc, lm.user_id) as rnk
          from public.league_members lm
          left join public.weekly_xp wx on wx.user_id = lm.user_id and wx.week_start = v_week
         where lm.week_start = v_week
           and lm.group_id = (select group_id from public.league_members
                               where user_id = r.user_id and week_start = v_week)
      ) g where g.rnk = v_zone;
      v_gap := greatest(0, coalesce(v_zone_xp, 0) - lr.xp + 1);
    end if;
    user_id := r.user_id; token := r.token; locale := r.locale;
    day_key := public.push_local_now(r.timezone)::date;
    payload := jsonb_build_object('rank', lr.rank, 'count', lr.member_count,
                                  'gap', v_gap, 'division', lr.division);
    return next;
  end loop;
end;
$$;

-- Lunes 10:00 local: resultado de la semana pasada (mismo criterio que
-- get_league: zona de ascenso + actividad mínima; zona de descenso solo si el
-- grupo da para las dos zonas). Es una predicción exacta de lo que get_league
-- aplicará cuando el usuario abra la app.
create or replace function public.push_due_league_result()
returns table (user_id uuid, token text, locale text, payload jsonb, day_key date)
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_prev date := (date_trunc('week', current_date) - interval '7 days')::date;
  r record;
  lr record;
  v_promote int;
  v_relegate int;
  v_result text;
begin
  for r in
    select pt.user_id, pt.token, pt.locale, pt.timezone
      from public.push_tokens pt
     where pt.disabled_at is null
       and extract(isodow from public.push_local_now(pt.timezone)) = 1
       and extract(hour from public.push_local_now(pt.timezone)) = 10
       and exists (select 1 from public.league_members lm
                    where lm.user_id = pt.user_id and lm.week_start = v_prev)
       and not exists (select 1 from public.push_log pl
                        where pl.user_id = pt.user_id and pl.kind = 'league_result'
                          and pl.day_key = public.push_local_now(pt.timezone)::date)
  loop
    select * into lr from public.push_league_rank(r.user_id, v_prev);
    if lr.rank is null then continue; end if;
    v_promote  := public.league_promote_zone(lr.member_count);
    v_relegate := public.league_relegate_zone(lr.member_count);
    if lr.division < 3 and lr.rank <= v_promote
       and (public.league_promote_min(lr.division) is null
            or lr.xp >= public.league_promote_min(lr.division)) then
      v_result := 'promoted';
    elsif lr.division > 0 and (
            (v_relegate > 0 and lr.member_count > v_promote + v_relegate
             and lr.rank > lr.member_count - v_relegate)
            or (public.league_relegate_min(lr.division) is not null
                and lr.xp < public.league_relegate_min(lr.division))) then
      v_result := 'relegated';
    else
      v_result := 'stayed';
    end if;
    user_id := r.user_id; token := r.token; locale := r.locale;
    day_key := public.push_local_now(r.timezone)::date;
    payload := jsonb_build_object('rank', lr.rank, 'count', lr.member_count,
                                  'result', v_result, 'division', lr.division,
                                  'reward', public.league_placement_reward(lr.division, lr.rank));
    return next;
  end loop;
end;
$$;

-- Cola por evento: devuelve lo pendiente con el token de cada destinatario
-- (un usuario con varios dispositivos recibe el aviso en todos).
create or replace function public.push_due_queue()
returns table (queue_id bigint, user_id uuid, token text, locale text, kind text, payload jsonb, day_key date)
language sql security definer set search_path = public, pg_temp as $$
  select q.id, q.user_id, pt.token, pt.locale, q.kind, q.payload, public.push_utc_today()
    from public.push_queue q
    join public.push_tokens pt on pt.user_id = q.user_id and pt.disabled_at is null
   where q.sent_at is null
     and q.created_at > now() - interval '1 day'
   order by q.created_at
   limit 500;
$$;

-- Marca de envío (una fila por usuario/tipo/día) y cierre de cola.
create or replace function public.push_mark_sent(p_user_id uuid, p_kind text, p_day date)
returns void language sql security definer set search_path = public, pg_temp as $$
  insert into public.push_log (user_id, kind, day_key) values (p_user_id, p_kind, p_day)
  on conflict do nothing;
$$;
create or replace function public.push_queue_done(p_ids bigint[])
returns void language sql security definer set search_path = public, pg_temp as $$
  update public.push_queue set sent_at = now() where id = any(p_ids);
$$;
create or replace function public.push_disable_tokens(p_tokens text[])
returns void language sql security definer set search_path = public, pg_temp as $$
  update public.push_tokens set disabled_at = now() where token = any(p_tokens);
$$;

-- Solo la clave de servicio (la Edge Function) puede llamar a estas.
revoke all on function public.push_due_morning() from public, anon, authenticated;
revoke all on function public.push_due_evening() from public, anon, authenticated;
revoke all on function public.push_due_league_closing() from public, anon, authenticated;
revoke all on function public.push_due_league_result() from public, anon, authenticated;
revoke all on function public.push_due_queue() from public, anon, authenticated;
revoke all on function public.push_mark_sent(uuid, text, date) from public, anon, authenticated;
revoke all on function public.push_queue_done(bigint[]) from public, anon, authenticated;
revoke all on function public.push_disable_tokens(text[]) from public, anon, authenticated;
revoke all on function public.push_league_rank(uuid, date) from public, anon, authenticated;

-- ─── 5. Evento: un amigo te ha superado en el ranking de hoy ─────────────────
-- Al guardar la respuesta del día de X, cada amigo Y que ya había respondido
-- y queda por debajo (menos puntos, o mismos puntos y más lento) recibe un
-- aviso. Máximo uno al día por persona (push_log 'friend_overtaken').
create or replace function public.push_on_daily_answer()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_name text;
begin
  select username into v_name from public.profiles where id = new.user_id;

  insert into public.push_queue (user_id, kind, payload)
  select f.friend, 'friend_overtaken',
         jsonb_build_object('friend', coalesce(v_name, '?'), 'score', new.score)
    from (
      select case when fr.user_id = new.user_id then fr.friend_id else fr.user_id end as friend
        from public.friendships fr
       where fr.status = 'accepted'
         and (fr.user_id = new.user_id or fr.friend_id = new.user_id)
    ) f
    join public.daily_rankings mine
      on mine.user_id = f.friend and mine.date = new.date
   where (mine.score < new.score
          or (mine.score = new.score and coalesce(mine.time_ms, 0) > coalesce(new.time_ms, 0)))
     and exists (select 1 from public.push_tokens pt where pt.user_id = f.friend and pt.disabled_at is null)
     and not exists (select 1 from public.push_log pl
                      where pl.user_id = f.friend and pl.kind = 'friend_overtaken'
                        and pl.day_key = new.date)
     and not exists (select 1 from public.push_queue q
                      where q.user_id = f.friend and q.kind = 'friend_overtaken'
                        and q.sent_at is null);
  return new;
end;
$$;

drop trigger if exists trg_push_on_daily_answer on public.daily_rankings;
create trigger trg_push_on_daily_answer
  after insert on public.daily_rankings
  for each row execute function public.push_on_daily_answer();

commit;
