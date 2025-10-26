import { Report } from '@/src/types';
import { formatDate } from '@/src/utils/utils';
import { XIcon } from 'lucide-react-native';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Box from '../Box';
import Text from '../Text';

type ReportDetailsModalProps = {
  report: Report;
  isModalVisible: boolean;
  setIsModalVisible: (args: boolean) => void;
};

export default function ReportDetailsModal({
  report,
  isModalVisible,
  setIsModalVisible,
}: ReportDetailsModalProps) {
  function formatReportReason(reason: string): string {
    return reason
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

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
            <Text variant="title">Report Details</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <XIcon />
            </TouchableOpacity>
          </Box>
          <Box borderWidth={0.3} borderColor="mutedLighter" />
          <Box flex={1} flexDirection="column" gap="l">
            <InfoTextBox
              title="Date"
              content={`${formatDate(report.created_at.toLocaleString())}`}
            />
            <InfoTextBox title="Ticket Number" content={`${report.ticket_number}`} />
            <InfoTextBox title="Report Reason" content={`${formatReportReason(report.type)}`} />
            <InfoTextBox title="Description" content={`${report.description}`} />
          </Box>
          <Box borderWidth={0.3} borderColor="mutedLighter" />
          <Text textAlign="center" variant="description">
            Rides older than 7 days cannot be reported.
          </Text>
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
