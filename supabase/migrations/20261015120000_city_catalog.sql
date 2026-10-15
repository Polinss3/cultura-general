-- Remote city questions. Names without images are valid distractors.
begin;
create table if not exists public.city_catalog (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name jsonb not null check (jsonb_typeof(name) = 'object' and length(trim(name->>'es')) > 0 and length(trim(name->>'en')) > 0 and name ? 'es' and name ? 'en'),
  continent text not null check (continent in ('europa','america','africa','asia','oceania')),
  difficulty smallint not null default 2 check (difficulty between 1 and 3),
  architecture_tags text[] not null default '{}',
  similar_city_ids text[] not null default '{}',
  image_url text check (image_url is null or image_url ~ '^https://'),
  framing jsonb,
  is_published boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint city_image_framing check (
    (image_url is null and framing is null) or
    (image_url is not null and framing is not null and jsonb_typeof(framing) = 'object'
      and framing ?& array['left','top','width','height','background']
      and jsonb_typeof(framing->'left') = 'number' and jsonb_typeof(framing->'top') = 'number'
      and jsonb_typeof(framing->'width') = 'number' and jsonb_typeof(framing->'height') = 'number'
      and (framing->>'width')::numeric > 0 and (framing->>'width')::numeric <= 2
      and (framing->>'height')::numeric > 0 and (framing->>'height')::numeric <= 2
      and (framing->>'left')::numeric between -1 and 1 and (framing->>'top')::numeric between -1 and 1
      and framing->>'background' ~ '^#[0-9a-fA-F]{6}$'))
);
alter table public.city_catalog enable row level security;
revoke all on public.city_catalog from anon, authenticated;
grant select on public.city_catalog to anon, authenticated;
grant all on public.city_catalog to service_role;
create policy "Published cities are readable" on public.city_catalog for select to anon, authenticated using (is_published);
create index city_catalog_published_id on public.city_catalog (id) where is_published;

-- Public artwork only; uploading and editing are restricted to trusted tooling.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('city-dioramas', 'city-dioramas', true, 5242880, array['image/png','image/webp','image/jpeg'])
on conflict (id) do nothing;

create or replace function public.award_daily_cap(p_source text)
returns table (cap_xp int, cap_coins int) language sql immutable as $$
  select caps.cap_xp, caps.cap_coins from (values
    ('learn',300,150), ('speed',900,300), ('flags',600,250), ('years',600,250),
    ('cities',600,250), ('ladder',900,400), ('exam',400,200), ('review',500,200),
    ('rewarded_ad',300,300), ('daily_route',40,30)
  ) as caps(source, cap_xp, cap_coins) where caps.source = p_source;
$$;
commit;
