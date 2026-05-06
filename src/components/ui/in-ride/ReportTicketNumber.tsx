import { Image } from 'expo-image';
import { BellIcon, ClockIcon } from 'lucide-react-native';
import Box from '../Box';
import Text from '../Text';
import CopyButton from './CopyButton';
import { Report } from '@/src/types';

type ReportTicketNumberProps = {
  reportDetails: Report;
};

export default function ReportTicketNumber({ reportDetails }: ReportTicketNumberProps) {
  return (
    <Box flexDirection="column" gap="l" width="100%">
      <Box flexDirection="column" alignItems="center" gap="m" marginTop="m">
        <Image
          source={require('@/src/assets/report.png')}
          style={{
            width: 80,
            height: 80,
          }}
        />
        <Text variant="description" textAlign="center">
          Your report has been successfully submitted and is now being reviewed by our team.
        </Text>
      </Box>

      <Box alignItems="center" gap="s" width="100%">
        <Text variant="title" color="mainForeground" fontSize={18}>
          Ticket Number
        </Text>
        <Box
          alignItems="center"
          flexDirection="row"
          justifyContent="center"
          gap="m"
          borderWidth={1}
          borderRadius="m"
          paddingVertical="m"
          width="100%"
          backgroundColor="grayLight"
          borderColor="mutedLighter">
          <Text variant="title" color="primary">
            {reportDetails.ticket_number}
          </Text>
          <CopyButton id={reportDetails.ticket_number} />
        </Box>
      </Box>

      <Box
        flexDirection="column"
        backgroundColor="primaryLighter"
        width="100%"
        borderRadius="m"
        gap="m"
        padding="m">
        <Box flexDirection="row" alignItems="center" gap="s">
          <BellIcon size={20} color="#1FAB89" />
          <Text flexShrink={1} color="primaryDark" lineHeight={20}>
            You will receive notifications about updates.
          </Text>
        </Box>
        <Box flexDirection="row" alignItems="center" gap="s">
          <ClockIcon size={20} color="#1FAB89" />
          <Text flexShrink={1} color="primaryDark" lineHeight={20}>
            Review typically takes 24-48 hours.
          </Text>
        </Box>
      </Box>

      <Box gap="xs">
        <Text variant="bodyBold">What happens next?</Text>
        <Box gap="xs" paddingLeft="s">
          <Text variant="description" lineHeight={22}>• Our team will investigate your report</Text>
          <Text variant="description" lineHeight={22}>• We will contact the driver if necessary</Text>
          <Text variant="description" lineHeight={22}>• You will receive an update via notification</Text>
        </Box>
      </Box>
    </Box>
  );
}
