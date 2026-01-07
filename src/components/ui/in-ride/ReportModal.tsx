import { useRideStore } from '@/src/store/useRideStore';
import { Report } from '@/src/types';
import { XIcon } from 'lucide-react-native';
import { useState } from 'react';
import {
  Keyboard,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import ReportForm from '../../forms/ReportForm';
import Box from '../Box';
import Text from '../Text';
import ReportTicketNumber from './ReportTicketNumber';

type ReportModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (args: boolean) => void;
};

export default function ReportModal({ isModalVisible, setIsModalVisible }: ReportModalProps) {
  const { rideDetails, setReportDetails, reportDetails } = useRideStore();
  const [localReportDetails, setLocalReportDetails] = useState<Report | null>(null);

  const handleReportSubmitted = (report: Report | null) => {
    // Set local state first to immediately show success screen
    setLocalReportDetails(report);
    // Then persist to store
    if (report) {
      setReportDetails(report);
    }
  };

  if (!rideDetails) return null;

  const submittedReport = localReportDetails || reportDetails;

  return (
    <Modal visible={isModalVisible} transparent animationType="none" statusBarTranslucent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Box
          flex={1}
          alignItems="center"
          justifyContent="center"
          backgroundColor="overlay"
          paddingHorizontal="l">
          <Box
            backgroundColor="white"
            borderRadius="l"
            flexDirection="column"
            gap="l"
            padding="xl"
            width="100%"
            maxWidth={380}
            style={{
              elevation: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 10,
            }}>
            <Box flexDirection="row" justifyContent="space-between">
              <Text variant="title">{submittedReport ? 'Report Submitted' : 'Report Issue'}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <XIcon />
              </TouchableOpacity>
            </Box>
            {submittedReport ? (
              <ReportTicketNumber reportDetails={submittedReport} />
            ) : (
              <ReportForm rideDetails={rideDetails} setReportDetails={handleReportSubmitted} />
            )}
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
