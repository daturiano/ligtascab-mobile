import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Container from '@/src/components/ui/Container';
import DriverAcceptedCard from '@/src/components/ui/pickup/DriverAcceptedCard';
import FareEstimateCard from '@/src/components/ui/pickup/FareEstimateCard';
import LocationPickerField from '@/src/components/ui/pickup/LocationPickerField';
import Text from '@/src/components/ui/Text';
import { useAuth } from '@/src/context/AuthenticationContext';
import { useActivePickupRequest } from '@/src/hooks/useActivePickupRequest';
import {
  cancelPickupRequest,
  confirmPickupCompletion,
  createPickupRequest,
} from '@/src/services/pickup';
import { useTerminalStore } from '@/src/store/useTerminalStore';
import { getRouteEstimate } from '@/src/utils/directionsService';
import { calculateFare, formatPHP } from '@/src/utils/pricing';
import { getErrorMessage } from '@/src/utils/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';

export default function PickupScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const commuterId = session?.user?.id;

  const { pickup, isLoading } = useActivePickupRequest();
  const { origin, destination, setOrigin, setDestination } = useTerminalStore();

  const [estimate, setEstimate] = useState<{
    distanceKm: number;
    durationMin: number;
    isPrecise: boolean;
  } | null>(null);
  const [estimateLoading, setEstimateLoading] = useState(false);

  // Recompute the route estimate whenever both endpoints are set.
  useEffect(() => {
    let cancelled = false;
    if (pickup) return; // a request is already in flight; don't recompute
    if (!origin || !destination) {
      setEstimate(null);
      return;
    }
    setEstimateLoading(true);
    getRouteEstimate(
      { latitude: origin.latitude, longitude: origin.longitude },
      { latitude: destination.latitude, longitude: destination.longitude }
    )
      .then((result) => {
        if (!cancelled) setEstimate(result);
      })
      .finally(() => {
        if (!cancelled) setEstimateLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [origin, destination, pickup]);

  const fare = useMemo(() => (estimate ? calculateFare(estimate.distanceKm) : null), [estimate]);

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!commuterId) throw new Error('Not signed in');
      if (!origin || !destination) throw new Error('Set both pickup and destination');
      if (!estimate || !fare) throw new Error('Estimate not ready');
      const { data, error } = await createPickupRequest({
        commuter_id: commuterId,
        origin: {
          latitude: origin.latitude,
          longitude: origin.longitude,
          address: origin.address ?? origin.name ?? 'Selected location',
          name: origin.name ?? null,
        },
        destination: {
          latitude: destination.latitude,
          longitude: destination.longitude,
          address: destination.address ?? destination.name ?? 'Selected location',
          name: destination.name ?? null,
        },
        distance_km: estimate.distanceKm,
        estimated_duration_min: estimate.durationMin,
        estimated_fare: fare.total,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-pickup', commuterId] });
    },
    onError: (err) => {
      Alert.alert('Could not request pickup', getErrorMessage(err));
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!pickup) throw new Error('No active request');
      const { data, error } = await cancelPickupRequest(pickup.id);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-pickup', commuterId] });
    },
    onError: (err) => {
      Alert.alert('Could not cancel', getErrorMessage(err));
    },
  });

  const confirmMutation = useMutation({
    mutationFn: async () => {
      if (!pickup) throw new Error('No active request');
      const { data, error } = await confirmPickupCompletion(pickup.id);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-pickup', commuterId] });
      // Reset the form's terminal store and pop back to home.
      setOrigin(null);
      setDestination(null);
      router.back();
    },
    onError: (err) => {
      Alert.alert('Could not confirm', getErrorMessage(err));
    },
  });

  const handleCancel = () => {
    Alert.alert('Cancel request?', 'This will cancel your pickup request.', [
      { text: 'Keep request', style: 'cancel' },
      {
        text: 'Cancel request',
        style: 'destructive',
        onPress: () => cancelMutation.mutate(),
      },
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
          <Text variant="title">Pick Me Up</Text>
        </Box>

        {isLoading ? (
          <Card alignItems="center" paddingVertical="xl">
            <ActivityIndicator />
          </Card>
        ) : !pickup ? (
          // ─── No active request: show the form ─────────────────────────────
          <>
            <Box gap="m">
              <LocationPickerField
                type="origin"
                label="Pickup"
                value={origin?.address ?? origin?.name ?? null}
              />
              <LocationPickerField
                type="destination"
                label="Destination"
                value={destination?.address ?? destination?.name ?? null}
              />
            </Box>

            {estimateLoading ? (
              <Card alignItems="center" paddingVertical="l">
                <ActivityIndicator />
                <Text variant="details" marginTop="s">
                  Calculating fare…
                </Text>
              </Card>
            ) : fare && estimate ? (
              <FareEstimateCard
                fare={fare}
                durationMin={estimate.durationMin}
                isPrecise={estimate.isPrecise}
              />
            ) : null}

            <Button
              variant={fare ? 'primary' : 'disabled'}
              disabled={!fare || createMutation.isPending}
              isLoading={createMutation.isPending}
              onPress={() => createMutation.mutate()}>
              <Text color="mainBackground" variant="bodyBold">
                {fare ? `Confirm Request · ${formatPHP(fare.total)}` : 'Set pickup and destination'}
              </Text>
            </Button>
          </>
        ) : pickup.status === 'pending' ? (
          // ─── Pending: searching for a driver ─────────────────────────────
          <>
            <Card alignItems="center" gap="m" paddingVertical="xl">
              <ActivityIndicator size="large" color="#1FAB89" />
              <Text variant="bodyBold">Looking for a driver…</Text>
              <Text variant="description" textAlign="center">
                We&apos;re broadcasting your request. The first available driver will accept it.
              </Text>
            </Card>
            <Card gap="xs">
              <Text variant="details">Pickup</Text>
              <Text variant="body">{pickup.origin.address}</Text>
              <Box height={1} backgroundColor="grayLighter" marginVertical="xs" />
              <Text variant="details">Destination</Text>
              <Text variant="body">{pickup.destination.address}</Text>
              <Box height={1} backgroundColor="grayLighter" marginVertical="xs" />
              <Box flexDirection="row" justifyContent="space-between">
                <Text variant="details">Estimated Fare</Text>
                <Text variant="bodyBold">{formatPHP(Number(pickup.estimated_fare))}</Text>
              </Box>
            </Card>
            <Button
              variant="destructive"
              isLoading={cancelMutation.isPending}
              onPress={handleCancel}>
              <Box flexDirection="row" alignItems="center" gap="s">
                <XCircle color="#fff" size={16} />
                <Text color="white" variant="bodyBold">
                  Cancel Request
                </Text>
              </Box>
            </Button>
          </>
        ) : pickup.status === 'accepted' ? (
          // ─── Accepted: driver assigned, on the way ───────────────────────
          <>
            <DriverAcceptedCard pickup={pickup} />
            <Card gap="xs">
              <Text variant="details">Pickup</Text>
              <Text variant="body">{pickup.origin.address}</Text>
              <Box height={1} backgroundColor="grayLighter" marginVertical="xs" />
              <Text variant="details">Destination</Text>
              <Text variant="body">{pickup.destination.address}</Text>
            </Card>
            <Button
              variant="destructive"
              isLoading={cancelMutation.isPending}
              onPress={handleCancel}>
              <Box flexDirection="row" alignItems="center" gap="s">
                <XCircle color="#fff" size={16} />
                <Text color="white" variant="bodyBold">
                  Cancel Request
                </Text>
              </Box>
            </Button>
          </>
        ) : pickup.status === 'in_progress' ? (
          // ─── In progress: ride has started ────────────────────────────────
          <>
            <Card alignItems="center" gap="m" paddingVertical="xl">
              <Text variant="bodyBold">On the way to your destination</Text>
              <Text variant="description" textAlign="center">
                Sit back and enjoy the ride. Your driver will mark the trip complete on arrival.
              </Text>
            </Card>
            <DriverAcceptedCard pickup={pickup} />
          </>
        ) : (
          // ─── Completed: awaiting commuter confirmation ────────────────────
          <>
            <Card alignItems="center" gap="m" paddingVertical="xl">
              <CheckCircle2 color="#1FAB89" size={48} />
              <Text variant="bodyBold">Trip Completed</Text>
              <Text variant="description" textAlign="center">
                Your driver marked the trip as complete. Tap below to confirm
                and close out the ride.
              </Text>
              <Text variant="title">{formatPHP(Number(pickup.estimated_fare))}</Text>
            </Card>
            <Card gap="xs">
              <Text variant="details">Pickup</Text>
              <Text variant="body">{pickup.origin.address}</Text>
              <Box height={1} backgroundColor="grayLighter" marginVertical="xs" />
              <Text variant="details">Destination</Text>
              <Text variant="body">{pickup.destination.address}</Text>
            </Card>
            <Button
              variant="primary"
              isLoading={confirmMutation.isPending}
              onPress={() => confirmMutation.mutate()}>
              <Text color="mainBackground" variant="bodyBold">
                Confirm Trip
              </Text>
            </Button>
          </>
        )}
      </ScrollView>
    </Container>
  );
}
