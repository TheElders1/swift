-- SwiftSurge Logistics — Supabase schema
-- Paste this complete file into Supabase Dashboard → SQL Editor and run it.
-- Safe to run again: tables, columns, policies, functions, and bucket are
-- created/replaced without adding demo shipment records.

create extension if not exists pgcrypto;

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_number text not null unique,
  sender_name text,
  sender_address text,
  sender_email text,
  sender_phone text,
  receiver_name text,
  receiver_address text,
  receiver_email text,
  receiver_phone text,
  origin text,
  destination text,
  description text,
  shipment_comments text,
  notification_type text,
  package_image_url text,
  status text not null default 'pending',
  current_lat double precision,
  current_lng double precision,
  origin_lat double precision,
  origin_lng double precision,
  destination_lat double precision,
  destination_lng double precision,
  estimated_delivery date,
  shipment_date date,
  weight_kg numeric,
  package_type text,
  shipment_amount numeric,
  currency text default 'USD',
  shipment_currency text default 'USD',
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add fields safely if a shipments table already exists from an earlier setup.
alter table public.shipments add column if not exists sender_name text;
alter table public.shipments add column if not exists sender_address text;
alter table public.shipments add column if not exists sender_email text;
alter table public.shipments add column if not exists sender_phone text;
alter table public.shipments add column if not exists receiver_name text;
alter table public.shipments add column if not exists receiver_address text;
alter table public.shipments add column if not exists receiver_email text;
alter table public.shipments add column if not exists receiver_phone text;
alter table public.shipments add column if not exists origin text;
alter table public.shipments add column if not exists destination text;
alter table public.shipments add column if not exists description text;
alter table public.shipments add column if not exists shipment_comments text;
alter table public.shipments add column if not exists notification_type text;
alter table public.shipments add column if not exists package_image_url text;
alter table public.shipments add column if not exists status text not null default 'pending';
alter table public.shipments add column if not exists current_lat double precision;
alter table public.shipments add column if not exists current_lng double precision;
alter table public.shipments add column if not exists origin_lat double precision;
alter table public.shipments add column if not exists origin_lng double precision;
alter table public.shipments add column if not exists destination_lat double precision;
alter table public.shipments add column if not exists destination_lng double precision;
alter table public.shipments add column if not exists estimated_delivery date;
alter table public.shipments add column if not exists shipment_date date;
alter table public.shipments add column if not exists weight_kg numeric;
alter table public.shipments add column if not exists package_type text;
alter table public.shipments add column if not exists shipment_amount numeric;
alter table public.shipments add column if not exists currency text default 'USD';
alter table public.shipments add column if not exists shipment_currency text default 'USD';
alter table public.shipments add column if not exists deleted_at timestamptz;
alter table public.shipments add column if not exists created_at timestamptz not null default now();
alter table public.shipments add column if not exists updated_at timestamptz not null default now();

create unique index if not exists shipments_tracking_number_key
  on public.shipments (tracking_number);
create index if not exists shipments_status_idx on public.shipments (status);
create index if not exists shipments_created_at_idx on public.shipments (created_at desc);
create index if not exists shipments_deleted_at_idx on public.shipments (deleted_at desc) where deleted_at is not null;

create table if not exists public.tracking_history (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  status text not null,
  location text,
  lat double precision,
  lng double precision,
  note text,
  progress_percent integer check (progress_percent between 0 and 100),
  created_at timestamptz not null default now()
);

