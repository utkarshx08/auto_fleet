// ============================================================================
// AUTRAIL FUEL PERSISTENCE SERVICE
// Provides storageService-backed persistence for fuel purchase records
// Mirrors the established tripService.js pattern
// ============================================================================

import { initialFuelRecords } from '../data/fuelMockData.js';
import storageService from './storageService.js';

const STORAGE_KEY = 'autrail_fuel_records';

/**
 * Loads all fuel records from storageService with fallback to mock data
 */
export const getFuelRecords = () => {
  const parsed = storageService.getItem(STORAGE_KEY, null);
  if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
    storageService.setItem(STORAGE_KEY, initialFuelRecords);
    return initialFuelRecords;
  }
  return parsed;
};

/**
 * Saves current fuel records array to storageService
 */
export const persistFuelRecords = (records) => {
  return storageService.setItem(STORAGE_KEY, records);
};

/**
 * Resets fuel storage to default mock data
 */
export const resetFuelToMock = () => {
  storageService.setItem(STORAGE_KEY, initialFuelRecords);
  return initialFuelRecords;
};

