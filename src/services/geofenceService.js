// ============================================================================
// AUTRAIL GEOFENCING & BREACH DETECTION ENGINE
// Haversine distance, Ray-casting Point-in-Polygon, and Anti-Duplicate State Machine
// ============================================================================

import { initialGeofenceZones, initialGeofenceAlerts } from '../data/geofenceMockData.js';

// In-memory geofence registry
let geofenceZones = [...initialGeofenceZones];
let geofenceAlerts = [...initialGeofenceAlerts];

// Vehicle containment state machine:
// { [vehicleId]: { [geofenceId]: { isInside: boolean, enteredAt: number, lastAlertTime: number } } }
const vehicleStateMap = {};

/**
 * Calculate great-circle distance between two GPS coordinates using the Haversine formula.
 * Returns distance in meters.
 */
export const haversineDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Generates an approximated circular GeoJSON polygon with 64 vertices
 */
export const createGeoJsonCircle = (center, radiusInMeters, points = 64) => {
  if (!center) return null;
  const coords = [];
  const km = radiusInMeters / 1000;
  const distanceX = km / (111.32 * Math.cos((center.lat * Math.PI) / 180));
  const distanceY = km / 110.574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([center.lng + x, center.lat + y]);
  }
  coords.push(coords[0]); // Close ring

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [coords]
    }
  };
};

/**
 * Converts any geofence object (circle or polygon) into a GeoJSON Feature
 */
export const createGeoJsonFeature = (zone) => {
  if (!zone) return null;
  if (zone.geometryType === 'circle' && zone.center) {
    return createGeoJsonCircle(zone.center, zone.radius || 1000);
  }
  if (zone.geometryType === 'polygon' && zone.coordinates?.length >= 3) {
    const ring = zone.coordinates.map((c) => [c.lng, c.lat]);
    if (
      ring[0][0] !== ring[ring.length - 1][0] ||
      ring[0][1] !== ring[ring.length - 1][1]
    ) {
      ring.push(ring[0]);
    }
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [ring]
      }
    };
  }
  if (zone.latitude && zone.longitude && zone.radius) {
    return createGeoJsonCircle({ lat: zone.latitude, lng: zone.longitude }, zone.radius);
  }
  return null;
};

/**
 * Check if a coordinate is inside a circular geofence.
 */
export const isPointInCircle = (point, center, radiusMeters) => {
  if (!point || !center || typeof radiusMeters !== 'number') return false;
  const distance = haversineDistanceMeters(point.lat, point.lng, center.lat, center.lng);
  return distance <= radiusMeters;
};

/**
 * Ray-Casting algorithm (Jordan Curve Theorem) to determine if a point lies inside a polygon.
 * Works for any non-self-intersecting polygon.
 * point: { lat, lng }
 * polygon: [{ lat, lng }, ...]
 */
export const isPointInPolygon = (point, polygon) => {
  if (!point || !Array.isArray(polygon) || polygon.length < 3) return false;

  const x = point.lng;
  const y = point.lat;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
};

/**
 * Dispatches containment test based on geofence geometry type ('circle' vs 'polygon').
 */
export const isVehicleInsideGeofence = (vehicleLocation, geofence) => {
  if (!geofence.isActive) return false;

  const point = {
    lat: Number(vehicleLocation.latitude ?? vehicleLocation.lat),
    lng: Number(vehicleLocation.longitude ?? vehicleLocation.lng)
  };

  if (isNaN(point.lat) || isNaN(point.lng)) return false;

  if (geofence.geometryType === 'polygon' && Array.isArray(geofence.coordinates)) {
    return isPointInPolygon(point, geofence.coordinates);
  }

  if (geofence.geometryType === 'circle' && geofence.center) {
    return isPointInCircle(point, geofence.center, geofence.radius);
  }

  // Fallback for legacy geofences with direct lat/lng/radius properties
  if (geofence.latitude && geofence.longitude && geofence.radius) {
    return isPointInCircle(
      point,
      { lat: geofence.latitude, lng: geofence.longitude },
      geofence.radius
    );
  }

  return false;
};

/**
 * Evaluate vehicle coordinates against all active geofences.
 * Detects:
 * 1. Entry breach
 * 2. Exit breach
 * 3. Restricted/prohibited corridor breach (Critical Severity)
 * 4. In-zone speed limit breach
 * 5. Excessive dwell time breach
 * Avoids duplicate alerts using the transition state machine.
 */
