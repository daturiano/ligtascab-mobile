import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_PERMISSION_KEY = 'location_permission_granted';

export async function requestLocationPermission(): Promise<boolean> {
  const stored = await AsyncStorage.getItem(LOCATION_PERMISSION_KEY);

  if (stored === 'true') return true;

  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status === 'granted') {
    await AsyncStorage.setItem(LOCATION_PERMISSION_KEY, 'true');
    return true;
  }

  return false;
}

export async function getCurrentLocation() {
  try {
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}
