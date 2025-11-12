-- ADD COMMENTS TABLE
-- This migration adds a dedicated comments table for post comments

-- Create comments table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for performance
create index if not exists comments_post_id on public.comments (post_id);
create index if not exists comments_user_id on public.comments (user_id);
create index if not exists comments_created_at on public.comments (created_at desc);

-- Enable RLS
alter table public.comments enable row level security;

-- Comments policies
create policy "comments_select_all" on public.comments for select using (true);
create policy "comments_insert_own" on public.comments for insert with check (auth.uid() = user_id);
create policy "comments_update_own" on public.comments for update using (auth.uid() = user_id);
create policy "comments_delete_own" on public.comments for delete using (auth.uid() = user_id);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger to auto-update updated_at
create trigger comments_updated_at
before update on public.comments
for each row execute procedure public.handle_updated_at();
