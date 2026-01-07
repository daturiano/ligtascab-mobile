import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Keyboard } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Image } from 'expo-image';
import { MapPin, LocateFixed, Navigation, Check } from 'lucide-react-native';
import { useTheme } from '@shopify/restyle';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';

import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Text from '@/src/components/ui/Text';
import NearbyTerminalSheet from '@/src/components/ui/terminals/NearbyTerminalSheet';
import AlertModal from '@/src/components/ui/AlertModal';
import { Terminal } from '@/src/types';
import { NAGA_TERMINALS } from '@/src/utils/constants';
import {
  getDirections,
  reverseGeocode,
} from '@/src/utils/directionsService';
import {
  findNearbyTerminals,
  getCurrentLocation,
  requestLocationPermission,
} from '@/src/utils/locationService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTerminalStore } from '@/src/store/useTerminalStore';
import { Theme } from '@/src/theme/theme';
import { Pressable } from 'react-native';

export default function Terminals() {
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const theme = useTheme<Theme>();
  const { mainBackground } = theme.colors;
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { 
    origin, setOrigin, 
    destination, setDestination, 
    isSelectingOnMap, setIsSelectingOnMap 
  } = useTerminalStore();

  const [nearbyTerminals, setNearbyTerminals] = useState<Terminal[] | null>(null);
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[] | null>(null);
  const [alertConfig, setAlertConfig] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: '',
    message: '',
  });
  
  // For dragging map selection
  const [mapCenter, setMapCenter] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      const granted = await requestLocationPermission();
      if (!granted) return;

      // Only set initial origin if not already set (retaining store value)
      if (!origin) {
        const loc = await getCurrentLocation();
        if (loc) {
          const address = await reverseGeocode(loc.latitude, loc.longitude);
          setOrigin({
            ...loc,
            address: address || 'Current Location',
          });
        }
      }
    })();
  }, []);

  // Auto-zoom to Origin
  useEffect(() => {
    if (origin && mapRef.current && !isSelectingOnMap) {
      mapRef.current.animateToRegion({
        latitude: origin.latitude,
        longitude: origin.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [origin, isSelectingOnMap]);

  // Auto-zoom to Destination
  useEffect(() => {
    if (destination && mapRef.current && !isSelectingOnMap) {
      mapRef.current.animateToRegion({
        latitude: destination.latitude,
        longitude: destination.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [destination, isSelectingOnMap]);

  // Fit to Route
  useEffect(() => {
    if (route && route.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(route, {
        edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
        animated: true,
      });
    }
  }, [route]);

  const handleStartSelecting = async (mode: 'origin' | 'destination') => {
      // If we already have a location for this mode, center map on it first
      const target = mode === 'origin' ? origin : destination;
      if (target) {
          mapRef.current?.animateToRegion({
              latitude: target.latitude,
              longitude: target.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
          }, 500);
      }
      setIsSelectingOnMap(mode);
  };

  const handleConfirmLocation = async () => {
      if (!mapCenter || !isSelectingOnMap) return;

      const address = await reverseGeocode(mapCenter.latitude, mapCenter.longitude);
      const locationData = {
          ...mapCenter,
          address: address || 'Pinned Location',
          name: 'Pinned Location',
      };

      if (isSelectingOnMap === 'origin') {
          setOrigin(locationData);
      } else {
          setDestination(locationData);
      }
      setIsSelectingOnMap(null);
  };

  const handleFindTricycles = () => {
    Keyboard.dismiss();
    if (!origin) return;
    const nearby = findNearbyTerminals(NAGA_TERMINALS, origin, 500);
    
    if (nearby.length === 0) {
      setAlertConfig({
        visible: true,
        title: 'No Tricycles Found',
        message: 'There are no tricycles within 500 meters of your location going to your destination.',
      });
      setNearbyTerminals(null);
      return;
    }

    setNearbyTerminals(nearby);
    bottomSheetRef.current?.expand();
  };

  const handleGetDirections = async () => {
    if (!origin || !selectedTerminal) return;
    
    // Close UI to show map (partially or fully?)
    // Usually we want to see the route. Minimizing sheet is best.
    bottomSheetRef.current?.collapse(); // Snap to bottom (15%) or close? 
    // Let's close it so map is full view
    bottomSheetRef.current?.close();

    const directions = await getDirections(origin, selectedTerminal.map);
    if (directions) setRoute(directions.coords);
  };

  const handleSelectTerminal = (terminal: Terminal) => {
    setSelectedTerminal(terminal);
    // Expand sheet to show details
    bottomSheetRef.current?.expand();
    
    // Zoom to terminal when selected
    mapRef.current?.animateToRegion({
        ...terminal.map,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });
  };

  if (!origin && !isSelectingOnMap) {
      // Still loading location
     return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" />
        </View>
     )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        onRegionChangeComplete={(region) => {
            if (isSelectingOnMap) {
                setMapCenter({ latitude: region.latitude, longitude: region.longitude });
            }
        }}
        style={{ flexGrow: 1 }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={!isSelectingOnMap}
        initialRegion={origin ? {
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        } : undefined}
        >
        
        {/* Render Markers only if NOT selecting */}
        {!isSelectingOnMap && (
           <>
             {destination && <Marker coordinate={destination} />}
             {route && route.length > 0 && (
               <Polyline coordinates={route} strokeColor="#1daa88" strokeWidth={5} />
             )}
     
             {/* Show Terminals if Found */}
             {nearbyTerminals && NAGA_TERMINALS.map((terminal) => (
               <Marker
                 key={terminal.direction}
                 coordinate={terminal.map}
                 onPress={() => {
                   handleSelectTerminal(terminal);
                 }}>
                 <Image style={{ width: 40, height: 40 }} source={require('@/src/assets/marker.png')} />
               </Marker>
             ))}
           </>
        )}
      </MapView>

      {/* Map Selection Center Pin */}
      {isSelectingOnMap && (
          <Box position="absolute" top={0} left={0} right={0} bottom={0} justifyContent="center" alignItems="center" pointerEvents="none">
              <Box marginBottom="xxl"> 
                {/* Visual offset for pin bottom tip */}
                <Image source={require('@/src/assets/marker.png')} style={{ width: 48, height: 48 }} contentFit="contain" />
              </Box>
          </Box>
      )}

      {/* Map Selection UI Overlays */}
      {isSelectingOnMap && (
          <Box position="absolute" bottom={40} left={20} right={20} gap="m">
               <Button onPress={handleConfirmLocation}>
                   <Box flexDirection="row" alignItems="center" gap="s">
                        <Check color="white" size={20} />
                        <Text variant="bodyBold" color="white">Confirm Location</Text>
                   </Box>
               </Button>
               <Button variant="secondary" onPress={() => setIsSelectingOnMap(null)}>
                   <Text variant="bodyBold" color="white">Cancel</Text>
               </Button>
          </Box>
      )}

      {/* Main Terminal UI (Hidden during map selection) */}
      {!isSelectingOnMap && (
        <>
            <Box position="absolute" top={0} marginTop="l" style={{ paddingTop: insets.top }} width="100%" alignItems="center">
                <Box
                bg="primary"
                paddingVertical="m"
                paddingHorizontal="l"
                width="90%"
                borderRadius="xl"
                gap="m"
                elevation={5}
                shadowColor="shadowColor"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.25}
                shadowRadius={3.84}
                >
                    {/* FROM Input */}
                    <Pressable onPress={() => router.push('/location-search?type=origin')}>
                        <Box flexDirection="row" alignItems="center" backgroundColor="mainBackground" padding="m" borderRadius="l">
                             <Box marginRight="s">
                                 <LocateFixed size={20} color={theme.colors.primary} />
                             </Box>
                             <Box flex={1}>
                                 <Text variant="details" color="muted">From:</Text>
                                 <Text variant="bodyBold" numberOfLines={1}>{origin?.address || 'Where are you?'}</Text>
                             </Box>
                        </Box>
                    </Pressable>

                    {/* TO Input */}
                    <Pressable onPress={() => router.push('/location-search?type=destination')}>
                        <Box flexDirection="row" alignItems="center" backgroundColor="mainBackground" padding="m" borderRadius="l">
                             <Box marginRight="s">
                                 <MapPin size={20} color={theme.colors.secondary} />
                             </Box>
                             <Box flex={1}>
                                 <Text variant="details" color="muted">To:</Text>
                                 <Text variant="bodyBold" numberOfLines={1}>{destination?.address || 'Where to?'}</Text>
                             </Box>
                        </Box>
                    </Pressable>

                    <Button
                        style={{ backgroundColor: '#fff' }}
                        paddingVertical="m"
                        onPress={handleFindTricycles}>
                        <Text variant="bodyBold" color="primary">
                        Find Tricycles
                        </Text>
                    </Button>
                </Box>
            </Box>

            {nearbyTerminals && (
                <NearbyTerminalSheet
                    ref={bottomSheetRef}
                    terminals={nearbyTerminals}
                    selectedTerminal={selectedTerminal}
                    onSelectTerminal={handleSelectTerminal}
                    onBack={() => setSelectedTerminal(null)}
                    onGetDirections={handleGetDirections}
                />
            )}
        </>
      )}

      <AlertModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
