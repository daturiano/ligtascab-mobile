import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import ErrorMessage from '@/src/components/ui/ErrorMessage';
import Input from '@/src/components/ui/Input';
import Text from '@/src/components/ui/Text';
import { AccountSetupSchema } from '@/src/schemas';
import { registerWithCredentials } from '@/src/services/authentication';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AtSign, LockIcon, MapPinHouse, User } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

export default function AccountSetupForm() {
  const router = useRouter();
  const { mobileNumber } = useLocalSearchParams();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm<z.infer<typeof AccountSetupSchema>>({
    resolver: zodResolver(AccountSetupSchema),
    defaultValues: {
      fullName: '',
      phone: mobileNumber as string,
      address: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: z.infer<typeof AccountSetupSchema>) => {
    try {
      const user = await registerWithCredentials(data);
      if (user) {
        return router.replace('/(private)/home');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError('root', {
        type: 'manual',
        message: err.message ?? 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <Box width="100%" gap="l" flexGrow={1} flexDirection="column" justifyContent="space-between">
      <Box gap="m">
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Enter your full name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="default"
              autoCapitalize="none"
              icon={User}
              errorMessage={errors.fullName?.message}
              title="Full Name"
            />
          )}
        />
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Enter your address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              icon={MapPinHouse}
              errorMessage={errors.address?.message}
              title="Address"
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Enter your email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              icon={AtSign}
              errorMessage={errors.email?.message}
              title="Email"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Create a password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              icon={LockIcon}
              secureTextEntry
              errorMessage={errors.password?.message}
              title="Password"
            />
          )}
        />
        <Controller
          control={control}
          name="confirm_password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Confirm your password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              icon={LockIcon}
              secureTextEntry
              errorMessage={errors.confirm_password?.message}
              title="Confirm Password"
            />
          )}
        />
        {errors.root?.message && <ErrorMessage message={errors.root.message} />}
      </Box>
      <Button
        onPress={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
        disabled={!isValid || isSubmitting}
        variant={!isValid ? 'disabled' : 'primary'}>
        <Text color="mainBackground" variant="body">
          Continue
        </Text>
      </Button>
    </Box>
  );
}
