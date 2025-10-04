import Box from '@/src/components/ui/Box';
import Text from '@/src/components/ui/Text';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text variant="header">{"This screen doesn't exist."}</Text>
        <Link href="/">
          <Text variant="body" color="primary">
            Go to home screen!
          </Text>
        </Link>
      </Box>
    </>
  );
}
