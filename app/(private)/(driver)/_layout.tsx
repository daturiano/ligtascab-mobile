import Container from '@/src/components/ui/Container';
import { useAuth } from '@/src/context/AuthenticationContext';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

export default function DriverLayout() {
  const { role, authChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authChecked && role && role !== 'driver') {
      router.replace('/(private)/(tabs)/home');
    }
  }, [authChecked, role, router]);

  if (!authChecked || role === null) {
    return (
      <Container>
        <ActivityIndicator size="large" />
      </Container>
    );
  }

  if (role !== 'driver') {
    return (
      <Container>
        <ActivityIndicator size="large" />
      </Container>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="active-shift" options={{ headerShown: false }} />
    </Stack>
  );
}
