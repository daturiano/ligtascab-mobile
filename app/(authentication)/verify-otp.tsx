import OtpForm from '@/src/components/forms/OtpForm';
import Box from '@/src/components/ui/Box';
import Container from '@/src/components/ui/Container';
import Text from '@/src/components/ui/Text';
import { useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function VerifyOtpPage() {
  const { mobileNumber, code } = useLocalSearchParams();
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
          <Text variant="header">Enter OTP</Text>
          <Text variant="description">
            A One Time Pin was sent to +63 ****** {mobileNumber.slice(6, 10)}
          </Text>
        </Box>
        <OtpForm mobileNumber={mobileNumber as string} code={code as string} />
      </Container>
    </KeyboardAvoidingView>
  );
}
