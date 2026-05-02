import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Card from '@/src/components/ui/Card';
import Text from '@/src/components/ui/Text';
import { useTerminalStore } from '@/src/store/useTerminalStore';
import { Theme } from '@/src/theme/theme';
import { reverseGeocode } from '@/src/utils/directionsService';
import { getCurrentLocation } from '@/src/utils/locationService';
import { useTheme } from '@shopify/restyle';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDebouncedCallback } from 'use-debounce';

const NAGA_CITY: Region = {
  latitude: 13.6195,
  longitude: 123.1814,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function MapPickerScreen() {
  const router = useRouter();
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ type: 'origin' | 'destination' }>();
  const type: 'origin' | 'destination' = params.type === 'destination' ? 'destination' : 'origin';

  const { setOrigin, setDestination } = useTerminalStore();
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<Region>(NAGA_CITY);
  const [address, setAddress] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  const debouncedGeocode = useDebouncedCallback(async (lat: number, lng: number) => {
    setAddressLoading(true);
    const result = await reverseGeocode(lat, lng);
    setAddress(result ?? 'Unknown location');
    setAddressLoading(false);
  }, 400);

  // On mount: for pickup → center on GPS; for destination → stay on Naga.
  useEffect(() => {
    if (type === 'origin') {
      (async () => {
        const loc = await getCurrentLocation();
        if (loc) {
          const next: Region = {
            latitude: loc.latitude,
            longitude: loc.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegion(next);
          mapRef.current?.animateToRegion(next, 500);
          debouncedGeocode(next.latitude, next.longitude);
        } else {
          debouncedGeocode(NAGA_CITY.latitude, NAGA_CITY.longitude);
        }
      })();
    } else {
      debouncedGeocode(NAGA_CITY.latitude, NAGA_CITY.longitude);
    }
    return () => {
      debouncedGeocode.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = () => {
    const locationData = {
      latitude: region.latitude,
      longitude: region.longitude,
      address: address ?? 'Pinned location',
      name: address ?? 'Pinned location',
    };
    if (type === 'origin') setOrigin(locationData);
    else setDestination(locationData);

    // Pop map-picker AND the location-search modal we came from.
    router.back();
    router.back();
  };

  return (
    <Box flex={1} backgroundColor="mainBackground" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <Box
        flexDirection="row"
        alignItems="center"
        gap="m"
        padding="m"
        backgroundColor="white"
        borderBottomWidth={1}
        borderBottomColor="mutedLighter">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <ArrowLeft size={24} color={theme.colors.mainForeground} />
        </Pressable>
        <Box flex={1}>
          <Text variant="bodyBold">
            {type === 'origin' ? 'Set Pickup Location' : 'Set Destination'}
          </Text>
          <Text variant="details">Pan the map to position the pin</Text>
        </Box>
      </Box>

      {/* Map area */}
      <Box flex={1}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_GOOGLE}
          initialRegion={NAGA_CITY}
          showsUserLocation
          showsMyLocationButton={false}
          onRegionChangeComplete={(r) => {
            setRegion(r);
            debouncedGeocode(r.latitude, r.longitude);
          }}
        />

        {/* Static centered pin overlay. The pin tip points at the screen
            center; marginBottom shifts the icon up so the tip aligns with
            the actual map center, not the icon's box center. */}
        <Box
          style={StyleSheet.absoluteFillObject}
          alignItems="center"
          justifyContent="center"
          pointerEvents="none">
          <MapPin
            size={40}
            color={theme.colors.primary}
            fill={theme.colors.primary}
            stroke="#ffffff"
            strokeWidth={1.5}
            style={{ marginBottom: 40 }}
          />
        </Box>
      </Box>

      {/* Footer */}
      <Box
        paddingHorizontal="l"
        paddingTop="m"
        gap="m"
        backgroundColor="white"
        borderTopWidth={1}
        borderTopColor="mutedLighter"
        style={{ paddingBottom: insets.bottom + 16 }}>
        <Card>
          <Box flexDirection="row" alignItems="center" gap="s">
            <MapPin size={18} color={theme.colors.primary} />
            <Box flex={1}>
              <Text variant="details">Selected location</Text>
              {addressLoading && !address ? (
                <Box flexDirection="row" alignItems="center" gap="s" marginTop="xs">
                  <ActivityIndicator size="small" />
                  <Text variant="body">Locating…</Text>
                </Box>
              ) : (
                <Text variant="body" numberOfLines={2}>
                  {address ?? 'Pan to choose'}
                </Text>
              )}
            </Box>
          </Box>
        </Card>
        <Button
          variant={address && !addressLoading ? 'primary' : 'disabled'}
          disabled={!address || addressLoading}
          onPress={handleConfirm}>
          <Text color="mainBackground" variant="bodyBold">
            Confirm Location
          </Text>
        </Button>
      </Box>
    </Box>
  );
}
