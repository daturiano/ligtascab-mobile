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

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const components = data.results[0].address_components;

      const street = components.find((c: { types: string | string[] }) =>
        c.types.includes('route')
      )?.long_name;
      const city =
        components.find((c: { types: string | string[] }) => c.types.includes('locality'))
          ?.long_name ||
        components.find((c: { types: string | string[] }) =>
          c.types.includes('administrative_area_level_2')
        )?.long_name;

      if (street && city) return `${street} ${city}`;
    }

    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

export type PlacePrediction = {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
};

export async function getPlaceAutocomplete(
  input: string,
  location?: { latitude: number; longitude: number }
): Promise<PlacePrediction[]> {
  if (!input.trim()) return [];

  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Google Maps API key is missing.');
    return [];
  }

  let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&components=country:ph`;

  if (location) {
    url += `&location=${location.latitude},${location.longitude}&radius=50000`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.predictions || [];
  } catch (error) {
    return [];
  }
}

export async function getPlaceDetails(
  placeId: string
): Promise<{ latitude: number; longitude: number; address: string } | null> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Google Maps API key is missing.');
    return null;
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.result?.geometry?.location) {
      return null;
    }

    const { lat, lng } = data.result.geometry.location;
    return {
      latitude: lat,
      longitude: lng,
      address: data.result.formatted_address,
    };
  } catch {
    return null;
  }
}
