// ============================================================================
// AUTRAIL TRIP & DISPATCH MANAGEMENT SERVICE
// Core State Machine, Conflict Validation, Expense Math & Analytics Engine
// ============================================================================

import { initialTrips } from '../data/tripMockData.js';
import { initialVehicles, initialDrivers } from '../data/mockData.js';
import storageService from './storageService.js';

const STORAGE_KEY = 'autrail_trips_store';

// Allowed trip lifecycle statuses
export const TRIP_STATUSES = [
  'Draft',
  'Scheduled',
  'Assigned',
  'In Progress',
  'Completed',
  'Delayed',
  'Cancelled'
];

export const EXPENSE_TYPES = [
  'Fuel',
  'Toll',
  'Parking',
  'Driver Allowance',
  'Loading/Unloading',
  'Other'
];

// Valid state machine transitions
const ALLOWED_TRANSITIONS = {
  Draft: ['Scheduled', 'Assigned', 'Cancelled'],
  Scheduled: ['Assigned', 'In Progress', 'Delayed', 'Cancelled'],
  Assigned: ['In Progress', 'Scheduled', 'Delayed', 'Cancelled'],
  'In Progress': ['Completed', 'Delayed', 'Cancelled'],
  Delayed: ['In Progress', 'Completed', 'Cancelled'],
  Completed: [], // Terminal state
  Cancelled: []  // Terminal state
};

/**
 * Validates whether transitioning from currentStatus to targetStatus is permitted
 */
export const canTransitionTripStatus = (currentStatus, targetStatus) => {
  if (currentStatus === targetStatus) {
    return { allowed: true };
  }
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowedNext.includes(targetStatus)) {
    return {
      allowed: false,
      reason: `Cannot transition trip from "${currentStatus}" to "${targetStatus}". Permitted transitions: ${
        allowedNext.length > 0 ? allowedNext.join(', ') : 'None (Terminal state)'
      }.`
    };
  }
  return { allowed: true };
};

/**
 * Loads all trips from storageService with fallback to initial mock dataset
 */
export const getTrips = () => {
  const parsed = storageService.getItem(STORAGE_KEY, null);
  if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
    storageService.setItem(STORAGE_KEY, initialTrips);
    return initialTrips;
  }
  return parsed;
};

/**
 * Saves current trips array to storageService
 */
export const persistTrips = (trips) => {
  return storageService.setItem(STORAGE_KEY, trips);
};

/**
 * Retrieves a single trip by ID with its nested stops, expenses, and history
 */
export const getTripById = (tripId) => {
  const trips = getTrips();
  return trips.find((t) => t.id === tripId) || null;
};

/**
 * Validates time overlap between two date intervals [startA, endA] and [startB, endB]
 */
export const isTimeOverlap = (startA, endA, startB, endB) => {
  const aStart = new Date(startA).getTime();
  const aEnd = new Date(endA).getTime();
  const bStart = new Date(startB).getTime();
  const bEnd = new Date(endB).getTime();

  if (isNaN(aStart) || isNaN(aEnd) || isNaN(bStart) || isNaN(bEnd)) {
    return false;
  }

  // Two intervals [A_start, A_end] and [B_start, B_end] overlap if:
  // max(A_start, B_start) < min(A_end, B_end)
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
};

/**
 * Validates vehicle and driver assignment for scheduling conflicts and maintenance lockouts
 */
