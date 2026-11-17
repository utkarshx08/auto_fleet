// ============================================================================
// AUTRAIL MAINTENANCE PERSISTENCE SERVICE
// Provides storageService-backed persistence for maintenance schedules & records
// Mirrors the established tripService.js pattern
// ============================================================================

import { initialMaintenanceSchedules, initialMaintenanceRecords } from '../data/maintenanceMockData.js';
import storageService from './storageService.js';

const SCHEDULES_KEY = 'autrail_maintenance_schedules';
const RECORDS_KEY = 'autrail_maintenance_records';

/**
 * Loads all maintenance schedules from storageService with fallback to mock data
 */
export const getSchedules = () => {
  const parsed = storageService.getItem(SCHEDULES_KEY, null);
  if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
    storageService.setItem(SCHEDULES_KEY, initialMaintenanceSchedules);
    return initialMaintenanceSchedules;
  }
  // Defensive filter: eliminate nulls, non-objects, and records without id
  const valid = parsed.filter((s) => s && typeof s === 'object' && s.id);
  if (valid.length === 0) {
    storageService.setItem(SCHEDULES_KEY, initialMaintenanceSchedules);
    return initialMaintenanceSchedules;
  }
  return valid;
};

/**
 * Saves current schedules array to storageService
 */
export const persistSchedules = (schedules) => {
  const safe = (schedules || []).filter((s) => s && typeof s === 'object' && s.id);
  return storageService.setItem(SCHEDULES_KEY, safe);
};

/**
 * Loads all maintenance records from storageService with fallback to mock data
 */
export const getRecords = () => {
  const parsed = storageService.getItem(RECORDS_KEY, null);
  if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
    storageService.setItem(RECORDS_KEY, initialMaintenanceRecords);
    return initialMaintenanceRecords;
  }
  // Defensive filter: eliminate nulls, non-objects, and records without id
  const valid = parsed.filter((r) => r && typeof r === 'object' && r.id);
  if (valid.length === 0) {
    storageService.setItem(RECORDS_KEY, initialMaintenanceRecords);
    return initialMaintenanceRecords;
  }
  return valid;
};

/**
 * Saves current records array to storageService
 */
export const persistRecords = (records) => {
  const safe = (records || []).filter((r) => r && typeof r === 'object' && r.id);
  return storageService.setItem(RECORDS_KEY, safe);
};

/**
 * Resets maintenance storage to default mock data
 */
export const resetMaintenanceToMock = () => {
  storageService.setItem(SCHEDULES_KEY, initialMaintenanceSchedules);
  storageService.setItem(RECORDS_KEY, initialMaintenanceRecords);
  return { schedules: initialMaintenanceSchedules, records: initialMaintenanceRecords };
};

