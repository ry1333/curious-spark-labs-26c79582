-- Migration 006: Add Comments Table and Missing Post Fields
-- Fixes: Missing comments table, caption field, parent_post_id field

-- 1. Create comments table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on comments
alter table public.comments enable row level security;

-- RLS Policies for comments
create policy "comments_select_all" on public.comments
  for select using (true);

create policy "comments_insert_authenticated" on public.comments
  for insert with check (auth.uid() = user_id);

create policy "comments_update_own" on public.comments
  for update using (auth.uid() = user_id);

create policy "comments_delete_own" on public.comments
  for delete using (auth.uid() = user_id);

-- Create indexes for performance
create index if not exists comments_post_id_idx on public.comments(post_id);
create index if not exists comments_user_id_idx on public.comments(user_id);
create index if not exists comments_created_at_idx on public.comments(created_at desc);

-- 2. Add missing fields to posts table
alter table public.posts
  add column if not exists caption text,
  add column if not exists parent_post_id uuid references public.posts(id) on delete set null;

-- Create index for remix lookups
create index if not exists posts_parent_post_id_idx on public.posts(parent_post_id);

-- 3. Create trigger for auto-updating comments.updated_at
create or replace function update_comments_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_comments_updated_at on public.comments;
create trigger update_comments_updated_at
  before update on public.comments
  for each row
  execute function update_comments_updated_at();

-- 4. Grant necessary permissions
grant all on public.comments to authenticated;
grant all on public.comments to service_role;

-- Note: After running this migration:
-- 1. Wait 30 seconds for Supabase to regenerate types
-- 2. Run: npm run build
-- 3. Check for TypeScript errors
