import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Container from '@/src/components/ui/Container';
import Input from '@/src/components/ui/Input';
import Text from '@/src/components/ui/Text';
import { resetPassword } from '@/src/services/authentication';
import { useRouter } from 'expo-router';
import { ChevronLeft, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Check your email',
        'We have sent a password reset link to your email address.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container style={{ paddingHorizontal: 0 }}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16 }}
        style={{ width: '100%' }}>
        <Box flex={1} gap="l" justifyContent="center">
          <Box gap="s">
            <Text variant="header">Forgot Password?</Text>
          <Text variant="body" color="muted">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </Text>
        </Box>

        <Input
          icon={Mail}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Button
          variant="primary"
          onPress={handleResetPassword}
          isLoading={isLoading}
          disabled={isLoading || !email}>
          <Text color="white" variant="bodyBold">
            Send Reset Link
          </Text>
        </Button>
        </Box>
      </KeyboardAwareScrollView>
    </Container>
  );
}
