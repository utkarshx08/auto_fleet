// ============================================================================
// AUTRAIL REAL-TIME GPS TELEMETRY SIMULATOR ENGINE
// Realistic metropolitan GPS breadcrumbs with heading, speed, & geofence triage
// ============================================================================

import { TRACKING_CONFIG, initialLiveTelemetry, initialGeofences } from '../data/trackingMockData';

/**
 * Step vehicle coordinates along realistic trajectories
 */
export const advanceVehicleTelemetry = (telemetryList, speedLimit = TRACKING_CONFIG.SPEED_LIMIT_KMH) => {
  const newAlerts = [];

  const updatedList = telemetryList.map((veh) => {
    // Only moving vehicles update location
    if (veh.status !== 'moving') {
      return veh;
    }

    // Incremental step in lat/lng (~30-50 meters per 3s tick)
    const latDelta = (Math.random() - 0.48) * 0.0006;
    const lngDelta = (Math.random() - 0.48) * 0.0007;

    const nextLat = Math.round((veh.latitude + latDelta) * 1000000) / 1000000;
    const nextLng = Math.round((veh.longitude + lngDelta) * 1000000) / 1000000;

    // Realistic speed fluctuation (± 3-5 km/h)
    const speedDelta = Math.floor(Math.random() * 7) - 3;
    let nextSpeed = Math.max(20, Math.min(95, veh.speed + speedDelta));

    // Calculate heading from delta
    const angleRad = Math.atan2(lngDelta, latDelta);
    let headingDeg = Math.round((angleRad * 180) / Math.PI);
    if (headingDeg < 0) headingDeg += 360;

    const isOverspeed = nextSpeed > speedLimit;

    // Check if an overspeed alert should be generated
    if (isOverspeed && !veh.isOverspeed) {
      newAlerts.push({
        id: `alt-${Date.now()}-${veh.vehicleId}`,
        vehicleId: veh.vehicleId,
        alertType: 'overspeed',
        message: `Vehicle ${veh.plate} exceeded the fleet limit of ${speedLimit} km/h (Recorded: ${nextSpeed} km/h).`,
        latitude: nextLat,
        longitude: nextLng,
        speed: nextSpeed,
        threshold: speedLimit,
        timestamp: 'Just now',
        isResolved: false
      });
    }

    return {
      ...veh,
      latitude: nextLat,
      longitude: nextLng,
      speed: nextSpeed,
      heading: headingDeg,
      headingText: `${getCompassDirection(headingDeg)} ${headingDeg}°`,
      todayDistance: Math.round((veh.todayDistance + 0.04) * 10) / 10,
      lastUpdated: 'Just now',
      lastTimestamp: new Date().toISOString(),
      isOverspeed
    };
  });

  return {
    telemetryList: updatedList,
    newAlerts
  };
};

/**
 * Convert 0-360 degree bearing to cardinal directions
 */
export const getCompassDirection = (deg) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const normalized = ((Math.round(Number(deg) / 45) % 8) + 8) % 8;
  return directions[normalized] || 'N';
};

/**
 * Format payload according to backend GPS ingestion requirements
 */
export const formatGpsIngestionPayload = (vehicleTelemetry) => {
  return {
    vehicle_id: vehicleTelemetry.vehicleId,
    latitude: vehicleTelemetry.latitude,
    longitude: vehicleTelemetry.longitude,
    speed: vehicleTelemetry.speed,
    heading: vehicleTelemetry.heading,
    recorded_at: vehicleTelemetry.lastTimestamp || new Date().toISOString(),
    source: 'simulator'
  };
};

