-- Simplify the shift gate for accepting pickup jobs.
-- The shifts table has no start_time/end_time; instead, a row's mere presence
-- for today (in Asia/Manila) means the driver is on shift. Operators create
-- these rows from the web dashboard.

-- 1. Allow drivers to read their own shift rows from the mobile app -----------
alter table public.shifts enable row level security;

drop policy if exists "drivers can read own shifts" on public.shifts;
create policy "drivers can read own shifts" on public.shifts
  for select using (
    driver_id in (select id from public.drivers where user_id = auth.uid())
  );

-- 2. Replace accept_pickup_request: check by created_at, not end_time ---------
create or replace function public.accept_pickup_request(request_id uuid)
returns public.pickup_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_driver public.drivers%rowtype;
  v_active_shift public.shifts%rowtype;
  v_today_start timestamptz;
  v_updated public.pickup_requests;
begin
  select * into v_driver from public.drivers where user_id = auth.uid();
  if not found then
    raise exception 'Not a driver' using errcode = '42501';
  end if;

  -- "Today" means the current calendar day in Asia/Manila (Naga City).
  v_today_start := date_trunc('day', now() at time zone 'Asia/Manila') at time zone 'Asia/Manila';

  select * into v_active_shift
    from public.shifts
    where driver_id = v_driver.id
      and created_at >= v_today_start
    order by created_at desc
    limit 1;
  if not found then
    raise exception 'You have no shift assigned for today' using errcode = 'P0001';
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
