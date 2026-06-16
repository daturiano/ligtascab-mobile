import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Text from '@/src/components/ui/Text';
import { PickupRequestWithParties } from '@/src/types';
import { CarFront, Clock, Phone, UserCircle } from 'lucide-react-native';
import { Linking } from 'react-native';

type DriverAcceptedCardProps = {
  pickup: PickupRequestWithParties;
};

export default function DriverAcceptedCard({ pickup }: DriverAcceptedCardProps) {
  const driver = pickup.driver;
  const tricycle = pickup.tricycle;
  const phone = driver?.phone_number;

  const handleCall = () => {
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  return (
    <Card gap="m">
      <Box flexDirection="row" alignItems="center" gap="s">
        <UserCircle color="#1FAB89" size={20} />
        <Text variant="bodyBold">Your driver is on the way</Text>
      </Box>

      <Box gap="xs">
        <Box flexDirection="row" justifyContent="space-between">
          <Text variant="details">Driver</Text>
          <Text variant="body">{driver ? `${driver.first_name} ${driver.last_name}` : '—'}</Text>
        </Box>
        {tricycle ? (
          <Box flexDirection="row" justifyContent="space-between">
            <Box flexDirection="row" alignItems="center" gap="xs">
              <CarFront color="#737373" size={14} />
              <Text variant="details">Tricycle</Text>
            </Box>
            <Text variant="body">{tricycle.plate_number ?? '—'}</Text>
          </Box>
        ) : null}
        <Box flexDirection="row" justifyContent="space-between">
          <Box flexDirection="row" alignItems="center" gap="xs">
            <Clock color="#737373" size={14} />
            <Text variant="details">ETA</Text>
          </Box>
          <Text variant="body">~{pickup.estimated_duration_min} min</Text>
        </Box>
      </Box>

      {phone ? (
        <Button variant="outline" onPress={handleCall}>
          <Box flexDirection="row" alignItems="center" gap="s">
            <Phone color="#0a0a0a" size={16} />
            <Text variant="bodyBold">Call Driver</Text>
          </Box>
        </Button>
      ) : null}
    </Card>
  );
}
