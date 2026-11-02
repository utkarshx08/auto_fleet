// ============================================================================
// AUTRAIL GEOFENCING & RESTRICTED-ZONE MOCK DATA
// Circular & Polygon boundaries with real New York Metropolitan coordinates
// ============================================================================

export const initialGeofenceZones = [
  {
    id: 'geo-1',
    name: 'Manhattan Central Depot',
    description: 'Primary dispatch, overnight charging, and fleet parking hub',
    zoneType: 'depot',
    geometryType: 'circle',
    center: { lat: 40.7589, lng: -73.9851 },
    radius: 1200, // 1.2 km
    speedLimit: 25, // km/h
    maxDwellMinutes: 120,
    entryAlert: true,
    exitAlert: true,
    isActive: true,
    color: '#b49aff',
    vehicleCount: 2,
    createdAt: '2025-01-10T08:00:00Z'
  },
  {
    id: 'geo-2',
    name: 'Brooklyn Navy Yard Fulfillment',
    description: 'Multi-dock maritime cargo transfer and logistics facility',
    zoneType: 'warehouse',
    geometryType: 'polygon',
    coordinates: [
      { lat: 40.7065, lng: -73.9785 },
      { lat: 40.7042, lng: -73.9650 },
      { lat: 40.6975, lng: -73.9680 },
      { lat: 40.6990, lng: -73.9820 },
      { lat: 40.7065, lng: -73.9785 }
    ],
    speedLimit: 30,
    maxDwellMinutes: 60,
    entryAlert: true,
    exitAlert: true,
    isActive: true,
    color: '#8be0b3',
    vehicleCount: 1,
    createdAt: '2025-02-14T09:30:00Z'
  },
  {
    id: 'geo-3',
    name: 'Queens Interborough Bay',
    description: 'Authorized heavy maintenance and certified inspection bay',
    zoneType: 'maintenance',
    geometryType: 'circle',
    center: { lat: 40.7484, lng: -73.9400 },
    radius: 950,
    speedLimit: 20,
    maxDwellMinutes: 180,
    entryAlert: true,
    exitAlert: false,
    isActive: true,
    color: '#e5a46e',
    vehicleCount: 1,
    createdAt: '2025-03-01T11:15:00Z'
  },
  {
    id: 'geo-4',
    name: 'Lower Manhattan Financial Corridor',
    description: 'High-density client delivery and expedited parcel offloading',
    zoneType: 'client',
    geometryType: 'polygon',
    coordinates: [
      { lat: 40.7145, lng: -74.0150 },
      { lat: 40.7160, lng: -74.0040 },
      { lat: 40.7050, lng: -74.0030 },
      { lat: 40.7020, lng: -74.0125 },
      { lat: 40.7145, lng: -74.0150 }
    ],
    speedLimit: 35,
    maxDwellMinutes: 45,
    entryAlert: true,
    exitAlert: true,
    isActive: true,
    color: '#38bdf8',
    vehicleCount: 0,
    createdAt: '2025-04-18T14:20:00Z'
  },
  {
    id: 'geo-5',
    name: 'Holland Tunnel Hazmat Restricted Corridor',
    description: 'Strictly prohibited for commercial freight carrying hazardous or flammable cargo',
    zoneType: 'restricted',
    geometryType: 'polygon',
    coordinates: [
      { lat: 40.7305, lng: -74.0175 },
      { lat: 40.7265, lng: -74.0080 },
      { lat: 40.7230, lng: -74.0110 },
      { lat: 40.7260, lng: -74.0205 },
      { lat: 40.7305, lng: -74.0175 }
    ],
    speedLimit: 40,
    maxDwellMinutes: 15,
    entryAlert: true,
    exitAlert: true,
    isActive: true,
    color: '#ef4444',
    vehicleCount: 0,
    createdAt: '2025-05-02T16:00:00Z'
  },
  {
    id: 'geo-6',
    name: 'Central Park West Pedestrian Buffer',
    description: 'Zero commercial traffic authorization zone; strictly pedestrian and authorized transit only',
    zoneType: 'prohibited',
    geometryType: 'circle',
    center: { lat: 40.7829, lng: -73.9654 },
    radius: 1100,
    speedLimit: 15,
    maxDwellMinutes: 0,
    entryAlert: true,
    exitAlert: true,
    isActive: true,
    color: '#f43f5e',
    vehicleCount: 0,
    createdAt: '2025-06-12T10:45:00Z'
  }
];

