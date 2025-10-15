import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Text from '@/src/components/ui/Text';
import { useRide } from '@/src/context/RideContext';
import { INITIAL_REGION } from '@/src/utils/constants';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default function InRide() {
  const { rideDetails } = useRide();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['45%', '66%'], []);

  if (!rideDetails) return null;

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
          <Text>Sheet</Text>
        </BottomSheetView>
      </BottomSheet>
      <Box paddingHorizontal="xl" paddingVertical="xxl" backgroundColor="white">
        <Button paddingVertical="l">
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
