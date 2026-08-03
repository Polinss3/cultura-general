-- ─────────────────────────────────────────────────────────────
-- Cultura General — push tokens for friendship notifications
-- Run this in the Supabase SQL Editor (after schema.sql).
--
-- Companion piece: the Edge Function `send-friend-notification`
-- is invoked by Supabase Database Webhooks (configured in the UI),
-- not by SQL triggers — so this migration intentionally only sets
-- up the push_tokens table and its RLS policy.
--
-- After running this file:
--   1) Deploy the Edge Function:
--        supabase functions deploy send-friend-notification --no-verify-jwt
--   2) In the Supabase Dashboard go to
--        Database → Webhooks → Create a new hook
--      and create TWO hooks pointing at the function above:
--
--      Hook A — friend_request
--        Table:       public.friendships
--        Events:      Insert
--        Type:        Supabase Edge Functions
--        Edge function: send-friend-notification
--        Method:      POST
--        Headers:     (leave default)
--
--      Hook B — friend_accept
--        Table:       public.friendships
--        Events:      Update
--        Type:        Supabase Edge Functions
--        Edge function: send-friend-notification
--        Method:      POST
--        Headers:     (leave default)
--
--   The Edge Function inspects `type`, `record` and `old_record` in
--   the standard Supabase webhook payload to decide what to do.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.push_tokens (
  user_id    uuid references auth.users(id) on delete cascade not null,
  token      text not null,
  platform   text not null check (platform in ('ios','android','web')),
  updated_at timestamptz default now(),
  primary key (user_id, token)
);

alter table public.push_tokens enable row level security;

do $$ begin
  drop policy if exists "Users manage own push tokens" on public.push_tokens;
end $$;

create policy "Users manage own push tokens" on public.push_tokens
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
