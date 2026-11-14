// ============================================================================
// AUTRAIL FUEL PURCHASE MANAGEMENT SEED DATA
// Real fuel purchase transactions, filling stations, payment methods & receipts
// ============================================================================

export const FUEL_TYPES = ['Diesel', 'Gasoline', 'Electric', 'Hybrid'];

export const FUEL_STATIONS = [
  'Shell Midtown Commercial Depot #412',
  'BP Queens Express Center #108',
  'Mobil Brooklyn Logistics Terminal #305',
  'Sunoco Bronx Cross-County Freight #92',
  'Exxon Staten Island Hub #14'
];

export const PAYMENT_METHODS = [
  'Company Fleet Card',
  'PetroCard Corporate',
  'Commercial Credit Card',
  'Direct Bay Account'
];

export const initialFuelRecords = [
  {
    id: 'FUEL-1001',
    vehicleId: 'RST-291',
    driverId: 'drv-1',
    driverName: 'Aarav Sharma',
    fuelType: 'Diesel',
    quantity: 62.4, // Litres
    pricePerLitre: 1.68,
    totalAmount: 104.83, // 62.4 * 1.68
    odometerReading: 12420,
    fuelStation: 'Shell Midtown Commercial Depot #412',
    paymentMethod: 'Company Fleet Card',
    receiptUrl: 'REC-FUEL-1001.pdf',
    purchaseDate: '2025-10-23T08:15:00Z',
    isAnomaly: false,
    anomalyReason: null
  },
  {
    id: 'FUEL-1002',
    vehicleId: 'RST-284',
    driverId: 'drv-2',
    driverName: 'Priya Patel',
    fuelType: 'Diesel',
    quantity: 58.0,
    pricePerLitre: 1.69,
    totalAmount: 98.02,
    odometerReading: 27950,
    fuelStation: 'Mobil Brooklyn Logistics Terminal #305',
    paymentMethod: 'PetroCard Corporate',
    receiptUrl: 'REC-FUEL-1002.pdf',
    purchaseDate: '2025-10-22T14:30:00Z',
    isAnomaly: false,
    anomalyReason: null
  },
  {
    id: 'FUEL-1003',
    vehicleId: 'RST-276',
    driverId: 'drv-3',
    driverName: 'Rohan Verma',
    fuelType: 'Diesel',
    quantity: 88.5, // unusually high quantity for a 80L standard tank
    pricePerLitre: 1.72,
    totalAmount: 152.22,
    odometerReading: 42100,
    fuelStation: 'BP Queens Express Center #108',
    paymentMethod: 'Company Fleet Card',
    receiptUrl: 'REC-FUEL-1003.pdf',
    purchaseDate: '2025-10-21T18:45:00Z',
    isAnomaly: true,
    anomalyReason: 'Abnormal fuel quantity: 88.5L exceeds standard 80L tank capacity by 10.6%.'
  },
  {
    id: 'FUEL-1004',
    vehicleId: 'RST-263',
    driverId: 'drv-5',
    driverName: 'Rajesh Kumar',
    fuelType: 'Gasoline',
    quantity: 54.2,
    pricePerLitre: 1.58,
    totalAmount: 85.64,
    odometerReading: 31200,
    fuelStation: 'Sunoco Bronx Cross-County Freight #92',
    paymentMethod: 'Commercial Credit Card',
    receiptUrl: 'REC-FUEL-1004.pdf',
    purchaseDate: '2025-10-20T09:20:00Z',
    isAnomaly: false,
    anomalyReason: null
  },
  {
    id: 'FUEL-1005',
    vehicleId: 'RST-265',
    driverId: 'drv-4',
    driverName: 'Ananya Iyer',
    fuelType: 'Diesel',
    quantity: 45.0,
    pricePerLitre: 1.67,
    totalAmount: 75.15,
    odometerReading: 5950,
    fuelStation: 'Exxon Staten Island Hub #14',
    paymentMethod: 'Direct Bay Account',
    receiptUrl: 'REC-FUEL-1005.pdf',
    purchaseDate: '2025-10-18T11:00:00Z',
    isAnomaly: false,
    anomalyReason: null
  },
  {
    id: 'FUEL-1006',
    vehicleId: 'RST-251',
    driverId: 'drv-6',
    driverName: 'Neha Gupta',
    fuelType: 'Diesel',
    quantity: 65.0,
    pricePerLitre: 1.68,
    totalAmount: 109.20,
    odometerReading: 18400,
    fuelStation: 'Mobil Brooklyn Logistics Terminal #305',
    paymentMethod: 'PetroCard Corporate',
    receiptUrl: 'REC-FUEL-1006.pdf',
    purchaseDate: '2025-10-17T16:15:00Z',
    isAnomaly: false,
    anomalyReason: null
  },
  {
    id: 'FUEL-1007',
    vehicleId: 'RST-291',
    driverId: 'drv-1',
    driverName: 'Aarav Sharma',
    fuelType: 'Diesel',
    quantity: 60.5,
    pricePerLitre: 1.66,
    totalAmount: 100.43,
    odometerReading: 11800,
    fuelStation: 'Shell Midtown Commercial Depot #412',
    paymentMethod: 'Company Fleet Card',
    receiptUrl: 'REC-FUEL-1007.pdf',
    purchaseDate: '2025-10-15T07:50:00Z',
    isAnomaly: false,
    anomalyReason: null
  },
  {
    id: 'FUEL-1008',
    vehicleId: 'RST-284',
    driverId: 'drv-2',
    driverName: 'Priya Patel',
    fuelType: 'Diesel',
    quantity: 35.0,
    pricePerLitre: 1.70,
    totalAmount: 59.50,
    odometerReading: 27400,
    fuelStation: 'BP Queens Express Center #108',
    paymentMethod: 'Company Fleet Card',
    receiptUrl: 'REC-FUEL-1008.pdf',
    purchaseDate: '2025-10-12T13:10:00Z',
    isAnomaly: false,
    anomalyReason: null
  }
];

