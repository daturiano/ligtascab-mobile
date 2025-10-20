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
    <Box flexDirection="column" justifyContent="space-between" flex={1}>
      <Box flexDirection="column" alignItems="center" gap="m" marginTop="l">
        <Image
          source={require('@/src/assets/report.png')}
          style={{
            width: 80,
            height: 80,
          }}
        />
        <Text variant="description" textAlign="center" fontSize={15}>
          Your report has been successfully submitted and is now being reviewed by our team.
        </Text>
      </Box>
      <Box alignItems="center" gap="s">
        <Text variant="description" color="mainForeground" fontSize={18}>
          Ticket Number
        </Text>
        <Box
          alignItems="center"
          flexDirection="row"
          justifyContent="center"
          gap="l"
          borderWidth={1}
          borderRadius="m"
          paddingVertical="m"
          width={'100%'}
          backgroundColor="grayLight"
          borderColor="mutedLighter">
          <Text fontSize={22} fontWeight={600} color="primary">
            {reportDetails.ticket_number}
          </Text>
          <CopyButton id={reportDetails.ticket_number} />
        </Box>
      </Box>
      <Box
        flexDirection="column"
        backgroundColor="primaryLighter"
        width={'100%'}
        borderRadius="m"
        gap="l"
        paddingVertical="l"
        paddingHorizontal="m">
        <Box flexDirection="row" alignItems="center" gap="s">
          <Box flexDirection="row" alignItems="center" gap="s">
            <BellIcon size={20} color="#1FAB89" />
          </Box>
          <Text flexShrink={1} color="primaryDark" lineHeight={18}>
            You&apos;ll receive notificions about updates.
          </Text>
        </Box>
        <Box flexDirection="row" gap="s">
          <Box flexDirection="row" alignItems="center" gap="s">
            <ClockIcon size={20} color="#1FAB89" />
          </Box>
          <Text flexShrink={1} color="primaryDark" lineHeight={18}>
            Review typically takes 24-48 hours.
          </Text>
        </Box>
      </Box>
      <Box gap="s">
        <Text fontSize={16} fontWeight={500}>
          What happens next?
        </Text>
        <Text variant="description" fontSize={15} lineHeight={24}>
          1. Our team will investigate your report{'\n'}
          2. We&apos;ll contact the driver if necessary{'\n'}
          3. You&apos;ll receive an update via notification{'\n'}
        </Text>
      </Box>
    </Box>
  );
}
