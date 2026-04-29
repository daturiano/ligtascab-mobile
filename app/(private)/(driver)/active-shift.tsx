import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Container from '@/src/components/ui/Container';
import Text from '@/src/components/ui/Text';
import { useAuth } from '@/src/context/AuthenticationContext';
import { endShift, fetchDriverActiveShift } from '@/src/services/driver';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ArrowLeft, CarFront, Clock, Square } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';

const formatElapsed = (startIso: string) => {
  const ms = Date.now() - new Date(startIso).getTime();
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function ActiveShiftScreen() {
  const { driver } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const driverId = driver?.id;
  const [, forceTick] = useState(0);

  const { data: shift, isLoading } = useQuery({
    queryKey: ['driver-active-shift', driverId],
    queryFn: async () => {
      if (!driverId) return null;
      const { data } = await fetchDriverActiveShift(driverId);
      return data;
    },
    enabled: !!driverId,
  });

  // Tick the elapsed timer once per second while a shift is active.
  useEffect(() => {
    if (!shift) return;
    const id = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [shift]);

  const endMutation = useMutation({
    mutationFn: async () => {
      if (!shift || !driverId) throw new Error('No active shift to end');
      const { data, error } = await endShift(shift.id, driverId);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-active-shift', driverId] });
      queryClient.invalidateQueries({ queryKey: ['driver-shift-history', driverId] });
      queryClient.invalidateQueries({ queryKey: ['driver-earnings', driverId] });
      router.back();
    },
    onError: (err: any) => {
      Alert.alert('Could not end shift', err.message ?? 'Please try again.');
    },
  });

  const confirmEnd = () => {
    Alert.alert('End Shift?', 'This will close your current shift.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End Shift', style: 'destructive', onPress: () => endMutation.mutate() },
    ]);
  };

  return (
    <Container style={{ paddingHorizontal: 0, paddingBottom: 0 }}>
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 16 }}>
        <Box flexDirection="row" alignItems="center" gap="m">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="#0a0a0a" size={24} />
          </TouchableOpacity>
          <Text variant="title">Active Shift</Text>
        </Box>

        {isLoading ? (
          <Card>
            <Text variant="description">Loading shift…</Text>
          </Card>
        ) : !shift ? (
          <Card>
            <Text variant="bodyBold">No active shift</Text>
            <Text variant="description">
              You don&apos;t have an open shift right now. Wait for your operator to assign a
              tricycle.
            </Text>
            <Button variant="outline" marginTop="m" onPress={() => router.back()}>
              <Text variant="bodyBold">Back to Dashboard</Text>
            </Button>
          </Card>
        ) : (
          <>
            <Card variant="elevated">
              <Box alignItems="center" gap="s">
                <Box flexDirection="row" alignItems="center" gap="s">
                  <Clock color="#1FAB89" size={18} />
                  <Text variant="details">Elapsed</Text>
                </Box>
                <Text variant="header">{formatElapsed(shift.start_time)}</Text>
                <Text variant="description">
                  Started{' '}
                  {new Date(shift.start_time).toLocaleTimeString('en-PH', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </Box>
            </Card>

            {shift.tricycle ? (
              <Card>
                <Box flexDirection="row" alignItems="center" gap="s" marginBottom="s">
                  <CarFront color="#0a0a0a" size={18} />
                  <Text variant="bodyBold">Assigned Tricycle</Text>
                </Box>
                <Box gap="xs">
                  <Box flexDirection="row" justifyContent="space-between">
                    <Text variant="details">Plate Number</Text>
                    <Text variant="body">{shift.tricycle.plate_number ?? '—'}</Text>
                  </Box>
                  {shift.tricycle.tricycle_details?.model ? (
                    <Box flexDirection="row" justifyContent="space-between">
                      <Text variant="details">Model</Text>
                      <Text variant="body">{shift.tricycle.tricycle_details.model}</Text>
                    </Box>
                  ) : null}
                  {shift.tricycle.tricycle_details?.body_number ? (
                    <Box flexDirection="row" justifyContent="space-between">
                      <Text variant="details">Body No.</Text>
                      <Text variant="body">{shift.tricycle.tricycle_details.body_number}</Text>
                    </Box>
                  ) : null}
                </Box>
              </Card>
            ) : null}

            <Button
              variant="destructive"
              isLoading={endMutation.isPending}
              onPress={confirmEnd}>
              <Box flexDirection="row" alignItems="center" gap="s">
                <Square color="#fff" size={16} />
                <Text color="white" variant="bodyBold">
                  End Shift
                </Text>
              </Box>
            </Button>
          </>
        )}
      </ScrollView>
    </Container>
  );
}
