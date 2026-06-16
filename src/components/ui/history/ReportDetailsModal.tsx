import { Report } from '@/src/types';
import { formatDate } from '@/src/utils/utils';
import { XIcon } from 'lucide-react-native';
import { Modal, TouchableOpacity } from 'react-native';
import Box from '../Box';
import Text from '../Text';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();
  function formatReportReason(reason: string): string {
    return reason
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <Modal visible={isModalVisible} transparent animationType="none" statusBarTranslucent>
      <Box
        flex={1}
        alignItems="center"
        justifyContent="center"
        backgroundColor="overlay"
        paddingHorizontal="l"
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}>
        <Box
          backgroundColor="white"
          borderRadius="l"
          flexDirection="column"
          gap="l"
          padding="xl"
          width="100%"
          maxWidth={380}
          height={400}
          style={{
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
          }}>
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
            <InfoTextBox title="Status" content={`${report.report_status}`} />
            <InfoTextBox title="Ticket Number" content={`${report.ticket_number}`} />
            <InfoTextBox title="Report Reason" content={`${formatReportReason(report.type)}`} />
            <InfoTextBox title="Description" content={`${report.description}`} />
          </Box>
          <Box borderWidth={0.3} borderColor="mutedLighter" />
          <Text textAlign="center" variant="description">
            Reports can be resolved in the PSO Office
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
    <Text variant="bodyBold">{content}</Text>
  </Box>
);
