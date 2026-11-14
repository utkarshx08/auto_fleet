// ============================================================================
// AUTRAIL TRIP & DISPATCH SEED DATASET
// Complete multi-status lifecycle: Draft, Scheduled, Assigned, In Progress, Completed, Delayed, Cancelled
// ============================================================================

export const initialTrips = [
  {
    id: 'TRP-1001',
    tripName: 'Midtown Pharmacy Direct Distribution',
    customerName: 'BioHealth Diagnostics & Pharma',
    pickupLocation: 'JFK Air Cargo Hub, Queens, NY',
    pickupCoords: { lat: 40.6413, lng: -73.7781 },
    destinationLocation: 'Upper East Side Health Network, New York, NY',
    destinationCoords: { lat: 40.7736, lng: -73.9566 },
    stops: [
      {
        id: 'stp-1001-1',
        tripId: 'TRP-1001',
        order: 1,
        locationName: 'Bellevue Medical Center, 462 1st Ave, New York, NY',
        coords: { lat: 40.7397, lng: -73.9754 },
        plannedArrival: '2026-11-04T09:15:00Z',
        actualArrival: '2026-11-04T09:22:00Z',
        status: 'Reached',
        notes: 'Cold chain container 1 delivered successfully'
      },
      {
        id: 'stp-1001-2',
        tripId: 'TRP-1001',
        order: 2,
        locationName: 'Mount Sinai West, 1000 10th Ave, New York, NY',
        coords: { lat: 40.7698, lng: -73.9877 },
        plannedArrival: '2026-11-04T10:15:00Z',
        actualArrival: null,
        status: 'Pending',
        notes: 'Dock B signature required'
      }
    ],
    scheduledDeparture: '2026-11-04T07:30:00Z',
    actualDeparture: '2026-11-04T07:45:00Z',
    scheduledArrival: '2026-11-04T11:30:00Z',
    actualArrival: null,
    assignedVehicleId: 'RST-291',
    assignedDriverId: 'drv-1',
    status: 'In Progress',
    priority: 'High',
    cargoDetails: 'Temperature-controlled vaccine vials (3 pallets, 280 kg, 2-8°C)',
    estimatedDistanceKm: 48.5,
    actualDistanceKm: 34.2,
    notes: 'Urgent morning distribution. Maintain temperature sensor log on arrival.',
    expenses: [
      {
        id: 'exp-1001-1',
        tripId: 'TRP-1001',
        type: 'Fuel',
        amount: 85.0,
        description: 'Shell Queens - 55L Ultra Low Sulfur Diesel',
        recordedAt: '2026-11-04T07:35:00Z',
        receiptUrl: null
      },
      {
        id: 'exp-1001-2',
        tripId: 'TRP-1001',
        type: 'Toll',
        amount: 16.0,
        description: 'Queens Midtown Tunnel Electronic Toll',
        recordedAt: '2026-11-04T08:50:00Z',
        receiptUrl: null
      }
    ],
    statusHistory: [
      {
        id: 'hst-1001-1',
        fromStatus: null,
        toStatus: 'Draft',
        changedAt: '2026-11-03T14:20:00Z',
        changedBy: 'Dispatch Coordinator',
        notes: 'Initial trip profile created'
      },
      {
        id: 'hst-1001-2',
        fromStatus: 'Draft',
        toStatus: 'Scheduled',
        changedAt: '2026-11-03T16:00:00Z',
        changedBy: 'Dispatch Coordinator',
        notes: 'Route confirmed and scheduled for morning departure'
      },
      {
        id: 'hst-1001-3',
        fromStatus: 'Scheduled',
        toStatus: 'Assigned',
        changedAt: '2026-11-03T17:30:00Z',
        changedBy: 'Fleet Lead',
        notes: 'Assigned vehicle RST-291 and driver Aarav Sharma'
      },
      {
        id: 'hst-1001-4',
        fromStatus: 'Assigned',
        toStatus: 'In Progress',
        changedAt: '2026-11-04T07:45:00Z',
        changedBy: 'Aarav Sharma',
        notes: 'Driver departed JFK Air Cargo Hub'
      }
    ],
    createdAt: '2026-11-03T14:20:00Z',
    updatedAt: '2026-11-04T09:22:00Z'
  },
  {
    id: 'TRP-1002',
    tripName: 'Jersey City Retail Electronics Transfer',
    customerName: 'Nexus Tech Distribution',
    pickupLocation: 'Newark Gateway Logistics Center, NJ',
    pickupCoords: { lat: 40.7357, lng: -74.1724 },
    destinationLocation: 'Newport Centre Distribution Hub, Jersey City, NJ',
    destinationCoords: { lat: 40.7268, lng: -74.0378 },
    stops: [
      {
        id: 'stp-1002-1',
        tripId: 'TRP-1002',
        order: 1,
        locationName: 'Hoboken Terminal Depot, NJ',
        coords: { lat: 40.7359, lng: -74.0298 },
        plannedArrival: '2026-11-05T09:30:00Z',
        actualArrival: null,
        status: 'Pending',
        notes: 'Drop-off 4 cartons SSD hardware'
      }
    ],
    scheduledDeparture: '2026-11-05T08:00:00Z',
    actualDeparture: null,
    scheduledArrival: '2026-11-05T12:00:00Z',
    actualArrival: null,
    assignedVehicleId: 'RST-284',
    assignedDriverId: 'drv-2',
    status: 'Scheduled',
    priority: 'Medium',
    cargoDetails: 'Enterprise Server Hardware & SSDs (650 kg, high-value)',
    estimatedDistanceKm: 36.8,
    actualDistanceKm: 0,
    notes: 'Requires dual security scan at Newport intake bay.',
    expenses: [],
    statusHistory: [
      {
        id: 'hst-1002-1',
        fromStatus: null,
        toStatus: 'Draft',
        changedAt: '2026-11-04T10:15:00Z',
        changedBy: 'Dispatch Coordinator',
        notes: 'Client booking accepted'
      },
      {
        id: 'hst-1002-2',
        fromStatus: 'Draft',
        toStatus: 'Scheduled',
        changedAt: '2026-11-04T11:00:00Z',
        changedBy: 'Fleet Lead',
        notes: 'Assigned to Priya Patel & RST-284 for tomorrow morning'
      }
    ],
    createdAt: '2026-11-04T10:15:00Z',
    updatedAt: '2026-11-04T11:00:00Z'
  },
  {
    id: 'TRP-1003',
    tripName: 'Long Island Regional Produce Delivery',
    customerName: 'FreshHarvest Metro Group',
    pickupLocation: 'Hunts Point Food Distribution Center, Bronx, NY',
    pickupCoords: { lat: 40.8122, lng: -73.8824 },
    destinationLocation: 'Hempstead Wholesale Center, NY',
    destinationCoords: { lat: 40.7062, lng: -73.6187 },
    stops: [
      {
        id: 'stp-1003-1',
        tripId: 'TRP-1003',
        order: 1,
        locationName: 'Flushing Fresh Mart, Queens, NY',
        coords: { lat: 40.758, lng: -73.829 },
        plannedArrival: '2026-11-03T07:45:00Z',
        actualArrival: '2026-11-03T07:40:00Z',
        status: 'Departed',
        notes: 'Unloaded 12 crates organic greens'
      },
      {
        id: 'stp-1003-2',
        tripId: 'TRP-1003',
        order: 2,
        locationName: 'Garden City Logistics Depot, NY',
        coords: { lat: 40.7268, lng: -73.6343 },
        plannedArrival: '2026-11-03T09:30:00Z',
        actualArrival: '2026-11-03T09:25:00Z',
        status: 'Departed',
        notes: 'Unloaded 20 boxes citrus'
      }
    ],
    scheduledDeparture: '2026-11-03T06:00:00Z',
    actualDeparture: '2026-11-03T06:10:00Z',
    scheduledArrival: '2026-11-03T11:30:00Z',
    actualArrival: '2026-11-03T11:15:00Z',
    assignedVehicleId: 'RST-265',
    assignedDriverId: 'drv-4',
    status: 'Completed',
    priority: 'Medium',
    cargoDetails: 'Organic produce and cold-chain fruits (1,150 kg)',
    estimatedDistanceKm: 62.4,
    actualDistanceKm: 64.1,
    notes: 'Completed ahead of schedule with zero cold-chain anomalies.',
    expenses: [
      {
        id: 'exp-1003-1',
        tripId: 'TRP-1003',
        type: 'Fuel',
        amount: 110.0,
        description: 'Exxon Bronx River Pkwy - 72L Diesel',
        recordedAt: '2026-11-03T06:20:00Z',
        receiptUrl: null
      },
      {
        id: 'exp-1003-2',
        tripId: 'TRP-1003',
        type: 'Toll',
        amount: 22.5,
        description: 'Throgs Neck Bridge & Grand Central Pkwy',
        recordedAt: '2026-11-03T07:15:00Z',
        receiptUrl: null
      },
      {
        id: 'exp-1003-3',
        tripId: 'TRP-1003',
        type: 'Parking',
        amount: 15.0,
        description: 'Flushing Mart Commercial Bay Permit',
        recordedAt: '2026-11-03T08:00:00Z',
        receiptUrl: null
      },
      {
        id: 'exp-1003-4',
        tripId: 'TRP-1003',
        type: 'Driver Allowance',
        amount: 40.0,
        description: 'Early morning shift meal & staging allowance',
        recordedAt: '2026-11-03T11:20:00Z',
        receiptUrl: null
      }
    ],
    statusHistory: [
      {
        id: 'hst-1003-1',
        fromStatus: null,
        toStatus: 'Draft',
        changedAt: '2026-11-02T11:00:00Z',
        changedBy: 'System Auto-Scheduler',
        notes: 'Recurring client order generated'
      },
      {
        id: 'hst-1003-2',
        fromStatus: 'Draft',
        toStatus: 'Assigned',
        changedAt: '2026-11-02T15:00:00Z',
        changedBy: 'Fleet Lead',
        notes: 'Assigned to RST-265 & Ananya Iyer'
      },
      {
        id: 'hst-1003-3',
        fromStatus: 'Assigned',
        toStatus: 'In Progress',
        changedAt: '2026-11-03T06:10:00Z',
        changedBy: 'Ananya Iyer',
        notes: 'Departed Hunts Point terminal'
      },
      {
        id: 'hst-1003-4',
        fromStatus: 'In Progress',
        toStatus: 'Completed',
        changedAt: '2026-11-03T11:15:00Z',
        changedBy: 'Ananya Iyer',
        notes: 'All manifests signed off and final delivery accepted'
      }
    ],
    createdAt: '2026-11-02T11:00:00Z',
    updatedAt: '2026-11-03T11:20:00Z'
  },
  {
    id: 'TRP-1004',
    tripName: 'Brooklyn Industrial Auto Parts Express',
    customerName: 'Vanguard Precision Machining',
    pickupLocation: 'Brooklyn Navy Yard, Brooklyn, NY',
    pickupCoords: { lat: 40.7011, lng: -73.9719 },
    destinationLocation: 'Staten Island Teleport Industrial Center, NY',
    destinationCoords: { lat: 40.6015, lng: -74.1784 },
    stops: [],
    scheduledDeparture: '2026-11-04T08:30:00Z',
    actualDeparture: '2026-11-04T09:40:00Z',
    scheduledArrival: '2026-11-04T10:45:00Z',
    actualArrival: null,
    assignedVehicleId: 'RST-251',
    assignedDriverId: 'drv-6',
    status: 'Delayed',
    priority: 'High',
    cargoDetails: 'CNC transmission assemblies (840 kg)',
    estimatedDistanceKm: 32.6,
    actualDistanceKm: 18.2,
    notes: 'Heavy traffic bottleneck near Verrazzano-Narrows Bridge construction zone.',
    expenses: [
      {
        id: 'exp-1004-1',
        tripId: 'TRP-1004',
        type: 'Toll',
        amount: 19.0,
        description: 'Verrazzano Bridge Eastbound Commercial Toll',
        recordedAt: '2026-11-04T10:05:00Z',
        receiptUrl: null
      }
    ],
    statusHistory: [
      {
        id: 'hst-1004-1',
        fromStatus: null,
        toStatus: 'Draft',
        changedAt: '2026-11-03T16:00:00Z',
        changedBy: 'Dispatch Coordinator',
        notes: 'Express parts dispatch booked'
      },
      {
        id: 'hst-1004-2',
        fromStatus: 'Draft',
        toStatus: 'Assigned',
        changedAt: '2026-11-03T17:00:00Z',
        changedBy: 'Fleet Lead',
        notes: 'Assigned to RST-251 & Neha Gupta'
      },
      {
        id: 'hst-1004-3',
        fromStatus: 'Assigned',
        toStatus: 'In Progress',
        changedAt: '2026-11-04T09:40:00Z',
        changedBy: 'Neha Gupta',
        notes: 'Departed late due to client loading bay delay'
      },
      {
        id: 'hst-1004-4',
        fromStatus: 'In Progress',
        toStatus: 'Delayed',
        changedAt: '2026-11-04T10:30:00Z',
        changedBy: 'Dispatch Coordinator',
        notes: 'Status changed to Delayed due to bridge closure congestion'
      }
    ],
    createdAt: '2026-11-03T16:00:00Z',
    updatedAt: '2026-11-04T10:30:00Z'
  },
  {
    id: 'TRP-1005',
    tripName: 'Manhattan Luxury Retail Consignment',
    customerName: 'Avenue Fashion Logistics',
    pickupLocation: 'Secaucus Distribution Center, NJ',
    pickupCoords: { lat: 40.7895, lng: -74.0565 },
    destinationLocation: '5th Avenue Flagship Store, New York, NY',
    destinationCoords: { lat: 40.7619, lng: -73.9754 },
    stops: [],
    scheduledDeparture: '2026-11-04T14:00:00Z',
    actualDeparture: null,
    scheduledArrival: '2026-11-04T17:00:00Z',
    actualArrival: null,
    assignedVehicleId: 'RST-263',
    assignedDriverId: 'drv-5',
    status: 'Assigned',
    priority: 'Medium',
    cargoDetails: 'Designer garments & high-value textiles (420 kg)',
    estimatedDistanceKm: 24.5,
    actualDistanceKm: 0,
    notes: 'Direct delivery to underground valet receiving dock.',
    expenses: [],
    statusHistory: [
      {
        id: 'hst-1005-1',
        fromStatus: null,
        toStatus: 'Draft',
        changedAt: '2026-11-04T09:00:00Z',
        changedBy: 'Dispatch Coordinator',
        notes: 'Consignment booking created'
      },
      {
        id: 'hst-1005-2',
        fromStatus: 'Draft',
        toStatus: 'Assigned',
        changedAt: '2026-11-04T10:00:00Z',
        changedBy: 'Fleet Lead',
        notes: 'Assigned vehicle RST-263 and driver Rajesh Kumar'
      }
    ],
    createdAt: '2026-11-04T09:00:00Z',
    updatedAt: '2026-11-04T10:00:00Z'
  },
  {
    id: 'TRP-1006',
    tripName: 'Bronx Cold Storage Cross-Docking',
    customerName: 'Apex Beverage Logistics',
    pickupLocation: 'Port Newark Container Terminal, NJ',
    pickupCoords: { lat: 40.6865, lng: -74.1505 },
    destinationLocation: 'Hunts Point Beverage Center, Bronx, NY',
    destinationCoords: { lat: 40.8145, lng: -73.886 },
    stops: [],
    scheduledDeparture: '2026-11-06T09:00:00Z',
    actualDeparture: null,
    scheduledArrival: '2026-11-06T13:00:00Z',
    actualArrival: null,
    assignedVehicleId: null,
    assignedDriverId: null,
    status: 'Draft',
    priority: 'Low',
    cargoDetails: 'Craft beverage canned inventory (1,800 kg)',
    estimatedDistanceKm: 44.2,
    actualDistanceKm: 0,
    notes: 'Awaiting container customs release at Port Newark berth 5.',
    expenses: [],
    statusHistory: [
      {
        id: 'hst-1006-1',
        fromStatus: null,
        toStatus: 'Draft',
        changedAt: '2026-11-04T08:00:00Z',
        changedBy: 'Operations Support',
        notes: 'Preliminary draft order created'
      }
    ],
    createdAt: '2026-11-04T08:00:00Z',
    updatedAt: '2026-11-04T08:00:00Z'
  },
  {
    id: 'TRP-1007',
    tripName: 'Queens Emergency Supply Drop',
    customerName: 'Metro Hospital Supplies',
    pickupLocation: 'LaGuardia Air Cargo Wing, Queens, NY',
    pickupCoords: { lat: 40.7769, lng: -73.874 },
    destinationLocation: 'Elmhurst Hospital Center, Queens, NY',
    destinationCoords: { lat: 40.7445, lng: -73.8856 },
    stops: [],
    scheduledDeparture: '2026-11-03T13:00:00Z',
    actualDeparture: null,
    scheduledArrival: '2026-11-03T15:00:00Z',
    actualArrival: null,
    assignedVehicleId: 'RST-276',
    assignedDriverId: 'drv-3',
    status: 'Cancelled',
    priority: 'High',
    cargoDetails: 'Surgical pack consumables (120 kg)',
    estimatedDistanceKm: 14.8,
    actualDistanceKm: 0,
    notes: 'Cancelled due to urgent maintenance schedule hold on vehicle RST-276.',
    expenses: [],
    statusHistory: [
      {
        id: 'hst-1007-1',
        fromStatus: null,
        toStatus: 'Draft',
        changedAt: '2026-11-03T11:00:00Z',
        changedBy: 'Dispatch Coordinator',
        notes: 'Emergency hospital request logged'
      },
      {
        id: 'hst-1007-2',
        fromStatus: 'Draft',
        toStatus: 'Assigned',
        changedAt: '2026-11-03T11:30:00Z',
        changedBy: 'Fleet Lead',
        notes: 'Assigned RST-276'
      },
      {
        id: 'hst-1007-3',
        fromStatus: 'Assigned',
        toStatus: 'Cancelled',
        changedAt: '2026-11-03T12:15:00Z',
        changedBy: 'Maintenance Lead',
        notes: 'Cancelled: RST-276 flagged for emergency brake service. Re-routed to third-party courier.'
      }
    ],
    createdAt: '2026-11-03T11:00:00Z',
    updatedAt: '2026-11-03T12:15:00Z'
  }
];

