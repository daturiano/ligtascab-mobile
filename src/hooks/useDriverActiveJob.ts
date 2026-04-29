import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthenticationContext';
import { fetchDriverActiveJob } from '../services/pickup';
import { supabase } from '../utils/supabase';

/**
 * The driver's currently-claimed pickup_request (status accepted or in_progress).
 * Subscribes to row changes filtered by driver_id so commuter cancellations or
 * status transitions reflect immediately.
 */
export function useDriverActiveJob() {
  const { driver } = useAuth();
  const driverId = driver?.id;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['driver-active-job', driverId],
    queryFn: async () => {
      if (!driverId) return null;
      const { data, error } = await fetchDriverActiveJob(driverId);
      if (error) {
        console.error('fetchDriverActiveJob failed:', {
          code: (error as any).code,
          message: error.message,
          details: (error as any).details,
          hint: (error as any).hint,
        });
        throw error;
      }
      return data;
    },
    enabled: !!driverId,
  });

  useEffect(() => {
    if (!driverId) return;
    const channel = supabase
      .channel(`driver-job-${driverId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pickup_requests',
          filter: `driver_id=eq.${driverId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['driver-active-job', driverId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId, queryClient]);

  return {
    job: query.data ?? null,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
