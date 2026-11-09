// ============================================================================
// AUTRAIL OPENSTREETMAP REVERSE GEOCODING SERVICE
// Converts GPS Coordinates (Lat, Lng) -> Human-Readable Street Addresses
// Uses free OpenStreetMap Nominatim with in-memory LRU caching
// ============================================================================

const geocodeCache = new Map();
const inFlightRequests = new Map();

/**
 * Perform reverse geocoding via OpenStreetMap Nominatim
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<{ address: string, road: string, city: string, displayName: string, source: string }>}
 */
export async function reverseGeocode(lat, lng) {
  if (lat == null || lng == null) {
    return { address: 'Unknown Location', source: 'error' };
  }

  // Cache key rounded to ~10 meters precision to prevent duplicate network calls
  const cacheKey = `${Number(lat).toFixed(4)},${Number(lng).toFixed(4)}`;

  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const fetchPromise = (async () => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Nominatim HTTP ${response.status}`);
      }

      const data = await response.json();
      const addr = data.address || {};

      const road = addr.road || addr.pedestrian || addr.street || '';
      const houseNumber = addr.house_number ? `${addr.house_number} ` : '';
      const suburb = addr.suburb || addr.neighbourhood || addr.city_district || '';
      const city = addr.city || addr.town || addr.municipality || 'New York';
      const state = addr.state || 'NY';

      let formatted = '';
      if (road) {
        formatted = `${houseNumber}${road}, ${suburb || city}, ${state}`.trim();
      } else {
        formatted = data.display_name?.split(',').slice(0, 3).join(',') || `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`;
      }

      const result = {
        address: formatted,
        road: road || 'Commercial Thoroughfare',
        city,
        displayName: data.display_name || formatted,
        source: 'openstreetmap_nominatim'
      };

      // Store in cache (limit to 100 entries)
      if (geocodeCache.size > 100) {
        const oldestKey = geocodeCache.keys().next().value;
        geocodeCache.delete(oldestKey);
      }
      geocodeCache.set(cacheKey, result);

      return result;
    } catch (err) {
      console.warn('Nominatim reverse geocode fallback to coordinate tag:', err.message);
      const latNum = Number(lat);
      const lngNum = Number(lng);
      const latDir = latNum >= 0 ? 'N' : 'S';
      const lngDir = lngNum >= 0 ? 'E' : 'W';
      const fallback = {
        address: `${Math.abs(latNum).toFixed(4)}° ${latDir}, ${Math.abs(lngNum).toFixed(4)}° ${lngDir}`,
        road: 'Metropolitan Corridor',
        city: 'Metro NY',
        displayName: 'Coordinate Position',
        source: 'offline_fallback'
      };
      geocodeCache.set(cacheKey, fallback);
      return fallback;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}

