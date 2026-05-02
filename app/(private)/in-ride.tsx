import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import DriverDetails from '@/src/components/ui/in-ride/DriverDetails';
import EmergencyButton from '@/src/components/ui/in-ride/EmergencyButton';
import FareBreakdown from '@/src/components/ui/in-ride/FareBreakdown';
import Report from '@/src/components/ui/in-ride/Report';
import FeedbackModal from '@/src/components/ui/in-ride/FeedbackModal';
import DriverReviewsModal from '@/src/components/ui/in-ride/DriverReviewsModal';
import Text from '@/src/components/ui/Text';
import { updateRide } from '@/src/services/rides';
import { useRideStore } from '@/src/store/useRideStore';
import { getCurrentLocation } from '@/src/utils/locationService';
import { useActivePickupRequest } from '@/src/hooks/useActivePickupRequest';
import { commuterFinishPickupRequest } from '@/src/services/pickup';
import { getDirections } from '@/src/utils/directionsService';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { PROVIDER_GOOGLE, Region, Marker, Polyline } from 'react-native-maps';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/src/theme/theme';
import { Navigation, MapPin } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CLEAN_MAP_STYLE } from '@/src/utils/mapStyle';
import { INITIAL_REGION } from '@/src/utils/constants';

export default function InRide() {
  const [location, setLocation] = useState<Region | null>(null);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [isReviewsVisible, setIsReviewsVisible] = useState(false);
  const { rideDetails, clearAll } = useRideStore();
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%', '85%'], []);
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  
  const mapRef = useRef<MapView>(null);
  const [routeCoords, setRouteCoords] = useState<{latitude: number; longitude: number}[]>([]);
  const { pickup } = useActivePickupRequest();

  const endRideMutation = useMutation({
    mutationFn: async (ride_id: string) => {
      // If this is an E-Hailing ride, finish the pickup request cleanly.
      // If it's just Scan-To-Ride, the active pickup is either null or doesn't match this ride id.
      if (pickup && pickup.id === ride_id) {
        const { error } = await commuterFinishPickupRequest(ride_id);
        if (error) throw new Error(error.message);
      } else {
        await updateRide(ride_id);
      }
    },
    onSuccess: () => {
      setIsFeedbackVisible(true);
    },
    onError: (error) => {
      console.error('Failed to end ride', error);
    },
  });

  useEffect(() => {
    (async () => {
      const loc = await getCurrentLocation();
      if (loc) {
        setLocation({
          ...loc,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (pickup?.origin && pickup?.destination) {
      getDirections(pickup.origin, pickup.destination).then((res) => {
        if (res?.coords) {
          setRouteCoords(res.coords);
          setTimeout(() => {
            mapRef.current?.fitToCoordinates([pickup.origin, pickup.destination], {
              edgePadding: { top: insets.top + 100, right: 50, bottom: 400, left: 50 },
              animated: true,
            });
          }, 500);
        }
      });
    }
  }, [pickup, insets]);

  // Loading state to prevent flickering
  if (!rideDetails || !location) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="mainBackground" gap="m">
        <ActivityIndicator size="large" color="#1FAB89" />
        <Text variant="body" color="muted">Loading ride details...</Text>
      </Box>
    );
  }

  const handleEndRide = async () => {
    endRideMutation.mutate(rideDetails.id);
  };

  const traverseToHome = () => {
    clearAll();
    router.push({
      pathname: '/(private)/(tabs)/home',
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        mapPadding={{ top: insets.top + 60, right: 0, left: 0, bottom: 300 }}
        style={{ flexGrow: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={location || INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        followsUserLocation={!pickup}
        customMapStyle={CLEAN_MAP_STYLE}
      >
        {pickup?.origin && (
          <Marker 
            coordinate={{ latitude: pickup.origin.latitude, longitude: pickup.origin.longitude }} 
            title="Pickup"
            centerOffset={{ x: 0, y: -16 }}
          >
            <MapPin size={32} color="white" fill={theme.colors.primary} />
          </Marker>
        )}
        {pickup?.destination && (
          <Marker 
            coordinate={{ latitude: pickup.destination.latitude, longitude: pickup.destination.longitude }} 
            title="Destination"
            centerOffset={{ x: 0, y: -16 }}
          >
            <MapPin size={32} color="white" fill={theme.colors.secondary} />
          </Marker>
        )}
        {routeCoords.length > 0 && (
          <Polyline 
            coordinates={routeCoords} 
            strokeWidth={4} 
            strokeColor={theme.colors.primary} 
          />
        )}
      </MapView>

      {/* Status Header */}
      <Box position="absolute" top={insets.top + 10} left={20} right={20}>
        <Box
          backgroundColor="mainBackground"
          flexDirection="row"
          alignItems="center"
          padding="m"
          borderRadius="l"
          elevation={4}
          shadowColor="shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.15}
          shadowRadius={4}>
          <Box backgroundColor="primary" padding="s" borderRadius="rounded" marginRight="m">
            <Navigation size={20} color="white" />
          </Box>
          <Box flex={1}>
            <Text variant="details" color="muted">
              Current Trip
            </Text>
            <Text variant="bodyBold" numberOfLines={1}>
              On the way to destination
            </Text>
          </Box>
        </Box>
      </Box>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: theme.colors.mainBackground,
          borderTopLeftRadius: theme.borderRadii.xl,
          borderTopRightRadius: theme.borderRadii.xl,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 10,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.mutedLight,
          width: 40,
        }}>
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.l,
            paddingBottom: theme.spacing.xl,
          }}>
          {/* Driver Section */}
          <Text variant="subheader" marginBottom="m">
            Ride Details
          </Text>
          <DriverDetails
            tricycle_details={rideDetails.tricycle_details}
            driver_details={rideDetails.driver_details}
            onRatingPress={() => setIsReviewsVisible(true)}
          />

          <Box height={1} backgroundColor="grayLight" marginVertical="m" />

          {/* Fare Section */}
          <FareBreakdown />

          <Box height={1} backgroundColor="grayLight" marginVertical="m" />

          {/* Actions Grid */}
          <Box flexDirection="row" gap="m" marginBottom="l">
            <Box flex={1}>
              <EmergencyButton />
            </Box>
            <Box flex={1}>
              <Report />
            </Box>
          </Box>

          {/* Finish Ride Button */}
          <Button
            paddingVertical="l"
            onPress={handleEndRide}
            isLoading={endRideMutation.isPending}
            disabled={endRideMutation.isPending}
            style={{ borderRadius: theme.borderRadii.l, elevation: 2 }}>
            <Text variant="bodyBold" color="white" textAlign="center" fontSize={16}>
              Finish Ride
            </Text>
          </Button>
        </BottomSheetScrollView>
      </BottomSheet>

      {/* Feedback Modal */}
      <FeedbackModal
        isModalVisible={isFeedbackVisible}
        setIsModalVisible={setIsFeedbackVisible}
        onFinish={traverseToHome}
      />

      {/* Public Reviews Modal */}
      <DriverReviewsModal
        isVisible={isReviewsVisible}
        onClose={() => setIsReviewsVisible(false)}
        driverId={rideDetails.driver_details.id}
        driverName={`${rideDetails.driver_details.first_name} ${rideDetails.driver_details.last_name}`}
      />
    </GestureHandlerRootView>
  );
}
