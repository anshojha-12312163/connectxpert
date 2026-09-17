-- ================================================================
-- ConnectXpert schema — run in Supabase SQL Editor
-- ================================================================

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
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid,
  name                     text not null,
  title                    text not null,
  category_id              text references public.categories(id) on delete set null,
  bio                      text not null default '',
  skills                   text[] not null default '{}',
  hourly_rate              numeric not null default 0,
  photo_url                text,
  is_verified              boolean not null default false,
  average_rating           numeric not null default 0,
  review_count             int     not null default 0,
  total_bookings           int     not null default 0,
  status                   text not null default 'active'
                             check (status in ('active','inactive','suspended')),
  last_active_at           timestamptz,
  avg_response_time_minutes int,
  offers_free_intro        boolean not null default false,
  intro_call_duration      int not null default 15,
  years_experience         int,
  languages                text[] default '{}',
  portfolio                jsonb default '[]',
  created_at               timestamptz not null default now()
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
  id                    uuid primary key default gen_random_uuid(),
  client_name           text not null,
  client_email          text not null,
  category_id           text references public.categories(id) on delete set null,
  message               text not null,
  status                text not null default 'open'
                          check (status in ('open','claimed','expired')),
  claimed_by_expert_id  uuid references public.experts(id) on delete set null,
  created_at            timestamptz not null default now()
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

-- Add expert_id to demo_bookings if not exists
alter table public.demo_bookings
  add column if not exists expert_id uuid references public.experts(id) on delete set null;

-- ── RLS ──────────────────────────────────────────────────────────

alter table public.categories            enable row level security;
alter table public.experts               enable row level security;
alter table public.expert_applications   enable row level security;
alter table public.reviews               enable row level security;
alter table public.favorites             enable row level security;
alter table public.quick_connect_requests enable row level security;
alter table public.conversations         enable row level security;
alter table public.messages              enable row level security;

-- categories: public read
drop policy if exists "public_read_categories" on public.categories;
create policy "public_read_categories" on public.categories for select to anon, authenticated using (true);

-- experts: public read of active experts
drop policy if exists "public_read_experts" on public.experts;
create policy "public_read_experts" on public.experts for select to anon, authenticated using (status = 'active');
drop policy if exists "authed_write_experts" on public.experts;
create policy "authed_write_experts" on public.experts for all to authenticated using (true);

-- expert_applications: public insert, authed read
drop policy if exists "public_insert_applications" on public.expert_applications;
create policy "public_insert_applications" on public.expert_applications for insert to anon, authenticated with check (true);
drop policy if exists "authed_read_applications" on public.expert_applications;
create policy "authed_read_applications" on public.expert_applications for select to authenticated using (true);
drop policy if exists "authed_update_applications" on public.expert_applications;
create policy "authed_update_applications" on public.expert_applications for update to authenticated using (true);

-- reviews: public read non-hidden, public insert
drop policy if exists "public_read_reviews" on public.reviews;
create policy "public_read_reviews" on public.reviews for select to anon, authenticated using (is_hidden = false);
drop policy if exists "public_insert_reviews" on public.reviews;
create policy "public_insert_reviews" on public.reviews for insert to anon, authenticated with check (true);
drop policy if exists "authed_update_reviews" on public.reviews;
create policy "authed_update_reviews" on public.reviews for update to authenticated using (true);

-- favorites: authed only
drop policy if exists "authed_favorites" on public.favorites;
create policy "authed_favorites" on public.favorites for all to authenticated using (true) with check (true);

-- quick_connect: public insert, authed read
drop policy if exists "public_insert_qc" on public.quick_connect_requests;
create policy "public_insert_qc" on public.quick_connect_requests for insert to anon, authenticated with check (true);
drop policy if exists "authed_read_qc" on public.quick_connect_requests;
create policy "authed_read_qc" on public.quick_connect_requests for select to authenticated using (true);

-- conversations + messages: authed only
drop policy if exists "authed_conversations" on public.conversations;
create policy "authed_conversations" on public.conversations for all to authenticated using (true);
drop policy if exists "authed_messages" on public.messages;
create policy "authed_messages" on public.messages for all to authenticated using (true);

-- ── Indexes ──────────────────────────────────────────────────────

create index if not exists idx_experts_category   on public.experts(category_id);
create index if not exists idx_experts_rating     on public.experts(average_rating desc);
create index if not exists idx_reviews_expert     on public.reviews(expert_id);
create index if not exists idx_favorites_client   on public.favorites(client_id);
create index if not exists idx_messages_conv      on public.messages(conversation_id);
create index if not exists idx_conv_client        on public.conversations(client_id);

-- ── Seed categories ───────────────────────────────────────────────

insert into public.categories (id, name, icon, description, slug) values
  ('business',  'Business Strategy', 'TrendingUp',  'GTM, OKRs, growth strategy, and operations',      'business-strategy'),
  ('marketing', 'Marketing',         'BarChart2',   'SEO, paid ads, content, and demand generation',   'marketing'),
  ('tech',      'Technology',        'Code2',       'Engineering, architecture, and tech advisory',    'technology'),
  ('legal',     'Legal',             'Scale',       'Contracts, IP, compliance, and startup law',      'legal'),
  ('design',    'Design',            'Palette',     'UX, product design, branding, and prototyping',   'design'),
  ('finance',   'Finance',           'DollarSign',  'Fundraising, CFO advisory, and financial modeling','finance')
on conflict (id) do update set name=excluded.name, icon=excluded.icon, description=excluded.description, slug=excluded.slug;
