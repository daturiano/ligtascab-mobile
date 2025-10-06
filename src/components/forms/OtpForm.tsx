import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Text from '@/src/components/ui/Text';
import { otpSchema } from '@/src/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { z } from 'zod';
import ErrorMessage from '../ui/ErrorMessage';

type OtpFormProps = {
  mobileNumber: string;
  code: string;
};

export default function OtpForm({ mobileNumber, code }: OtpFormProps) {
  const [timer, setTimer] = useState(60);
  const router = useRouter();

  useEffect(() => {
    if (timer <= 0) return;
    const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const otpValue = watch('otp');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newOtp = otpValue.substring(0, index) + text + otpValue.substring(index + 1);
    setValue('otp', newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpValue[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(60);
  };

  const onSubmit = (otp: z.infer<typeof otpSchema>) => {
    if (code === otp.otp) {
      router.replace({
        pathname: '/(authentication)/account-setup',
        params: { mobileNumber: `63${mobileNumber}` },
      });
    } else {
      setError('root', {
        type: 'manual',
        message: 'Make sure the OTP Pin are correct.',
      });
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
      <Box flexDirection="column" gap="s" alignItems="flex-start">
        <Controller
          control={control}
          name="otp"
          render={({ fieldState: { error } }) => (
            <>
              <Box justifyContent="center" flexDirection="row" gap="s">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    value={otpValue[index] || ''}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    autoFocus={true}
                    style={styles.textBox}
                  />
                ))}
              </Box>
            </>
          )}
        />
        <Box width="100%" marginTop="m">
          <Text variant="body" fontWeight="600">
            Didn’t receive it?
          </Text>
          {timer > 0 ? (
            <Text variant="description">
              Request a new OTP in{' '}
              <Text color="primary" fontWeight="600">
                00:{timer.toString().padStart(2, '0')}
              </Text>
            </Text>
          ) : (
            <Pressable onPress={handleResend}>
              <Text fontSize={16} color="primary" fontWeight={600}>
                Resend
              </Text>
            </Pressable>
          )}
        </Box>
        {errors.root?.message && <ErrorMessage message={errors.root.message} />}
      </Box>
      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={otpValue.length !== 6 || isSubmitting}
        isLoading={isSubmitting}
        variant={otpValue.length !== 6 ? 'disabled' : 'primary'}>
        <Text color="mainBackground" variant="body">
          Next
        </Text>
      </Button>
    </Box>
  );
}

const styles = StyleSheet.create({
  textBox: {
    width: 50,
    height: 60,
    borderWidth: 1.5,
    borderColor: '#737373',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    color: '#000',
  },
});
