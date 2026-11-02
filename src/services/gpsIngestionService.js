// ============================================================================
// AUTRAIL GPS TELEMETRY INGESTION SERVICE
// Validates, sanitizes, and transmits incoming GPS hardware / API events
// ============================================================================

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { TRACKING_CONFIG, initialGeofences } from '../data/trackingMockData';

/**
 * Validates GPS payload structure and mathematical bounds
 */
export const validateGpsPayload = (payload, registeredVehicles = []) => {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Invalid payload body: must be an object'] };
  }

  // 1. Vehicle ID Validation
  if (!payload.vehicle_id || typeof payload.vehicle_id !== 'string') {
    errors.push('vehicle_id is required and must be a string');
  } else if (
    registeredVehicles.length > 0 &&
    !registeredVehicles.includes(payload.vehicle_id.trim().toUpperCase())
  ) {
    errors.push(`Unregistered vehicle: ${payload.vehicle_id} is not in the fleet registry`);
  }

  // 2. Latitude Validation (-90 to +90)
  const lat = Number(payload.latitude);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    errors.push('latitude must be a valid float between -90.000000 and 90.000000');
  }

  // 3. Longitude Validation (-180 to +180)
  const lng = Number(payload.longitude);
  if (isNaN(lng) || lng < -180 || lng > 180) {
    errors.push('longitude must be a valid float between -180.000000 and 180.000000');
  }

  // 4. Speed Validation (0 to 250 km/h)
  const speed = Number(payload.speed);
  if (isNaN(speed) || speed < 0 || speed > 250) {
    errors.push('speed must be a non-negative float between 0 and 250 km/h');
  }

  // 5. Heading Validation (0 to 360 degrees)
  const heading = Number(payload.heading);
  if (isNaN(heading) || heading < 0 || heading > 360) {
    errors.push('heading must be a float between 0 and 360 degrees');
  }

  // 6. Timestamp Validation
  if (payload.recorded_at) {
    const time = new Date(payload.recorded_at).getTime();
    if (isNaN(time)) {
      errors.push('recorded_at must be a valid ISO 8601 timestamp string');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized:
      errors.length === 0
        ? {
            vehicle_id: payload.vehicle_id.trim().toUpperCase(),
            latitude: lat,
            longitude: lng,
            speed: Math.round(speed * 10) / 10,
            heading: Math.round(heading),
            recorded_at: payload.recorded_at
              ? new Date(payload.recorded_at).toISOString()
              : new Date().toISOString(),
            source: payload.source || 'api_push'
          }
        : null
  };
};

/**
 * Client caller for POST /api/tracking/location
 */
export const sendLocationTelemetry = async (payload, apiKey = 'autrail-sec-token-2026') => {
  try {
    const response = await fetch('/api/tracking/location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return {
      status: response.status,
      ok: response.ok,
      data
    };
  } catch (err) {
    console.warn('Direct HTTP ingestion endpoint fallback to local parser:', err);
    // Graceful offline fallback
    const validation = validateGpsPayload(payload);
    return {
      status: validation.valid ? 200 : 400,
      ok: validation.valid,
      data: validation.valid
        ? { success: true, message: 'Local client parsed telemetry', data: validation.sanitized }
        : { success: false, errors: validation.errors }
    };
  }
};

/**
 * Ingest validated GPS ping into Supabase or local state
 */
export const ingestGpsTelemetry = async (rawPayload, speedLimit = TRACKING_CONFIG.SPEED_LIMIT_KMH) => {
  const { valid, errors, sanitized } = validateGpsPayload(rawPayload);

  if (!valid) {
    console.error('GPS Ingestion rejected due to validation errors:', errors);
    return { success: false, errors };
  }

  const alertsGenerated = [];

  // 1. Overspeed Evaluation
  if (sanitized.speed > speedLimit) {
    alertsGenerated.push({
      id: `alert-spd-${Date.now()}-${sanitized.vehicle_id}`,
      vehicle_id: sanitized.vehicle_id,
      alert_type: 'overspeed',
      message: `Vehicle ${sanitized.vehicle_id} exceeded ${speedLimit} km/h (Recorded: ${sanitized.speed} km/h).`,
      latitude: sanitized.latitude,
      longitude: sanitized.longitude,
      speed: sanitized.speed,
      threshold_value: speedLimit,
      created_at: new Date().toISOString(),
      is_resolved: false
    });
  }

  // 2. Geofence Boundary Check (Haversine Distance)
  initialGeofences.forEach((geo) => {
    const distMeters = calculateDistanceMeters(
      sanitized.latitude,
      sanitized.longitude,
      geo.latitude,
      geo.longitude
    );

    // If vehicle is inside depot zone but speed is high
    if (distMeters <= geo.radius && sanitized.speed > 30 && geo.zoneType === 'depot') {
      alertsGenerated.push({
        id: `alert-geo-${Date.now()}-${sanitized.vehicle_id}`,
        vehicle_id: sanitized.vehicle_id,
        alert_type: 'overspeed',
        message: `Depot speed violation: ${sanitized.speed} km/h inside ${geo.name}.`,
        latitude: sanitized.latitude,
        longitude: sanitized.longitude,
        speed: sanitized.speed,
        threshold_value: 30,
        created_at: new Date().toISOString(),
        is_resolved: false
      });
    }
  });

  // 3. Persist to Supabase if configured (without exposing service_role in frontend)
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error: locError } = await supabase
        .from('vehicle_locations')
        .insert([sanitized]);

      if (locError) {
        console.warn('Supabase location insert warning:', locError.message);
      }

      if (alertsGenerated.length > 0) {
        await supabase.from('tracking_alerts').insert(alertsGenerated);
      }
    } catch (dbErr) {
      console.warn('Supabase offline fallback:', dbErr);
    }
  }

  return {
    success: true,
    telemetry: sanitized,
    alerts: alertsGenerated
  };
};

/**
 * Haversine distance formula in meters
 */
export const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
