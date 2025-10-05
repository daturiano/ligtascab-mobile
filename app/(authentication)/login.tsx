import LoginForm from '@/src/components/forms/LoginForm';
import Box from '@/src/components/ui/Box';
import BrandName from '@/src/components/ui/BrandName';
import Container from '@/src/components/ui/Container';
import Text from '@/src/components/ui/Text';
import { Link } from 'expo-router';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function Login() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container
        style={{
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 24,
          marginBottom: 50,
        }}>
        <BrandName style={{ alignSelf: 'center', justifyContent: 'center' }} />
        <Box alignItems="center" width="100%">
          <Text variant="header" color="secondary">
            Welcome Back!
          </Text>
          <Text variant="description">Sign in to start your LigtasCab journey.</Text>
        </Box>
        <LoginForm />
        <Box flexDirection="row" alignItems="center" justifyContent="center" width="100%" gap="s">
          <Text variant="description">Don’t have an account?</Text>
          <Link href="/(authentication)/sign-up" asChild>
            <Text color="primary" fontWeight={500} fontSize={16}>
              Sign Up
            </Text>
          </Link>
        </Box>
      </Container>
    </TouchableWithoutFeedback>
  );
}
