-- Add passenger_count to pickup_requests
alter table public.pickup_requests
  add column if not exists passenger_count integer not null default 1;
