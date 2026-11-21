-- ==============================================================================
-- PROOFPIX SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Enterprise Security, Audit Logging & Real Payment Integrity Migration
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

create index if not exists idx_selections_project on public.selections(project_id);

-- 4. AUDIT_LOGS TABLE (Tracks WHO is logging in, IP, User Agent, Actions)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  studio_name text,
  action text not null, -- 'LOGIN', 'SIGNUP', 'LOGOUT', 'CREATE_GALLERY', 'PAYMENT_UNLOCKED', 'UTR_SUBMITTED'
  ip_address text,
  user_agent text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_audit_user on public.audit_logs(user_id);
create index if not exists idx_audit_created on public.audit_logs(created_at desc);

-- 5. PAYMENTS TABLE (Cryptographically verified Razorpay / UPI transactions)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  photographer_id uuid references public.profiles(id) on delete set null,
  client_name text not null,
  client_phone text,
  amount integer not null, -- In INR (e.g. 5000)
  currency text not null default 'INR',
  gateway text not null default 'razorpay', -- 'razorpay', 'upi_direct', 'cashfree'
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  utr_number text, -- 12-digit bank reference for peer-to-peer UPI verification
  status text not null default 'pending', -- 'pending', 'verified', 'captured', 'failed'
  verified_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_payments_project on public.payments(project_id);
create index if not exists idx_payments_utr on public.payments(utr_number);

-- 6. SUBSCRIPTIONS TABLE (ProofPix SaaS Pro Tiers)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  photographer_id uuid references public.profiles(id) on delete cascade not null,
  plan_tier text not null default 'FREE', -- 'FREE', 'MONTHLY_PRO', 'ANNUAL_PASS'
  amount integer not null default 0,
  currency text not null default 'INR',
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.selections enable row level security;
alter table public.audit_logs enable row level security;
alter table public.payments enable row level security;
alter table public.subscriptions enable row level security;

-- PROFILES POLICIES
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Public can read studio details for galleries"
  on public.profiles for select
  using (true);

-- PROJECTS POLICIES
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

create policy "Clients can view project by slug"
  on public.projects for select
  using (true);

create policy "Clients can submit selection"
  on public.projects for update
  using (true)
  with check (true);

-- SELECTIONS POLICIES
create policy "Photographers can view project selections"
  on public.selections for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = selections.project_id
      and projects.photographer_id = auth.uid()
    )
  );

create policy "Clients can view selections for project"
  on public.selections for select
  using (true);

create policy "Clients can add selections"
  on public.selections for insert
  with check (true);

create policy "Clients can update selection notes"
  on public.selections for update
  using (true);

create policy "Clients can remove selections"
  on public.selections for delete
  using (true);

-- AUDIT_LOGS POLICIES
create policy "Users can view their own audit logs"
  on public.audit_logs for select
  using (auth.uid() = user_id);

create policy "Allow inserting audit logs"
  on public.audit_logs for insert
  with check (true);

-- PAYMENTS POLICIES
create policy "Photographers can view project payments"
  on public.payments for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = payments.project_id
      and projects.photographer_id = auth.uid()
    )
  );

create policy "Clients can insert payment records"
  on public.payments for insert
  with check (true);

create policy "Photographers can update payment status"
  on public.payments for update
  using (
    exists (
      select 1 from public.projects
      where projects.id = payments.project_id
      and projects.photographer_id = auth.uid()
    )
  );

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

  -- Initial audit log record for signup
  insert into public.audit_logs (user_id, email, studio_name, action, metadata)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'studio_name', 'Creative Studio'),
    'SIGNUP',
    jsonb_build_object('provider', new.raw_app_meta_data->>'provider')
  );

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
