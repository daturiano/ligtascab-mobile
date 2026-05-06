import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Container from './Container';

type KeyboardAvoidingContainerProps = {
  children: React.ReactNode;
  scrollable?: boolean;
};

export default function KeyboardAvoidingContainer({
  children,
  scrollable = true,
}: KeyboardAvoidingContainerProps) {
  const content = <Container style={{ gap: 24 }}>{children}</Container>;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </KeyboardAvoidingView>
  );
}
