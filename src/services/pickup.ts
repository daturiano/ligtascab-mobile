import { PickupLocation, PickupRequest, PickupRequestWithParties } from '../types';
import { supabase } from '../utils/supabase';

// NOTE: we deliberately do NOT embed commuters here. pickup_requests.commuter_id
// references auth.users(id), not public.commuters(id), so PostgREST can't infer
// the relationship and the entire query fails with a 400. If commuter info is
// needed (driver-side active job), fetch it separately by commuter_id.
const PICKUP_WITH_RELATIONS_SELECT = '*, driver:drivers(*), tricycle:tricycles(*)';

type CreatePickupRequestInput = {
  commuter_id: string;
  origin: PickupLocation;
  destination: PickupLocation;
  distance_km: number;
  estimated_duration_min: number;
  estimated_fare: number;
  offer_amount: number;
  passenger_count: number;
};

export const createPickupRequest = async (input: CreatePickupRequestInput) => {
  const { data, error } = await supabase
    .from('pickup_requests')
    .insert({
      commuter_id: input.commuter_id,
      origin: input.origin,
      destination: input.destination,
      distance_km: input.distance_km,
      estimated_duration_min: input.estimated_duration_min,
      estimated_fare: input.estimated_fare,
      offer_amount: input.offer_amount,
      passenger_count: input.passenger_count,
    })
    .select()
    .single();

  return { data: data as PickupRequest | null, error };
};

export const cancelPickupRequest = async (requestId: string) => {
  const { data, error } = await supabase
    .from('pickup_requests')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancelled_by: 'commuter',
    })
    .eq('id', requestId)
    .select()
    .single();

  return { data: data as PickupRequest | null, error };
};

/**
 * Returns the commuter's currently in-flight pickup request OR a recently
 * completed-but-not-yet-confirmed one (so the completion screen stays visible
 * until the commuter explicitly taps Confirm).
 */
export const fetchActivePickupForCommuter = async (commuterId: string) => {
  const { data, error } = await supabase
    .from('pickup_requests')
    .select(PICKUP_WITH_RELATIONS_SELECT)
    .eq('commuter_id', commuterId)
    .or('status.in.(pending,accepted,in_progress),and(status.eq.completed,confirmed_at.is.null)')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return { data: data as PickupRequestWithParties | null, error };
};

/**
 * All currently broadcast (pending) pickup requests, newest first.
 */
export const fetchPendingPickupRequests = async () => {
  const { data, error } = await supabase
    .from('pickup_requests')
    .select(PICKUP_WITH_RELATIONS_SELECT)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  return { data: (data ?? []) as PickupRequestWithParties[], error };
};

/**
 * The driver's currently active claimed job (accepted or in_progress).
 * Resolved through drivers.user_id == auth.uid() in the underlying RLS.
 */
export const fetchDriverActiveJob = async (driverId: string) => {
  const { data, error } = await supabase
    .from('pickup_requests')
    .select(PICKUP_WITH_RELATIONS_SELECT)
    .eq('driver_id', driverId)
    .in('status', ['accepted', 'in_progress'])
    .order('accepted_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return { data: data as PickupRequestWithParties | null, error };
};

export const acceptPickupRequest = async (requestId: string) => {
  const { data, error } = await supabase.rpc('accept_pickup_request', {
    request_id: requestId,
  });
  return { data: data as PickupRequest | null, error };
};

export const markPickupInProgress = async (requestId: string) => {
  const { data, error } = await supabase.rpc('mark_pickup_in_progress', {
    request_id: requestId,
  });
  return { data: data as PickupRequest | null, error };
};

export const completePickupRequest = async (requestId: string) => {
  const { data, error } = await supabase.rpc('complete_pickup_request', {
    request_id: requestId,
  });
  return { data: data as PickupRequest | null, error };
};

export const confirmPickupCompletion = async (requestId: string) => {
  const { data, error } = await supabase.rpc('confirm_pickup_completion', {
    request_id: requestId,
  });
  return { data: data as PickupRequest | null, error };
};

/**
 * Driver's history of pickup jobs (completed + cancelled), newest first.
 * Used in the History tab's Jobs sub-view.
 */
export const fetchDriverCompletedJobs = async (driverId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('pickup_requests')
    .select('*')
    .eq('driver_id', driverId)
    .in('status', ['completed', 'cancelled'])
    .order('accepted_at', { ascending: false })
    .limit(limit);
  return { data: (data ?? []) as PickupRequest[], error };
};

export const updatePickupOffer = async (requestId: string, newOfferAmount: number) => {
  const { data, error } = await supabase.rpc('update_pickup_offer', {
    request_id: requestId,
    new_offer: newOfferAmount,
  });
  return { data: data as PickupRequest | null, error };
};

export const commuterFinishPickupRequest = async (requestId: string) => {
  const { data, error } = await supabase.rpc('commuter_finish_pickup_request', {
    request_id: requestId,
  });
  return { data: data as PickupRequest | null, error };
};