alter table public.tracking_history add column if not exists location text;
alter table public.tracking_history add column if not exists lat double precision;
alter table public.tracking_history add column if not exists lng double precision;
alter table public.tracking_history add column if not exists note text;
alter table public.tracking_history add column if not exists progress_percent integer;
alter table public.tracking_history add column if not exists created_at timestamptz not null default now();
create index if not exists tracking_history_shipment_created_idx
  on public.tracking_history (shipment_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_shipments_updated_at on public.shipments;
create trigger trg_shipments_updated_at
before update on public.shipments
for each row execute function public.set_updated_at();

-- Admins are explicitly allow-listed by user UUID. No ordinary signed-in user
-- receives shipment access just because they can create a Supabase account.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

alter table public.shipments enable row level security;
alter table public.tracking_history enable row level security;

-- Remove the permissive policies from the reference schema if it was run before.
drop policy if exists "Public can view shipments" on public.shipments;
drop policy if exists "Public can view tracking history" on public.tracking_history;
drop policy if exists "Authenticated users can insert shipments" on public.shipments;
drop policy if exists "Authenticated users can update shipments" on public.shipments;
drop policy if exists "Authenticated users can delete shipments" on public.shipments;
drop policy if exists "Authenticated users can insert tracking history" on public.tracking_history;
drop policy if exists "Authenticated users can update tracking history" on public.tracking_history;
drop policy if exists "Authenticated users can delete tracking history" on public.tracking_history;
drop policy if exists "Admins can read shipments" on public.shipments;
drop policy if exists "Admins can insert shipments" on public.shipments;
drop policy if exists "Admins can update shipments" on public.shipments;
drop policy if exists "Admins can delete shipments" on public.shipments;
drop policy if exists "Admins can read tracking history" on public.tracking_history;
drop policy if exists "Admins can insert tracking history" on public.tracking_history;
drop policy if exists "Admins can update tracking history" on public.tracking_history;
drop policy if exists "Admins can delete tracking history" on public.tracking_history;

create policy "Admins can read shipments" on public.shipments
  for select to authenticated using ((select public.is_admin()));
create policy "Admins can insert shipments" on public.shipments
  for insert to authenticated with check ((select public.is_admin()));
create policy "Admins can update shipments" on public.shipments
  for update to authenticated using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "Admins can delete shipments" on public.shipments
  for delete to authenticated using ((select public.is_admin()));

create policy "Admins can read tracking history" on public.tracking_history
  for select to authenticated using ((select public.is_admin()));
create policy "Admins can insert tracking history" on public.tracking_history
  for insert to authenticated with check ((select public.is_admin()));
create policy "Admins can update tracking history" on public.tracking_history
  for update to authenticated using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "Admins can delete tracking history" on public.tracking_history
  for delete to authenticated using ((select public.is_admin()));

-- Public tracking exposes shipment and sender/recipient contact details to
-- anyone with a valid tracking number. Keep admin-only notes out of this RPC.
create or replace function public.track_shipment(p_tracking_number text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'tracking_number', s.tracking_number,
    'status', s.status,
    'sender_name', s.sender_name,
    'sender_address', s.sender_address,
    'sender_email', s.sender_email,
    'sender_phone', s.sender_phone,
    'receiver_name', s.receiver_name,
    'receiver_address', s.receiver_address,
    'receiver_email', s.receiver_email,
    'receiver_phone', s.receiver_phone,
    'origin', s.origin,
    'destination', s.destination,
    'description', s.description,
    'package_type', s.package_type,
    'package_image_url', s.package_image_url,
    'weight_kg', s.weight_kg,
    'shipment_amount', s.shipment_amount,
    'currency', coalesce(s.currency, s.shipment_currency, 'USD'),
    'shipment_date', s.shipment_date,
    'estimated_delivery', s.estimated_delivery,
    'current_lat', s.current_lat,
    'current_lng', s.current_lng,
    'origin_lat', s.origin_lat,
    'origin_lng', s.origin_lng,
    'destination_lat', s.destination_lat,
    'destination_lng', s.destination_lng,
    'progress_percent', coalesce((
      select h.progress_percent from public.tracking_history h
      where h.shipment_id = s.id
      order by h.created_at desc limit 1
    ), 0),
    'history', coalesce((
      select jsonb_agg(jsonb_build_object(
        'status', h.status,
        'location', h.location,
        'lat', h.lat,
        'lng', h.lng,
        'note', h.note,
        'progress_percent', h.progress_percent,
        'created_at', h.created_at
      ) order by h.created_at desc)
      from public.tracking_history h where h.shipment_id = s.id
    ), '[]'::jsonb)
  )
  from public.shipments s
  where lower(s.tracking_number) = lower(trim(p_tracking_number))
    and s.deleted_at is null
  limit 1;
$$;
revoke all on function public.track_shipment(text) from public;
grant execute on function public.track_shipment(text) to anon, authenticated;

-- Public bucket supports package photos on a tracking page. Upload and delete
-- operations remain restricted to UUIDs listed in admin_users.
insert into storage.buckets (id, name, public)
values ('shipment-images', 'shipment-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can view shipment images" on storage.objects;
drop policy if exists "Authenticated users can upload shipment images" on storage.objects;
drop policy if exists "Authenticated users can update shipment images" on storage.objects;
drop policy if exists "Authenticated users can delete shipment images" on storage.objects;
drop policy if exists "Admins can upload shipment images" on storage.objects;
drop policy if exists "Admins can update shipment images" on storage.objects;
drop policy if exists "Admins can delete shipment images" on storage.objects;
drop policy if exists "Public can view SwiftSurge shipment images" on storage.objects;

create policy "Public can view SwiftSurge shipment images" on storage.objects
  for select to anon, authenticated using (bucket_id = 'shipment-images');
create policy "Admins can upload shipment images" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'shipment-images' and (select public.is_admin())
  );
create policy "Admins can update shipment images" on storage.objects
  for update to authenticated using (
    bucket_id = 'shipment-images' and (select public.is_admin())
  ) with check (bucket_id = 'shipment-images' and (select public.is_admin()));
create policy "Admins can delete shipment images" on storage.objects
  for delete to authenticated using (
    bucket_id = 'shipment-images' and (select public.is_admin())
  );

-- After creating the admin login in Authentication → Users, allow-list it:
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'your-admin-email@example.com'
-- on conflict (user_id) do nothing;
