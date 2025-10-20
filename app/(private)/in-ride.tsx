import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import DriverDetails from '@/src/components/ui/in-ride/DriverDetails';
import FareBreakdown from '@/src/components/ui/in-ride/FareBreakdown';
import Report from '@/src/components/ui/in-ride/Report';
import Text from '@/src/components/ui/Text';
import { updateRide } from '@/src/services/rides';
import { useRideStore } from '@/src/store/useRideStore';
import { INITIAL_REGION } from '@/src/utils/constants';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default function InRide() {
  const { rideDetails, clearAll } = useRideStore();
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['45%', '66%'], []);

  const endRideMutation = useMutation({
    mutationFn: async (ride_id: string) => {
      await updateRide(ride_id);
    },
  });

  if (!rideDetails) return null;

  const handleEndRide = async () => {
    endRideMutation.mutate(rideDetails.id);
    clearAll();
    router.push({
      pathname: '/(private)/(tabs)/home',
    });
  };

  return (
    <GestureHandlerRootView>
      <MapView
        mapPadding={{ top: 0, right: 0, left: 0, bottom: 275 }}
        style={{ flexGrow: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
        followsUserLocation
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        enableDynamicSizing={false}
        enableOverDrag={false}
        snapPoints={snapPoints}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}>
        <BottomSheetView>
          <Box
            width={'100%'}
            flexDirection="column"
            gap="s"
            paddingHorizontal="xl"
            paddingVertical="s">
            <DriverDetails
              tricycle_details={rideDetails.tricycle_details}
              driver_details={rideDetails.driver_details}
            />
            <FareBreakdown />
            <Report />
          </Box>
        </BottomSheetView>
      </BottomSheet>
      <Box paddingHorizontal="xl" paddingVertical="xxl" backgroundColor="white">
        <Button paddingVertical="l" onPress={handleEndRide}>
          <Text fontSize={18} fontWeight={600} color="white">
            Finish Ride
          </Text>
        </Button>
      </Box>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fffbfc',
  },
  handleIndicator: {
    backgroundColor: '#ccc',
    width: 40,
  },
});
