-- Pick Me Up: pickup_requests table, RLS, and acceptance RPC family.
-- Apply via Supabase CLI (`supabase db push`) or paste into the SQL editor.

-- 1. Lifecycle enum -----------------------------------------------------------
do $$ begin
  if not exists (select 1 from pg_type where typname = 'pickup_status') then
    create type pickup_status as enum (
      'pending', 'accepted', 'in_progress', 'completed', 'cancelled'
    );
  end if;
end $$;

-- 2. Table --------------------------------------------------------------------
create table if not exists public.pickup_requests (
  id uuid primary key default gen_random_uuid(),
  commuter_id uuid not null references auth.users(id) on delete cascade,
  driver_id uuid references public.drivers(id),
  tricycle_id uuid references public.tricycles(id),
  origin jsonb not null,
  destination jsonb not null,
  distance_km numeric(8,2) not null,
  estimated_duration_min int not null,
  estimated_fare numeric(10,2) not null,
  status pickup_status not null default 'pending',
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  picked_up_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancelled_by text check (cancelled_by in ('commuter', 'driver'))
);

create unique index if not exists pickup_requests_one_active_per_commuter
  on public.pickup_requests (commuter_id)
  where status in ('pending', 'accepted', 'in_progress');

create index if not exists pickup_requests_status_idx
  on public.pickup_requests (status);

create index if not exists pickup_requests_driver_idx
  on public.pickup_requests (driver_id)
  where driver_id is not null;

-- 3. Realtime publication -----------------------------------------------------
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'pickup_requests'
  ) then
    alter publication supabase_realtime add table public.pickup_requests;
  end if;
end $$;

-- 4. RLS ---------------------------------------------------------------------
alter table public.pickup_requests enable row level security;

drop policy if exists "commuter selects own" on public.pickup_requests;
create policy "commuter selects own" on public.pickup_requests
  for select using (auth.uid() = commuter_id);

drop policy if exists "commuter inserts own" on public.pickup_requests;
create policy "commuter inserts own" on public.pickup_requests
  for insert with check (auth.uid() = commuter_id);

-- Commuter can only update their own row to status='cancelled' (and only while
-- the row hasn't yet entered in_progress — we let the driver be the one who
-- transitions to in_progress / completed, via the RPCs).
drop policy if exists "commuter cancels own" on public.pickup_requests;
create policy "commuter cancels own" on public.pickup_requests
  for update using (
    auth.uid() = commuter_id and status in ('pending', 'accepted')
  )
  with check (
    auth.uid() = commuter_id and status = 'cancelled'
  );

-- Driver can read pending broadcasts and any row already claimed by them.
drop policy if exists "driver sees pending or own" on public.pickup_requests;
create policy "driver sees pending or own" on public.pickup_requests
  for select using (
    status = 'pending'
    or driver_id in (select id from public.drivers where user_id = auth.uid())
  );

-- Drivers do NOT get a direct UPDATE policy. They go through the RPCs below,
-- which run with definer privileges and enforce the state-machine rules.

-- 5. RPC: accept_pickup_request ---------------------------------------------
create or replace function public.accept_pickup_request(request_id uuid)
returns public.pickup_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_driver public.drivers%rowtype;
  v_active_shift public.shifts%rowtype;
  v_updated public.pickup_requests;
begin
  select * into v_driver from public.drivers where user_id = auth.uid();
  if not found then
    raise exception 'Not a driver' using errcode = '42501';
  end if;

  select * into v_active_shift
    from public.shifts
    where driver_id = v_driver.id and end_time is null
    order by start_time desc
    limit 1;
  if not found then
    raise exception 'You must start a shift before accepting jobs' using errcode = 'P0001';
  end if;

  update public.pickup_requests
    set driver_id = v_driver.id,
        tricycle_id = v_active_shift.tricycle_id,
        status = 'accepted',
        accepted_at = now()
    where id = request_id and status = 'pending'
    returning * into v_updated;

  if v_updated.id is null then
    raise exception 'This job has already been taken' using errcode = 'P0002';
  end if;

  return v_updated;
end $$;

grant execute on function public.accept_pickup_request(uuid) to authenticated;

-- 6. RPC: mark_pickup_in_progress -------------------------------------------
create or replace function public.mark_pickup_in_progress(request_id uuid)
returns public.pickup_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_driver public.drivers%rowtype;
  v_updated public.pickup_requests;
begin
  select * into v_driver from public.drivers where user_id = auth.uid();
  if not found then
    raise exception 'Not a driver' using errcode = '42501';
  end if;

  update public.pickup_requests
    set status = 'in_progress',
        picked_up_at = now()
    where id = request_id
      and driver_id = v_driver.id
      and status = 'accepted'
    returning * into v_updated;

  if v_updated.id is null then
    raise exception 'This job is not in an accepted state' using errcode = 'P0003';
  end if;

  return v_updated;
end $$;

grant execute on function public.mark_pickup_in_progress(uuid) to authenticated;

-- 7. RPC: complete_pickup_request -------------------------------------------
create or replace function public.complete_pickup_request(request_id uuid)
returns public.pickup_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_driver public.drivers%rowtype;
  v_updated public.pickup_requests;
begin
  select * into v_driver from public.drivers where user_id = auth.uid();
  if not found then
    raise exception 'Not a driver' using errcode = '42501';
  end if;

  update public.pickup_requests
    set status = 'completed',
        completed_at = now()
    where id = request_id
      and driver_id = v_driver.id
      and status = 'in_progress'
    returning * into v_updated;

  if v_updated.id is null then
    raise exception 'This job is not in progress' using errcode = 'P0004';
  end if;

  return v_updated;
end $$;

grant execute on function public.complete_pickup_request(uuid) to authenticated;
