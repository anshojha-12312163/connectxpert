-- ================================================================
-- MASTER SUPABASE SETUP SCRIPT (CONNECTXPERT)
-- Copy and paste this entire file into Supabase SQL Editor and click RUN.
-- Dashboard URL: https://supabase.com/dashboard/project/ndcpfedipeczqdrdffhd/sql
-- ================================================================

create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────────
-- 1. AUTO-CONFIRM USERS (Solves "Email not confirmed" error)
-- ────────────────────────────────────────────────────────────────

-- Confirm any existing unconfirmed users:
update auth.users
set email_confirmed_at = now()
where email_confirmed_at is null;

-- Trigger to automatically confirm future email signups:
create or replace function public.auto_confirm_user()
returns trigger
language plpgsql
security definer
as $$
begin
  new.email_confirmed_at = coalesce(new.email_confirmed_at, now());
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_auto_confirm on auth.users;
create trigger on_auth_user_created_auto_confirm
  before insert on auth.users
  for each row
  execute function public.auto_confirm_user();

-- ────────────────────────────────────────────────────────────────
-- 2. CORE SYSTEM TABLES
-- ────────────────────────────────────────────────────────────────

-- contacts
create table if not exists public.contacts (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  company    text,
  message    text not null,
  created_at timestamptz not null default now()
);

-- newsletter_subscribers
create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  subscribed_at timestamptz not null default now()
);

-- services
create table if not exists public.services (
  id               text primary key,
  name             text not null,
  description      text not null,
  duration_minutes int  not null default 30,
  icon             text not null default 'Globe',
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);

-- availability
create table if not exists public.availability (
  id          uuid primary key default gen_random_uuid(),
  day_of_week int  not null check (day_of_week between 0 and 6),
  start_time  text not null,
  end_time    text not null,
  is_active   boolean not null default true,
  unique (day_of_week)
);

-- categories
create table if not exists public.categories (
  id          text primary key,
  name        text not null,
  icon        text not null default 'Globe',
  description text not null default '',
  slug        text not null unique
);

-- experts
create table if not exists public.experts (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid,
  name                      text not null,
  title                     text not null,
  category_id               text references public.categories(id) on delete set null,
  bio                       text not null default '',
  skills                    text[] not null default '{}',
  hourly_rate               numeric not null default 0,
  photo_url                 text,
  is_verified               boolean not null default false,
  average_rating            numeric not null default 0,
  review_count              int     not null default 0,
  total_bookings            int     not null default 0,
  status                    text not null default 'active'
                              check (status in ('active','inactive','suspended')),
  last_active_at            timestamptz,
  avg_response_time_minutes int,
  offers_free_intro         boolean not null default false,
  intro_call_duration       int not null default 15,
  years_experience          int,
  languages                 text[] default '{}',
  portfolio                 jsonb default '[]',
  created_at                timestamptz not null default now()
);

-- expert_applications
create table if not exists public.expert_applications (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  email             text not null,
  phone             text,
  title             text not null,
  category_id       text references public.categories(id) on delete set null,
  bio               text not null,
  years_experience  int not null default 0,
  hourly_rate       numeric not null default 0,
  portfolio_links   text[] default '{}',
  skills            text[] default '{}',
  offers_free_intro boolean not null default false,
  status            text not null default 'pending'
                      check (status in ('pending','approved','rejected','more_info')),
  admin_notes       text,
  submitted_at      timestamptz not null default now(),
  reviewed_at       timestamptz
);

-- demo_bookings
create table if not exists public.demo_bookings (
  id                uuid primary key default gen_random_uuid(),
  booking_reference text not null unique,
  service_id        text references public.services(id) on delete set null,
  service_name      text,
  name              text not null,
  email             text not null,
  company           text,
  phone             text,
  preferred_date    date not null,
  preferred_time    text not null,
  timezone          text not null default 'UTC',
  notes             text,
  status            text not null default 'pending'
                      check (status in ('pending','confirmed','completed','cancelled','rescheduled')),
  expert_id         uuid references public.experts(id) on delete set null,
  created_at        timestamptz not null default now(),
  video_room_url    text,
  video_room_name   text
);

