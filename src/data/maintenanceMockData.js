// ============================================================================
// AUTRAIL AUTOMATED MAINTENANCE SCHEDULING SEED DATA
// Operational Service Schedules, Categories & Work Order Invoices
// ============================================================================

export const MAINTENANCE_CATEGORIES = [
  'Engine oil replacement',
  'Brake inspection',
  'Tyre replacement',
  'Battery inspection',
  'General servicing',
  'Engine inspection'
];

export const SERVICE_CENTERS = [
  'Manhattan Fleet Care Hub',
  'Brooklyn Commercial Depot',
  'Queens Interborough Bay',
  'Apex Automotive Solutions',
  'Northstar Central Bay'
];

export const initialMaintenanceSchedules = [
  {
    id: 'SCH-101',
    vehicleId: 'RST-291',
    maintenanceType: 'Engine oil replacement',
    intervalKm: 10000,
    intervalDays: 180,
    lastServiceDate: '2025-05-15',
    lastServiceOdometer: 8500,
    nextServiceDate: '2025-11-15',
    nextServiceOdometer: 18500,
    reminderKm: 1000,
    reminderDays: 14,
    serviceCenter: 'Manhattan Fleet Care Hub',
    priority: 'High',
    status: 'Active', // Active, Due, Overdue, Completed
    createdAt: '2025-05-15T09:00:00Z'
  },
  {
    id: 'SCH-102',
    vehicleId: 'RST-276',
    maintenanceType: 'Brake inspection',
    intervalKm: 15000,
    intervalDays: 180,
    lastServiceDate: '2025-04-10',
    lastServiceOdometer: 27000,
    nextServiceDate: '2025-10-10',
    nextServiceOdometer: 42000,
    reminderKm: 800,
    reminderDays: 10,
    serviceCenter: 'Queens Interborough Bay',
    priority: 'Critical',
    status: 'Overdue', // Vehicle is 42,180 km and date was Oct 10
    createdAt: '2025-04-10T11:00:00Z'
  },
  {
    id: 'SCH-103',
    vehicleId: 'RST-284',
    maintenanceType: 'Tyre replacement',
    intervalKm: 30000,
    intervalDays: 365,
    lastServiceDate: '2024-11-20',
    lastServiceOdometer: 5000,
    nextServiceDate: '2025-11-20',
    nextServiceOdometer: 35000,
    reminderKm: 1500,
    reminderDays: 20,
    serviceCenter: 'Brooklyn Commercial Depot',
    priority: 'Medium',
    status: 'Upcoming',
    createdAt: '2024-11-20T08:30:00Z'
  },
  {
    id: 'SCH-104',
    vehicleId: 'RST-263',
    maintenanceType: 'General servicing',
    intervalKm: 20000,
    intervalDays: 240,
    lastServiceDate: '2025-03-01',
    lastServiceOdometer: 12000,
    nextServiceDate: '2025-10-28',
    nextServiceOdometer: 32000,
    reminderKm: 1000,
    reminderDays: 14,
    serviceCenter: 'Apex Automotive Solutions',
    priority: 'High',
    status: 'Due', // RST-263 is at 31,500 km
    createdAt: '2025-03-01T10:15:00Z'
  },
  {
    id: 'SCH-105',
    vehicleId: 'RST-265',
    maintenanceType: 'Battery inspection',
    intervalKm: 25000,
    intervalDays: 365,
    lastServiceDate: '2025-06-01',
    lastServiceOdometer: 2000,
    nextServiceDate: '2026-06-01',
    nextServiceOdometer: 27000,
    reminderKm: 500,
    reminderDays: 7,
    serviceCenter: 'Northstar Central Bay',
    priority: 'Low',
    status: 'Active',
    createdAt: '2025-06-01T14:00:00Z'
  },
  {
    id: 'SCH-106',
    vehicleId: 'RST-251',
    maintenanceType: 'Engine inspection',
    intervalKm: 20000,
    intervalDays: 240,
    lastServiceDate: '2025-02-14',
    lastServiceOdometer: 500,
    nextServiceDate: '2025-10-14',
    nextServiceOdometer: 20500,
    reminderKm: 1000,
    reminderDays: 14,
    serviceCenter: 'Manhattan Fleet Care Hub',
    priority: 'Critical',
    status: 'Overdue',
    createdAt: '2025-02-14T09:45:00Z'
  }
];

export const initialMaintenanceRecords = [
  {
    id: 'REC-201',
    vehicleId: 'RST-291',
    scheduleId: 'SCH-101',
    serviceType: 'Synthetic Oil & Filter Replacement',
    serviceDate: '2025-10-18',
    odometerReading: 12400,
    serviceCost: 185.00,
    serviceProvider: 'Manhattan Fleet Care Hub',
    technician: 'Marcus Vance',
    description: 'Replaced Mobil 1 full synthetic oil (8.5L), OEM oil filter, and completed multi-point inspection.',
    invoiceUrl: 'INV-2025-1018-RST291.pdf',
    status: 'Completed',
    createdAt: '2025-10-18T16:20:00Z'
  },
  {
    id: 'REC-202',
    vehicleId: 'RST-284',
    scheduleId: 'SCH-103',
    serviceType: 'Brake Pad & Rotor Inspection',
    serviceDate: '2025-10-10',
    odometerReading: 27800,
    serviceCost: 420.00,
    serviceProvider: 'Apex Automotive Solutions',
    technician: 'Elena Rostova',
    description: 'Front ceramic brake pads installed. Brake fluid flushed and pressure tested.',
    invoiceUrl: 'INV-2025-1010-RST284.pdf',
    status: 'Completed',
    createdAt: '2025-10-10T14:30:00Z'
  },
  {
    id: 'REC-203',
    vehicleId: 'RST-276',
    scheduleId: null,
    serviceType: 'Transmission Fluid Flush & Coolant',
    serviceDate: '2025-09-28',
    odometerReading: 41200,
    serviceCost: 310.00,
    serviceProvider: 'Queens Interborough Bay',
    technician: 'David Miller',
    description: 'Transmission pan cleaned, fresh synthetic ATF fluid filled, cooling system burped.',
    invoiceUrl: 'INV-2025-0928-RST276.pdf',
    status: 'Completed',
    createdAt: '2025-09-28T11:45:00Z'
  },
  {
    id: 'REC-204',
    vehicleId: 'RST-265',
    scheduleId: 'SCH-105',
    serviceType: 'Full 10,000 km Scheduled Inspection',
    serviceDate: '2025-09-15',
    odometerReading: 5900,
    serviceCost: 240.00,
    serviceProvider: 'Northstar Central Bay',
    technician: 'Marcus Vance',
    description: 'Checked suspension bushings, tire pressure alignment, spark plugs, and cabin filters.',
    invoiceUrl: 'INV-2025-0915-RST265.pdf',
    status: 'Completed',
    createdAt: '2025-09-15T13:00:00Z'
  },
  {
    id: 'REC-205',
    vehicleId: 'RST-263',
    scheduleId: 'SCH-104',
    serviceType: 'Battery Diagnostic & Alternator Test',
    serviceDate: '2025-08-22',
    odometerReading: 29800,
    serviceCost: 165.00,
    serviceProvider: 'Brooklyn Commercial Depot',
    technician: 'Elena Rostova',
    description: 'Battery health rated at 94% CCA. Terminals cleaned and dielectric grease applied.',
    invoiceUrl: 'INV-2025-0822-RST263.pdf',
    status: 'Completed',
    createdAt: '2025-08-22T15:10:00Z'
  }
];

