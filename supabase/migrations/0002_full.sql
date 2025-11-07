-- Enable pgcrypto for gen_random_uuid (Supabase has it by default)
create extension if not exists pgcrypto;

-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

-- Auto-create profile on auth signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- CHALLENGES (simple weekly)
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  ends_at timestamptz,
  created_at timestamptz default now()
);

-- POSTS (audio clips)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  audio_url text not null,
  caption text default '',
  bpm int,
  key text,
  style text,
  challenge_id uuid references public.challenges(id) on delete set null,
  created_at timestamptz default now()
);

-- REACTIONS (likes/saves/shares)
create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text check (type in ('love','save','share')) not null,
  created_at timestamptz default now()
);
create unique index if not exists uniq_reaction on public.reactions (post_id, user_id, type);

-- Indexes
create index if not exists posts_created_at_desc on public.posts (created_at desc);
create index if not exists reactions_post_id on public.reactions (post_id);

-- RLS
alter table public.posts enable row level security;
alter table public.reactions enable row level security;
alter table public.profiles enable row level security;
alter table public.challenges enable row level security;

-- Policies
create policy if not exists "read profiles"   on public.profiles   for select using (true);
create policy if not exists "update own prof" on public.profiles   for update using (auth.uid() = id);

create policy if not exists "read posts"   on public.posts for select using (true);
create policy if not exists "insert own"   on public.posts for insert with check (auth.uid() = user_id);
create policy if not exists "update own"   on public.posts for update using (auth.uid() = user_id);
create policy if not exists "delete own"   on public.posts for delete using (auth.uid() = user_id);

create policy if not exists "read reactions" on public.reactions for select using (true);
create policy if not exists "insert own react" on public.reactions for insert with check (auth.uid() = user_id);
create policy if not exists "delete own react" on public.reactions for delete using (auth.uid() = user_id);

create policy if not exists "read challenges" on public.challenges for select using (true);
