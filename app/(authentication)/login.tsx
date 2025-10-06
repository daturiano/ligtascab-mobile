import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import LoginForm from '@/src/components/forms/LoginForm';
import Box from '@/src/components/ui/Box';
import BrandName from '@/src/components/ui/BrandName';
import Container from '@/src/components/ui/Container';
import Text from '@/src/components/ui/Text';

export default function Login() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Container
            style={{
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: 24,
            }}>
            <BrandName />
            <Box width={'100%'} flex={1} justifyContent="center" gap="xl">
              <Box width="100%">
                <Text variant="header">Welcome Back!</Text>
                <Text variant="description">Sign in to start your ligtascab journey.</Text>
              </Box>
              <LoginForm />
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                width="100%"
                gap="s">
                <Text variant="description">Don’t have an account?</Text>
                <Link href="/(authentication)/sign-up" asChild>
                  <Text color="primary" fontWeight={500} fontSize={16}>
                    Sign Up
                  </Text>
                </Link>
              </Box>
            </Box>
          </Container>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
