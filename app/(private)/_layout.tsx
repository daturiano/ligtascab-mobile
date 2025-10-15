import AuthenticatedViewOnly from '@/src/components/wrapper/AuthenticatedViewOnly';
import { RideProvider } from '@/src/context/RideContext';
import { supabase } from '@/src/utils/supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
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
  return (
    <AuthenticatedViewOnly>
      <RideProvider>
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="in-ride"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </QueryClientProvider>
      </RideProvider>
    </AuthenticatedViewOnly>
  );
}
