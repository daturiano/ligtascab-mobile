import AccountSetupForm from '@/src/components/forms/AccountSetupForm';
import Box from '@/src/components/ui/Box';
import BrandName from '@/src/components/ui/BrandName';
import Container from '@/src/components/ui/Container';
import Text from '@/src/components/ui/Text';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

export default function AccountSetupPage() {
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
            <Box width={'100%'} flex={1} flexDirection="column" gap="xl">
              <Box width="100%">
                <Text variant="subheader">Almost there!</Text>
                <Text variant="description">Complete your profile to finish signing up.</Text>
              </Box>
              <AccountSetupForm />
            </Box>
          </Container>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
