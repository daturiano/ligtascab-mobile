import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Container from '@/src/components/ui/Container';
import Text from '@/src/components/ui/Text';
import { useAuth } from '@/src/context/AuthenticationContext';
import { fetchDriverActiveShift } from '@/src/services/driver';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ArrowLeft, CarFront, Clock } from 'lucide-react-native';
import { ScrollView, TouchableOpacity } from 'react-native';

export default function ActiveShiftScreen() {
  const { driver } = useAuth();
  const router = useRouter();
  const driverId = driver?.id;

  const { data: shift, isLoading } = useQuery({
    queryKey: ['driver-active-shift', driverId],
    queryFn: async () => {
      if (!driverId) return null;
      const { data } = await fetchDriverActiveShift(driverId);
      return data;
    },
    enabled: !!driverId,
  });

  return (
    <Container style={{ paddingHorizontal: 0, paddingBottom: 0 }}>
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
          gap: 16,
        }}>
        <Box flexDirection="row" alignItems="center" gap="m">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="#0a0a0a" size={24} />
          </TouchableOpacity>
          <Text variant="title">Today’s Shift</Text>
        </Box>

        {isLoading ? (
          <Card>
            <Text variant="description">Loading shift…</Text>
          </Card>
        ) : !shift ? (
          <Card>
            <Text variant="bodyBold">No shift today</Text>
            <Text variant="description">
              Your operator hasn’t assigned you a shift for today yet. Once they do, you’ll be able
              to accept pickup jobs.
            </Text>
            <Button variant="outline" marginTop="m" onPress={() => router.back()}>
              <Text variant="bodyBold">Back to Dashboard</Text>
            </Button>
          </Card>
        ) : (
          <>
            <Card>
              <Box flexDirection="row" alignItems="center" gap="s" marginBottom="s">
                <Clock color="#1FAB89" size={18} />
                <Text variant="bodyBold">Shift active</Text>
              </Box>
              <Text variant="description">
                Created at{' '}
                {new Date(shift.created_at).toLocaleTimeString('en-PH', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              {shift.shift_type ? (
                <Text variant="details" marginTop="xs">
                  Type: {shift.shift_type}
                </Text>
              ) : null}
            </Card>

            <Card>
              <Box flexDirection="row" alignItems="center" gap="s" marginBottom="s">
                <CarFront color="#0a0a0a" size={18} />
                <Text variant="bodyBold">Assigned Tricycle</Text>
              </Box>
              <Box gap="xs">
                <Box flexDirection="row" justifyContent="space-between">
                  <Text variant="details">Plate Number</Text>
                  <Text variant="body">
                    {shift.plate_number ?? shift.tricycle?.plate_number ?? '—'}
                  </Text>
                </Box>
                {shift.tricycle?.tricycle_details?.model ? (
                  <Box flexDirection="row" justifyContent="space-between">
                    <Text variant="details">Model</Text>
                    <Text variant="body">{shift.tricycle.tricycle_details.model}</Text>
                  </Box>
                ) : null}
                {shift.tricycle?.tricycle_details?.body_number ? (
                  <Box flexDirection="row" justifyContent="space-between">
                    <Text variant="details">Body No.</Text>
                    <Text variant="body">{shift.tricycle.tricycle_details.body_number}</Text>
                  </Box>
                ) : null}
              </Box>
            </Card>

            {shift.shift_description ? (
              <Card>
                <Text variant="bodyBold" marginBottom="s">
                  Notes from your operator
                </Text>
                <Text variant="body">{shift.shift_description}</Text>
              </Card>
            ) : null}
          </>
        )}
      </ScrollView>
    </Container>
  );
}
