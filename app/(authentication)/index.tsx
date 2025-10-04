import Box from '@/src/components/ui/Box';
import BrandName from '@/src/components/ui/BrandName';
import Button from '@/src/components/ui/Button';
import Container from '@/src/components/ui/Container';
import Text from '@/src/components/ui/Text';
import { Theme } from '@/src/theme/theme';
import { useTheme } from '@shopify/restyle';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function Index() {
  const theme = useTheme<Theme>();
  const { mainBackground } = theme.colors;
  const router = useRouter();

  return (
    <Container>
      <BrandName />
      <Image style={styles.image} source={require('@/src/assets/welcome.svg')} />
      <Box flexDirection="column" gap="l" alignItems="center">
        <Box
          style={styles.badge}
          flexDirection="row"
          alignItems="center"
          gap="s"
          backgroundColor="secondary">
          <Image style={styles.logo} source={require('@/src/assets/logo-white.svg')} />
          <Text variant="body" style={{ color: mainBackground, fontWeight: '500' }}>
            Welcome to LigtasCab!
          </Text>
        </Box>
        <Text variant="header" style={{ textAlign: 'center' }}>
          Safe and Smart Transportation.
        </Text>
        <Text variant="description" style={{ textAlign: 'center' }}>
          Systemizing your daily travel by combining convenience, comfort, and efficiency for a
          stress-free journey every time.
        </Text>
      </Box>
      <Box width={'100%'} gap="s">
        <Button onPress={() => router.push('/(authentication)/login')}>
          <Text variant="body" style={{ color: mainBackground }}>
            Get Started
          </Text>
        </Button>
        <Button onPress={() => router.push('/(authentication)/login')} variant="outline">
          <Text variant="body">I already have an account</Text>
        </Button>
      </Box>
    </Container>
  );
}

const styles = StyleSheet.create({
  link: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    textAlign: 'center',
  },
  image: {
    width: 304,
    height: 239,
  },
  logo: {
    width: 18,
    height: 18,
  },
  pressed: {
    opacity: 0.5,
  },
  badge: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
});
