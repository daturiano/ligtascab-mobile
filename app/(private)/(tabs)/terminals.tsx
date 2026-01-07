import { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Image } from 'expo-image';
import { MapPin, LocateFixed } from 'lucide-react-native';
import { useTheme } from '@shopify/restyle';

import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Text from '@/src/components/ui/Text';
import MarkerModal from '@/src/components/ui/terminals/MarkerModal';
import NearbyTerminalSheet from '@/src/components/ui/terminals/NearbyTerminalSheet';
import { Terminal } from '@/src/types';
import { NAGA_TERMINALS } from '@/src/utils/constants';
import {
  getDirections,
  reverseGeocode,
  getPlaceDetails,
  PlacePrediction,
} from '@/src/utils/directionsService';
import {
  findNearbyTerminals,
  getCurrentLocation,
  requestLocationPermission,
} from '@/src/utils/locationService';
import LocationInputRow from '@/src/components/ui/terminals/LocationInput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Terminals() {
  const theme = useTheme();
  const { mainBackground } = theme.colors;
  const insets = useSafeAreaInsets();

  const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [pinnedAddress, setPinnedAddress] = useState('');
  const [pinLocation, setPinLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [nearbyTerminals, setNearbyTerminals] = useState<Terminal[] | null>(null);
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[] | null>(null);

  useEffect(() => {
    (async () => {
      const granted = await requestLocationPermission();
      if (!granted) return;

      const loc = await getCurrentLocation();
      if (loc) {
        setOrigin(loc);
        const address = await reverseGeocode(loc.latitude, loc.longitude);
        if (address) setCurrentAddress(address);
      }
    })();
  }, []);

  if (!origin) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const region: Region = {
    ...origin,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const handleUseCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      const address = await reverseGeocode(location.latitude, location.longitude);
      if (address) setCurrentAddress(address);
      setOrigin(location);
    }
  };

  const handleSelectFromPlace = async (place: PlacePrediction) => {
    const details = await getPlaceDetails(place.place_id);
    if (details) {
      setOrigin({ latitude: details.latitude, longitude: details.longitude });
      setCurrentAddress(place.structured_formatting.main_text);
    }
  };

  const handleSelectToPlace = async (place: PlacePrediction) => {
    const details = await getPlaceDetails(place.place_id);
    if (details) {
      setPinLocation({ latitude: details.latitude, longitude: details.longitude });
      setPinnedAddress(place.structured_formatting.main_text);
    }
  };

  const handleFindTricycles = () => {
    if (!origin) return;
    const nearby = findNearbyTerminals(NAGA_TERMINALS, origin, 500);
    setNearbyTerminals(nearby);
    console.log(nearby.length ? nearby : 'No tricycles nearby');
  };

  const handleGetDirections = async () => {
    if (!origin || !selectedTerminal) return;
    const directions = await getDirections(origin, selectedTerminal.map);
    if (directions) setRoute(directions.coords);
  };

  const handleSelectTerminal = (terminal: Terminal) => {
    setSelectedTerminal(terminal);
    setIsModalVisible(true);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MapView
        onPress={async (e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          setPinLocation({ latitude, longitude });
          const address = await reverseGeocode(latitude, longitude);
          if (address) setPinnedAddress(address);
        }}
        style={{ flexGrow: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        showsUserLocation
        followsUserLocation>
        {pinLocation && <Marker coordinate={pinLocation} />}
        {route && route.length > 0 && (
          <Polyline coordinates={route} strokeColor="#1daa88" strokeWidth={5} />
        )}

        {NAGA_TERMINALS.map((terminal) => (
          <Marker
            key={terminal.direction}
            coordinate={terminal.map}
            onPress={() => {
              setSelectedTerminal(terminal);
              setIsModalVisible(true);
            }}>
            <Image style={{ width: 40, height: 40 }} source={require('@/src/assets/marker.png')} />
          </Marker>
        ))}
      </MapView>

      {selectedTerminal && (
        <MarkerModal
          hasRoute={route ? true : false}
          setRoute={setRoute}
          terminal={selectedTerminal}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          handleGetDirections={handleGetDirections}
        />
      )}

      <Box position="absolute" top={0} marginTop="l" style={{ paddingTop: insets.top }} width="100%" alignItems="center">
        <Box
          bg="primary"
          paddingVertical="m"
          paddingHorizontal="l"
          width="80%"
          borderRadius="xl"
          gap="m">
          <LocationInputRow
            icon={<LocateFixed size={20} color={mainBackground} />}
            placeholder="From:"
            value={currentAddress}
            onPressUse={handleUseCurrentLocation}
            onChangeText={setCurrentAddress}
            onSelectPlace={handleSelectFromPlace}
            searchEnabled
            userLocation={origin}
          />

          <LocationInputRow
            icon={<MapPin size={20} color={mainBackground} />}
            placeholder="To:"
            value={pinnedAddress}
            onChangeText={setPinnedAddress}
            onSelectPlace={handleSelectToPlace}
            searchEnabled
            userLocation={origin}
          />

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
        <NearbyTerminalSheet terminals={nearbyTerminals} onSelectTerminal={handleSelectTerminal} />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
