import { Terminal } from '@/src/types';
import Box from '../Box';
import Text from '../Text';
import { TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/src/theme/theme';

type NearbyTerminalCardProps = {
  terminal: Terminal;
  onPressTerminal: (terminal: Terminal) => void;
};

const NearbyTerminalCard = ({ terminal, onPressTerminal }: NearbyTerminalCardProps) => {
  const theme = useTheme<Theme>();
  return (
    <TouchableOpacity onPress={() => onPressTerminal(terminal)}>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        padding="m"
        backgroundColor="cardBackground"
        borderRadius="l"
        shadowColor="shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={3}>
        <Box flexDirection="row" gap="m" alignItems="center">
          <Box
            backgroundColor="primaryLight"
            padding="s"
            borderRadius="rounded"
            alignItems="center"
            justifyContent="center">
            <Image
              source={require('@/src/assets/motorbike.png')}
              style={{ width: 32, height: 32 }}
            />
          </Box>
          <Box flexDirection="column">
            <Text variant="bodyBold" numberOfLines={1}>
              {terminal.direction}
            </Text>
            <Text variant="details">Tricycle Terminal</Text>
          </Box>
        </Box>
        <ChevronRight size={24} color={theme.colors.muted} />
      </Box>
    </TouchableOpacity>
  );
};

export default NearbyTerminalCard;
