import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import ErrorMessage from '@/src/components/ui/ErrorMessage';
import Input from '@/src/components/ui/Input';
import Text from '@/src/components/ui/Text';
import { AccountSetupSchema } from '@/src/schemas';
import { registerWithCredentials, signOut } from '@/src/services/authentication';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AtSign, Eye, EyeOff, LockIcon, MapPinHouse, Phone, User } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Alert } from 'react-native';
import { useState } from 'react';

export default function AccountSetupForm() {
  const router = useRouter();
  const { mobileNumber } = useLocalSearchParams();

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
      contact_person: '',
      contact_person_number: '',
      password: '',
      confirm_password: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: z.infer<typeof AccountSetupSchema>) => {
    try {
      const user = await registerWithCredentials(data);
      if (user) {
        await signOut();
        Alert.alert(
            "Account Created!",
            "Welcome to LigtasCab! Please check your email to verify your account. Please log in to continue.",
            [{ text: "OK", onPress: () => router.replace('/(authentication)/login') }]
        );
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError('root', {
        type: 'manual',
        message: err.message ?? 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <Box width="100%" gap="l" flexGrow={1} flexDirection="column" justifyContent="space-between">
      <Box gap="l">
        {/* Personal Information Section */}
        <Box gap="m">
          <Text variant="title">Personal Information</Text>
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
                autoCapitalize="words"
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
                autoCapitalize="words"
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
        </Box>

        {/* Emergency Contact Section */}
        <Box gap="m">
          <Text variant="title">Emergency Contact</Text>
          <Controller
            control={control}
            name="contact_person"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Enter emergency contact name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                icon={User}
                errorMessage={errors.contact_person?.message}
                title="Emergency Contact Person"
              />
            )}
          />
          <Controller
            control={control}
            name="contact_person_number"
            render={({ field: { onChange, onBlur, value } }) => (
              <Box gap="s">
                <Text variant="bodyBold">Emergency Contact Number</Text>
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
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      maxLength={10}
                      keyboardType="phone-pad"
                      icon={Phone}
                      errorMessage={errors.contact_person_number?.message}
                    />
                  </Box>
                </Box>
                {errors.contact_person_number?.message && (
                  <ErrorMessage message={errors.contact_person_number?.message} />
                )}
              </Box>
            )}
          />
        </Box>

        {/* Security Section */}
        <Box gap="m">
          <Text variant="title">Security</Text>
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
                secureTextEntry={!isPasswordVisible}
                errorMessage={errors.password?.message}
                title="Password"
                rightIcon={isPasswordVisible ? EyeOff : Eye}
                onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
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
                secureTextEntry={!isPasswordVisible}
                errorMessage={errors.confirm_password?.message}
                title="Confirm Password"
              />
            )}
          />
        </Box>
        {errors.root?.message && <ErrorMessage message={errors.root.message} />}
      </Box>
      <Button
        onPress={handleSubmit(onSubmit, (errors) => {
            const messages = Object.values(errors).map((e: any) => e.message).join('\n');
            Alert.alert("Please check the following:", messages);
        })}
        isLoading={isSubmitting}
        disabled={isSubmitting}
        variant="primary">
        <Text color="mainBackground" variant="body">
          Continue
        </Text>
      </Button>
    </Box>
  );
}
