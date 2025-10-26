import { Report } from '@/src/types';
import { TriangleAlert } from 'lucide-react-native';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Box from '../Box';
import Text from '../Text';
import ReportDetailsModal from './ReportDetailsModal';

export default function ReportDetailsCard({ report }: { report: Report }) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  function formatReportReason(reason: string): string {
    return reason
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          width={'100%'}
          gap="m"
          backgroundColor="primaryLighter"
          paddingVertical="xl"
          paddingHorizontal="l"
          borderRadius="l">
          <Box flexDirection="row" alignItems="center" gap="m">
            <Box
              style={{ width: 40, height: 40, borderRadius: '50%' }}
              backgroundColor="warningLight"
              flexDirection="row"
              alignItems="center"
              justifyContent="center">
              <TriangleAlert size={20} color={'#ffffff'} />
            </Box>
            <Box flexDirection="column">
              <Text variant="body" color="mainForeground" fontWeight={400}>
                {formatReportReason(report.type)}
              </Text>
              <Text color="muted" fontSize={14}>
                Ticket: {report.ticket_number}
              </Text>
            </Box>
          </Box>
          <Box
            flexDirection="column"
            paddingVertical="xs"
            paddingHorizontal="s"
            borderRadius="s"
            backgroundColor={report.report_status === 'Pending' ? 'secondaryLighter' : 'primary'}>
            <Text
              fontSize={12}
              fontWeight={500}
              color={report.report_status === 'Pending' ? 'secondary' : 'mainBackground'}>
              {report.report_status}
            </Text>
          </Box>
        </Box>
      </TouchableOpacity>
      {isModalVisible && (
        <ReportDetailsModal isModalVisible setIsModalVisible={setIsModalVisible} report={report} />
      )}
    </>
  );
}
