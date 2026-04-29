import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Container from '@/src/components/ui/Container';
import Text from '@/src/components/ui/Text';
import { useAuth } from '@/src/context/AuthenticationContext';
import {
  fetchDriverActiveShift,
  fetchDriverEarningsSummary,
} from '@/src/services/driver';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  CarFront,
  CircleDot,
  Coins,
  Play,
} from 'lucide-react-native';
import { ScrollView } from 'react-native';

const formatPHP = (n: number) =>
  `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const daysUntil = (date: Date | string | null | undefined) => {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = d.getTime() - Date.now();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

export default function DriverDashboard() {
  const { driver } = useAuth();
  const router = useRouter();
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

  const { data: earnings } = useQuery({
    queryKey: ['driver-earnings', driverId],
    queryFn: async () => {
      if (!driverId) return null;
      return fetchDriverEarningsSummary(driverId);
    },
    enabled: !!driverId,
  });

  const licenseDaysLeft = daysUntil(driver?.license_expiration);
  const licenseExpiringSoon = licenseDaysLeft !== null && licenseDaysLeft <= 30;

  return (
    <Container style={{ paddingHorizontal: 0, paddingBottom: 0 }}>
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingBottom: 24 }}>
        <Box gap="l" paddingTop="l">
          {/* Header */}
          <Box flexDirection="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Text variant="title">Hello, {driver?.first_name ?? 'Driver'} 👋</Text>
              <Text variant="description">Here&apos;s a snapshot of your day.</Text>
            </Box>
            <Box
              backgroundColor="primaryLighter"
              paddingHorizontal="m"
              paddingVertical="xs"
              borderRadius="rounded">
              <Text variant="details" color="primaryDark" fontWeight="600">
                Driver
              </Text>
            </Box>
          </Box>

          {/* Active shift card */}
          <Card>
            <Box flexDirection="row" alignItems="center" gap="s" marginBottom="m">
              <CircleDot
                color={activeShift ? '#1FAB89' : '#737373'}
                size={18}
                strokeWidth={2}
              />
              <Text variant="bodyBold">
                {activeShift ? 'On shift' : 'Not on shift'}
              </Text>
            </Box>
            {activeShift ? (
              <Box gap="s">
                <Text variant="description">
                  Started{' '}
                  {new Date(activeShift.start_time).toLocaleTimeString('en-PH', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                {activeShift.tricycle ? (
                  <Box flexDirection="row" alignItems="center" gap="s">
                    <CarFront color="#0a0a0a" size={16} />
                    <Text variant="body">
                      {activeShift.tricycle.plate_number ?? 'Assigned tricycle'}
                    </Text>
                  </Box>
                ) : null}
                <Button
                  variant="primary"
                  marginTop="s"
                  onPress={() => router.push('/(private)/(driver)/active-shift')}>
                  <Text color="mainBackground" variant="bodyBold">
                    View Active Shift
                  </Text>
                </Button>
              </Box>
            ) : (
              <Box gap="s">
                <Text variant="description">
                  {shiftLoading
                    ? 'Checking for an open shift…'
                    : 'Your operator will assign your next tricycle. Tap below once you receive your assignment.'}
                </Text>
                <Button
                  variant="outline"
                  marginTop="s"
                  onPress={() => router.push('/(private)/(driver)/active-shift')}>
                  <Box flexDirection="row" alignItems="center" gap="s">
                    <Play color="#0a0a0a" size={16} />
                    <Text variant="bodyBold">Start Shift</Text>
                  </Box>
                </Button>
              </Box>
            )}
          </Card>

          {/* Earnings */}
          <Box flexDirection="row" alignItems="center" gap="s" marginTop="s">
            <Coins color="#0a0a0a" size={18} />
            <Text variant="bodyBold">Earnings</Text>
            {!earnings?.hasRealData && (
              <Text variant="details" color="muted">
                · placeholder
              </Text>
            )}
          </Box>
          <Box flexDirection="row" gap="m">
            <Card flex={1}>
              <Text variant="details">Today</Text>
              <Text variant="title" marginTop="xs">
                {formatPHP(earnings?.todayTotal ?? 0)}
              </Text>
            </Card>
            <Card flex={1}>
              <Text variant="details">This Week</Text>
              <Text variant="title" marginTop="xs">
                {formatPHP(earnings?.weekTotal ?? 0)}
              </Text>
            </Card>
          </Box>
          <Card>
            <Text variant="details">Lifetime</Text>
            <Text variant="title" marginTop="xs">
              {formatPHP(earnings?.lifetimeTotal ?? 0)}
            </Text>
          </Card>

          {/* License warning */}
          {licenseExpiringSoon && (
            <Card backgroundColor="warningLight">
              <Box flexDirection="row" alignItems="center" gap="s" marginBottom="xs">
                <AlertTriangle color="#0a0a0a" size={18} />
                <Text variant="bodyBold">License Expiring Soon</Text>
              </Box>
              <Text variant="description">
                Your driver&apos;s license expires in {licenseDaysLeft} day
                {licenseDaysLeft === 1 ? '' : 's'}. Please renew it through your operator.
              </Text>
            </Card>
          )}
        </Box>
      </ScrollView>
    </Container>
  );
}
