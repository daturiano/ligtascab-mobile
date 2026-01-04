import { Terminal } from '@/src/types';
import Box from '../Box';
import Text from '../Text';
import { TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

type NearbyTerminalCardProps = {
  terminal: Terminal;
  onPressTerminal: (terminal: Terminal) => void;
};

const NearbyTerminalCard = ({ terminal, onPressTerminal }: NearbyTerminalCardProps) => {
  return (
    <TouchableOpacity onPress={() => onPressTerminal(terminal)}>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width={'100%'}
        backgroundColor="primary"
        paddingVertical="m"
        paddingHorizontal="l"
        borderRadius="l">
        <Box flexDirection="row" gap="m">
          <Image source={require('@/src/assets/motorbike.png')} style={{ width: 40, height: 40 }} />
          <Box flexDirection="column">
            <Text fontSize={18} fontWeight={500} color="white">
              {terminal.direction}
            </Text>
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default NearbyTerminalCard;
