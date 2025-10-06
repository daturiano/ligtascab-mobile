import LoginForm from '@/src/components/forms/LoginForm';
import Box from '@/src/components/ui/Box';
import BrandName from '@/src/components/ui/BrandName';
import KeyboardAvoidingContainer from '@/src/components/ui/KeyboardAvoidingContainer';
import Text from '@/src/components/ui/Text';
import { Link } from 'expo-router';

export default function Login() {
  return (
    <KeyboardAvoidingContainer>
      <BrandName />
      <Box width={'100%'} flex={1} justifyContent="center" gap="xl">
        <Box width="100%">
          <Text variant="header">Welcome Back!</Text>
          <Text variant="description">Sign in to start your ligtascab journey.</Text>
        </Box>
        <LoginForm />
        <Box flexDirection="row" alignItems="center" justifyContent="center" width="100%" gap="s">
          <Text variant="description">Don’t have an account?</Text>
          <Link href="/(authentication)/account-setup" asChild>
            <Text color="primary" fontWeight={500} fontSize={16}>
              Sign Up
            </Text>
          </Link>
        </Box>
      </Box>
    </KeyboardAvoidingContainer>
  );
}