export const evaluateVehicleGeofences = (vehicle, activeGeofences = geofenceZones) => {
  const generatedAlerts = [];
  const vehicleId = vehicle.vehicleId || vehicle.id || vehicle.plate;
  if (!vehicleId) return generatedAlerts;

  if (!vehicleStateMap[vehicleId]) {
    vehicleStateMap[vehicleId] = {};
  }

  const now = Date.now();
  const currentSpeed = Number(vehicle.speed || 0);
  const location = {
    lat: Number(vehicle.latitude ?? vehicle.lat),
    lng: Number(vehicle.longitude ?? vehicle.lng)
  };

  activeGeofences.forEach((zone) => {
    if (!zone.isActive) return;

    const previousState = vehicleStateMap[vehicleId][zone.id] || {
      isInside: false,
      enteredAt: null,
      lastSpeedAlert: 0,
      lastDwellAlert: 0
    };

    const isInsideNow = isVehicleInsideGeofence(location, zone);

    // 1. Transition: Outside -> Inside (ENTRY)
    if (!previousState.isInside && isInsideNow) {
      previousState.isInside = true;
      previousState.enteredAt = now;

      // Restricted or Prohibited Zone Breach (CRITICAL)
      if (zone.zoneType === 'restricted' || zone.zoneType === 'prohibited') {
        generatedAlerts.push({
          id: `geo-alt-${Date.now()}-${vehicleId}-${zone.id}`,
          vehicleId,
          plate: vehicle.plate || vehicleId,
          geofenceId: zone.id,
          geofenceName: zone.name,
          zoneType: zone.zoneType,
          eventType: 'restricted_breach',
          severity: 'critical',
          message: `CRITICAL BREACH: Vehicle ${vehicle.plate || vehicleId} penetrated ${zone.name} (${zone.zoneType.toUpperCase()} AREA).`,
          latitude: location.lat,
          longitude: location.lng,
          speed: currentSpeed,
          timestamp: 'Just now',
          recordedAt: new Date().toISOString(),
          status: 'new'
        });
      } else if (zone.entryAlert) {
        // Standard Authorized Entry
        generatedAlerts.push({
          id: `geo-alt-${Date.now()}-${vehicleId}-${zone.id}`,
          vehicleId,
          plate: vehicle.plate || vehicleId,
          geofenceId: zone.id,
          geofenceName: zone.name,
          zoneType: zone.zoneType,
          eventType: 'geofence_entry',
          severity: 'low',
          message: `Vehicle ${vehicle.plate || vehicleId} entered perimeter of ${zone.name}.`,
          latitude: location.lat,
          longitude: location.lng,
          speed: currentSpeed,
          timestamp: 'Just now',
          recordedAt: new Date().toISOString(),
          status: 'new'
        });
      }
    }

    // 2. Continuous State: Vehicle is Inside Geofence
    else if (previousState.isInside && isInsideNow) {
      // Check Speed Limit in Zone (Throttle to once every 60s per vehicle per zone)
      if (
        zone.speedLimit &&
        currentSpeed > zone.speedLimit &&
        now - (previousState.lastSpeedAlert || 0) > 60000
      ) {
        previousState.lastSpeedAlert = now;
        generatedAlerts.push({
          id: `geo-alt-${Date.now()}-${vehicleId}-${zone.id}-spd`,
          vehicleId,
          plate: vehicle.plate || vehicleId,
          geofenceId: zone.id,
          geofenceName: zone.name,
          zoneType: zone.zoneType,
          eventType: 'zone_overspeed',
          severity: 'high',
          message: `Speed Violation: Vehicle ${vehicle.plate || vehicleId} traveling at ${currentSpeed} km/h (Limit: ${zone.speedLimit} km/h in ${zone.name}).`,
          latitude: location.lat,
          longitude: location.lng,
          speed: currentSpeed,
          timestamp: 'Just now',
          recordedAt: new Date().toISOString(),
          status: 'new'
        });
      }

      // Check Dwell Time in Zone (Throttle to once every 120s)
      if (
        zone.maxDwellMinutes > 0 &&
        previousState.enteredAt &&
        (now - previousState.enteredAt) > zone.maxDwellMinutes * 60000 &&
        now - (previousState.lastDwellAlert || 0) > 120000
      ) {
        previousState.lastDwellAlert = now;
        const minutesInside = Math.round((now - previousState.enteredAt) / 60000);
        generatedAlerts.push({
          id: `geo-alt-${Date.now()}-${vehicleId}-${zone.id}-dwl`,
          vehicleId,
          plate: vehicle.plate || vehicleId,
          geofenceId: zone.id,
          geofenceName: zone.name,
          zoneType: zone.zoneType,
          eventType: 'excessive_dwell',
          severity: 'medium',
          message: `Excessive Dwell: Vehicle ${vehicle.plate || vehicleId} has been inside ${zone.name} for ${minutesInside}m (Max allowed: ${zone.maxDwellMinutes}m).`,
          latitude: location.lat,
          longitude: location.lng,
          speed: currentSpeed,
          timestamp: 'Just now',
          recordedAt: new Date().toISOString(),
          status: 'new'
        });
      }
    }

    // 3. Transition: Inside -> Outside (EXIT)
    else if (previousState.isInside && !isInsideNow) {
      previousState.isInside = false;
      previousState.enteredAt = null;

      if (zone.exitAlert) {
        generatedAlerts.push({
          id: `geo-alt-${Date.now()}-${vehicleId}-${zone.id}`,
          vehicleId,
          plate: vehicle.plate || vehicleId,
          geofenceId: zone.id,
          geofenceName: zone.name,
          zoneType: zone.zoneType,
          eventType: 'geofence_exit',
          severity: 'low',
          message: `Vehicle ${vehicle.plate || vehicleId} departed from ${zone.name}.`,
          latitude: location.lat,
          longitude: location.lng,
          speed: currentSpeed,
          timestamp: 'Just now',
          recordedAt: new Date().toISOString(),
          status: 'new'
        });
      }
    }

    vehicleStateMap[vehicleId][zone.id] = previousState;
  });

  // Append new alerts to global store
  if (generatedAlerts.length > 0) {
    geofenceAlerts = [...generatedAlerts, ...geofenceAlerts];
  }

  return generatedAlerts;
};

