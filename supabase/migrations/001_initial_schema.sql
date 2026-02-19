-- Memory Bank: Initial Schema
-- Creates all core tables with Row Level Security
--
-- NOTE: Cross-referencing policies (those that reference tables defined later)
-- are grouped at the end of this file to avoid dependency errors.

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- ============================================================
-- 1. PROFILES (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  bio text,
  date_of_birth date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

-- ============================================================
-- 2. MEMORIES
-- ============================================================
create table public.memories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  memory_date date,
  location text,
  is_private boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.memories enable row level security;

create policy "Users can view their own memories"
  on public.memories for select
  using (auth.uid() = user_id);

create policy "Users can create their own memories"
  on public.memories for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own memories"
  on public.memories for update
  using (auth.uid() = user_id);

create policy "Users can delete their own memories"
  on public.memories for delete
  using (auth.uid() = user_id);

create trigger memories_updated_at
  before update on public.memories
  for each row execute function public.update_updated_at();

create index memories_user_id_idx on public.memories(user_id);
create index memories_memory_date_idx on public.memories(memory_date);
create index memories_created_at_idx on public.memories(created_at desc);

-- ============================================================
-- 3. MEMORY MEDIA
-- ============================================================
create table public.memory_media (
  id uuid default gen_random_uuid() primary key,
  memory_id uuid references public.memories(id) on delete cascade not null,
  storage_path text not null,
  file_type text not null,
  mime_type text not null,
  file_size integer not null,
  caption text,
  display_order integer default 0 not null,
  created_at timestamptz default now() not null
);

alter table public.memory_media enable row level security;

create policy "Users can view media for their memories"
  on public.memory_media for select
  using (
    memory_id in (
      select id from public.memories where user_id = auth.uid()
    )
  );

create policy "Users can add media to their memories"
  on public.memory_media for insert
  with check (
    memory_id in (
      select id from public.memories where user_id = auth.uid()
    )
  );

create policy "Users can delete media from their memories"
  on public.memory_media for delete
  using (
    memory_id in (
      select id from public.memories where user_id = auth.uid()
    )
  );

create index memory_media_memory_id_idx on public.memory_media(memory_id);

-- ============================================================
-- 4. TAGS (hashtags)
-- ============================================================
create table public.tags (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  usage_count integer default 0 not null,
  created_at timestamptz default now() not null
);

alter table public.tags enable row level security;

create policy "Authenticated users can view tags"
  on public.tags for select
  to authenticated
  using (true);

create policy "Authenticated users can create tags"
  on public.tags for insert
  to authenticated
  with check (true);

create index tags_name_idx on public.tags(name);

-- ============================================================
-- 5. MEMORY TAGS (junction table)
-- ============================================================
create table public.memory_tags (
  memory_id uuid references public.memories(id) on delete cascade not null,
  tag_id uuid references public.tags(id) on delete cascade not null,
  primary key (memory_id, tag_id)
);

alter table public.memory_tags enable row level security;

create policy "Users can view tags on their memories"
  on public.memory_tags for select
  using (
    memory_id in (
      select id from public.memories where user_id = auth.uid()
    )
  );

create policy "Users can tag their memories"
  on public.memory_tags for insert
  with check (
    memory_id in (
      select id from public.memories where user_id = auth.uid()
    )
  );

create policy "Users can remove tags from their memories"
  on public.memory_tags for delete
  using (
    memory_id in (
      select id from public.memories where user_id = auth.uid()
    )
  );

-- ============================================================
-- 6. FAMILY CONNECTIONS
-- ============================================================
create table public.family_connections (
  id uuid default gen_random_uuid() primary key,
  requester_id uuid references public.profiles(id) on delete cascade not null,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  relationship_label text not null,
  status text default 'pending' not null check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint no_self_connection check (requester_id != recipient_id)
);

alter table public.family_connections enable row level security;

create policy "Users can view their connections"
  on public.family_connections for select
  using (auth.uid() = requester_id or auth.uid() = recipient_id);

create policy "Users can create connection requests"
  on public.family_connections for insert
  with check (auth.uid() = requester_id);

create policy "Users can update connections they're part of"
  on public.family_connections for update
  using (auth.uid() = requester_id or auth.uid() = recipient_id);

create policy "Users can delete their connection requests"
  on public.family_connections for delete
  using (auth.uid() = requester_id);

create trigger family_connections_updated_at
  before update on public.family_connections
  for each row execute function public.update_updated_at();

create index family_connections_requester_idx on public.family_connections(requester_id);
create index family_connections_recipient_idx on public.family_connections(recipient_id);

-- ============================================================
-- 7. SHARED MEMORIES
-- ============================================================
create table public.shared_memories (
  id uuid default gen_random_uuid() primary key,
  memory_id uuid references public.memories(id) on delete cascade not null,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  shared_with_id uuid references public.profiles(id) on delete cascade not null,
  permission text default 'view' not null check (permission in ('view', 'comment')),
  created_at timestamptz default now() not null,
  revoked_at timestamptz,
  constraint no_self_share check (owner_id != shared_with_id)
);

alter table public.shared_memories enable row level security;

create policy "Owners can view their shares"
  on public.shared_memories for select
  using (auth.uid() = owner_id);

create policy "Recipients can view shares with them"
  on public.shared_memories for select
  using (auth.uid() = shared_with_id and revoked_at is null);

create policy "Owners can create shares"
  on public.shared_memories for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update/revoke shares"
  on public.shared_memories for update
  using (auth.uid() = owner_id);

create index shared_memories_owner_idx on public.shared_memories(owner_id);
create index shared_memories_shared_with_idx on public.shared_memories(shared_with_id);
create index shared_memories_memory_idx on public.shared_memories(memory_id);

-- ============================================================
-- 8. DAILY PROMPTS (Nexa Lite)
-- ============================================================
create table public.daily_prompts (
  id uuid default gen_random_uuid() primary key,
  question_text text not null,
  category text not null check (category in (
    'childhood', 'family', 'milestones', 'reflections',
    'gratitude', 'relationships', 'career', 'travel',
    'traditions', 'lessons'
  )),
  depth text default 'light' not null check (depth in ('light', 'medium', 'deep')),
  created_at timestamptz default now() not null
);

alter table public.daily_prompts enable row level security;

create policy "Authenticated users can view prompts"
  on public.daily_prompts for select
  to authenticated
  using (true);

-- ============================================================
-- 9. PROMPT RESPONSES
-- ============================================================
create table public.prompt_responses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  prompt_id uuid references public.daily_prompts(id) on delete cascade not null,
  response_text text not null,
  converted_to_memory_id uuid references public.memories(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.prompt_responses enable row level security;

create policy "Users can view their own responses"
  on public.prompt_responses for select
  using (auth.uid() = user_id);

create policy "Users can create their own responses"
  on public.prompt_responses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own responses"
  on public.prompt_responses for update
  using (auth.uid() = user_id);

create trigger prompt_responses_updated_at
  before update on public.prompt_responses
  for each row execute function public.update_updated_at();

create index prompt_responses_user_idx on public.prompt_responses(user_id);
create index prompt_responses_prompt_idx on public.prompt_responses(prompt_id);

-- ============================================================
-- 10. CROSS-REFERENCING POLICIES
-- These reference tables defined earlier, so must come last.
-- ============================================================

-- Profiles: allow viewing connected family members' profiles
create policy "Users can view connected family profiles"
  on public.profiles for select
  using (
    id in (
      select recipient_id from public.family_connections
      where requester_id = auth.uid() and status = 'accepted'
      union
      select requester_id from public.family_connections
      where recipient_id = auth.uid() and status = 'accepted'
    )
  );

-- Memories: allow viewing memories shared with you
create policy "Users can view shared memories"
  on public.memories for select
  using (
    id in (
      select memory_id from public.shared_memories
      where shared_with_id = auth.uid() and revoked_at is null
    )
  );

-- Memory media: allow viewing media on shared memories
create policy "Users can view media for shared memories"
  on public.memory_media for select
  using (
    memory_id in (
      select memory_id from public.shared_memories
      where shared_with_id = auth.uid() and revoked_at is null
    )
  );

-- Memory tags: allow viewing tags on shared memories
create policy "Users can view tags on shared memories"
  on public.memory_tags for select
  using (
    memory_id in (
      select memory_id from public.shared_memories
      where shared_with_id = auth.uid() and revoked_at is null
    )
  );
