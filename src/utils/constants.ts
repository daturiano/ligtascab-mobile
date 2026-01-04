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
    direction: 'Calauag Terminal',
    map: { latitude: 13.624287057418767, longitude: 123.18544782141437 },
    landmarks: ['Karangahan', 'Ateneo Ave.', 'Bagumbayan Sur'],
  },
  {
    direction: 'CBD Plaza Terminal',
    map: { latitude: 13.623906716109602, longitude: 123.18539212521404 },
    landmarks: ['Upgrade Central', 'SM Naga City', 'IBM', 'Bus Terminal'],
  },
  {
    direction: 'Diversion Terminal',
    map: { latitude: 13.622611425967284, longitude: 123.18429392453567 },
    landmarks: ['St Peter Diversion', 'S&R', 'Robinsons Mall'],
  },
  {
    direction: 'Van Terminal',
    map: { latitude: 13.622803993878156, longitude: 123.183236047261 },
    landmarks: ['LCC Mall', 'East Bound Terminal'],
  },
  {
    direction: 'Magsaysay Avenue Terminal',
    map: { latitude: 13.620394, longitude: 123.193278 },
    landmarks: ['Centro Square', 'Starbucks', 'Dayangdang'],
  },
  {
    direction: 'Concepcion Pequeña Terminal',
    map: { latitude: 13.618933, longitude: 123.207181 },
    landmarks: ['Savemore', 'Naga College Foundation', 'Concepcion Church'],
  },
  {
    direction: 'Triangulo Terminal',
    map: { latitude: 13.617785, longitude: 123.190486 },
    landmarks: ['Elias Angeles St.', 'Tinago', 'Peñafrancia Shrine'],
  },
  {
    direction: 'Pacol Terminal',
    map: { latitude: 13.6068, longitude: 123.2066 },
    landmarks: ['Pacol Terminal', 'Camarines Sur National HS', 'Villa Grande'],
  },
  {
    direction: 'Cararayan Terminal',
    map: { latitude: 13.630821, longitude: 123.171055 },
    landmarks: ['Cararayan Elementary School', 'San Felipe Bridge'],
  },
  {
    direction: 'San Felipe Terminal',
    map: { latitude: 13.626133, longitude: 123.176414 },
    landmarks: ['Bichara Compound', 'San Felipe Church', 'Buenavista Road'],
  },
  {
    direction: 'Del Rosario Terminal',
    map: { latitude: 13.618259996283326, longitude: 123.2335910262252 },
    landmarks: ['Vista Mall', 'Casureco II', 'Wilcon Naga'],
  },
];
