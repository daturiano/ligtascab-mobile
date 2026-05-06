import { geocodeAddress, getDirections } from '@/src/utils/directionsService';
import { getCurrentLocation, requestLocationPermission } from '@/src/utils/locationService';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, TextInput, View } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';

export default function NavigationMap() {
  const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const granted = await requestLocationPermission();
      if (!granted) return;
      const loc = await getCurrentLocation();
      if (loc) setOrigin(loc);
    })();
  }, []);

  const handleGetDirections = async () => {
    if (!origin || !address) return;

    setLoading(true);
    const destCoords = await geocodeAddress(address);
    if (!destCoords) {
      alert('Destination not found');
      setLoading(false);
      return;
    }

    setDestination(destCoords);
    const routeCoords = await getDirections(origin, destCoords);
    setRoute(routeCoords?.coords || []);
    setLoading(false);
  };

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
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} initialRegion={region} showsUserLocation followsUserLocation>
        {destination && <Marker coordinate={destination} title="Destination" />}
        {route.length > 0 && <Polyline coordinates={route} strokeColor="#1daa88" strokeWidth={5} />}
      </MapView>

      {/* Input UI overlay */}
      <View className="absolute top-12 left-4 right-4 bg-white rounded-xl p-3 shadow">
        <TextInput
          placeholder="Enter destination address"
          value={address}
          onChangeText={setAddress}
          className="border-b border-gray-300 py-2 text-base"
        />
        <Button title="Get Directions" onPress={handleGetDirections} disabled={loading} />
      </View>
    </View>
  );
}
