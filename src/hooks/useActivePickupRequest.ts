import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthenticationContext';
import { fetchActivePickupForCommuter } from '../services/pickup';
import { supabase } from '../utils/supabase';

/**
 * Subscribes to the commuter's own pickup_requests rows so the screen reflects
 * driver-side state changes (accepted, picked up, completed) in real time.
 * The query cache is the source of truth; the channel just invalidates it.
 */
export function useActivePickupRequest() {
  const { session } = useAuth();
  const commuterId = session?.user?.id;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['active-pickup', commuterId],
    queryFn: async () => {
      if (!commuterId) return null;
      const { data, error } = await fetchActivePickupForCommuter(commuterId);
      if (error) {
        console.error('fetchActivePickupForCommuter failed:', {
          code: (error as any).code,
          message: error.message,
          details: (error as any).details,
          hint: (error as any).hint,
        });
        throw error;
      }
      return data;
    },
    enabled: !!commuterId,
  });

  useEffect(() => {
    if (!commuterId) return;

    const channel = supabase
      .channel(`pickup-mine-${commuterId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pickup_requests',
          filter: `commuter_id=eq.${commuterId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['active-pickup', commuterId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [commuterId, queryClient]);

  return {
    pickup: query.data ?? null,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
