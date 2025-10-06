import AccountSetupForm from '@/src/components/forms/AccountSetupForm';
import Box from '@/src/components/ui/Box';
import BrandName from '@/src/components/ui/BrandName';
import KeyboardAvoidingContainer from '@/src/components/ui/KeyboardAvoidingContainer';
import Text from '@/src/components/ui/Text';

export default function AccountSetupPage() {
  return (
    <KeyboardAvoidingContainer scrollable>
      <BrandName />
      <Box width={'100%'} flex={1} flexDirection="column" gap="xl">
        <Box width="100%">
          <Text variant="subheader">Almost there!</Text>
          <Text variant="description">Complete your profile to finish signing up.</Text>
        </Box>
        <AccountSetupForm />
      </Box>
    </KeyboardAvoidingContainer>
  );
}
