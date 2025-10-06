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
            animation: Platform.OS === 'ios' ? 'none' : 'none',
          }}>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="sign-up"
            options={{
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.replace('/(authentication)/login')}>
                  <ArrowLeft style={{ paddingHorizontal: theme.spacing.l }} color={primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="verify-otp"
            options={{
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <ArrowLeft style={{ paddingHorizontal: theme.spacing.l }} color={primary} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="account-setup"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </QueryClientProvider>
    </GuestViewOnly>
  );
}