export const validateTripAssignment = ({
  vehicleId = null,
  driverId = null,
  departureTime,
  arrivalTime,
  excludeTripId = null,
  vehiclesList = initialVehicles,
  tripsList = null
}) => {
  const errors = [];
  const trips = tripsList || getTrips();

  // 1. Validate dates logic
  if (!departureTime) {
    errors.push('Scheduled departure date & time is required.');
  }
  if (!arrivalTime) {
    errors.push('Scheduled arrival date & time is required.');
  }
  if (departureTime && arrivalTime) {
    const dep = new Date(departureTime).getTime();
    const arr = new Date(arrivalTime).getTime();
    if (isNaN(dep) || isNaN(arr)) {
      errors.push('Departure or arrival date format is invalid.');
    } else if (arr <= dep) {
      errors.push('Scheduled arrival must be after scheduled departure.');
    }
  }

  // 2. Vehicle Availability & Maintenance checks
  if (vehicleId) {
    const vehicle = (vehiclesList || []).find((v) => v.id === vehicleId || v.plate === vehicleId);
    if (vehicle && vehicle.status === 'service') {
      errors.push(
        `Vehicle ${vehicle.plate || vehicleId} is currently under maintenance/service and cannot be assigned.`
      );
    }

    // Check overlapping trips for this vehicle
    const vehicleConflict = trips.find((t) => {
      if (t.id === excludeTripId) return false;
      if (t.status === 'Completed' || t.status === 'Cancelled') return false;
      if (t.assignedVehicleId !== vehicleId) return false;

      return isTimeOverlap(
        departureTime,
        arrivalTime,
        t.scheduledDeparture,
        t.scheduledArrival
      );
    });

    if (vehicleConflict) {
      errors.push(
        `Vehicle ${vehicleId} is already scheduled on trip "${vehicleConflict.tripName}" (${vehicleConflict.id}) during this time window.`
      );
    }
  }

  // 3. Driver Availability & Conflict checks
  if (driverId) {
    const driverConflict = trips.find((t) => {
      if (t.id === excludeTripId) return false;
      if (t.status === 'Completed' || t.status === 'Cancelled') return false;
      if (t.assignedDriverId !== driverId) return false;

      return isTimeOverlap(
        departureTime,
        arrivalTime,
        t.scheduledDeparture,
        t.scheduledArrival
      );
    });

    if (driverConflict) {
      errors.push(
        `Driver is already assigned to trip "${driverConflict.tripName}" (${driverConflict.id}) during this time window.`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Calculates sum of all expenses and the cost per kilometer
 * Safe zero-distance math to prevent NaN / Infinity
 */
export const calculateTripExpenses = (trip) => {
  if (!trip) return { totalExpense: 0, costPerKm: 0, breakdown: {} };

  const expenses = Array.isArray(trip.expenses) ? trip.expenses : [];
  let totalExpense = 0;
  const breakdown = {
    Fuel: 0,
    Toll: 0,
    Parking: 0,
    'Driver Allowance': 0,
    'Loading/Unloading': 0,
    Other: 0
  };

  expenses.forEach((item) => {
    const amount = Number(item.amount) || 0;
    totalExpense += amount;
    const cat = item.type || 'Other';
    if (breakdown[cat] !== undefined) {
      breakdown[cat] += amount;
    } else {
      breakdown.Other = (breakdown.Other || 0) + amount;
    }
  });

  // Effective distance: use actualDistanceKm if recorded and > 0, otherwise fallback to estimatedDistanceKm
  const actualDist = Number(trip.actualDistanceKm) || 0;
  const estimatedDist = Number(trip.estimatedDistanceKm) || 0;
  const effectiveDistance = actualDist > 0 ? actualDist : estimatedDist;

  const costPerKm = effectiveDistance > 0
    ? Math.round((totalExpense / effectiveDistance) * 100) / 100
    : 0;

  return {
    totalExpense: Math.round(totalExpense * 100) / 100,
    costPerKm,
    effectiveDistance,
    isBasedOnActualDistance: actualDist > 0,
    breakdown
  };
};

/**
 * Creates or updates a trip
 */
export const saveTrip = (tripData, actor = 'Dispatch Operator') => {
  const trips = getTrips();
  const isEditing = Boolean(tripData.id);

  // Validate core fields
  if (!tripData.tripName || tripData.tripName.trim().length < 3) {
    throw new Error('Trip name must be at least 3 characters long.');
  }
  if (!tripData.customerName || tripData.customerName.trim().length < 2) {
    throw new Error('Customer/client name is required.');
  }
  if (!tripData.pickupLocation || tripData.pickupLocation.trim().length < 2) {
    throw new Error('Pickup location is required.');
  }
  if (!tripData.destinationLocation || tripData.destinationLocation.trim().length < 2) {
    throw new Error('Destination location is required.');
  }

  // Conflict validation
  const validation = validateTripAssignment({
    vehicleId: tripData.assignedVehicleId,
    driverId: tripData.assignedDriverId,
    departureTime: tripData.scheduledDeparture,
    arrivalTime: tripData.scheduledArrival,
    excludeTripId: isEditing ? tripData.id : null,
    tripsList: trips
  });

  if (!validation.isValid) {
    throw new Error(validation.errors.join(' '));
  }

  const now = new Date().toISOString();

  if (isEditing) {
    const existingIndex = trips.findIndex((t) => t.id === tripData.id);
    if (existingIndex === -1) {
      throw new Error(`Trip with ID ${tripData.id} not found.`);
    }

    const prevTrip = trips[existingIndex];
    let updatedHistory = Array.isArray(prevTrip.statusHistory) ? [...prevTrip.statusHistory] : [];

    // If status changed in edit form, check transition and append history
    if (tripData.status && tripData.status !== prevTrip.status) {
      const transitionCheck = canTransitionTripStatus(prevTrip.status, tripData.status);
      if (!transitionCheck.allowed) {
        throw new Error(transitionCheck.reason);
      }
      updatedHistory.push({
        id: `hst-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        fromStatus: prevTrip.status,
        toStatus: tripData.status,
        changedAt: now,
        changedBy: actor,
        notes: tripData.notes || `Status manually updated from ${prevTrip.status} to ${tripData.status}`
      });
    }

    const updatedTrip = {
      ...prevTrip,
      ...tripData,
      statusHistory: updatedHistory,
      updatedAt: now
    };

    trips[existingIndex] = updatedTrip;
    persistTrips(trips);
    return updatedTrip;
  } else {
    // Creating new trip
    const nextNum = trips.length + 1001;
    const generatedId = tripData.id || `TRP-${nextNum}`;
    const initialStatus = tripData.status || (tripData.assignedVehicleId && tripData.assignedDriverId ? 'Assigned' : 'Scheduled');

    const newTrip = {
      id: generatedId,
      tripName: tripData.tripName.trim(),
      customerName: tripData.customerName.trim(),
      pickupLocation: tripData.pickupLocation.trim(),
      pickupCoords: tripData.pickupCoords || { lat: 40.7128, lng: -74.006 },
      destinationLocation: tripData.destinationLocation.trim(),
      destinationCoords: tripData.destinationCoords || { lat: 40.7589, lng: -73.9851 },
      stops: Array.isArray(tripData.stops) ? tripData.stops : [],
      scheduledDeparture: tripData.scheduledDeparture,
      actualDeparture: null,
      scheduledArrival: tripData.scheduledArrival,
      actualArrival: null,
      assignedVehicleId: tripData.assignedVehicleId || null,
      assignedDriverId: tripData.assignedDriverId || null,
      status: initialStatus,
      priority: tripData.priority || 'Medium',
      cargoDetails: tripData.cargoDetails || '',
      estimatedDistanceKm: Number(tripData.estimatedDistanceKm) || 25,
      actualDistanceKm: 0,
      notes: tripData.notes || '',
      expenses: Array.isArray(tripData.expenses) ? tripData.expenses : [],
      statusHistory: [
        {
          id: `hst-${Date.now()}-init`,
          fromStatus: null,
          toStatus: initialStatus,
          changedAt: now,
          changedBy: actor,
          notes: 'Trip created and registered in dispatch system'
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    trips.unshift(newTrip);
    persistTrips(trips);
    return newTrip;
  }
};

/**
 * Updates trip status with strict transition verification and history logging
 */
export const updateTripStatus = (tripId, targetStatus, notes = '', actor = 'Fleet Operator') => {
  const trips = getTrips();
  const tripIndex = trips.findIndex((t) => t.id === tripId);
  if (tripIndex === -1) {
    throw new Error(`Trip with ID ${tripId} not found.`);
  }

  const trip = trips[tripIndex];
  const check = canTransitionTripStatus(trip.status, targetStatus);
  if (!check.allowed) {
    throw new Error(check.reason);
  }

  const now = new Date().toISOString();
  let actualDeparture = trip.actualDeparture;
  let actualArrival = trip.actualArrival;
  let actualDistanceKm = trip.actualDistanceKm;

  // Auto-record timestamps on critical state transitions
  if (targetStatus === 'In Progress' && !actualDeparture) {
    actualDeparture = now;
  }
  if (targetStatus === 'Completed') {
    if (!actualDeparture) actualDeparture = trip.scheduledDeparture;
    if (!actualArrival) actualArrival = now;
    if (!actualDistanceKm || actualDistanceKm <= 0) {
      actualDistanceKm = trip.estimatedDistanceKm;
    }
  }

  const newHistoryEntry = {
    id: `hst-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    fromStatus: trip.status,
    toStatus: targetStatus,
    changedAt: now,
    changedBy: actor,
    notes: notes || `Status changed from ${trip.status} to ${targetStatus}`
  };

  const updatedTrip = {
    ...trip,
    status: targetStatus,
    actualDeparture,
    actualArrival,
    actualDistanceKm,
    statusHistory: [...(trip.statusHistory || []), newHistoryEntry],
    updatedAt: now
  };

  trips[tripIndex] = updatedTrip;
  persistTrips(trips);
  return updatedTrip;
};

/**
 * Updates an intermediate waypoint's status (e.g. 'Reached', 'Departed', 'Pending', 'Skipped')
 */
export const updateTripStopStatus = (tripId, stopId, newStatus, notes = '') => {
  const trips = getTrips();
  const tripIndex = trips.findIndex((t) => t.id === tripId);
  if (tripIndex === -1) {
    throw new Error(`Trip with ID ${tripId} not found.`);
  }

  const trip = trips[tripIndex];
  const now = new Date().toISOString();
  const stops = Array.isArray(trip.stops) ? [...trip.stops] : [];
  const stopIndex = stops.findIndex((s) => s.id === stopId);
  if (stopIndex === -1) {
    throw new Error(`Stop with ID ${stopId} not found.`);
  }

  const prevStop = stops[stopIndex];
  stops[stopIndex] = {
    ...prevStop,
    status: newStatus,
    actualArrival: newStatus === 'Reached' ? (prevStop.actualArrival || now) : prevStop.actualArrival,
    notes: notes || prevStop.notes
  };

  const updatedTrip = {
    ...trip,
    stops,
    updatedAt: now
  };

  trips[tripIndex] = updatedTrip;
  persistTrips(trips);
  return updatedTrip;
};

/**
 * Deletes a trip with confirmation safety
 */
export const deleteTrip = (tripId) => {
  const trips = getTrips();
  const filtered = trips.filter((t) => t.id !== tripId);
  if (filtered.length === trips.length) {
    throw new Error(`Trip with ID ${tripId} not found.`);
  }
  persistTrips(filtered);
  return true;
};

/**
 * Adds an expense item to a trip
 */
export const addTripExpense = (tripId, expenseData) => {
  const trips = getTrips();
  const tripIndex = trips.findIndex((t) => t.id === tripId);
  if (tripIndex === -1) {
    throw new Error(`Trip with ID ${tripId} not found.`);
  }

  const amount = Number(expenseData.amount);
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Expense amount must be a positive number.');
  }

  const trip = trips[tripIndex];
  const newExpense = {
    id: `exp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    tripId,
    type: expenseData.type || 'Other',
    amount: Math.round(amount * 100) / 100,
    description: expenseData.description || '',
    recordedAt: expenseData.recordedAt || new Date().toISOString(),
    receiptUrl: expenseData.receiptUrl || null
  };

  const updatedTrip = {
    ...trip,
    expenses: [...(trip.expenses || []), newExpense],
    updatedAt: new Date().toISOString()
  };

  trips[tripIndex] = updatedTrip;
  persistTrips(trips);
  return { updatedTrip, newExpense };
};

/**
 * Deletes an expense item from a trip
 */
export const deleteTripExpense = (tripId, expenseId) => {
  const trips = getTrips();
  const tripIndex = trips.findIndex((t) => t.id === tripId);
  if (tripIndex === -1) {
    throw new Error(`Trip with ID ${tripId} not found.`);
  }

  const trip = trips[tripIndex];
  const updatedExpenses = (trip.expenses || []).filter((e) => e.id !== expenseId);

  const updatedTrip = {
    ...trip,
    expenses: updatedExpenses,
    updatedAt: new Date().toISOString()
  };

  trips[tripIndex] = updatedTrip;
  persistTrips(trips);
  return updatedTrip;
};

/**
 * Calculates comprehensive KPI statistics and metrics strictly derived from real data
 */
export const getTripMetrics = (trips = null) => {
  const allTrips = trips || getTrips();

  const metrics = {
    totalTrips: allTrips.length,
    scheduledTrips: 0,
    activeTrips: 0,
    completedTrips: 0,
    delayedTrips: 0,
    cancelledTrips: 0,
    draftTrips: 0,
    assignedTrips: 0,
    totalExpenses: 0,
    totalDistanceKm: 0,
    averageCostPerKm: 0,
    statusDistribution: {
      Draft: 0,
      Scheduled: 0,
      Assigned: 0,
      'In Progress': 0,
      Completed: 0,
      Delayed: 0,
      Cancelled: 0
    },
    vehicleUtilization: {},
    driverUtilization: {},
    monthlyStatistics: {}
  };

  let totalExpenseAcrossAll = 0;
  let totalDistanceAcrossAll = 0;

  allTrips.forEach((trip) => {
    // Status counts
    const status = trip.status;
    if (metrics.statusDistribution[status] !== undefined) {
      metrics.statusDistribution[status]++;
    }

    if (status === 'Draft') metrics.draftTrips++;
    if (status === 'Scheduled') metrics.scheduledTrips++;
    if (status === 'Assigned') metrics.assignedTrips++;
    if (status === 'In Progress') metrics.activeTrips++;
    if (status === 'Delayed') {
      metrics.delayedTrips++;
      metrics.activeTrips++; // Delayed trips are still active journeys
    }
    if (status === 'Completed') metrics.completedTrips++;
    if (status === 'Cancelled') metrics.cancelledTrips++;

    // Expenses
    const { totalExpense } = calculateTripExpenses(trip);
    totalExpenseAcrossAll += totalExpense;

    // Distances (actual if available, else estimated for in-progress/completed)
    const dist = Number(trip.actualDistanceKm) > 0 ? Number(trip.actualDistanceKm) : (status === 'Completed' || status === 'In Progress' ? Number(trip.estimatedDistanceKm) || 0 : 0);
    totalDistanceAcrossAll += dist;

    // Vehicle utilization
    if (trip.assignedVehicleId) {
      metrics.vehicleUtilization[trip.assignedVehicleId] = (metrics.vehicleUtilization[trip.assignedVehicleId] || 0) + 1;
    }

    // Driver utilization
    if (trip.assignedDriverId) {
      metrics.driverUtilization[trip.assignedDriverId] = (metrics.driverUtilization[trip.assignedDriverId] || 0) + 1;
    }

    // Monthly bucket (using scheduledDeparture)
    if (trip.scheduledDeparture) {
      const date = new Date(trip.scheduledDeparture);
      if (!isNaN(date.getTime())) {
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        metrics.monthlyStatistics[monthKey] = (metrics.monthlyStatistics[monthKey] || 0) + 1;
      }
    }
  });

  metrics.totalExpenses = Math.round(totalExpenseAcrossAll * 100) / 100;
  metrics.totalDistanceKm = Math.round(totalDistanceAcrossAll * 10) / 10;
  metrics.averageCostPerKm = totalDistanceAcrossAll > 0
    ? Math.round((totalExpenseAcrossAll / totalDistanceAcrossAll) * 100) / 100
    : 0;

  return metrics;
};

/**
 * Generates dynamic, real-time alerts derived from trip records
 */
export const generateTripAlerts = (trips = null) => {
  const allTrips = trips || getTrips();
  const alerts = [];
  const now = new Date().getTime();

  allTrips.forEach((trip) => {
    // 1. Delayed trip alert
    if (trip.status === 'Delayed') {
      alerts.push({
        id: `alt-delay-${trip.id}`,
        tripId: trip.id,
        tripName: trip.tripName,
        type: 'delayed',
        severity: 'warning',
        title: `Trip Delayed: ${trip.tripName}`,
        message: trip.notes || `Trip ${trip.id} is flagged as delayed in transit.`,
        vehicleId: trip.assignedVehicleId,
        timestamp: trip.updatedAt || trip.scheduledDeparture
      });
    }

    // 2. Upcoming trip alert (scheduled within next 4 hours)
    if (trip.status === 'Scheduled' || trip.status === 'Assigned') {
      const depTime = new Date(trip.scheduledDeparture).getTime();
      const diffHours = (depTime - now) / (1000 * 60 * 60);

      if (diffHours > 0 && diffHours <= 4) {
        alerts.push({
          id: `alt-upcoming-${trip.id}`,
          tripId: trip.id,
          tripName: trip.tripName,
          type: 'upcoming',
          severity: 'info',
          title: `Upcoming Departure: ${trip.tripName}`,
          message: `Scheduled to depart in ${Math.round(diffHours * 60)} minutes. Driver: ${trip.assignedDriverId || 'Unassigned'}.`,
          vehicleId: trip.assignedVehicleId,
          timestamp: trip.scheduledDeparture
        });
      }
    }

    // 3. Active in-progress journey
    if (trip.status === 'In Progress') {
      alerts.push({
        id: `alt-active-${trip.id}`,
        tripId: trip.id,
        tripName: trip.tripName,
        type: 'active',
        severity: 'normal',
        title: `Active Journey: ${trip.tripName}`,
        message: `Currently en route to ${trip.destinationLocation}. Vehicle: ${trip.assignedVehicleId || 'N/A'}.`,
        vehicleId: trip.assignedVehicleId,
        timestamp: trip.actualDeparture || trip.updatedAt
      });
    }
  });

  return alerts;
};

/**
 * Resets local trip storage to default initial mock dataset
 */
export const resetTripsToMock = () => {
  storageService.setItem(STORAGE_KEY, initialTrips);
  return initialTrips;
};