-- reviews
create table if not exists public.reviews (
  id              uuid primary key default gen_random_uuid(),
  expert_id       uuid references public.experts(id) on delete cascade,
  client_id       uuid,
  client_name     text not null,
  booking_id      uuid,
  rating          int not null check (rating between 1 and 5),
  comment         text not null,
  expert_response text,
  is_hidden       boolean not null default false,
  created_at      timestamptz not null default now()
);

-- favorites
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null,
  expert_id  uuid references public.experts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (client_id, expert_id)
);

-- quick_connect_requests
create table if not exists public.quick_connect_requests (
  id                   uuid primary key default gen_random_uuid(),
  client_name          text not null,
  client_email         text not null,
  category_id          text references public.categories(id) on delete set null,
  message              text not null,
  status               text not null default 'open'
                         check (status in ('open','claimed','expired')),
  claimed_by_expert_id uuid references public.experts(id) on delete set null,
  created_at           timestamptz not null default now()
);

-- conversations
create table if not exists public.conversations (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null,
  expert_id       uuid references public.experts(id) on delete cascade,
  last_message_at timestamptz,
  created_at      timestamptz not null default now()
);

-- messages
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id       uuid not null,
  content         text not null,
  attachment_url  text,
  is_read         boolean not null default false,
  created_at      timestamptz not null default now()
);

-- clients (dashboard client management)
create table if not exists public.clients (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null,
  project_name text not null,
  status       text not null default 'active'
                 check (status in ('active','paused','completed')),
  notes        text,
  created_at   timestamptz not null default now()
);

