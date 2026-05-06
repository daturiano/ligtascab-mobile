import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Keyboard, FlatList, Dimensions, Animated } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Image } from 'expo-image';
import { MapPin, LocateFixed, Check, ChevronDown, ChevronRight, Navigation2, MapIcon } from 'lucide-react-native';
import { useTheme } from '@shopify/restyle';
import { useRouter } from 'expo-router';

import Box from '@/src/components/ui/Box';
import Button from '@/src/components/ui/Button';
import Text from '@/src/components/ui/Text';
import AlertModal from '@/src/components/ui/AlertModal';
import { Terminal } from '@/src/types';
import { NAGA_TERMINALS, INITIAL_REGION } from '@/src/utils/constants';
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
import { CLEAN_MAP_STYLE } from '@/src/utils/mapStyle';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;
const CARD_SPACING = 12;

export default function Terminals() {
  const mapRef = useRef<MapView>(null);
  const theme = useTheme<Theme>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const { 
    origin, setOrigin, 
    destination, setDestination, 
    isSelectingOnMap, setIsSelectingOnMap 
  } = useTerminalStore();

  const [nearbyTerminals, setNearbyTerminals] = useState<Terminal[] | null>(null);
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[] | null>(null);
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: '',
    message: '',
  });
  
  // For dragging map selection
  const [mapCenter, setMapCenter] = useState<{ latitude: number; longitude: number } | null>(null);

  // Animation for collapsing
  const collapseAnim = useRef(new Animated.Value(0)).current;

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
        edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
        animated: true,
      });
    }
  }, [route]);

  const handleStartSelecting = async (mode: 'origin' | 'destination') => {
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
    setSelectedTerminal(null);
    setRoute(null);

    // Collapse the search card
    setIsSearchCollapsed(true);
    Animated.spring(collapseAnim, {
      toValue: 1,
      useNativeDriver: false,
      speed: 14,
    }).start();

    // Fit map to show all terminals
    const coords = nearby.map(t => t.map);
    if (origin) coords.push({ latitude: origin.latitude, longitude: origin.longitude });
    setTimeout(() => {
      mapRef.current?.fitToCoordinates(coords, {
        edgePadding: { top: insets.top + 80, right: 50, bottom: 220, left: 50 },
        animated: true,
      });
    }, 300);
  };

  const handleExpandSearch = () => {
    setIsSearchCollapsed(false);
    Animated.spring(collapseAnim, {
      toValue: 0,
      useNativeDriver: false,
      speed: 14,
    }).start();
  };

  const handleGetDirections = async () => {
    if (!origin || !selectedTerminal) return;
    
    const directions = await getDirections(origin, selectedTerminal.map);
    if (directions) setRoute(directions.coords);
  };

  const handleSelectTerminal = (terminal: Terminal, index: number) => {
    setSelectedTerminal(terminal);
    setRoute(null);
    
    // Zoom to terminal
    mapRef.current?.animateToRegion({
        ...terminal.map,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    }, 500);

    // Scroll the horizontal list to center this card
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  if (!origin && !isSelectingOnMap) {
     return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color="#1FAB89" />
            <Text style={{ marginTop: 12, color: '#737373', fontFamily: 'Nunito_300Light' }}>Finding your location...</Text>
        </View>
     )
  }

  // Render a single horizontal terminal card
  const renderTerminalCard = ({ item, index }: { item: Terminal; index: number }) => {
    const isSelected = selectedTerminal?.direction === item.direction;
    return (
      <Pressable onPress={() => handleSelectTerminal(item, index)}>
        <Box
          width={CARD_WIDTH}
          marginLeft={index === 0 ? 'l' : undefined}
          marginRight="m"
          backgroundColor={isSelected ? 'primary' : 'cardBackground'}
          borderRadius="l"
          padding="m"
          shadowColor="shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={4}
          elevation={3}>
          {/* Row: same style as NearbyTerminalCard */}
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box flexDirection="row" gap="m" alignItems="center" flex={1}>
              <Box
                backgroundColor={isSelected ? 'primaryDark' : 'primaryLight'}
                padding="s"
                borderRadius="rounded"
                alignItems="center"
                justifyContent="center">
                <Image
                  source={require('@/src/assets/motorbike.png')}
                  style={{ width: 32, height: 32 }}
                />
              </Box>
              <Box flexDirection="column" flex={1}>
                <Text
                  variant="bodyBold"
                  color={isSelected ? 'white' : 'mainForeground'}
                  numberOfLines={1}>
                  {item.direction}
                </Text>
                <Text
                  variant="details"
                  color={isSelected ? 'primaryLight' : 'muted'}>
                  Tricycle Terminal
                </Text>
              </Box>
            </Box>
            <ChevronRight size={24} color={isSelected ? '#a0d5c2' : theme.colors.muted} />
          </Box>

          {/* Get Directions button (only on selected) */}
          {isSelected && (
            <Pressable
              onPress={handleGetDirections}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 12,
                paddingVertical: 10,
                marginTop: 12,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 6,
              }}>
              <Navigation2 size={16} color={theme.colors.primary} />
              <Text variant="bodyBold" color="primary" fontSize={14}>
                Get Directions
              </Text>
            </Pressable>
          )}
        </Box>
      </Pressable>
    );
  };

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
        } : INITIAL_REGION}
        customMapStyle={CLEAN_MAP_STYLE}
        >
        
        {/* Render Markers only if NOT selecting */}
        {!isSelectingOnMap && (
           <>
             {destination && <Marker coordinate={destination} />}
             {route && route.length > 0 && (
               <Polyline coordinates={route} strokeColor="#1daa88" strokeWidth={5} />
             )}
    
             {/* Show Terminals if Found */}
             {nearbyTerminals && NAGA_TERMINALS.map((terminal) => {
               const isActive = selectedTerminal?.direction === terminal.direction;
               return (
                <Marker
                  key={terminal.direction}
                  coordinate={terminal.map}
                  tracksViewChanges={isActive}
                  anchor={{ x: 0.5, y: 0.5 }}
                  onPress={() => {
                    const idx = nearbyTerminals.findIndex(t => t.direction === terminal.direction);
                    if (idx >= 0) handleSelectTerminal(terminal, idx);
                  }}>
                  <View style={{ width: 68, height: 68, alignItems: 'center', justifyContent: 'center' }}>
                    {isActive ? (
                      <View style={{
                        backgroundColor: 'rgba(31, 171, 137, 0.15)',
                        borderRadius: 999,
                        padding: 6,
                        borderWidth: 2,
                        borderColor: theme.colors.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Image style={{ width: 44, height: 44 }} source={require('@/src/assets/marker.png')} />
                      </View>
                    ) : (
                      <Image style={{ width: 36, height: 36 }} source={require('@/src/assets/marker.png')} />
                    )}
                  </View>
                </Marker>
               );
             })}
           </>
        )}
      </MapView>

      {/* Map Selection Center Pin */}
      {isSelectingOnMap && (
          <Box position="absolute" top={0} left={0} right={0} bottom={0} justifyContent="center" alignItems="center" pointerEvents="none">
              <Box marginBottom="xxl"> 
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
            {/* ====== COLLAPSED SEARCH SUMMARY ====== */}
            {isSearchCollapsed ? (
              <Pressable
                onPress={handleExpandSearch}
                style={{
                  position: 'absolute',
                  top: insets.top + 12,
                  left: 16,
                  right: 16,
                }}>
                <Box
                  backgroundColor="primary"
                  paddingVertical="m"
                  paddingHorizontal="l"
                  borderRadius="xl"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  elevation={5}
                  shadowColor="shadowColor"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.25}
                  shadowRadius={3.84}>
                  <Box flexDirection="row" alignItems="center" gap="s" flex={1}>
                    <MapIcon size={18} color="white" />
                    <Text variant="bodyBold" color="white" fontSize={14} numberOfLines={1} flex={1}>
                      {nearbyTerminals?.length || 0} terminals near you
                    </Text>
                  </Box>
                  <Box
                    backgroundColor="primaryDark"
                    padding="xs"
                    borderRadius="rounded">
                    <ChevronDown size={18} color="white" />
                  </Box>
                </Box>
              </Pressable>
            ) : (
              /* ====== EXPANDED SEARCH CARD ====== */
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
                  shadowRadius={3.84}>

                    {/* FROM Input */}
                    <Pressable onPress={() => router.push('/location-search?type=origin')}>
                        <Box
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between"
                          backgroundColor="mainBackground"
                          padding="m"
                          borderRadius="l">
                          <Box flexDirection="row" gap="m" alignItems="center" flex={1}>
                            <Box
                              backgroundColor="primaryLight"
                              padding="s"
                              borderRadius="rounded"
                              alignItems="center"
                              justifyContent="center">
                              <LocateFixed size={20} color={theme.colors.primary} />
                            </Box>
                            <Box flexDirection="column" flex={1}>
                              <Text variant="details" color="muted">From:</Text>
                              <Text variant="bodyBold" numberOfLines={1}>{origin?.address || 'Where are you?'}</Text>
                            </Box>
                          </Box>
                          <ChevronRight size={20} color={theme.colors.muted} />
                        </Box>
                    </Pressable>

                    {/* TO Input */}
                    <Pressable onPress={() => router.push('/location-search?type=destination')}>
                        <Box
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between"
                          backgroundColor="mainBackground"
                          padding="m"
                          borderRadius="l">
                          <Box flexDirection="row" gap="m" alignItems="center" flex={1}>
                            <Box
                              backgroundColor="secondaryLighter"
                              padding="s"
                              borderRadius="rounded"
                              alignItems="center"
                              justifyContent="center">
                              <MapPin size={20} color={theme.colors.secondary} />
                            </Box>
                            <Box flexDirection="column" flex={1}>
                              <Text variant="details" color="muted">To:</Text>
                              <Text variant="bodyBold" numberOfLines={1}>{destination?.address || 'Where to?'}</Text>
                            </Box>
                          </Box>
                          <ChevronRight size={20} color={theme.colors.muted} />
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
            )}

            {/* ====== HORIZONTAL TERMINAL CARD STRIP ====== */}
            {nearbyTerminals && nearbyTerminals.length > 0 && (
              <Box
                position="absolute"
                bottom={16}
                left={0}
                right={0}>
                <FlatList
                  ref={flatListRef}
                  data={nearbyTerminals}
                  renderItem={renderTerminalCard}
                  keyExtractor={(item) => item.direction}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={CARD_WIDTH + CARD_SPACING}
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingRight: 16 }}
                  onScrollToIndexFailed={() => {}}
                />
              </Box>
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
