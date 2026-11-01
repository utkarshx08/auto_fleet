// ============================================================================
// AUTRAIL HISTORICAL VEHICLE TRACKING SERVICE
// Retrieves GPS coordinates, computes journey statistics, and builds route paths
// ============================================================================

import { mockHistoricalJourney } from '../data/trackingMockData';

/**
 * Generate or fetch journey waypoints for any vehicle on a given date and time range
 */
export const getHistoricalJourney = ({
  vehicleId = 'RST-291',
  date = '2025-10-24',
  startTime = '08:00',
  endTime = '18:00'
}) => {
  // Base template paths across NYC
  const routeTemplates = {
    'RST-291': {
      routeName: 'Midtown Express Loop (FDR Drive & Manhattan Spine)',
      totalDistance: 24.8,
      averageSpeed: 42.5,
      maximumSpeed: 74.0,
      startTime: '08:15 AM',
      endTime: '09:25 AM',
      waypoints: mockHistoricalJourney.waypoints
    },
    'RST-284': {
      routeName: 'Brooklyn River Corridor (BQE & Flatbush Ave)',
      totalDistance: 31.4,
      averageSpeed: 46.2,
      maximumSpeed: 78.5,
      startTime: '09:30 AM',
      endTime: '11:15 AM',
      waypoints: [
        { index: 0, lat: 40.7023, lng: -73.9712, speed: 20, heading: 180, time: '09:30 AM', location: 'Brooklyn Navy Yard Depot' },
        { index: 1, lat: 40.6970, lng: -73.9780, speed: 45, heading: 210, time: '09:42 AM', location: 'BQE Southbound & Tillary St' },
        { index: 2, lat: 40.6892, lng: -73.9840, speed: 52, heading: 175, time: '09:58 AM', location: 'Flatbush Ave & Atlantic Ave Terminal' },
        { index: 3, lat: 40.6720, lng: -73.9780, speed: 64, heading: 180, time: '10:15 AM', location: 'Prospect Park West Corridor' },
        { index: 4, lat: 40.6550, lng: -73.9720, speed: 70, heading: 170, time: '10:32 AM', location: 'Ocean Parkway Express' },
        { index: 5, lat: 40.6380, lng: -73.9680, speed: 78.5, heading: 165, time: '10:48 AM', location: 'Ocean Parkway & Avenue J (Peak Speed)' },
        { index: 6, lat: 40.6120, lng: -73.9650, speed: 40, heading: 175, time: '11:02 AM', location: 'Brighton Beach Terminal Approach' },
        { index: 7, lat: 40.5780, lng: -73.9620, speed: 0, heading: 180, time: '11:15 AM', location: 'Coney Island Fulfillment Facility (End)' }
      ]
    },
    'RST-263': {
      routeName: 'Bronx Cross-County Arterial (I-95 & Major Deegan)',
      totalDistance: 38.6,
      averageSpeed: 58.4,
      maximumSpeed: 86.0,
      startTime: '07:45 AM',
      endTime: '08:50 AM',
      waypoints: [
        { index: 0, lat: 40.8120, lng: -73.9280, speed: 30, heading: 30, time: '07:45 AM', location: 'Hunts Point Logistics Center' },
        { index: 1, lat: 40.8250, lng: -73.9050, speed: 65, heading: 40, time: '08:00 AM', location: 'Bruckner Expressway Interchange' },
        { index: 2, lat: 40.8380, lng: -73.8820, speed: 86.0, heading: 18, time: '08:18 AM', location: 'Cross Bronx Expressway (Overspeed Event)' },
        { index: 3, lat: 40.8520, lng: -73.8650, speed: 72, heading: 15, time: '08:32 AM', location: 'Pelham Parkway Crossing' },
        { index: 4, lat: 40.8850, lng: -73.8420, speed: 0, heading: 0, time: '08:50 AM', location: 'White Plains Hub Terminal (End)' }
      ]
    }
  };

  const selectedTemplate = routeTemplates[vehicleId] || routeTemplates['RST-291'];

  return {
    vehicleId,
    date,
    timeRange: `${startTime} – ${endTime}`,
    routeName: selectedTemplate.routeName,
    totalDistance: selectedTemplate.totalDistance,
    averageSpeed: selectedTemplate.averageSpeed,
    maximumSpeed: selectedTemplate.maximumSpeed,
    startPoint: selectedTemplate.waypoints[0],
    endPoint: selectedTemplate.waypoints[selectedTemplate.waypoints.length - 1],
    waypoints: selectedTemplate.waypoints
  };
};

