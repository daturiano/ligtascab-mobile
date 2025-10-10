import { Ellipsis } from 'lucide-react-native';
import Box from '../Box';
import Text from '../Text';
import { Image } from 'expo-image';

export default function RecentRides() {
  return (
    <Box
      flex={1}
      flexGrow={1}
      borderRadius="m"
      backgroundColor="white"
      flexDirection="column"
      padding="l"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}>
      <Box justifyContent="space-between" flexDirection="row" alignItems="center">
        <Box>
          <Text fontWeight={500} fontSize={14}>
            Recent Rides
          </Text>
        </Box>
        <Ellipsis />
      </Box>
      <Box flexGrow={1} alignItems="center" justifyContent="center">
        <Image style={{ width: 140, height: 140 }} source={require('@/src/assets/empty.png')} />
        <Text>You have no recent rides.</Text>
      </Box>
    </Box>
  );
}
