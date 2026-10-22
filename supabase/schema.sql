-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).

create table if not exists public.appointments (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  theme       text not null,                      -- 'dental' | 'coaching' | 'property'
  name        text not null check (char_length(name) between 2 and 80),
  phone       text not null check (char_length(phone) between 10 and 16),
  service     text not null,
  date        date not null,
  slot        text not null check (slot ~ '^[0-2][0-9]:[0-5][0-9]$'),
  notes       text check (char_length(notes) <= 500),
  status      text not null default 'pending' check (status in ('pending','confirmed','cancelled'))
);

-- One active booking per slot (cancelled slots can be re-booked)
create unique index if not exists appointments_unique_slot
  on public.appointments (theme, date, slot) where status <> 'cancelled';

alter table public.appointments enable row level security;

-- DEMO policies: the anon key may create, read and update bookings so the owner view works without login.
-- For a real client: remove the select/update policies and protect /admin with Supabase Auth.
drop policy if exists "demo insert" on public.appointments;
drop policy if exists "demo select" on public.appointments;
drop policy if exists "demo update" on public.appointments;
create policy "demo insert" on public.appointments for insert to anon with check (true);
create policy "demo select" on public.appointments for select to anon using (true);
create policy "demo update" on public.appointments for update to anon using (true) with check (true);

-- Realtime
alter publication supabase_realtime add table public.appointments;
