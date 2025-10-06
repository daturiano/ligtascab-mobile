import OtpForm from '@/src/components/forms/OtpForm';
import Box from '@/src/components/ui/Box';
import KeyboardAvoidingContainer from '@/src/components/ui/KeyboardAvoidingContainer';
import Text from '@/src/components/ui/Text';
import { useLocalSearchParams } from 'expo-router';

export default function VerifyOtpPage() {
  const { mobileNumber, code } = useLocalSearchParams();
  return (
    <KeyboardAvoidingContainer>
      <Box gap="m" flexDirection="column">
        <Text variant="header">Enter OTP</Text>
        <Text variant="description">
          A One Time Pin was sent to +63 ****** {mobileNumber.slice(6, 10)}
        </Text>
      </Box>
      <OtpForm mobileNumber={mobileNumber as string} code={code as string} />
    </KeyboardAvoidingContainer>
  );
}
