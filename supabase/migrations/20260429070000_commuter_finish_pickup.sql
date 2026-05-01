-- Create an RPC to allow the commuter to forcibly finish a pickup request
-- This bypasses the driver's "Complete Trip" and the commuter's "Confirm Trip" phases.
create or replace function public.commuter_finish_pickup_request(request_id uuid)
returns public.pickup_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated public.pickup_requests;
begin
  update public.pickup_requests
    set status = 'completed',
        completed_at = coalesce(completed_at, now()),
        confirmed_at = now()
    where id = request_id
      and commuter_id = auth.uid()
      and status = 'in_progress'
    returning * into v_updated;

  if v_updated.id is null then
    raise exception 'This job cannot be finished by the commuter' using errcode = 'P0006';
  end if;

  -- Ensure the rides table captures the end_time
  update public.rides
    set end_time = now()
    where id = request_id and end_time is null;

  return v_updated;
end $$;

grant execute on function public.commuter_finish_pickup_request(uuid) to authenticated;
