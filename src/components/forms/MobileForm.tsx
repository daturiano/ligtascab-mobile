import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Input from '@/src/components/ui/Input';
import Text from '@/src/components/ui/Text';
import { checkPhoneNumberExists, requestOtp } from '@/src/services/authentication';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import ErrorMessage from '../ui/ErrorMessage';

export default function MobileForm() {
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const sendOtpMutation = useMutation({
    mutationFn: async (mobileNumber: string) => requestOtp(mobileNumber),
  });

  const onSubmit = async () => {
    setIsLoading(true);
    const fullMobileNumber = `63${mobileNumber}`;

    try {
      // 1. Pre-check availability
      const isTaken = await checkPhoneNumberExists(fullMobileNumber);

      if (isTaken) {
        setError('This mobile number is already linked to an account.');
        setIsLoading(false);
        return;
      }

      const data = await sendOtpMutation.mutateAsync(fullMobileNumber);

      if (!data || !data[0] || !data[0].code) {
        throw new Error('Invalid OTP response received');
      }

      router.replace({
        pathname: '/(authentication)/verify-otp',
        params: { mobileNumber: fullMobileNumber, code: data[0].code },
      });
    } catch (error: any) {
      console.error(error);
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      width="100%"
      gap="l"
      flexGrow={1}
      flexDirection="column"
      justifyContent="space-between"
      style={{ marginBottom: 80 }}>
      <Box flexDirection="column" gap="m">
        <Box gap="m" flexDirection="row" alignItems="center">
          <Box
            paddingHorizontal="l"
            paddingVertical="l"
            borderRadius="m"
            borderColor="muted"
            borderWidth={1}>
            <Text variant="bodyBold">🇵🇭 +63</Text>
          </Box>
          <Box flexGrow={1}>
            <Input
              placeholder="9xxxxxxxxx"
              value={mobileNumber}
              maxLength={10}
              onChangeText={setMobileNumber}
              onKeyPress={() => setError(null)}
              keyboardType="number-pad"
              onFocus={() => setError(null)}
              autoCapitalize="none"
              autoFocus={true}
            />
          </Box>
        </Box>
        {error && <ErrorMessage message={error} />}
      </Box>
      <Button
        onPress={onSubmit}
        isLoading={isLoading}
        variant={mobileNumber.length !== 10 ? 'disabled' : 'primary'}
        disabled={mobileNumber.length !== 10}>
        <Text color="mainBackground" variant="body">
          Next
        </Text>
      </Button>
    </Box>
  );
}
