import { Terminal } from '@/src/types';
import { XIcon } from 'lucide-react-native';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Box from '../Box';
import Text from '../Text';
import Button from '../Button';

type MarkerModalProps = {
  terminal: Terminal;
  isModalVisible: boolean;
  setIsModalVisible: (args: boolean) => void;
  handleGetDirections: () => void;
};

export default function MarkerModal({
  terminal,
  isModalVisible,
  setIsModalVisible,
  handleGetDirections,
}: MarkerModalProps) {
  return (
    <Modal visible={isModalVisible} transparent animationType="none" statusBarTranslucent>
      <Box flex={1} alignItems="center" justifyContent="center" backgroundColor="overlay">
        <Box
          style={styles.card}
          backgroundColor="white"
          flexDirection="column"
          gap="l"
          padding="xl">
          <Box flexDirection="row" justifyContent="space-between" width={'100%'}>
            <Text variant="title">Terminal Routes</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <XIcon />
            </TouchableOpacity>
          </Box>
          <Box borderWidth={0.3} borderColor="mutedLighter" />
          <Box flex={1} flexDirection="column" gap="l">
            {terminal.landmarks.map((landmark) => (
              <Text key={landmark}>{landmark}</Text>
            ))}
          </Box>
          <Box borderWidth={0.3} borderColor="mutedLighter" />
          <Button
            onPress={() => {
              handleGetDirections();
              setIsModalVisible(false);
            }}>
            <Text color="white" fontWeight={400}>
              Get Direction
            </Text>
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 400,
    width: '92%',
    maxWidth: 380,
    borderRadius: 10,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
});
