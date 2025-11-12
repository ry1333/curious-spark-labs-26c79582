-- MODERATION TABLES
-- This migration adds tables for content moderation and user safety

-- REPORTS TABLE
-- Users can report inappropriate posts, comments, or users
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  reason text not null check (reason in ('spam', 'inappropriate', 'harassment', 'copyright', 'other')),
  description text,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'resolved', 'dismissed')),
  moderator_id uuid references public.profiles(id) on delete set null,
  moderator_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- At least one target must be specified
  constraint report_has_target check (
    (reported_user_id is not null) or
    (post_id is not null) or
    (comment_id is not null)
  )
);

-- BLOCKED USERS TABLE
-- Users can block other users to prevent seeing their content
create table if not exists public.blocked_users (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),

  -- Can't block yourself
  constraint no_self_block check (blocker_id != blocked_id),

  -- Can't block the same user twice
  constraint unique_block unique (blocker_id, blocked_id)
);

-- ADMIN USERS TABLE
-- Track which users have moderation privileges
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  role text not null default 'moderator' check (role in ('moderator', 'admin', 'super_admin')),
  granted_by uuid references public.profiles(id) on delete set null,
  granted_at timestamptz default now(),
  revoked_at timestamptz,
  is_active boolean default true
);

-- CONTENT FLAGS TABLE
-- Automated system flags for suspicious content (future use)
create table if not exists public.content_flags (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  flag_type text not null check (flag_type in ('profanity', 'spam_pattern', 'duplicate', 'suspicious_link')),
  confidence_score decimal(3,2), -- 0.00 to 1.00
  auto_hidden boolean default false,
  reviewed boolean default false,
  created_at timestamptz default now(),

  constraint flag_has_target check (
    (post_id is not null) or (comment_id is not null)
  )
);

-- INDEXES for performance
create index if not exists reports_status on public.reports (status);
create index if not exists reports_created_at on public.reports (created_at desc);
create index if not exists reports_reporter_id on public.reports (reporter_id);
create index if not exists reports_post_id on public.reports (post_id);
create index if not exists blocked_users_blocker_id on public.blocked_users (blocker_id);
create index if not exists blocked_users_blocked_id on public.blocked_users (blocked_id);
create index if not exists content_flags_reviewed on public.content_flags (reviewed) where reviewed = false;

-- ENABLE ROW LEVEL SECURITY
alter table public.reports enable row level security;
alter table public.blocked_users enable row level security;
alter table public.admin_users enable row level security;
alter table public.content_flags enable row level security;

-- RLS POLICIES

-- Reports policies
-- Users can view their own reports
create policy "reports_select_own" on public.reports
  for select using (auth.uid() = reporter_id);

-- Admins can view all reports (checked via admin_users table)
create policy "reports_select_admin" on public.reports
  for select using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
      and is_active = true
    )
  );

-- Users can create reports
create policy "reports_insert_own" on public.reports
  for insert with check (auth.uid() = reporter_id);

-- Only admins can update reports
create policy "reports_update_admin" on public.reports
  for update using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
      and is_active = true
    )
  );

-- Blocked users policies
-- Users can view their own blocks
create policy "blocks_select_own" on public.blocked_users
  for select using (auth.uid() = blocker_id);

-- Users can create blocks
create policy "blocks_insert_own" on public.blocked_users
  for insert with check (auth.uid() = blocker_id);

-- Users can delete their own blocks (unblock)
create policy "blocks_delete_own" on public.blocked_users
  for delete using (auth.uid() = blocker_id);

-- Admin users policies
-- Anyone can check if someone is an admin (for UI purposes)
create policy "admins_select_all" on public.admin_users
  for select using (true);

-- Only super admins can modify admin status (manual for now)
-- (We'll handle this via direct DB access initially)

-- Content flags policies
-- Only admins can view flags
create policy "flags_select_admin" on public.content_flags
  for select using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
      and is_active = true
    )
  );

-- System can insert flags (we'll use service role for this)
-- No insert policy for regular users

-- FUNCTIONS

-- Function to check if user is admin
create or replace function public.is_admin(user_id uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.admin_users
    where admin_users.user_id = $1
    and is_active = true
  );
$$;

-- Function to get blocked user IDs for current user
create or replace function public.get_blocked_user_ids()
returns table (blocked_id uuid) language sql security definer as $$
  select blocked_users.blocked_id
  from public.blocked_users
  where blocker_id = auth.uid();
$$;

-- Trigger to update reports.updated_at
create or replace function public.update_report_timestamp()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger reports_updated_at
before update on public.reports
for each row execute procedure public.update_report_timestamp();
