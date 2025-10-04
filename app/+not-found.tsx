import Box from '@/components/ui/Box';
import Text from '@/components/ui/Text';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Box flex={1} justifyContent="center" alignItems="center" padding="ml_24">
        <Text variant="title">{"This screen doesn't exist."}</Text>
        <Link href="/">
          <Text variant="body" color="blue">
            Go to home screen!
          </Text>
        </Link>
      </Box>
    </>
  );
}
