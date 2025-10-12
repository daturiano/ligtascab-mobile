import { Ride, Tricycle } from '../types';
import { supabase } from '../utils/supabase';
import { getErrorMessage } from '../utils/utils';
import { fetchDriverDetails, fetchOperatorDetails } from './supabase';

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
