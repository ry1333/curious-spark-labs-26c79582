-- UNIFIED SCHEMA MIGRATION
-- This migration creates a clean, unified database schema
-- Run this in your Supabase SQL Editor

-- Drop existing tables and triggers (to clean up any conflicts)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.reactions cascade;
drop table if exists public.posts cascade;
drop table if exists public.challenges cascade;
drop table if exists public.profiles cascade;

-- Enable extensions
create extension if not exists pgcrypto;

-- PROFILES TABLE
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

-- Auto-create profile on auth signup
create function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- CHALLENGES TABLE
create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  ends_at timestamptz,
  created_at timestamptz default now()
);

-- POSTS TABLE
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  audio_url text not null,
  caption text default '',
  bpm int,
  key text,
  style text,
  parent_post_id uuid references public.posts(id) on delete set null,
  challenge_id uuid references public.challenges(id) on delete set null,
  created_at timestamptz default now()
);

-- REACTIONS TABLE
create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('love','comment','save','share')),
  created_at timestamptz default now()
);

-- INDEXES
create unique index uniq_reaction on public.reactions (post_id, user_id, type);
create index posts_created_at_desc on public.posts (created_at desc);
create index posts_user_id on public.posts (user_id);
create index reactions_post_id on public.reactions (post_id);
create index reactions_user_id on public.reactions (user_id);

-- ENABLE ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.challenges enable row level security;
alter table public.posts enable row level security;
alter table public.reactions enable row level security;

-- DROP OLD POLICIES (if they exist)
drop policy if exists "read profiles" on public.profiles;
drop policy if exists "update own prof" on public.profiles;
drop policy if exists "read posts" on public.posts;
drop policy if exists "insert own post" on public.posts;
drop policy if exists "insert own" on public.posts;
drop policy if exists "update own post" on public.posts;
drop policy if exists "update own" on public.posts;
drop policy if exists "delete own post" on public.posts;
drop policy if exists "delete own" on public.posts;
drop policy if exists "read reactions" on public.reactions;
drop policy if exists "insert own reaction" on public.reactions;
drop policy if exists "insert own react" on public.reactions;
drop policy if exists "delete own reaction" on public.reactions;
drop policy if exists "delete own react" on public.reactions;
drop policy if exists "read challenges" on public.challenges;

-- CREATE POLICIES
-- Profiles policies
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Posts policies
create policy "posts_select_all" on public.posts for select using (true);
create policy "posts_insert_own" on public.posts for insert with check (auth.uid() = user_id);
create policy "posts_update_own" on public.posts for update using (auth.uid() = user_id);
create policy "posts_delete_own" on public.posts for delete using (auth.uid() = user_id);

-- Reactions policies
create policy "reactions_select_all" on public.reactions for select using (true);
create policy "reactions_insert_own" on public.reactions for insert with check (auth.uid() = user_id);
create policy "reactions_delete_own" on public.reactions for delete using (auth.uid() = user_id);

-- Challenges policies
create policy "challenges_select_all" on public.challenges for select using (true);

-- Note: No demo data inserted here because profiles require real auth.users entries.
-- The app will use the fallback mock data mechanism when no posts exist.
