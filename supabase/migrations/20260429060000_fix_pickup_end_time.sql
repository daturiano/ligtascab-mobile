-- Update complete_pickup_request to also mark the rides row with end_time
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

  -- Ensure the rides table captures the end_time
  update public.rides
    set end_time = now()
    where id = request_id and end_time is null;

  return v_updated;
end $$;


-- Update confirm_pickup_completion to also mark the rides row with end_time if not already set
create or replace function public.confirm_pickup_completion(request_id uuid)
returns public.pickup_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated public.pickup_requests;
begin
  update public.pickup_requests
    set confirmed_at = now()
    where id = request_id
      and commuter_id = auth.uid()
      and status = 'completed'
      and confirmed_at is null
    returning * into v_updated;

  if v_updated.id is null then
    raise exception 'This trip cannot be confirmed' using errcode = 'P0005';
  end if;

  -- Ensure the rides table captures the end_time (fallback if driver side didn't log it)
  update public.rides
    set end_time = now()
    where id = request_id and end_time is null;

  return v_updated;
end $$;
