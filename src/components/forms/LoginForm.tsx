import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import ErrorMessage from '@/src/components/ui/ErrorMessage';
import Input from '@/src/components/ui/Input';
import Text from '@/src/components/ui/Text';
import { useAuth } from '@/src/context/AuthenticationContext';
import { LoginSchema } from '@/src/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { LockIcon, PhoneIcon } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

export default function LoginForm() {
  const router = useRouter();
  const { signInWithPhoneNumber } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { phoneNumber: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    try {
      const { success } = await signInWithPhoneNumber(data.phoneNumber, data.password);
      if (!success) {
        setError('root', {
          type: 'manual',
          message: 'Make sure the credentials are correct.',
        });
        return;
      }
      router.replace('/(private)/(tabs)/home');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError('root', {
        type: 'manual',
        message: err.message ?? 'An unexpected error occurred. Please try again.',
      });
    }
  };
  return (
    <Box width="100%" gap="l">
      <Box gap="m">
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Phone Number"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="number-pad"
              autoCapitalize="none"
              maxLength={12}
              icon={PhoneIcon}
              errorMessage={errors.phoneNumber?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              autoCapitalize="none"
              icon={LockIcon}
              errorMessage={errors.password?.message}
            />
          )}
        />
        {errors.root?.message && <ErrorMessage message={errors.root.message} />}
      </Box>
      <Button
        onPress={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
        disabled={!isValid}
        variant={!isValid ? 'disabled' : 'primary'}>
        <Text color="mainBackground" variant="body">
          Sign In
        </Text>
      </Button>
    </Box>
  );
}
