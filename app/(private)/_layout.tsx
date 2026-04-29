import AuthenticatedViewOnly from '@/src/components/wrapper/AuthenticatedViewOnly';
import { useAuth } from '@/src/context/AuthenticationContext';
import { useRideStore } from '@/src/store/useRideStore';
import { supabase } from '@/src/utils/supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
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
  const { role } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inDriverGroup = segments.some((s) => s === '(driver)');
    const inCommuterTabs = segments.some((s) => s === '(tabs)') && !inDriverGroup;

    // Route a driver who somehow lands in the commuter tabs back to their dashboard.
    if (role === 'driver' && inCommuterTabs) {
      router.replace('/(private)/(driver)/(tabs)/dashboard');
      return;
    }
    // And the inverse: a non-driver in the driver group goes home.
    if (role && role !== 'driver' && inDriverGroup) {
      router.replace('/(private)/(tabs)/home');
      return;
    }

    // The persisted-ride redirect is commuter-specific; drivers are exempt.
    if (role === 'commuter' || role === null) {
      const inRide = segments.some((s) => s === 'in-ride');
      if (rideDetails && !inRide) {
        router.replace('/(private)/in-ride');
      }
    }
  }, [rideDetails, role, router, segments]);

  return (
    <AuthenticatedViewOnly>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(driver)" options={{ headerShown: false }} />
          <Stack.Screen name="in-ride" options={{ headerShown: false }} />
          <Stack.Screen
            name="location-search"
            options={{ presentation: 'modal', headerShown: false }}
          />
        </Stack>
      </QueryClientProvider>
    </AuthenticatedViewOnly>
  );
}
