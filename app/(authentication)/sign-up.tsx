import MobileForm from '@/src/components/forms/MobileForm';
import Box from '@/src/components/ui/Box';
import KeyboardAvoidingContainer from '@/src/components/ui/KeyboardAvoidingContainer';
import Text from '@/src/components/ui/Text';

export default function SignUpPage() {
  return (
    <KeyboardAvoidingContainer>
      <Box gap="m" flexDirection="column">
        <Text variant="header">Hi! What&apos;s your mobile number?</Text>
        <Text variant="description">
          With a valid number, you can confirm rides, look up terminals, and other services.
        </Text>
      </Box>
      <MobileForm />
    </KeyboardAvoidingContainer>
  );
}