// ============================================================================
// GEOFENCE CRUD & MANAGEMENT SERVICES
// ============================================================================

export const getGeofenceZones = () => [...geofenceZones];

export const getGeofenceAlerts = () => [...geofenceAlerts];

export const createGeofenceZone = (zoneData) => {
  const newZone = {
    id: `geo-${Date.now()}`,
    name: zoneData.name.trim(),
    description: zoneData.description?.trim() || '',
    zoneType: zoneData.zoneType || 'client',
    geometryType: zoneData.geometryType || 'circle',
    center: zoneData.geometryType === 'circle' ? zoneData.center : null,
    radius: zoneData.geometryType === 'circle' ? Number(zoneData.radius || 1000) : null,
    coordinates: zoneData.geometryType === 'polygon' ? zoneData.coordinates : null,
    speedLimit: Number(zoneData.speedLimit || 30),
    maxDwellMinutes: Number(zoneData.maxDwellMinutes || 60),
    entryAlert: Boolean(zoneData.entryAlert ?? true),
    exitAlert: Boolean(zoneData.exitAlert ?? true),
    isActive: Boolean(zoneData.isActive ?? true),
    color: zoneData.color || '#b49aff',
    vehicleCount: 0,
    createdAt: new Date().toISOString()
  };

  geofenceZones = [newZone, ...geofenceZones];
  return newZone;
};

export const updateGeofenceZone = (id, updates) => {
  geofenceZones = geofenceZones.map((z) => (z.id === id ? { ...z, ...updates } : z));
  return geofenceZones.find((z) => z.id === id);
};

export const deleteGeofenceZone = (id) => {
  geofenceZones = geofenceZones.filter((z) => z.id !== id);
  return true;
};

export const toggleGeofenceStatus = (id) => {
  geofenceZones = geofenceZones.map((z) =>
    z.id === id ? { ...z, isActive: !z.isActive } : z
  );
  return geofenceZones.find((z) => z.id === id);
};

export const acknowledgeGeofenceAlert = (alertId) => {
  geofenceAlerts = geofenceAlerts.map((a) =>
    a.id === alertId ? { ...a, status: 'acknowledged' } : a
  );
  return geofenceAlerts.find((a) => a.id === alertId);
};

export const resolveGeofenceAlert = (alertId) => {
  geofenceAlerts = geofenceAlerts.map((a) =>
    a.id === alertId ? { ...a, status: 'resolved' } : a
  );
  return geofenceAlerts.find((a) => a.id === alertId);
};
