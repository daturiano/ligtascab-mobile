-- Fix mark_pickup_in_progress by removing start_time, which doesn't exist in rides table
create or replace function public.mark_pickup_in_progress(request_id uuid)
returns public.pickup_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_driver public.drivers%rowtype;
  v_tricycle public.tricycles%rowtype;
  v_operator public.operators%rowtype;
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

  -- Create a record in the rides table to represent this trip
  select * into v_tricycle from public.tricycles where id = v_updated.tricycle_id;
  if found then
    select * into v_operator from public.operators where id = v_tricycle.operator_id;
    
    insert into public.rides (
      id,
      commuter_id,
      tricycle_details,
      driver_details,
      operator_details,
      fare
    ) values (
      v_updated.id, -- Use the same ID as the pickup request
      v_updated.commuter_id,
      row_to_json(v_tricycle)::jsonb,
      row_to_json(v_driver)::jsonb,
      row_to_json(v_operator)::jsonb,
      v_updated.estimated_fare::text
    );
  end if;

  return v_updated;
end $$;
