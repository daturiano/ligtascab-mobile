import theme from '@/src/theme/theme';
import { Nunito_300Light, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { Roboto_600SemiBold, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
import { ThemeProvider } from '@shopify/restyle';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
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

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar />
      <Stack
        screenOptions={{
          headerTintColor: '#1daa88',
          headerShown: false,
        }}
      />
    </ThemeProvider>
  );
}
