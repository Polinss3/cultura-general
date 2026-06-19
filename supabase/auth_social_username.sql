-- ─────────────────────────────────────────────────────────────
-- Cultura General — Auth social + username con espacios
-- Aplicar en Supabase SQL Editor antes de activar Google/Apple.
-- ─────────────────────────────────────────────────────────────

create or replace function public.normalize_username(p_username text)
returns text language sql immutable as $$
  select nullif(regexp_replace(btrim(coalesce(p_username, '')), '\s+', ' ', 'g'), '');
$$;

create or replace function public.is_valid_username(p_username text)
returns boolean language sql immutable as $$
  select p_username is not null
    and char_length(p_username) between 3 and 20
    and p_username = btrim(p_username)
    and p_username !~ '\s{2,}';
$$;

create or replace function public.generate_profile_username(
  p_user_id uuid,
  p_email text,
  p_meta jsonb default '{}'::jsonb
)
returns text language plpgsql security definer as $$
declare
  v_candidate text;
  v_candidates text[] := array[
    public.normalize_username(p_meta->>'username'),
    public.normalize_username(p_meta->>'full_name'),
    public.normalize_username(p_meta->>'name'),
    public.normalize_username(split_part(coalesce(p_email, ''), '@', 1))
  ];
  v_suffix text := upper(substr(replace(coalesce(p_user_id::text, uuid_generate_v4()::text), '-', ''), 1, 6));
  v_attempt int := 0;
begin
  if coalesce((p_meta->>'manual_username')::boolean, false) then
    return public.normalize_username(p_meta->>'username');
  end if;

  foreach v_candidate in array v_candidates loop
    if public.is_valid_username(v_candidate)
      and not exists (
        select 1
          from public.profiles
         where username = v_candidate
           and id <> p_user_id
      ) then
      return v_candidate;
    end if;
  end loop;

  loop
    v_attempt := v_attempt + 1;
    v_candidate := left(
      'Jugador ' || v_suffix || case when v_attempt = 1 then '' else v_attempt::text end,
      20
    );

    if not exists (
      select 1
        from public.profiles
       where username = v_candidate
         and id <> p_user_id
    ) then
      return v_candidate;
    end if;

    if v_attempt > 50 then
      return left('Jugador ' || substr(upper(replace(uuid_generate_v4()::text, '-', '')), 1, 10), 20);
    end if;
  end loop;
end;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    public.generate_profile_username(new.id, new.email, coalesce(new.raw_user_meta_data, '{}'::jsonb))
  );
  return new;
end;
$$;

do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'profiles_username_format_check'
  ) then
    alter table public.profiles
      drop constraint profiles_username_format_check;
  end if;

  alter table public.profiles
    add constraint profiles_username_format_check
    check (public.is_valid_username(username))
    not valid;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
