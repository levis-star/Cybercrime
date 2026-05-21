create extension if not exists "pgcrypto";

create type user_role as enum ('citizen', 'analyst', 'admin');
create type report_status as enum ('new', 'under_review', 'escalated', 'resolved', 'closed');
create type verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
create type anonymity_status as enum ('anonymous', 'verified');
create type severity_level as enum ('low', 'medium', 'high', 'critical');
create type language_code as enum ('en', 'sw');

create table users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text unique not null,
  password_hash text not null,
  role user_role not null default 'citizen',
  language_preference language_code not null default 'en',
  verified_status verification_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  tracking_code text unique not null,
  user_id uuid references users(id) on delete set null,
  category text not null,
  description text not null,
  location_region text not null,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  anonymity_status anonymity_status not null,
  verification_status verification_status not null default 'unverified',
  severity_score int not null default 0 check (severity_score between 0 and 100),
  status report_status not null default 'new',
  created_at timestamptz not null default now()
);

create table evidence (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete cascade,
  file_url text not null,
  file_type text not null,
  uploaded_at timestamptz not null default now()
);

create table alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  language language_code not null,
  target_region text not null default 'National',
  severity_level severity_level not null,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table awareness_content (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  language language_code not null,
  title text not null,
  content text not null,
  published_at timestamptz not null default now()
);

create table community_trust (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete cascade,
  score int not null check (score between 0 and 100),
  moderation_status text not null default 'pending'
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references users(id) on delete set null,
  action text not null,
  target_record text not null,
  timestamp timestamptz not null default now()
);

create index reports_tracking_code_idx on reports (tracking_code);
create index reports_region_idx on reports (location_region);
create index reports_status_idx on reports (status);
create index alerts_language_idx on alerts (language);
create index awareness_language_category_idx on awareness_content (language, category);

alter table users enable row level security;
alter table reports enable row level security;
alter table evidence enable row level security;
alter table alerts enable row level security;
alter table awareness_content enable row level security;
alter table community_trust enable row level security;
alter table audit_logs enable row level security;

create policy "public can read alerts" on alerts for select using (true);
create policy "public can read awareness" on awareness_content for select using (true);
create policy "citizens can create reports" on reports for insert with check (true);
create policy "tracking reads are handled through API" on reports for select using (false);