export const initialGeofenceAlerts = [
  {
    id: 'geo-alt-101',
    vehicleId: 'RST-263',
    plate: 'RST-263',
    geofenceId: 'geo-5',
    geofenceName: 'Holland Tunnel Hazmat Restricted Corridor',
    zoneType: 'restricted',
    eventType: 'restricted_breach',
    severity: 'critical',
    message: 'CRITICAL: Vehicle entered prohibited Hazmat Corridor without hazardous clearance badge.',
    latitude: 40.7268,
    longitude: -74.0125,
    speed: 44,
    timestamp: '8 mins ago',
    recordedAt: new Date(Date.now() - 480000).toISOString(),
    status: 'new' // 'new', 'acknowledged', 'resolved'
  },
  {
    id: 'geo-alt-102',
    vehicleId: 'RST-284',
    plate: 'RST-284',
    geofenceId: 'geo-2',
    geofenceName: 'Brooklyn Navy Yard Fulfillment',
    zoneType: 'warehouse',
    eventType: 'zone_overspeed',
    severity: 'high',
    message: 'Speed violation: Operating at 42 km/h inside designated 30 km/h warehouse perimeter.',
    latitude: 40.7015,
    longitude: -73.9720,
    speed: 42,
    timestamp: '24 mins ago',
    recordedAt: new Date(Date.now() - 1440000).toISOString(),
    status: 'acknowledged'
  },
  {
    id: 'geo-alt-103',
    vehicleId: 'RST-291',
    plate: 'RST-291',
    geofenceId: 'geo-1',
    geofenceName: 'Manhattan Central Depot',
    zoneType: 'depot',
    eventType: 'geofence_entry',
    severity: 'low',
    message: 'Routine fleet arrival: Checked in to Manhattan Central Depot dispatch bay.',
    latitude: 40.7582,
    longitude: -73.9850,
    speed: 18,
    timestamp: '45 mins ago',
    recordedAt: new Date(Date.now() - 2700000).toISOString(),
    status: 'resolved'
  },
  {
    id: 'geo-alt-104',
    vehicleId: 'RST-276',
    plate: 'RST-276',
    geofenceId: 'geo-3',
    geofenceName: 'Queens Interborough Bay',
    zoneType: 'maintenance',
    eventType: 'excessive_dwell',
    severity: 'medium',
    message: 'Dwell threshold exceeded: Vehicle present in inspection bay for over 195 minutes.',
    latitude: 40.7480,
    longitude: -73.9395,
    speed: 0,
    timestamp: '1 hr ago',
    recordedAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'resolved'
  }
];

export const GEOFENCE_ZONE_TYPES = [
  { value: 'depot', label: 'Fleet Depot / Base', color: '#b49aff' },
  { value: 'client', label: 'Client / Customer Site', color: '#38bdf8' },
  { value: 'warehouse', label: 'Warehouse / Fulfillment Hub', color: '#8be0b3' },
  { value: 'maintenance', label: 'Maintenance / Service Bay', color: '#e5a46e' },
  { value: 'delivery', label: 'Commercial Delivery Zone', color: '#f59e0b' },
  { value: 'restricted', label: 'Restricted Hazmat / Cargo Area', color: '#ef4444' },
  { value: 'prohibited', label: 'Strictly Prohibited No-Go Zone', color: '#f43f5e' }
];

export const PRESET_POLYGON_TEMPLATES = [
  {
    name: 'Brooklyn Navy Yard Quadrant',
    coordinates: [
      { lat: 40.7065, lng: -73.9785 },
      { lat: 40.7042, lng: -73.9650 },
      { lat: 40.6975, lng: -73.9680 },
      { lat: 40.6990, lng: -73.9820 }
    ]
  },
  {
    name: 'Lower Manhattan Commercial Core',
    coordinates: [
      { lat: 40.7145, lng: -74.0150 },
      { lat: 40.7160, lng: -74.0040 },
      { lat: 40.7050, lng: -74.0030 },
      { lat: 40.7020, lng: -74.0125 }
    ]
  },
  {
    name: 'Midtown East Commercial Corridor',
    coordinates: [
      { lat: 40.7600, lng: -73.9750 },
      { lat: 40.7550, lng: -73.9650 },
      { lat: 40.7450, lng: -73.9720 },
      { lat: 40.7500, lng: -73.9820 }
    ]
  }
];

