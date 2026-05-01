import Box from '../Box';
import Text from '../Text';
import { useRideStore } from '@/src/store/useRideStore';
import { formatPHP } from '@/src/utils/pricing';

export default function FareBreakdown() {
  const { rideDetails } = useRideStore();
  const totalFare = rideDetails?.fare ? Number(rideDetails.fare) : 0;

  return (
    <Box
      gap="s"
      borderColor="grayLighter"
      borderLeftWidth={0}
      borderRightWidth={0}
      borderTopWidth={0}
      paddingTop="l"
      paddingBottom="l"
      borderWidth={1}>
      <Text variant="title" color="secondary">
        Fare Overview
      </Text>
      <Box flexDirection="column" gap="xs">
        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
          <Text variant="bodyBold" color="muted">
            Total Agreed Fare
          </Text>
          <Text variant="title" color="primary">
            {formatPHP(totalFare)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
