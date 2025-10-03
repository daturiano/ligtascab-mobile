import { Link, Stack } from 'expo-router';

import { Box, Text, makeStyles } from 'theme';

import { Container } from '@/components/Container';

export default function NotFoundScreen() {
  const styles = useStyles();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Box flex={1} justifyContent="center" alignItems="center" padding="ml_24">
        <Text variant="title">{"This screen doesn't exist."}</Text>
        <Link href="/" style={styles.link}>
          <Text variant="body" color="blue">
            Go to home screen!
          </Text>
        </Link>
      </Box>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  link: {
    marginTop: theme.spacing.m_16,
    paddingVertical: theme.spacing.m_16,
  },
}));
