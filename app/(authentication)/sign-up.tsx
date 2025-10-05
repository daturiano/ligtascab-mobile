import MobileForm from '@/src/components/forms/MobileForm';
import Box from '@/src/components/ui/Box';
import Container from '@/src/components/ui/Container';
import Text from '@/src/components/ui/Text';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function SignUpPage() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}>
      <Container
        style={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 24,
          marginBottom: 50,
        }}>
        <Box gap="m" flexDirection="column">
          <Text variant="header">Hi! What&apos;s your mobile number?</Text>
          <Text variant="description">
            With a valid number, you can confirm rides, look up terminals, and other services.
          </Text>
        </Box>
        <MobileForm />
      </Container>
    </KeyboardAvoidingView>
  );
}
