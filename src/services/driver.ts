import { Driver, DriverEarningsSummary, Ride, Shift, ShiftWithTricycle } from '../types';
import { supabase } from '../utils/supabase';

/**
 * Resolve a driver row from the authenticated user id.
 * Strict isolation: never accepts a driver_id from the UI.
 */
export const fetchDriverByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  return { data: data as Driver | null, error };
};

/**
 * Currently active shift (no end_time) for the given driver.
 * Returns null without an error when no active shift exists.
 */
export const fetchDriverActiveShift = async (driverId: string) => {
  const { data, error } = await supabase
    .from('shifts')
    .select('*, tricycle:tricycles(*)')
    .eq('driver_id', driverId)
    .is('end_time', null)
    .order('start_time', { ascending: false })
    .limit(1)
    .maybeSingle();

  return { data: data as ShiftWithTricycle | null, error };
};

/**
 * Full shift history for the driver, newest first.
 */
export const fetchDriverShiftHistory = async (driverId: string, limit = 50) => {
  const { data, error } = await supabase
    .from('shifts')
    .select('*, tricycle:tricycles(*)')
    .eq('driver_id', driverId)
    .order('start_time', { ascending: false })
    .limit(limit);

  return { data: (data ?? []) as ShiftWithTricycle[], error };
};

/**
 * Earnings summary aggregated from rides.fare. Falls back to placeholder
 * values (zero) without surfacing an error when the rides table or
 * driver_id column doesn't exist yet — UI shows the empty state in that case.
 */
export const fetchDriverEarningsSummary = async (
  driverId: string
): Promise<DriverEarningsSummary> => {
  const placeholder: DriverEarningsSummary = {
    todayTotal: 0,
    weekTotal: 0,
    lifetimeTotal: 0,
    hasRealData: false,
  };

  try {
    const { data, error } = await supabase
      .from('rides')
      .select('fare, end_time')
      .eq('driver_id', driverId);

    if (error || !data) return placeholder;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

    let todayTotal = 0;
    let weekTotal = 0;
    let lifetimeTotal = 0;

    for (const row of data as Pick<Ride, 'fare' | 'end_time'>[]) {
      const fare = Number(row.fare ?? 0);
      if (Number.isNaN(fare)) continue;
      lifetimeTotal += fare;

      const endedAt = row.end_time ? new Date(row.end_time) : null;
      if (!endedAt) continue;

      if (endedAt >= startOfWeek) weekTotal += fare;
      if (endedAt >= startOfToday) todayTotal += fare;
    }

    return {
      todayTotal,
      weekTotal,
      lifetimeTotal,
      hasRealData: data.length > 0,
    };
  } catch {
    return placeholder;
  }
};

/**
 * Start a new shift on a tricycle. Caller must pass the driver's own id
 * (resolved from auth context) — the UI never passes a foreign driver_id.
 */
export const startShift = async (driverId: string, tricycleId: string) => {
  const { data, error } = await supabase
    .from('shifts')
    .insert({
      driver_id: driverId,
      tricycle_id: tricycleId,
      start_time: new Date().toISOString(),
    })
    .select()
    .single();

  return { data: data as Shift | null, error };
};

/**
 * Close out an active shift. Scoped by driver_id so a shift cannot be
 * closed by anyone other than the driver who owns it.
 */
export const endShift = async (shiftId: string, driverId: string) => {
  const { data, error } = await supabase
    .from('shifts')
    .update({ end_time: new Date().toISOString() })
    .eq('id', shiftId)
    .eq('driver_id', driverId)
    .select()
    .single();

  return { data: data as Shift | null, error };
};
