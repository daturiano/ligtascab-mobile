import Box from '@/src/components/ui/Box';
import Card from '@/src/components/ui/Card';
import Text from '@/src/components/ui/Text';
import { FareBreakdown, formatPHP } from '@/src/utils/pricing';
import { Clock, Coins, Route } from 'lucide-react-native';

type FareEstimateCardProps = {
  fare: FareBreakdown;
  durationMin: number;
  /** When false, the route was estimated via Haversine fallback — show an "approx." disclaimer. */
  isPrecise: boolean;
};

export default function FareEstimateCard({ fare, durationMin, isPrecise }: FareEstimateCardProps) {
  return (
    <Card gap="m">
      <Box flexDirection="row" alignItems="center" gap="s">
        <Coins color="#0a0a0a" size={18} />
        <Text variant="bodyBold">Fare Estimate</Text>
      </Box>

      <Box flexDirection="row" justifyContent="space-between">
        <Box flexDirection="row" alignItems="center" gap="xs">
          <Route color="#737373" size={14} />
          <Text variant="details">Distance</Text>
        </Box>
        <Text variant="body">
          {fare.distanceKm.toFixed(2)} km{!isPrecise ? ' (approx.)' : ''}
        </Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Box flexDirection="row" alignItems="center" gap="xs">
          <Clock color="#737373" size={14} />
          <Text variant="details">Estimated Time</Text>
        </Box>
        <Text variant="body">~{durationMin} min</Text>
      </Box>

      <Box height={1} backgroundColor="grayLighter" marginVertical="xs" />

      <Box flexDirection="row" justifyContent="space-between">
        <Text variant="details">Base Fare</Text>
        <Text variant="body">{formatPHP(fare.baseFare)}</Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text variant="details">Distance · {formatPHP(fare.ratePerKm)}/km</Text>
        <Text variant="body">{formatPHP(fare.distanceCost)}</Text>
      </Box>

      <Box height={1} backgroundColor="grayLighter" marginVertical="xs" />

      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text variant="bodyBold">Total</Text>
        <Text variant="title">{formatPHP(fare.total)}</Text>
      </Box>
    </Card>
  );
}
