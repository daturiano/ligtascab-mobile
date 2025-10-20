import AuthenticatedViewOnly from '@/src/components/wrapper/AuthenticatedViewOnly';
import { useRideStore } from '@/src/store/useRideStore';
import { supabase } from '@/src/utils/supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const queryClient = new QueryClient();

export default function PrivateLayout() {
  const { rideDetails } = useRideStore();
  const router = useRouter();

  useEffect(() => {
    if (rideDetails) {
      router.push('/(private)/in-ride');
    }
  }, [rideDetails, router]);

  return (
    <AuthenticatedViewOnly>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="in-ride" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </AuthenticatedViewOnly>
  );
}
