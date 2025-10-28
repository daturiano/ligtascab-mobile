import MarkerModal from '@/src/components/ui/terminals/MarkerModal';
import { NAGA_TERMINALS } from '@/src/utils/constants';
import { getCurrentLocation, requestLocationPermission } from '@/src/utils/locationService';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Terminal } from '@/src/types';
import { Image } from 'expo-image';

export default function Terminals() {
  const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);

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
        {NAGA_TERMINALS.map((terminal) => (
          <Marker
            coordinate={terminal.map}
            key={terminal.direction}
            onPress={() => setSelectedTerminal(terminal)}>
            <Image style={{ width: 40, height: 40 }} source={require('@/src/assets/marker.png')} />
          </Marker>
        ))}
      </MapView>

      {selectedTerminal && (
        <MarkerModal
          terminal={selectedTerminal}
          showMarkerModal={!!selectedTerminal}
          setShowMarkerModal={(visible) => {
            if (!visible) setSelectedTerminal(null);
          }}
        />
      )}
    </>
  );
}
