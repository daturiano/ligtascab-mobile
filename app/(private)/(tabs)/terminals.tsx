import MarkerModal from '@/src/components/ui/terminals/MarkerModal';
import { Terminal } from '@/src/types';
import { NAGA_TERMINALS } from '@/src/utils/constants';
import { getDirections } from '@/src/utils/directionsService';
import { getCurrentLocation, requestLocationPermission } from '@/src/utils/locationService';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';

export default function Terminals() {
  const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>([]);
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleGetDirections = async () => {
    if (!origin || !selectedTerminal) return;

    const directions = await getDirections(origin, selectedTerminal.map);
    if (directions) {
      const { coords, duration, distance } = directions;
      console.log(duration, distance);
      setRoute(coords);
    }
  };

  useEffect(() => {
    (async () => {
      const granted = await requestLocationPermission();
      if (!granted) return;
      const loc = await getCurrentLocation();
      if (loc) setOrigin(loc);
    })();
  }, []);

  if (!origin) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const region: Region = {
    ...origin,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <>
      <MapView
        style={{ flexGrow: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        showsUserLocation
        followsUserLocation>
        {route.length > 0 && <Polyline coordinates={route} strokeColor="#1daa88" strokeWidth={5} />}
        {NAGA_TERMINALS.map((terminal) => (
          <Marker
            coordinate={terminal.map}
            key={terminal.direction}
            onPress={() => {
              setIsModalVisible(true);
              setSelectedTerminal(terminal);
            }}>
            <Image style={{ width: 40, height: 40 }} source={require('@/src/assets/marker.png')} />
          </Marker>
        ))}
      </MapView>
      {selectedTerminal && (
        <MarkerModal
          terminal={selectedTerminal}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          handleGetDirections={handleGetDirections}
        />
      )}
    </>
  );
}
