import { XIcon } from 'lucide-react-native';
import {
  Keyboard,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Box from '../Box';
import Text from '../Text';

type EmergencyModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (args: boolean) => void;
};

export default function EmergencyModal({ isModalVisible, setIsModalVisible }: EmergencyModalProps) {
  return (
    <Modal visible={isModalVisible} transparent animationType="none" statusBarTranslucent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Box flex={1} alignItems="center" justifyContent="center" backgroundColor="overlay">
          <Box
            style={styles.card}
            backgroundColor="white"
            flexDirection="column"
            gap="l"
            padding="xl">
            <Box flexDirection="row" justifyContent="space-between">
              <Text variant="title">Emergency Assistance</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <XIcon />
              </TouchableOpacity>
            </Box>
            <Text variant="description">
              Once you call for assistance your location and vehicle details will be automatically
              shared.
            </Text>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 500,
    width: '92%',
    maxWidth: 380,
    borderRadius: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
});
