import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Container from '@/src/components/ui/Container';
import Input from '@/src/components/ui/Input';
import Text from '@/src/components/ui/Text';
import { updatePassword } from '@/src/services/authentication';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, LockIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Alert } from 'react-native';

export default function UpdatePassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters.');
        return;
    }

    setIsLoading(true);
    try {
      await updatePassword(password);
      Alert.alert(
        'Success',
        'Your password has been updated. Please sign in with your new password.',
        [{ text: 'OK', onPress: () => router.replace('/(authentication)/login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Box flex={1} gap="l" justifyContent="center">
        <Box gap="s">
          <Text variant="header">Reset Password</Text>
          <Text variant="body" color="muted">
            Create a new password for your account.
          </Text>
        </Box>

        <Box gap="m">
            <Input
            icon={LockIcon}
            placeholder="New Password"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry={!isPasswordVisible}
            rightIcon={isPasswordVisible ? EyeOff : Eye}
            onRightIconPress={() => setIsPasswordVisible(!isPasswordVisible)}
            />

            <Input
            icon={LockIcon}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
            secureTextEntry={!isPasswordVisible}
            />
        </Box>

        <Button
          variant="primary"
          onPress={handleUpdatePassword}
          isLoading={isLoading}
          disabled={isLoading || !password || !confirmPassword}>
          <Text color="white" variant="bodyBold">
            Update Password
          </Text>
        </Button>
      </Box>
    </Container>
  );
}
