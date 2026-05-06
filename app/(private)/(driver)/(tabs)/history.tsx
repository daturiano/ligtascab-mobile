import Box from '@/src/components/ui/Box';
import Card from '@/src/components/ui/Card';
import Container from '@/src/components/ui/Container';
import Text from '@/src/components/ui/Text';
import { useAuth } from '@/src/context/AuthenticationContext';
import { fetchDriverShiftHistory } from '@/src/services/driver';
import { fetchDriverCompletedJobs } from '@/src/services/pickup';
import { Theme } from '@/src/theme/theme';
import { PickupRequest, ShiftWithTricycle } from '@/src/types';
import { formatPHP } from '@/src/utils/pricing';
import { useTheme } from '@shopify/restyle';
import { useQuery } from '@tanstack/react-query';
import { CarFront, CircleDot, Coins, MapPin, XCircle } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable } from 'react-native';

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

type SubTab = 'shifts' | 'jobs';

export default function DriverHistory() {
  const { driver } = useAuth();
  const driverId = driver?.id;
  const [tab, setTab] = useState<SubTab>('shifts');

  return (
    <Container style={{ paddingHorizontal: 0, paddingBottom: 0 }}>
      <Box width="100%" paddingHorizontal="l" paddingTop="l" gap="xs">
        <Text variant="title">History</Text>
        <Text variant="description">Your past shifts and pickup jobs.</Text>
      </Box>

      <Box width="100%" flexDirection="row" paddingHorizontal="l" paddingTop="m" gap="s">
        <SubTabPill label="Shifts" active={tab === 'shifts'} onPress={() => setTab('shifts')} />
        <SubTabPill label="Jobs" active={tab === 'jobs'} onPress={() => setTab('jobs')} />
      </Box>

      {tab === 'shifts' ? (
        <ShiftsList driverId={driverId} />
      ) : (
        <JobsList driverId={driverId} />
      )}
    </Container>
  );
}

function SubTabPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useTheme<Theme>();
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <Box
          paddingHorizontal="l"
          paddingVertical="s"
          borderRadius="rounded"
          backgroundColor={active ? 'primary' : 'grayLighter'}
          opacity={pressed ? 0.8 : 1}>
          <Text
            variant="bodyBold"
            style={{ color: active ? theme.colors.mainBackground : theme.colors.mainForeground }}>
            {label}
          </Text>
        </Box>
      )}
    </Pressable>
  );
}

function ShiftsList({ driverId }: { driverId: string | undefined }) {
  const { data: shifts, isLoading } = useQuery({
    queryKey: ['driver-shift-history', driverId],
    queryFn: async () => {
      if (!driverId) return [];
      const { data } = await fetchDriverShiftHistory(driverId);
      return data;
    },
    enabled: !!driverId,
  });

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" />
      </Box>
    );
  }

  if (!shifts || shifts.length === 0) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" paddingHorizontal="l">
        <Text variant="bodyBold">No shifts yet</Text>
        <Text variant="description" textAlign="center">
          Once your operator assigns you a shift, it will show up here.
        </Text>
      </Box>
    );
  }

  return (
    <FlatList<ShiftWithTricycle>
      data={shifts}
      keyExtractor={(item) => String(item.id)}
      style={{ width: '100%' }}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      renderItem={({ item }) => (
        <Card>
          <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start">
            <Box gap="xs" flex={1}>
              <Box flexDirection="row" alignItems="center" gap="s">
                <CarFront color="#0a0a0a" size={16} />
                <Text variant="bodyBold">
                  {item.plate_number ?? item.tricycle?.plate_number ?? 'Tricycle'}
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
              <Text variant="details">{formatDateTime(item.created_at)}</Text>
            </Box>
            <Box alignItems="flex-end" gap="xs">
              {item.shift_type ? (
                <Box
                  backgroundColor="grayLighter"
                  paddingHorizontal="s"
                  paddingVertical="xs"
                  borderRadius="rounded">
                  <Text variant="details">{item.shift_type}</Text>
                </Box>
              ) : null}
              {typeof item.revenue_collected === 'number' ? (
                <Box flexDirection="row" alignItems="center" gap="xs">
                  <Coins color="#737373" size={14} />
                  <Text variant="details">{formatPHP(item.revenue_collected)}</Text>
                </Box>
              ) : null}
            </Box>
          </Box>
        </Card>
      )}
    />
  );
}

function JobsList({ driverId }: { driverId: string | undefined }) {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['driver-jobs-history', driverId],
    queryFn: async () => {
      if (!driverId) return [];
      const { data } = await fetchDriverCompletedJobs(driverId);
      return data;
    },
    enabled: !!driverId,
  });

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" />
      </Box>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" paddingHorizontal="l">
        <Text variant="bodyBold">No jobs yet</Text>
        <Text variant="description" textAlign="center">
          Pickup jobs you accept will appear here once they wrap up.
        </Text>
      </Box>
    );
  }

  return (
    <FlatList<PickupRequest>
      data={jobs}
      keyExtractor={(item) => item.id}
      style={{ width: '100%' }}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      renderItem={({ item }) => {
        const isCancelled = item.status === 'cancelled';
        const dateIso = item.completed_at ?? item.cancelled_at ?? item.accepted_at ?? item.created_at;
        return (
          <Card gap="s">
            <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start">
              <Box flex={1} gap="xs">
                <Box flexDirection="row" alignItems="flex-start" gap="s">
                  <CircleDot color="#1FAB89" size={14} style={{ marginTop: 4 }} />
                  <Text variant="body" flex={1} numberOfLines={1}>
                    {item.origin.address}
                  </Text>
                </Box>
                <Box flexDirection="row" alignItems="flex-start" gap="s">
                  <MapPin color="#EF9651" size={14} style={{ marginTop: 4 }} />
                  <Text variant="body" flex={1} numberOfLines={1}>
                    {item.destination.address}
                  </Text>
                </Box>
                <Text variant="details">{formatDateTime(dateIso)}</Text>
              </Box>
              <Box alignItems="flex-end" gap="xs">
                {isCancelled ? (
                  <Box
                    backgroundColor="warningLight"
                    paddingHorizontal="s"
                    paddingVertical="xs"
                    borderRadius="rounded"
                    flexDirection="row"
                    alignItems="center"
                    gap="xs">
                    <XCircle color="#0a0a0a" size={12} />
                    <Text variant="details">Cancelled</Text>
                  </Box>
                ) : (
                  <Box
                    backgroundColor="primaryLighter"
                    paddingHorizontal="s"
                    paddingVertical="xs"
                    borderRadius="rounded">
                    <Text variant="details">Completed</Text>
                  </Box>
                )}
                <Text variant="bodyBold">{formatPHP(Number(item.estimated_fare))}</Text>
                <Text variant="details">{Number(item.distance_km).toFixed(2)} km</Text>
              </Box>
            </Box>
          </Card>
        );
      }}
    />
  );
}