-- analytics_events
create table if not exists public.analytics_events (
  id         uuid primary key default gen_random_uuid(),
  event_type text not null,
  page       text,
  metadata   jsonb,
  created_at timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────
-- 3. ENABLE ROW LEVEL SECURITY (RLS) & OPEN POLICIES
-- ────────────────────────────────────────────────────────────────

alter table public.contacts                 enable row level security;
alter table public.newsletter_subscribers   enable row level security;
alter table public.services                 enable row level security;
alter table public.availability             enable row level security;
alter table public.demo_bookings            enable row level security;
alter table public.analytics_events         enable row level security;
alter table public.categories               enable row level security;
alter table public.experts                  enable row level security;
alter table public.expert_applications      enable row level security;
alter table public.reviews                  enable row level security;
alter table public.favorites                enable row level security;
alter table public.quick_connect_requests   enable row level security;
alter table public.conversations            enable row level security;
alter table public.messages                 enable row level security;
alter table public.clients                  enable row level security;

-- Contacts: public insert, authed read
drop policy if exists "allow_insert_contacts" on public.contacts;
create policy "allow_insert_contacts" on public.contacts for insert to anon, authenticated with check (true);
drop policy if exists "allow_select_contacts" on public.contacts;
create policy "allow_select_contacts" on public.contacts for select to anon, authenticated using (true);

-- Newsletter: public insert
drop policy if exists "allow_insert_newsletter" on public.newsletter_subscribers;
create policy "allow_insert_newsletter" on public.newsletter_subscribers for insert to anon, authenticated with check (true);
drop policy if exists "allow_select_newsletter" on public.newsletter_subscribers;
create policy "allow_select_newsletter" on public.newsletter_subscribers for select to anon, authenticated using (true);

-- Services: public read
drop policy if exists "allow_read_services" on public.services;
create policy "allow_read_services" on public.services for select to anon, authenticated using (true);
drop policy if exists "allow_write_services" on public.services;
create policy "allow_write_services" on public.services for all to authenticated using (true);

-- Availability: public read
drop policy if exists "allow_read_availability" on public.availability;
create policy "allow_read_availability" on public.availability for select to anon, authenticated using (true);

-- Demo bookings: public insert & read
drop policy if exists "allow_insert_demo_bookings" on public.demo_bookings;
create policy "allow_insert_demo_bookings" on public.demo_bookings for insert to anon, authenticated with check (true);
drop policy if exists "allow_select_demo_bookings" on public.demo_bookings;
create policy "allow_select_demo_bookings" on public.demo_bookings for select to anon, authenticated using (true);
drop policy if exists "allow_update_demo_bookings" on public.demo_bookings;
create policy "allow_update_demo_bookings" on public.demo_bookings for update to anon, authenticated using (true);

-- Categories: public read
drop policy if exists "public_read_categories" on public.categories;
create policy "public_read_categories" on public.categories for select to anon, authenticated using (true);

-- Experts: public read of active experts, authenticated write
drop policy if exists "public_read_experts" on public.experts;
create policy "public_read_experts" on public.experts for select to anon, authenticated using (true);
drop policy if exists "authed_write_experts" on public.experts;
create policy "authed_write_experts" on public.experts for all to anon, authenticated using (true);

-- Expert applications: public insert, all read
drop policy if exists "public_insert_applications" on public.expert_applications;
create policy "public_insert_applications" on public.expert_applications for insert to anon, authenticated with check (true);
drop policy if exists "authed_read_applications" on public.expert_applications;
create policy "authed_read_applications" on public.expert_applications for select to anon, authenticated using (true);

-- Reviews: public read & insert
drop policy if exists "public_read_reviews" on public.reviews;
create policy "public_read_reviews" on public.reviews for select to anon, authenticated using (true);
drop policy if exists "public_insert_reviews" on public.reviews;
create policy "public_insert_reviews" on public.reviews for insert to anon, authenticated with check (true);

-- Quick Connect: public insert, all read
drop policy if exists "public_insert_qc" on public.quick_connect_requests;
create policy "public_insert_qc" on public.quick_connect_requests for insert to anon, authenticated with check (true);
drop policy if exists "authed_read_qc" on public.quick_connect_requests;
create policy "authed_read_qc" on public.quick_connect_requests for select to anon, authenticated using (true);

-- Conversations & Messages
drop policy if exists "all_conversations" on public.conversations;
create policy "all_conversations" on public.conversations for all to anon, authenticated using (true);
drop policy if exists "all_messages" on public.messages;
create policy "all_messages" on public.messages for all to anon, authenticated using (true);

-- Clients (dashboard)
drop policy if exists "all_clients" on public.clients;
create policy "all_clients" on public.clients for all to anon, authenticated using (true);

-- Analytics events: public insert, all read
drop policy if exists "allow_insert_analytics" on public.analytics_events;
create policy "allow_insert_analytics" on public.analytics_events for insert to anon, authenticated with check (true);
drop policy if exists "allow_select_analytics" on public.analytics_events;
create policy "allow_select_analytics" on public.analytics_events for select to anon, authenticated using (true);

-- ────────────────────────────────────────────────────────────────
-- 4. SEED DATA (Categories & Initial Services)
-- ────────────────────────────────────────────────────────────────

insert into public.categories (id, name, icon, description, slug) values
  ('business',  'Business Strategy', 'TrendingUp',  'GTM, OKRs, growth strategy, and operations',      'business-strategy'),
  ('marketing', 'Marketing',         'BarChart2',   'SEO, paid ads, content, and demand generation',   'marketing'),
  ('tech',      'Technology',        'Code2',       'Engineering, architecture, and tech advisory',    'technology'),
  ('legal',     'Legal',             'Scale',       'Contracts, IP, compliance, and startup law',      'legal'),
  ('design',    'Design',            'Palette',     'UX, product design, branding, and prototyping',   'design'),
  ('finance',   'Finance',           'DollarSign',  'Fundraising, CFO advisory, and financial modeling','finance')
on conflict (id) do update set name=excluded.name, icon=excluded.icon, description=excluded.description, slug=excluded.slug;

insert into public.services (id, name, description, duration_minutes, icon, is_active) values
  ('discovery', '30-Min Strategy Consultation', 'Initial deep-dive into your growth roadmap and current bottlenecks.', 30, 'Zap', true),
  ('audit',     'Full Systems & Tech Audit',   'Architecture, DevOps, and codebase health evaluation.', 60, 'Shield', true),
  ('growth',    'Marketing & GTM Sprint',      'Customer acquisition, SEO, and paid media strategy review.', 45, 'TrendingUp', true)
on conflict (id) do update set name=excluded.name, description=excluded.description;

-- ────────────────────────────────────────────────────────────────
-- 5. CASE STUDIES (Original & Sourced for ConnectXpert)
-- ────────────────────────────────────────────────────────────────

create table if not exists public.case_studies (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  client      text not null,
  industry    text not null,
  tag         text not null,
  problem     text not null,
  solution    text not null,
  outcome     text not null,
  metrics     text[] not null default '{}',
  color       text not null default 'from-blue-900/40 to-primary/10',
  featured    boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.case_studies enable row level security;
drop policy if exists "public_read_case_studies" on public.case_studies;
create policy "public_read_case_studies" on public.case_studies for select to anon, authenticated using (true);
drop policy if exists "admin_all_case_studies" on public.case_studies;
create policy "admin_all_case_studies" on public.case_studies for all to anon, authenticated using (true);

insert into public.case_studies (slug, client, industry, tag, problem, solution, outcome, metrics, color, featured) values
  (
    'aurascale-gtm',
    'AuraScale',
    'B2B Cloud Workflow Software',
    'Growth Marketing & GTM',
    'Post-Seed SaaS startup struggled with long 9-month sales cycles, unfocused ICP targeting, and demo conversion rates below 4%.',
    'ConnectXpert restructured the outbound motion: defined high-intent mid-market ICPs, rebuilt the demo narrative around immediate ROI, and deployed personalized multi-touch cadence playbooks.',
    '+280% pipeline velocity, demo-to-close rate improved from 3.8% to 14.2% in 90 days.',
    array['+280%', 'Pipeline Velocity', '14.2%', 'Demo-to-Close'],
    'from-blue-900/40 to-primary/10',
    true
  ),
  (
    'vanguard-clinical-architecture',
    'Vanguard Clinical',
    'HealthTech & Telehealth',
    'Tech & Architecture Advisory',
    'Telehealth platform faced scaling bottlenecks, 45-second latency during peak video visits, and pending HIPAA audit readiness challenges.',
    'Conducted an end-to-end cloud architecture review, transitioned video routing to WebRTC edge clusters, implemented audit trails, and established automated compliance gates.',
    'Latency reduced to under 180ms, 99.98% platform uptime during peak hours, passed third-party SOC2 Type II audit.',
    array['<180ms', 'Peak Latency', '99.98%', 'System Uptime'],
    'from-teal-900/40 to-primary/10',
    true
  ),
  (
    'finbridge-onboarding-ux',
    'FinBridge Pay',
    'FinTech & Cross-Border Payments',
    'Product & UX Strategy',
    'High drop-off rate (54%) during KYC merchant onboarding and confusing tiered compliance documentation causing merchant churn.',
    'Streamlined 7-step merchant onboarding into a 3-step progressive KYC flow with instant OCR document verification and real-time status callbacks.',
    'Merchant drop-off decreased by 62%, average onboarding completion time dropped from 48 hours to 9 minutes.',
    array['-62%', 'Drop-off Rate', '9 min', 'Avg Onboarding'],
    'from-emerald-900/40 to-primary/10',
    true
  ),
  (
    'logiroute-dispatch-ops',
    'LogiRoute Systems',
    'Supply Chain & Logistics',
    'Business Strategy & Ops',
    'Freight brokerage operated on disconnected spreadsheets and manual phone dispatching, limiting broker capacity to 12 loads/day per operator.',
    'Built an integrated carrier dispatch workflow with automated rate intelligence, SMS driver updates, and real-time margin tracking dashboards.',
    'Broker daily load capacity increased by 3.5x, gross margin improved by 420 bps in the first quarter.',
    array['3.5x', 'Broker Capacity', '+420 bps', 'Gross Margin'],
    'from-purple-900/40 to-primary/10',
    true
  ),
  (
    'pulse-collective-talent',
    'Pulse Collective',
    'Omnichannel Consumer Retail',
    'Talent & Hiring Advisory',
    'Rapidly expanding consumer brand struggled to hire specialized Head of Performance Marketing and VP Supply Chain, with searches open for 7+ months.',
    'Engaged ConnectXpert hiring advisors to calibrate role specs, map top talent from high-growth competitors, run structured scorecards, and negotiate compensation packages.',
    'Both executive hires closed within 24 days with 100% first-year retention and accelerated holiday season delivery.',
    array['24 days', 'Time-to-Hire', '100%', 'Retention Rate'],
    'from-orange-900/40 to-primary/10',
    true
  )
on conflict (slug) do update set
  client = excluded.client,
  industry = excluded.industry,
  tag = excluded.tag,
  problem = excluded.problem,
  solution = excluded.solution,
  outcome = excluded.outcome,
  metrics = excluded.metrics,
  color = excluded.color;

