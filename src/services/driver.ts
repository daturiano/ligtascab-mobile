import { Driver, DriverEarningsSummary, ShiftWithTricycle } from '../types';
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
 * Returns today's shift row for the driver, if any. The mere presence of a
 * row for the current calendar day means the driver is "on shift" — the
 * shifts table has no start/end columns; operators provision a row per shift.
 */
export const fetchDriverActiveShift = async (driverId: string) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('shifts')
    .select('*, tricycle:tricycles(*)')
    .eq('driver_id', driverId)
    .gte('created_at', startOfToday.toISOString())
    .order('created_at', { ascending: false })
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
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data: (data ?? []) as ShiftWithTricycle[], error };
};

/**
 * Earnings summary aggregated from completed pickup_requests. Falls back to
 * placeholder zeros without surfacing an error so the UI degrades gracefully.
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
      .from('pickup_requests')
      .select('estimated_fare, completed_at')
      .eq('driver_id', driverId)
      .eq('status', 'completed')
      .not('completed_at', 'is', null);

    if (error || !data) return placeholder;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

    let todayTotal = 0;
    let weekTotal = 0;
    let lifetimeTotal = 0;

    for (const row of data as { estimated_fare: number | string; completed_at: string | null }[]) {
      const fare = Number(row.estimated_fare ?? 0);
      if (!Number.isFinite(fare)) continue;
      lifetimeTotal += fare;

      const completedAt = row.completed_at ? new Date(row.completed_at) : null;
      if (!completedAt) continue;

      if (completedAt >= startOfWeek) weekTotal += fare;
      if (completedAt >= startOfToday) todayTotal += fare;
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

