-- Two-sided completion: driver marks the trip complete, then the commuter
-- explicitly confirms. The commuter's pickup screen keeps showing the
-- completion summary until confirmed_at is set.

alter table public.pickup_requests
  add column if not exists confirmed_at timestamptz;

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

  return v_updated;
end $$;

grant execute on function public.confirm_pickup_completion(uuid) to authenticated;
