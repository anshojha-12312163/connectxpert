-- ============================================================
-- Ansh Consultancy — full database schema
-- Run this once against your Supabase project
-- ============================================================

-- ── Enable UUID extension ──────────────────────────────────
create extension if not exists "pgcrypto";

-- ── contacts ──────────────────────────────────────────────
create table if not exists public.contacts (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  company     text,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- ── newsletter_subscribers ────────────────────────────────
create table if not exists public.newsletter_subscribers (
  id             uuid primary key default gen_random_uuid(),
  email          text not null unique,
  subscribed_at  timestamptz not null default now()
);

-- ── services ──────────────────────────────────────────────
create table if not exists public.services (
  id                  text primary key,
  name                text not null,
  description         text not null,
  duration_minutes    int  not null default 30,
  icon                text not null default 'Globe',
  is_active           boolean not null default true,
  created_at          timestamptz not null default now()
);

-- ── availability ──────────────────────────────────────────
create table if not exists public.availability (
  id           uuid primary key default gen_random_uuid(),
  day_of_week  int  not null check (day_of_week between 0 and 6),
  start_time   text not null,   -- "09:00"
  end_time     text not null,   -- "18:00"
  is_active    boolean not null default true,
  unique (day_of_week)
);

-- ── demo_bookings ─────────────────────────────────────────
create table if not exists public.demo_bookings (
  id                  uuid primary key default gen_random_uuid(),
  booking_reference   text not null unique,
  service_id          text references public.services(id) on delete set null,
  service_name        text,
  name                text not null,
  email               text not null,
  company             text,
  phone               text,
  preferred_date      date not null,
  preferred_time      text not null,   -- "09:30"
  timezone            text not null default 'UTC',
  notes               text,
  status              text not null default 'pending'
                        check (status in ('pending','confirmed','completed','cancelled','rescheduled')),
  created_at          timestamptz not null default now()
);

-- ── analytics_events ──────────────────────────────────────
create table if not exists public.analytics_events (
  id          uuid primary key default gen_random_uuid(),
  event_type  text not null,   -- 'page_view', 'cta_click', 'demo_booking', 'contact_form_submit'
  page        text,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

-- ── clients ───────────────────────────────────────────────
create table if not exists public.clients (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null,
  project_name  text not null,
  status        text not null default 'active'
                  check (status in ('active','paused','completed')),
  notes         text,
  created_at    timestamptz not null default now()
);

-- ── blog_posts (future use) ───────────────────────────────
create table if not exists public.blog_posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  excerpt     text,
  content     text,
  category    text,
  author      text,
  published   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Row Level Security — allow public inserts on form tables,
-- restrict reads to authenticated users only
-- ============================================================

alter table public.contacts               enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.demo_bookings          enable row level security;
alter table public.analytics_events       enable row level security;
alter table public.clients                enable row level security;
alter table public.availability           enable row level security;
alter table public.services               enable row level security;
alter table public.blog_posts             enable row level security;

-- contacts: anyone can insert, only authed users can read
create policy "public_insert_contacts"
  on public.contacts for insert to anon, authenticated
  with check (true);

create policy "authed_read_contacts"
  on public.contacts for select to authenticated
  using (true);

-- newsletter: anyone can insert (unique constraint prevents duplicates)
create policy "public_insert_newsletter"
  on public.newsletter_subscribers for insert to anon, authenticated
  with check (true);

create policy "authed_read_newsletter"
  on public.newsletter_subscribers for select to authenticated
  using (true);

-- demo_bookings: anyone can insert; authed users can read + update
create policy "public_insert_bookings"
  on public.demo_bookings for insert to anon, authenticated
  with check (true);

create policy "authed_read_bookings"
  on public.demo_bookings for select to authenticated
  using (true);

create policy "authed_update_bookings"
  on public.demo_bookings for update to authenticated
  using (true);

-- Allow public to read bookings for a specific date (for slot availability check)
create policy "public_read_bookings_by_date"
  on public.demo_bookings for select to anon
  using (true);

-- analytics: anyone can insert, authed can read
create policy "public_insert_analytics"
  on public.analytics_events for insert to anon, authenticated
  with check (true);

create policy "authed_read_analytics"
  on public.analytics_events for select to authenticated
  using (true);

-- availability: public read (needed for booking calendar), authed write
create policy "public_read_availability"
  on public.availability for select to anon, authenticated
  using (true);

create policy "authed_write_availability"
  on public.availability for all to authenticated
  using (true);

-- services: public read
create policy "public_read_services"
  on public.services for select to anon, authenticated
  using (true);

create policy "authed_write_services"
  on public.services for all to authenticated
  using (true);

-- clients: only authed users
create policy "authed_all_clients"
  on public.clients for all to authenticated
  using (true);

-- blog_posts: public read of published posts
create policy "public_read_published_posts"
  on public.blog_posts for select to anon, authenticated
  using (published = true);

create policy "authed_all_posts"
  on public.blog_posts for all to authenticated
  using (true);

-- ============================================================
-- Indexes for performance
-- ============================================================

create index if not exists idx_demo_bookings_date    on public.demo_bookings(preferred_date);
create index if not exists idx_demo_bookings_email   on public.demo_bookings(email);
create index if not exists idx_demo_bookings_ref     on public.demo_bookings(booking_reference);
create index if not exists idx_analytics_type        on public.analytics_events(event_type);
create index if not exists idx_analytics_created     on public.analytics_events(created_at);
create index if not exists idx_contacts_created      on public.contacts(created_at);
create index if not exists idx_availability_day      on public.availability(day_of_week);

-- ============================================================
-- Seed data
-- ============================================================

-- Default availability: Mon–Fri 9:00–18:00
insert into public.availability (day_of_week, start_time, end_time, is_active)
values
  (1, '09:00', '18:00', true),
  (2, '09:00', '18:00', true),
  (3, '09:00', '18:00', true),
  (4, '09:00', '18:00', true),
  (5, '09:00', '18:00', true)
on conflict (day_of_week) do update
  set start_time = excluded.start_time,
      end_time   = excluded.end_time,
      is_active  = excluded.is_active;

-- Default consulting services
insert into public.services (id, name, description, duration_minutes, icon, is_active)
values
  ('strategy-30',  'Business Strategy Call',     'Align on goals, priorities, and a 90-day roadmap.',        30, 'TrendingUp', true),
  ('growth-60',    'Growth Marketing Session',   'Diagnose your funnel and build a growth action plan.',      60, 'BarChart2',  true),
  ('hiring-45',    'Talent & Hiring Advisory',   'Define your ideal hire and streamline your hiring process.',45, 'Users',      true),
  ('tech-60',      'Tech Advisory Session',      'Architecture review, stack decisions, team structure.',     60, 'Code2',      true),
  ('product-30',   'Product Consulting Call',    'Roadmap prioritisation and product-market fit deep dive.',  30, 'Lightbulb',  true),
  ('insights-30',  'Market Insights Briefing',   'Competitive intelligence and market entry strategy.',       30, 'Globe',      true)
on conflict (id) do update
  set name             = excluded.name,
      description      = excluded.description,
      duration_minutes = excluded.duration_minutes,
      icon             = excluded.icon,
      is_active        = excluded.is_active;
