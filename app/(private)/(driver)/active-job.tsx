import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Container from '@/src/components/ui/Container';
import Text from '@/src/components/ui/Text';
import { useAuth } from '@/src/context/AuthenticationContext';
import { useDriverActiveJob } from '@/src/hooks/useDriverActiveJob';
import { completePickupRequest, markPickupInProgress } from '@/src/services/pickup';
import { formatPHP } from '@/src/utils/pricing';
import { getErrorMessage } from '@/src/utils/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle2,
  CircleDot,
  Clock,
  MapPin,
  Phone,
  Route,
  UserCircle,
  Users,
} from 'lucide-react-native';
import { ActivityIndicator, Alert, Linking, ScrollView, TouchableOpacity } from 'react-native';

export default function DriverActiveJob() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { driver } = useAuth();
  const driverId = driver?.id;

  const { job, isLoading } = useDriverActiveJob();

  const pickupMutation = useMutation({
    mutationFn: async () => {
      if (!job) throw new Error('No active job');
      const { data, error } = await markPickupInProgress(job.id);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-active-job', driverId] });
    },
    onError: (err) => {
      Alert.alert('Could not update', getErrorMessage(err));
    },
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!job) throw new Error('No active job');
      const { data, error } = await completePickupRequest(job.id);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-active-job', driverId] });
      queryClient.invalidateQueries({ queryKey: ['driver-shift-history', driverId] });
      queryClient.invalidateQueries({ queryKey: ['driver-earnings', driverId] });
      Alert.alert('Trip completed', 'Nice work! The trip has been marked complete.');
      router.back();
    },
    onError: (err) => {
      Alert.alert('Could not complete', getErrorMessage(err));
    },
  });

  const phone = job?.commuter?.phone_number;

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
          <Text variant="title">Active Job</Text>
        </Box>

        {isLoading ? (
          <Card alignItems="center" paddingVertical="xl">
            <ActivityIndicator />
          </Card>
        ) : !job ? (
          <Card>
            <Text variant="bodyBold">No active job</Text>
            <Text variant="description">
              You don&apos;t have a claimed job. Head to the Jobs tab to find one.
            </Text>
            <Button variant="outline" marginTop="m" onPress={() => router.back()}>
              <Text variant="bodyBold">Back</Text>
            </Button>
          </Card>
        ) : (
          <>
            {/* Status banner */}
            <Card>
              <Box flexDirection="row" alignItems="center" gap="s">
                {job.status === 'in_progress' ? (
                  <CheckCircle2 color="#1FAB89" size={20} />
                ) : (
                  <UserCircle color="#1FAB89" size={20} />
                )}
                <Text variant="bodyBold">
                  {job.status === 'in_progress' ? 'Trip in progress' : 'Heading to pickup'}
                </Text>
              </Box>
            </Card>

            {/* Route */}
            <Card gap="m">
              <Box gap="xs">
                <Box flexDirection="row" alignItems="flex-start" gap="s">
                  <CircleDot color="#1FAB89" size={16} style={{ marginTop: 2 }} />
                  <Box flex={1}>
                    <Text variant="details">Pickup</Text>
                    <Text variant="body">{job.origin.address}</Text>
                  </Box>
                </Box>
                <Box flexDirection="row" alignItems="flex-start" gap="s">
                  <MapPin color="#EF9651" size={16} style={{ marginTop: 2 }} />
                  <Box flex={1}>
                    <Text variant="details">Destination</Text>
                    <Text variant="body">{job.destination.address}</Text>
                  </Box>
                </Box>
              </Box>

              <Box height={1} backgroundColor="grayLighter" />

              <Box flexDirection="row" gap="m">
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Route color="#737373" size={14} />
                  <Text variant="details">{Number(job.distance_km).toFixed(2)} km</Text>
                </Box>
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Clock color="#737373" size={14} />
                  <Text variant="details">~{job.estimated_duration_min} min</Text>
                </Box>
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Users color="#737373" size={14} />
                  <Text variant="details">{job.passenger_count}</Text>
                </Box>
                <Box flex={1} alignItems="flex-end">
                  <Text variant="bodyBold">{formatPHP(Number(job.estimated_fare))}</Text>
                </Box>
              </Box>
            </Card>

            {/* Commuter contact */}
            {job.commuter ? (
              <Card gap="s">
                <Text variant="bodyBold">Commuter</Text>
                <Box flexDirection="row" justifyContent="space-between">
                  <Text variant="body">
                    {job.commuter.first_name} {job.commuter.last_name}
                  </Text>
                </Box>
                {phone ? (
                  <Button variant="outline" onPress={() => Linking.openURL(`tel:${phone}`)}>
                    <Box flexDirection="row" alignItems="center" gap="s">
                      <Phone color="#0a0a0a" size={16} />
                      <Text variant="bodyBold">Call Commuter</Text>
                    </Box>
                  </Button>
                ) : null}
              </Card>
            ) : null}

            {/* Action button switches based on status */}
            {job.status === 'accepted' ? (
              <Button
                variant="primary"
                isLoading={pickupMutation.isPending}
                onPress={() => pickupMutation.mutate()}>
                <Text color="mainBackground" variant="bodyBold">
                  Mark as Picked Up
                </Text>
              </Button>
            ) : (
              <Button
                variant="primary"
                isLoading={completeMutation.isPending}
                onPress={() => completeMutation.mutate()}>
                <Box flexDirection="row" alignItems="center" gap="s">
                  <CheckCircle2 color="#fff" size={16} />
                  <Text color="mainBackground" variant="bodyBold">
                    Complete Trip
                  </Text>
                </Box>
              </Button>
            )}
          </>
        )}
      </ScrollView>
    </Container>
  );
}
