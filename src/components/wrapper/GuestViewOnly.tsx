import { useAuth } from '@/src/context/AuthenticationContext';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import Container from '../ui/Container';
import { ActivityIndicator } from 'react-native';

export default function GuestViewOnly({ children }: { children: React.ReactNode }) {
  const { session, authChecked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authChecked && session !== null) {
      router.replace('/(private)/home');
    }
  }, [authChecked, session, router]);

  if (!authChecked || session) {
    return (
      <Container>
        <ActivityIndicator size="large" />
      </Container>
    );
  }

  return children;
}
