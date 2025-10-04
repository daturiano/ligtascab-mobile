import Box from '@/components/ui/Box';
import BrandName from '@/components/ui/BrandName';
import Container from '@/components/ui/Container';
import Text from '@/components/ui/Text';
import { Theme } from '@/theme/theme';
import { useTheme } from '@shopify/restyle';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

export default function Index() {
  const theme = useTheme<Theme>();
  const { primary, mainBackground, muted } = theme.colors;
  const router = useRouter();

  return (
    <Container>
      <BrandName />
      <Image style={styles.image} source={require('@/assets/welcome.svg')} />
      <Box flexDirection="column" gap="l" alignItems="center">
        <Box
          style={styles.badge}
          flexDirection="row"
          alignItems="center"
          gap="s"
          backgroundColor="secondary">
          <Image style={styles.logo} source={require('@/assets/logo-white.svg')} />
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
        <Pressable
          onPress={() => router.push('/login')}
          style={({ pressed }) => [
            styles.link,
            pressed && styles.pressed,
            { backgroundColor: primary },
          ]}>
          <Text variant="body" style={{ color: mainBackground }}>
            Get Started
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/login')}
          style={({ pressed }) => [
            styles.link,
            pressed && styles.pressed,
            { borderColor: muted, borderWidth: 1 },
          ]}>
          <Text variant="body">I already have an account</Text>
        </Pressable>
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
