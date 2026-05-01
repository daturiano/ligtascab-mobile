-- Add offer_amount to pickup_requests
alter table public.pickup_requests
  add column if not exists offer_amount numeric(10,2) not null default 0;

-- Allow commuters to update their offer amount if the request is still pending
create or replace function public.update_pickup_offer(request_id uuid, new_offer numeric)
returns public.pickup_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated public.pickup_requests;
begin
  update public.pickup_requests
    set offer_amount = new_offer,
        estimated_fare = estimated_fare - offer_amount + new_offer -- Adjust total fare
    where id = request_id
      and commuter_id = auth.uid()
      and status = 'pending'
    returning * into v_updated;

  if v_updated.id is null then
    raise exception 'Cannot update offer for this request' using errcode = 'P0006';
  end if;

  return v_updated;
end $$;

grant execute on function public.update_pickup_offer(uuid, numeric) to authenticated;

-- Update mark_pickup_in_progress to also insert a ride record
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
      fare,
      start_time
    ) values (
      v_updated.id, -- Use the same ID as the pickup request
      v_updated.commuter_id,
      row_to_json(v_tricycle)::jsonb,
      row_to_json(v_driver)::jsonb,
      row_to_json(v_operator)::jsonb,
      v_updated.estimated_fare::text,
      now()
    );
  end if;

  return v_updated;
end $$;

-- Update complete_pickup_request to also complete the ride
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

  -- Update the rides table record
  update public.rides
    set end_time = now()
    where id = v_updated.id;

  return v_updated;
end $$;
