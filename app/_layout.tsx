import { AuthProvider } from '@/src/context/AuthenticationContext';
import { useRideStore } from '@/src/store/useRideStore';
import theme from '@/src/theme/theme';
import { Nunito_300Light, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { Roboto_600SemiBold, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
import { ThemeProvider } from '@shopify/restyle';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Roboto_600SemiBold,
    Roboto_700Bold,
    Nunito_300Light,
    Nunito_800ExtraBold,
  });

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useRideStore.persist.onFinishHydration(() => setHydrated(true));
    if (useRideStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  useEffect(() => {
    if ((loaded || error) && hydrated) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, hydrated]);

  if (!loaded || !hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <StatusBar />
        <Stack
          screenOptions={{
            headerTintColor: '#1daa88',
            headerShown: false,
          }}
        />
      </ThemeProvider>
    </AuthProvider>
  );
}
