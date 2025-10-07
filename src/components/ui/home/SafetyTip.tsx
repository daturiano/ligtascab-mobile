import { ShieldQuestion } from 'lucide-react-native';
import Box from '../Box';
import Text from '../Text';

export default function SafetyTip() {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      backgroundColor="primaryLight"
      borderRadius="m"
      paddingHorizontal="l"
      gap="m"
      paddingVertical="xl">
      <ShieldQuestion size={28} color="#189375" />
      <Text flexShrink={1} color="primaryDark">
        Always double-check the body number on the app with the physical tricycle before boarding.
      </Text>
    </Box>
  );
}
