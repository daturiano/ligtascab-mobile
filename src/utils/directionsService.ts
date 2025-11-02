import { decode } from '@mapbox/polyline';

type Coordinates = { latitude: number; longitude: number };

type DirectionsResult = {
  coords: Coordinates[];
  duration: string;
  distance: string;
} | null;

export async function getDirections(
  origin: Coordinates,
  destination: Coordinates
): Promise<DirectionsResult> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error('Google Maps API key is missing.');

  const originStr = `${origin.latitude},${origin.longitude}`;
  const destinationStr = `${destination.latitude},${destination.longitude}`;

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&mode=walking&alternatives=true&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Directions API error:', data.status, data.error_message);
      return null;
    }

    // Pick the fastest (shortest duration) route
    const fastestRoute = data.routes.reduce((fastest: any, current: any) => {
      const currentDuration = current.legs[0]?.duration?.value ?? Infinity;
      const fastestDuration = fastest.legs[0]?.duration?.value ?? Infinity;
      return currentDuration < fastestDuration ? current : fastest;
    }, data.routes[0]);

    const points = fastestRoute.overview_polyline.points;
    const coords = decode(points).map(([latitude, longitude]) => ({
      latitude,
      longitude,
    }));

    return {
      coords,
      duration: fastestRoute.legs[0].duration.text,
      distance: fastestRoute.legs[0].distance.text,
    };
  } catch (error) {
    console.error('Error fetching directions:', error);
    return null;
  }
}

export async function geocodeAddress(address: string) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK' || !data.results.length) return null;

  const { lat, lng } = data.results[0].geometry.location;
  return { latitude: lat, longitude: lng };
}
