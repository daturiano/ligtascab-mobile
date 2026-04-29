import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Container from '@/src/components/ui/Container';
import Text from '@/src/components/ui/Text';
import { useAuth } from '@/src/context/AuthenticationContext';
import { usePendingPickupJobs } from '@/src/hooks/usePendingPickupJobs';
import { fetchDriverActiveShift } from '@/src/services/driver';
import { acceptPickupRequest } from '@/src/services/pickup';
import { PickupRequestWithParties } from '@/src/types';
import { formatPHP } from '@/src/utils/pricing';
import { getErrorMessage } from '@/src/utils/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { CircleDot, Clock, MapPin, Route } from 'lucide-react-native';
import { ActivityIndicator, Alert, FlatList, RefreshControl } from 'react-native';

export default function DriverJobsTab() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { driver } = useAuth();
  const driverId = driver?.id;

  const { data: activeShift, isLoading: shiftLoading } = useQuery({
    queryKey: ['driver-active-shift', driverId],
    queryFn: async () => {
      if (!driverId) return null;
      const { data } = await fetchDriverActiveShift(driverId);
      return data;
    },
    enabled: !!driverId,
  });

  const onShift = !!activeShift;

  const { jobs, isLoading, refetch } = usePendingPickupJobs(onShift);

  const acceptMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { data, error } = await acceptPickupRequest(requestId);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-pickup-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['driver-active-job', driverId] });
      router.push('/(private)/(driver)/active-job');
    },
    onError: (err) => {
      Alert.alert('Could not accept', getErrorMessage(err));
      // Refetch in case the row was claimed by someone else
      queryClient.invalidateQueries({ queryKey: ['pending-pickup-jobs'] });
    },
  });

  return (
    <Container style={{ paddingHorizontal: 0, paddingBottom: 0 }}>
      <Box width="100%" paddingHorizontal="l" paddingTop="l" gap="xs">
        <Text variant="title">Available Jobs</Text>
        <Text variant="description">
          Pickup requests from commuters. First to accept claims the trip.
        </Text>
      </Box>

      {shiftLoading ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" />
        </Box>
      ) : !onShift ? (
        <Box flex={1} justifyContent="center" alignItems="center" paddingHorizontal="l" gap="m">
          <Text variant="bodyBold" textAlign="center">
            No shift today
          </Text>
          <Text variant="description" textAlign="center">
            Your operator hasn’t assigned you a shift for today yet. Once they do,
            jobs will show up here automatically.
          </Text>
        </Box>
      ) : isLoading ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" />
        </Box>
      ) : jobs.length === 0 ? (
        <Box flex={1} justifyContent="center" alignItems="center" paddingHorizontal="l">
          <Text variant="bodyBold">No pending requests</Text>
          <Text variant="description" textAlign="center">
            New jobs will appear here automatically.
          </Text>
        </Box>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          style={{ width: '100%' }}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} />}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              isAccepting={acceptMutation.isPending && acceptMutation.variables === item.id}
              onAccept={() => acceptMutation.mutate(item.id)}
            />
          )}
        />
      )}
    </Container>
  );
}

function JobCard({
  job,
  onAccept,
  isAccepting,
}: {
  job: PickupRequestWithParties;
  onAccept: () => void;
  isAccepting: boolean;
}) {
  return (
    <Card gap="m">
      <Box gap="xs">
        <Box flexDirection="row" alignItems="flex-start" gap="s">
          <CircleDot color="#1FAB89" size={16} style={{ marginTop: 2 }} />
          <Box flex={1}>
            <Text variant="details">Pickup</Text>
            <Text variant="body" numberOfLines={1}>
              {job.origin.address}
            </Text>
          </Box>
        </Box>
        <Box flexDirection="row" alignItems="flex-start" gap="s">
          <MapPin color="#EF9651" size={16} style={{ marginTop: 2 }} />
          <Box flex={1}>
            <Text variant="details">Destination</Text>
            <Text variant="body" numberOfLines={1}>
              {job.destination.address}
            </Text>
          </Box>
        </Box>
      </Box>

      <Box flexDirection="row" gap="l">
        <Box flexDirection="row" alignItems="center" gap="xs">
          <Route color="#737373" size={14} />
          <Text variant="details">{Number(job.distance_km).toFixed(2)} km</Text>
        </Box>
        <Box flexDirection="row" alignItems="center" gap="xs">
          <Clock color="#737373" size={14} />
          <Text variant="details">~{job.estimated_duration_min} min</Text>
        </Box>
        <Box flex={1} alignItems="flex-end">
          <Text variant="bodyBold">{formatPHP(Number(job.estimated_fare))}</Text>
        </Box>
      </Box>

      <Button variant="primary" isLoading={isAccepting} onPress={onAccept}>
        <Text color="mainBackground" variant="bodyBold">
          Accept Job
        </Text>
      </Button>
    </Card>
  );
}
