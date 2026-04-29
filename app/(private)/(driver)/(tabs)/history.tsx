import Box from '@/src/components/ui/Box';
import Card from '@/src/components/ui/Card';
import Container from '@/src/components/ui/Container';
import Text from '@/src/components/ui/Text';
import { useAuth } from '@/src/context/AuthenticationContext';
import { fetchDriverShiftHistory } from '@/src/services/driver';
import { ShiftWithTricycle } from '@/src/types';
import { useQuery } from '@tanstack/react-query';
import { CarFront, Clock } from 'lucide-react-native';
import { ActivityIndicator, FlatList } from 'react-native';

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const shiftDuration = (shift: ShiftWithTricycle) => {
  if (!shift.end_time) return 'Ongoing';
  const ms = new Date(shift.end_time).getTime() - new Date(shift.start_time).getTime();
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export default function DriverHistory() {
  const { driver } = useAuth();
  const driverId = driver?.id;

  const { data: shifts, isLoading } = useQuery({
    queryKey: ['driver-shift-history', driverId],
    queryFn: async () => {
      if (!driverId) return [];
      const { data } = await fetchDriverShiftHistory(driverId);
      return data;
    },
    enabled: !!driverId,
  });

  return (
    <Container style={{ paddingHorizontal: 0, paddingBottom: 0 }}>
      <Box width="100%" paddingHorizontal="l" paddingTop="l" gap="xs">
        <Text variant="title">History</Text>
        <Text variant="description">All your past shifts and assigned tricycles.</Text>
      </Box>

      {isLoading ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" />
        </Box>
      ) : !shifts || shifts.length === 0 ? (
        <Box flex={1} justifyContent="center" alignItems="center" paddingHorizontal="l">
          <Text variant="bodyBold">No shifts yet</Text>
          <Text variant="description">
            Once you complete your first shift, it will show up here.
          </Text>
        </Box>
      ) : (
        <FlatList
          data={shifts}
          keyExtractor={(item) => item.id}
          style={{ width: '100%' }}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }) => (
            <Card>
              <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start">
                <Box gap="xs" flex={1}>
                  <Box flexDirection="row" alignItems="center" gap="s">
                    <CarFront color="#0a0a0a" size={16} />
                    <Text variant="bodyBold">
                      {item.tricycle?.plate_number ?? 'Tricycle'}
                    </Text>
                  </Box>
                  {item.tricycle?.tricycle_details?.model ? (
                    <Text variant="details">
                      {item.tricycle.tricycle_details.model}
                      {item.tricycle.tricycle_details.year
                        ? ` · ${item.tricycle.tricycle_details.year}`
                        : ''}
                    </Text>
                  ) : null}
                  <Text variant="details">{formatDateTime(item.start_time)}</Text>
                </Box>
                <Box alignItems="flex-end" gap="xs">
                  <Box flexDirection="row" alignItems="center" gap="xs">
                    <Clock color="#737373" size={14} />
                    <Text variant="details">{shiftDuration(item)}</Text>
                  </Box>
                  {item.end_time ? (
                    <Box
                      backgroundColor="grayLighter"
                      paddingHorizontal="s"
                      paddingVertical="xs"
                      borderRadius="rounded">
                      <Text variant="details">Closed</Text>
                    </Box>
                  ) : (
                    <Box
                      backgroundColor="primaryLighter"
                      paddingHorizontal="s"
                      paddingVertical="xs"
                      borderRadius="rounded">
                      <Text variant="details" color="primaryDark" fontWeight="600">
                        Active
                      </Text>
                    </Box>
                  )}
                </Box>
              </Box>
            </Card>
          )}
        />
      )}
    </Container>
  );
}
