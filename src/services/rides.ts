import { Report, Ride, Tricycle } from '../types';
import { supabase } from '../utils/supabase';
import { getErrorMessage } from '../utils/utils';
import { fetchDriverDetails, fetchOperatorDetails } from './db';

export async function submitReport(reportDetails: Partial<Report>): Promise<Report> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const reportData = {
      ...reportDetails,
      commuter_id: user.id,
    };

    const { data, error } = await supabase.from('reports').insert(reportData).select().single();

    if (error || !data) {
      throw new Error(error?.message || 'Unable to create new ride');
    }

    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createNewRide(tricycleDetails: Tricycle): Promise<Ride> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { data: driverDetails } = await fetchDriverDetails(tricycleDetails.assigned_driver);
    const { data: operatorDetails } = await fetchOperatorDetails(tricycleDetails.operator_id);

    const rideData = {
      commuter_id: user.id,
      tricycle_details: tricycleDetails,
      driver_details: driverDetails,
      operator_details: operatorDetails,
      fare: '15.00',
    };

    console.log(rideData);

    const { data, error } = await supabase.from('rides').insert(rideData).select().single();

    if (error || !data) {
      throw new Error(error?.message || 'Unable to create new ride');
    }

    return data;
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export const updateRide = async (ride_id: string) => {
  const endTime = new Date().toISOString();
  const { data, error } = await supabase
    .from('rides')
    .update({ end_time: endTime })
    .eq('id', ride_id)
    .single();

  return { data, error };
};

export const fetchRecentRides = async (): Promise<Ride[]> => {
  const { data } = await supabase
    .from('rides')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  return data ?? [];
};

export const fetchRecentRidesInfiniteQuery = async (offset = 0, limit = 3): Promise<Ride[]> => {
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching recent rides:', error);
    return [];
  }

  return data ?? [];
};

export const searchRides = async (query: string, page: number = 0): Promise<Ride[]> => {
  if (!query.trim()) return [];

  const limit = 3;
  const offset = page * limit;

  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .filter('tricycle_details->>plate_number', 'ilike', `%${query}%`)
    .range(offset, offset + limit - 1)
    .limit(limit);

  if (error) {
    console.error('Error searching tricycles:', error);
    return [];
  }

  return data || [];
};
