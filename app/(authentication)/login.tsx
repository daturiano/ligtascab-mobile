import Box from '@/src/components/ui/Box';
import BrandName from '@/src/components/ui/BrandName';
import Button from '@/src/components/ui/Button';
import Container from '@/src/components/ui/Container';
import Input from '@/src/components/ui/Input';
import Text from '@/src/components/ui/Text';
import { Link } from 'expo-router';
import { LockIcon, PhoneIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container
        style={{ justifyContent: 'center', alignItems: 'flex-start', gap: 24, marginBottom: 50 }}>
        <BrandName style={{ justifyContent: 'center' }} />
        <Box alignItems="center" width={'100%'}>
          <Text variant="header" color="secondary">
            Welcome Back!
          </Text>
          <Text variant="description">Sign in to start your ligtascab journey.</Text>
        </Box>
        <Box width={'100%'} gap="s">
          <Input
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            keyboardType="number-pad"
            autoCapitalize={'none'}
            icon={PhoneIcon}
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            autoCapitalize={'none'}
            icon={LockIcon}
          />
        </Box>
        <Button
          // onPress={() => signInWithPhoneNumber(phoneNumber, password)}
          disabled={!phoneNumber || !password}
          variant={!phoneNumber || !password ? 'disabled' : 'primary'}>
          <Text color="mainBackground" variant="body">
            Sign in
          </Text>
        </Button>
        <Box flexDirection="row" alignItems="center" justifyContent="center" width={'100%'} gap="s">
          <Text variant="description">Don&apos;t have an account?</Text>
          <Link href={'/(authentication)/sign-up'}>
            <Text color="primary" fontWeight={400} fontSize={16}>
              Sign Up
            </Text>
          </Link>
        </Box>
      </Container>
    </TouchableWithoutFeedback>
  );
}
