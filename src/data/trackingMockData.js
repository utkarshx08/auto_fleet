// ============================================================================
// AUTRAIL REAL-TIME GPS TRACKING & TELEMETRY SEED DATA
// Real coordinates across the New York Metropolitan Corridor
// ============================================================================

export const TRACKING_CONFIG = {
  SPEED_LIMIT_KMH: 80,
  OFFLINE_TIMEOUT_MINUTES: 15,
  UPDATE_INTERVAL_MS: 3000,
  MAP_DEFAULT_CENTER: [40.730610, -73.935242], // NYC Metro center
  MAP_DEFAULT_ZOOM: 11
};

export const initialGeofences = [
  {
    id: 'geo-1',
    name: 'Manhattan Central Depot',
    description: 'Primary dispatch and overnight fleet parking facility',
    latitude: 40.7589,
    longitude: -73.9851,
    radius: 1200,
    zoneType: 'depot',
    color: '#b49aff'
  },
  {
    id: 'geo-2',
    name: 'Brooklyn Navy Yard Fulfillment',
    description: 'High-volume parcel distribution hub',
    latitude: 40.7023,
    longitude: -73.9712,
    radius: 1500,
    zoneType: 'client',
    color: '#8be0b3'
  },
  {
    id: 'geo-3',
    name: 'Queens Interborough Bay',
    description: 'Authorized commercial maintenance inspection bay',
    latitude: 40.7484,
    longitude: -73.9400,
    radius: 1000,
    zoneType: 'maintenance',
    color: '#e5a46e'
  }
];

export const initialLiveTelemetry = [
  {
    vehicleId: 'RST-291',
    plate: 'RST-291',
    model: 'Mercedes-Benz Sprinter 3500',
    driver: 'Aarav Sharma',
    driverPhone: '+91 98765 43210',
    latitude: 40.7580,
    longitude: -73.9855,
    speed: 48,
    heading: 42,
    headingText: 'NE 42°',
    status: 'moving', // 'moving', 'idle', 'stopped', 'offline'
    lastUpdated: '10s ago',
    lastTimestamp: new Date(Date.now() - 10000).toISOString(),
    assignedRoute: 'Midtown Express Loop',
    todayDistance: 134.5,
    fuel: 78,
    gpsAccuracy: '±4m (Optimal)',
    locationName: 'Broadway & W 47th St, Manhattan',
    ignition: true,
    isOverspeed: false
  },
  {
    vehicleId: 'RST-284',
    plate: 'RST-284',
    model: 'Ford Transit Cargo',
    driver: 'Priya Patel',
    driverPhone: '+91 98765 43211',
    latitude: 40.6892,
    longitude: -73.9840,
    speed: 52,
    heading: 175,
    headingText: 'S 175°',
    status: 'moving',
    lastUpdated: '35s ago',
    lastTimestamp: new Date(Date.now() - 35000).toISOString(),
    assignedRoute: 'Brooklyn River Corridor',
    todayDistance: 168.2,
    fuel: 64,
    gpsAccuracy: '±5m (Good)',
    locationName: 'Flatbush Ave & Atlantic Ave, Brooklyn',
    ignition: true,
    isOverspeed: false
  },
  {
    vehicleId: 'RST-276',
    plate: 'RST-276',
    model: 'Renault Master Commercial',
    driver: 'Rohan Verma',
    driverPhone: '+91 98765 43212',
    latitude: 40.7410,
    longitude: -73.9210,
    speed: 0,
    heading: 0,
    headingText: 'Stationary',
    status: 'idle', // engine running, stationary
    lastUpdated: '2m ago',
    lastTimestamp: new Date(Date.now() - 120000).toISOString(),
    assignedRoute: 'Queens Service Hub',
    todayDistance: 45.0,
    fuel: 32,
    gpsAccuracy: '±3m (Optimal)',
    locationName: 'Queens Blvd Bay #2, Queens',
    ignition: true,
    isOverspeed: false
  },
  {
    vehicleId: 'RST-265',
    plate: 'RST-265',
    model: 'Volkswagen Crafter 30',
    driver: 'Ananya Iyer',
    driverPhone: '+91 98765 43213',
    latitude: 40.7180,
    longitude: -74.0420,
    speed: 0,
    heading: 0,
    headingText: 'Stationary',
    status: 'stopped', // engine off
    lastUpdated: '8m ago',
    lastTimestamp: new Date(Date.now() - 480000).toISOString(),
    assignedRoute: 'Jersey City Depot Standby',
    todayDistance: 0.0,
    fuel: 91,
    gpsAccuracy: '±5m (Good)',
    locationName: 'Grove St Terminal, Jersey City',
    ignition: false,
    isOverspeed: false
  },
  {
    vehicleId: 'RST-263',
    plate: 'RST-263',
    model: 'Ram ProMaster 2500',
    driver: 'Rajesh Kumar',
    driverPhone: '+91 98765 43214',
    latitude: 40.8380,
    longitude: -73.8820,
    speed: 86, // Overspeed alert!
    heading: 18,
    headingText: 'N 18°',
    status: 'moving',
    lastUpdated: '5s ago',
    lastTimestamp: new Date(Date.now() - 5000).toISOString(),
    assignedRoute: 'Bronx Cross-County Freight',
    todayDistance: 192.4,
    fuel: 14,
    gpsAccuracy: '±4m (Optimal)',
    locationName: 'Cross Bronx Expressway (I-95)',
    ignition: true,
    isOverspeed: true
  },
  {
    vehicleId: 'RST-251',
    plate: 'RST-251',
    model: 'Iveco Daily 35S',
    driver: 'Neha Gupta',
    driverPhone: '+91 98765 43215',
    latitude: 40.5890,
    longitude: -74.1480,
    speed: 0,
    heading: 220,
    headingText: 'SW 220°',
    status: 'offline', // no GPS ping for > 15 mins
    lastUpdated: '42m ago',
    lastTimestamp: new Date(Date.now() - 2520000).toISOString(),
    assignedRoute: 'Staten Island Express Loop',
    todayDistance: 82.0,
    fuel: 82,
    gpsAccuracy: 'No Signal',
    locationName: 'Staten Island Expressway Westbound',
    ignition: false,
    isOverspeed: false
  }
];

