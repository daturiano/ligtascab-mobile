import { ShieldQuestion } from 'lucide-react-native';
import Box from '../Box';
import Text from '../Text';

export default function SafetyTip() {
  return (
    <Box
      flexDirection="column"
      alignItems="center"
      backgroundColor="primaryLight"
      borderRadius="m"
      marginBottom="l"
      paddingHorizontal="xl"
      gap="m"
      paddingVertical="xl">
      <Box gap="s">
        <Box flexDirection="row" alignItems="center" gap="s">
          <ShieldQuestion size={20} color="#1FAB89" />
          <Text fontSize={16} fontWeight={600} color="primary">
            Safety Tip
          </Text>
        </Box>
        <Text flexShrink={1} color="description">
          Always double-check the body number on the app with the physical tricycle before boarding.
        </Text>
      </Box>
    </Box>
  );
}
