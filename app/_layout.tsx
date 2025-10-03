import { ThemeProvider } from '@shopify/restyle';
import { theme } from 'theme';

import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <ThemeProvider theme={theme}>
      <Stack />
    </ThemeProvider>
  );
}
