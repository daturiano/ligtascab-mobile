import { useRideStore } from '@/src/store/useRideStore';
import { Report, Ride } from '@/src/types';
import { XIcon } from 'lucide-react-native';
import { useState } from 'react';
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import ReportForm from '../../forms/ReportForm';
import Box from '../Box';
import Text from '../Text';
import ReportTicketNumber from './ReportTicketNumber';

type ReportModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (args: boolean) => void;
  ride?: Ride;
};

export default function ReportModal({ isModalVisible, setIsModalVisible, ride }: ReportModalProps) {
  const { rideDetails, setReportDetails, reportDetails } = useRideStore();
  const [localReportDetails, setLocalReportDetails] = useState<Report | null>(null);

  const activeRide = ride || rideDetails;

  const handleReportSubmitted = (report: Report | null) => {
    setLocalReportDetails(report);
    if (report) {
      setReportDetails(report);
    }
  };

  if (!activeRide) return null;

  const submittedReport = localReportDetails || reportDetails;

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsModalVisible(false)}>
      <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
        <Box
          flex={1}
          justifyContent="center"
          alignItems="center"
          backgroundColor="overlay"
          padding="m">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ width: '100%', alignItems: 'center' }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Box
                backgroundColor="white"
                borderRadius="l"
                padding="xl"
                gap="l"
                width="100%"
                maxWidth={380}
                style={styles.card}>
                <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Text variant="title">
                    {submittedReport ? 'Report Submitted' : 'Report Issue'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsModalVisible(false)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <XIcon size={24} color="#000" />
                  </TouchableOpacity>
                </Box>

                {submittedReport ? (
                  <ReportTicketNumber reportDetails={submittedReport} />
                ) : (
                  <ReportForm rideDetails={activeRide} setReportDetails={handleReportSubmitted} />
                )}
              </Box>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Box>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
