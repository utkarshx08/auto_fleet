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
  return parsed;
};

/**
 * Saves current schedules array to storageService
 */
export const persistSchedules = (schedules) => {
  return storageService.setItem(SCHEDULES_KEY, schedules);
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
  return parsed;
};

/**
 * Saves current records array to storageService
 */
export const persistRecords = (records) => {
  return storageService.setItem(RECORDS_KEY, records);
};

/**
 * Resets maintenance storage to default mock data
 */
export const resetMaintenanceToMock = () => {
  storageService.setItem(SCHEDULES_KEY, initialMaintenanceSchedules);
  storageService.setItem(RECORDS_KEY, initialMaintenanceRecords);
  return { schedules: initialMaintenanceSchedules, records: initialMaintenanceRecords };
};

