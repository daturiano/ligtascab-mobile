import Box from '../Box';
import Text from '../Text';

export default function FareBreakdown() {
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
        Fare Breakdown
      </Text>
      <Box flexDirection="column" gap="xs">
        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
          <Text variant="description" fontSize={14} fontWeight={500}>
            Base Fare
          </Text>
          <Text variant="description" fontSize={14} fontWeight={500}>
            ₱15.00
          </Text>
        </Box>
        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
          <Text variant="description" fontSize={14} fontWeight={500}>
            Per Exceeding Kilometer
          </Text>
          <Text variant="description" fontSize={14} fontWeight={500}>
            +₱5.00
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
