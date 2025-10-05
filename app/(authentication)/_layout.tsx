import GuestViewOnly from '@/src/components/wrapper/GuestViewOnly';
import { Theme } from '@/src/theme/theme';
import { supabase } from '@/src/utils/supabase';
import { useTheme } from '@shopify/restyle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';
import { AppState, Platform, TouchableOpacity } from 'react-native';
export { ErrorBoundary } from 'expo-router';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const queryClient = new QueryClient();

export default function AuthLayout() {
  const theme = useTheme<Theme>();
  const { mainBackground, primary } = theme.colors;
  const router = useRouter();
  return (
    <GuestViewOnly>
      <QueryClientProvider client={queryClient}>
        <StatusBar />
        <Stack
          screenOptions={{
            headerTintColor: primary,
            headerStyle: { backgroundColor: mainBackground },
            headerShadowVisible: false,
            headerTitle: '',
          }}>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              animation: Platform.OS === 'ios' ? 'ios_from_left' : 'slide_from_left',
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.push('/')}>
                  <ArrowLeft style={{ paddingHorizontal: theme.spacing.l }} />
                </TouchableOpacity>
              ),
              animation: Platform.OS === 'ios' ? 'ios_from_right' : 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="sign-up"
            options={{
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <ArrowLeft style={{ paddingHorizontal: theme.spacing.l }} />
                </TouchableOpacity>
              ),
              animation: Platform.OS === 'ios' ? 'ios_from_right' : 'slide_from_right',
            }}
          />
        </Stack>
      </QueryClientProvider>
    </GuestViewOnly>
  );
}
