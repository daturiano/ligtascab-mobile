import { Terminal } from '@/src/types';
import { XIcon } from 'lucide-react-native';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Box from '../Box';
import Text from '../Text';

type MarkerModalProps = {
  terminal: Terminal;
  showMarkerModal: boolean;
  setShowMarkerModal: (args: boolean) => void;
};

export default function MarkerModal({
  terminal,
  showMarkerModal,
  setShowMarkerModal,
}: MarkerModalProps) {
  return (
    <Modal visible={showMarkerModal} transparent animationType="none" statusBarTranslucent>
      <Box flex={1} alignItems="center" justifyContent="center" backgroundColor="overlay">
        <Box
          style={styles.card}
          backgroundColor="white"
          flexDirection="column"
          gap="l"
          padding="xl">
          <Box flexDirection="row" justifyContent="space-between" width={'100%'}>
            <Text variant="title">Terminal Routes</Text>
            <TouchableOpacity onPress={() => setShowMarkerModal(false)}>
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
        </Box>
      </Box>
    </Modal>
  );
}

const InfoTextBox = ({ title, content }: { title: string; content: string }) => (
  <Box flexDirection="row" justifyContent="space-between" alignItems="center">
    <Text variant="body" color="muted">
      {title}
    </Text>
    <Text variant="body">{content}</Text>
  </Box>
);

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
