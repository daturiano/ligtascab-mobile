import React from 'react';
import Box from '../Box';
import Text from '../Text';
import { InfoIcon } from 'lucide-react-native';

export default function ReportMsg() {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      backgroundColor="primaryLighter"
      borderRadius="m"
      paddingHorizontal="xl"
      gap="m"
      paddingVertical="xl">
      <Box flexDirection="row" alignItems="center" gap="s">
        <InfoIcon size={20} color="#1FAB89" />
      </Box>
      <Text flexShrink={1} color="primaryDark" lineHeight={18}>
        Your report will be reviewed within 24-48 hours. You&apos;ll receive a ticket number for
        tracking.
      </Text>
    </Box>
  );
}
