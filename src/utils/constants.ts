export const INITIAL_REGION = {
  latitude: 13.624,
  longitude: 123.185,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

export const violationOptions = [
  { id: 'rude_driver', label: 'Rude Driver' },
  { id: 'overcharging', label: 'Overcharging' },
  { id: 'reckless_driving', label: 'Reckless Driving' },
  { id: 'unsafe_vehicle', label: 'Unsafe Vehicle Condition' },
  { id: 'route_deviation', label: 'Route Deviation' },
  { id: 'poor_hygiene', label: 'Poor Vehicle Hygiene' },
  { id: 'discrimination', label: 'Discrimination' },
  { id: 'smoking', label: 'Smoking in Vehicle' },
  { id: 'other', label: 'Other' },
];

export const NAGA_TERMINALS = [
  {
    direction: 'Calauag',
    map: { latitude: 13.624287057418767, longitude: 123.18544782141437 },
    landmarks: ['Karangahan', 'Ateneo Ave.', 'Bagumbayan Sur'],
  },
  {
    direction: 'CBD Plaza',
    map: { latitude: 13.623906716109602, longitude: 123.18539212521404 },
    landmarks: ['Upgrade Central', 'SM Naga City', 'IBM', 'Bus Terminal'],
  },
  {
    direction: 'Diversion',
    map: { latitude: 13.622611425967284, longitude: 123.18429392453567 },
    landmarks: ['St Peter Diversion', 'S&R', 'Robinsons Mall'],
  },
  {
    direction: 'Van Terminal',
    map: { latitude: 13.622803993878156, longitude: 123.183236047261 },
    landmarks: ['LCC Mall', 'East Bound Terminal'],
  },
];