// Historical Journey Waypoints for RST-291 Journey Playback (25 waypoints)
export const mockHistoricalJourney = {
  vehicleId: 'RST-291',
  date: '2025-10-24',
  routeName: 'Midtown Express Loop (FDR Drive & Manhattan Spine)',
  totalDistance: 24.8, // km
  averageSpeed: 42.5, // km/h
  maximumSpeed: 74.0, // km/h
  startTime: '08:15 AM',
  endTime: '09:25 AM',
  waypoints: [
    { index: 0, lat: 40.7614, lng: -73.9776, speed: 28, heading: 110, time: '08:15 AM', location: 'Queensboro Bridge Manhattan Approach' },
    { index: 1, lat: 40.7580, lng: -73.9650, speed: 45, heading: 180, time: '08:18 AM', location: 'FDR Drive Southbound & E 60th St' },
    { index: 2, lat: 40.7520, lng: -73.9680, speed: 58, heading: 190, time: '08:21 AM', location: 'FDR Drive & E 48th St (UN Plaza)' },
    { index: 3, lat: 40.7440, lng: -73.9710, speed: 64, heading: 195, time: '08:24 AM', location: 'FDR Drive Overpass & E 34th St' },
    { index: 4, lat: 40.7320, lng: -73.9740, speed: 68, heading: 190, time: '08:27 AM', location: 'FDR Drive & E 23rd St Waterside' },
    { index: 5, lat: 40.7200, lng: -73.9750, speed: 74, heading: 185, time: '08:30 AM', location: 'FDR Drive & Houston St Viaduct (Peak Speed)' },
    { index: 6, lat: 40.7130, lng: -73.9770, speed: 60, heading: 200, time: '08:33 AM', location: 'FDR Drive & Williamsburg Bridge underpass' },
    { index: 7, lat: 40.7090, lng: -73.9840, speed: 46, heading: 220, time: '08:36 AM', location: 'FDR Drive & Manhattan Bridge underpass' },
    { index: 8, lat: 40.7060, lng: -73.9980, speed: 38, heading: 235, time: '08:39 AM', location: 'South St Seaport & Brooklyn Bridge' },
    { index: 9, lat: 40.7030, lng: -74.0090, speed: 30, heading: 260, time: '08:42 AM', location: 'Battery Park Underpass Approach' },
    { index: 10, lat: 40.7050, lng: -74.0150, speed: 22, heading: 340, time: '08:46 AM', location: 'West St / Route 9A & Battery Place' },
    { index: 11, lat: 40.7120, lng: -74.0140, speed: 35, heading: 0, time: '08:50 AM', location: 'World Trade Center & Vesey St' },
    { index: 12, lat: 40.7220, lng: -74.0110, speed: 42, heading: 10, time: '08:54 AM', location: 'West Side Highway & Canal St' },
    { index: 13, lat: 40.7350, lng: -74.0090, speed: 48, heading: 15, time: '08:58 AM', location: 'West Side Highway & 14th St Meatpacking' },
    { index: 14, lat: 40.7480, lng: -74.0060, speed: 40, heading: 20, time: '09:03 AM', location: '11th Ave & W 23rd St Chelsea' },
    { index: 15, lat: 40.7550, lng: -74.0010, speed: 32, heading: 45, time: '09:07 AM', location: 'Hudson Yards & W 34th St' },
    { index: 16, lat: 40.7580, lng: -73.9920, speed: 24, heading: 70, time: '09:12 AM', location: 'W 42nd St & 8th Ave (Port Authority)' },
    { index: 17, lat: 40.7580, lng: -73.9855, speed: 0, heading: 42, time: '09:20 AM', location: 'Broadway & W 47th St Times Square (Destination)' }
  ]
};

export const initialTrackingAlerts = [
  {
    id: 'trk-alt-01',
    vehicleId: 'RST-263',
    alertType: 'overspeed',
    message: 'Vehicle speed reached 86 km/h, exceeding the 80 km/h fleet threshold on Cross Bronx Expressway.',
    latitude: 40.8380,
    longitude: -73.8820,
    speed: 86,
    threshold: 80,
    timestamp: '5 mins ago',
    isResolved: false
  },
  {
    id: 'trk-alt-02',
    vehicleId: 'RST-251',
    alertType: 'offline',
    message: 'GPS telemetry heartbeat lost for over 42 minutes. Last recorded location: Staten Island Expressway.',
    latitude: 40.5890,
    longitude: -74.1480,
    speed: 0,
    threshold: null,
    timestamp: '42 mins ago',
    isResolved: false
  },
  {
    id: 'trk-alt-03',
    vehicleId: 'RST-284',
    alertType: 'geofence_exit',
    message: 'Vehicle exited Brooklyn Navy Yard Fulfillment geofence perimeter.',
    latitude: 40.6892,
    longitude: -73.9840,
    speed: 52,
    threshold: null,
    timestamp: '1 hr ago',
    isResolved: true
  }
];

