import { useState, useEffect, useRef } from 'react';
import { TextInput, FlatList, Pressable, Keyboard, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/src/theme/theme';
import { ArrowLeft, MapPin, Navigation, Map as MapIcon, X } from 'lucide-react-native';
import Box from '@/src/components/ui/Box';
import Text from '@/src/components/ui/Text';
import { useTerminalStore } from '@/src/store/useTerminalStore';
import { getPlaceAutocomplete, getPlaceDetails, PlacePrediction, reverseGeocode } from '@/src/utils/directionsService';
import { getCurrentLocation } from '@/src/utils/locationService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LocationSearchScreen() {
  const router = useRouter();
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ type: 'origin' | 'destination' }>();
  const type = params.type || 'origin';
  
  const { setOrigin, setDestination } = useTerminalStore();
  
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Auto-focus input
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      setLoading(true);
      try {
        const results = await getPlaceAutocomplete(text);
        setSuggestions(results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectPlace = async (place: PlacePrediction) => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const details = await getPlaceDetails(place.place_id);
      if (details) {
        const locationData = {
          latitude: details.latitude,
          longitude: details.longitude,
          address: place.structured_formatting.main_text,
          name: place.structured_formatting.main_text,
        };

        if (type === 'origin') {
          setOrigin(locationData);
        } else {
          setDestination(locationData);
        }
        router.back();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setLoading(true);
    try {
      const location = await getCurrentLocation();
      if (location) {
        const address = await reverseGeocode(location.latitude, location.longitude);
        const locationData = {
          ...location,
          address: address || 'Current Location',
          name: 'Current Location',
        };
        setOrigin(locationData);
        router.back();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChooseOnMap = () => {
    router.push(`/(private)/map-picker?type=${type}` as any);
  };

  return (
    <Box flex={1} backgroundColor="mainBackground" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <Box flexDirection="row" alignItems="center" padding="m" gap="s" borderBottomWidth={1} borderBottomColor="mutedLighter">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <ArrowLeft size={24} color={theme.colors.mainForeground} />
        </Pressable>
        <Box flex={1}>
            <TextInput
            ref={inputRef}
            placeholder={type === 'origin' ? "Where are you?" : "Where to?"}
            placeholderTextColor={theme.colors.muted}
            style={{
                fontSize: 18,
                color: theme.colors.mainForeground,
                fontFamily: 'Nunito_600SemiBold',
                paddingVertical: 8,
            }}
            value={query}
            onChangeText={handleSearch}
            />
        </Box>
        {query.length > 0 && (
            <Pressable onPress={() => handleSearch('')}>
                <X size={20} color={theme.colors.muted} />
            </Pressable>
        )}
      </Box>

      {/* Options List */}
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.place_id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          !query ? (
            <Box>
              {type === 'origin' && (
                <Pressable
                  onPress={handleUseCurrentLocation}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: theme.spacing.l,
                    opacity: pressed ? 0.7 : 1,
                  })}>
                  <Box
                    backgroundColor="primaryLight"
                    padding="s"
                    borderRadius="rounded"
                    marginRight="m">
                    <Navigation size={20} color={theme.colors.primary} fill={theme.colors.primary} />
                  </Box>
                  <Text variant="bodyBold" color="mainForeground">
                    Use current location
                  </Text>
                </Pressable>
              )}
              
              <Pressable
                onPress={handleChooseOnMap}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: theme.spacing.l,
                  opacity: pressed ? 0.7 : 1,
                })}>
                <Box
                  backgroundColor="grayLight"
                  padding="s"
                  borderRadius="rounded"
                  marginRight="m">
                  <MapIcon size={20} color={theme.colors.mutedDark} />
                </Box>
                <Text variant="bodyBold" color="mainForeground">
                  Choose on map
                </Text>
              </Pressable>
            </Box>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelectPlace(item)}
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              padding: theme.spacing.m,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.grayLighter,
              backgroundColor: pressed ? theme.colors.grayLight : 'transparent',
            })}>
            <Box marginRight="m">
              <MapPin size={20} color={theme.colors.muted} />
            </Box>
            <Box flex={1}>
              <Text variant="bodyBold" color="mainForeground">
                {item.structured_formatting.main_text}
              </Text>
              <Text variant="details" numberOfLines={1}>
                {item.structured_formatting.secondary_text}
              </Text>
            </Box>
          </Pressable>
        )}
      />
      {loading && (
        <Box position="absolute" top={100} left={0} right={0} alignItems="center">
            <ActivityIndicator size="small" color={theme.colors.primary} />
        </Box>
      )}
    </Box>
  );
}
