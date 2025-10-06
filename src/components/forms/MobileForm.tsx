import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Input from '@/src/components/ui/Input';
import Text from '@/src/components/ui/Text';
import { requestOtp } from '@/src/services/authentication';
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
    setIsLoading(false);
    try {
      const data = await sendOtpMutation.mutateAsync(mobileNumber);
      router.replace({
        pathname: '/(authentication)/verify-otp',
        params: { mobileNumber, code: data[0].code },
      });
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box width="100%" gap="l" flexGrow={1} flexDirection="column" justifyContent="space-between">
      <Box flexDirection="column" gap="m">
        <Box gap="m" flexDirection="row" alignItems="center">
          <Box
            paddingHorizontal="l"
            paddingVertical="l"
            borderRadius="m"
            borderColor="muted"
            borderWidth={1}>
            <Text fontSize={18}>🇵🇭 +63</Text>
          </Box>
          <Box flexGrow={1}>
            <Input
              style={{ fontSize: 18 }}
              placeholder="9391234567"
              value={mobileNumber}
              maxLength={10}
              onChangeText={setMobileNumber}
              onKeyPress={() => setError(null)}
              keyboardType="phone-pad"
              onFocus={() => setError(null)}
              autoCapitalize="none"
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
