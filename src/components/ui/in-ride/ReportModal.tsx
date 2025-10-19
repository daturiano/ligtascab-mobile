import { XIcon } from 'lucide-react-native';
import {
  Keyboard,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import ReportForm from '../../forms/ReportForm';
import Box from '../Box';
import Text from '../Text';

type ReportModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (args: boolean) => void;
};

export default function ReportModal({ isModalVisible, setIsModalVisible }: ReportModalProps) {
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
              <Text variant="title">Report Issue</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <XIcon />
              </TouchableOpacity>
            </Box>
            <ReportForm />
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 600,
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
