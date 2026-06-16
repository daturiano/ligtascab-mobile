import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchPendingPickupRequests } from '../services/pickup';
import { supabase } from '../utils/supabase';

/**
 * Live feed of pending (unclaimed) pickup requests for the driver "Jobs" tab.
 * Subscribes to all changes on pickup_requests; INSERTs add new pending jobs,
 * UPDATEs (status leaving 'pending') remove them, and the cache is invalidated
 * for either case.
 */
export function usePendingPickupJobs(enabled: boolean) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['pending-pickup-jobs'],
    queryFn: async () => {
      const { data, error } = await fetchPendingPickupRequests();
      if (error) {
        console.error('fetchPendingPickupRequests failed:', {
          code: (error as any).code,
          message: error.message,
          details: (error as any).details,
          hint: (error as any).hint,
        });
        throw error;
      }
      return data;
    },
    enabled,
  });

  useEffect(() => {
    if (!enabled) return;
    const channel = supabase
      .channel('pickup-pending')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pickup_requests' }, () => {
        queryClient.invalidateQueries({ queryKey: ['pending-pickup-jobs'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, queryClient]);

  return {
    jobs: query.data ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
