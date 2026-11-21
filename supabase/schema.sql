-- ==============================================================================
-- PROOFPIX SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Production-Ready Migration for Next.js 14 Micro-SaaS
-- ==============================================================================

-- 1. PROFILES TABLE (Stores photographer studio information)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  studio_name text not null,
  whatsapp_number text not null,
  upi_id text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. PROJECTS TABLE (Stores client galleries connected to Google Drive)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  photographer_id uuid references public.profiles(id) on delete cascade not null,
  slug text unique not null,
  event_name text not null,
  client_name text not null,
  client_whatsapp text,
  drive_folder_id text not null,
  max_selection integer not null default 150,
  watermark_text text not null,
  access_pin text,
  is_paid boolean not null default false,
  is_submitted boolean not null default false,
  submitted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index on slug for lightning-fast gallery routing
create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_projects_photographer on public.projects(photographer_id);

-- 3. SELECTIONS TABLE (Stores client selected photos & comments)
create table if not exists public.selections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  drive_file_id text not null,
  file_name text not null,
  comment text,
  created_at timestamptz default now(),
  constraint unique_project_drive_file unique (project_id, drive_file_id)
);

-- Index on project_id for instant retrieval of selected photos
create index if not exists idx_selections_project on public.selections(project_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.selections enable row level security;

-- PROFILES POLICIES
-- Photographers can manage their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Public can read studio contact info for gallery branding and UPI payments
create policy "Public can read studio details for galleries"
  on public.profiles for select
  using (true);

-- PROJECTS POLICIES
-- Photographers can view and manage their own projects
create policy "Photographers can select own projects"
  on public.projects for select
  using (auth.uid() = photographer_id);

create policy "Photographers can insert own projects"
  on public.projects for insert
  with check (auth.uid() = photographer_id);

create policy "Photographers can update own projects"
  on public.projects for update
  using (auth.uid() = photographer_id);

create policy "Photographers can delete own projects"
  on public.projects for delete
  using (auth.uid() = photographer_id);

-- Clients can view public project by slug (for /gallery/[slug])
create policy "Clients can view project by slug"
  on public.projects for select
  using (true);

-- Clients can update project status to submitted
create policy "Clients can submit selection"
  on public.projects for update
  using (true)
  with check (true);

-- SELECTIONS POLICIES
-- Photographers can view and manage all selections for their projects
create policy "Photographers can view project selections"
  on public.selections for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = selections.project_id
      and projects.photographer_id = auth.uid()
    )
  );

-- Clients can view selections for any public project (to show ❤️ state)
create policy "Clients can view selections for project"
  on public.selections for select
  using (true);

-- Clients can insert/update their selections (heart toggle & comments)
create policy "Clients can add selections"
  on public.selections for insert
  with check (true);

create policy "Clients can update selection notes"
  on public.selections for update
  using (true);

-- Clients can remove a photo from selection (un-heart)
create policy "Clients can remove selections"
  on public.selections for delete
  using (true);

-- ==============================================================================
-- AUTOMATIC PROFILE TRIGGER ON SIGNUP
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, studio_name, whatsapp_number, upi_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'studio_name', 'Creative Studio'),
    coalesce(new.raw_user_meta_data->>'whatsapp_number', ''),
    coalesce(new.raw_user_meta_data->>'upi_id', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
