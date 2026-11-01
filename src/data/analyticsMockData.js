// ============================================================================
// AUTRAIL FLEET MANAGEMENT - GRANULAR ANALYTICS SEED DATABASE
// Consistent, mathematically linked dataset for Fleet Intelligence
// ============================================================================

export const fuelTypes = ['Diesel', 'Gasoline', 'Electric', 'Hybrid'];

export const expenseCategories = [
  'Fuel',
  'Maintenance',
  'Repairs',
  'Insurance',
  'Driver Wages',
  'Tolls & Permits',
  'Other'
];

// 1. Detailed Fuel Records (Last 30 days)
export const mockFuelRecords = [
  { id: 'fl-01', vehicleId: 'RST-291', fuelType: 'Diesel', quantity: 68.5, pricePerLitre: 1.84, totalCost: 126.04, odometerReading: 11980, recordedAt: '2025-10-02T08:30:00Z', vendor: 'Shell Metro Depot' },
  { id: 'fl-02', vehicleId: 'RST-284', fuelType: 'Diesel', quantity: 72.0, pricePerLitre: 1.82, totalCost: 131.04, odometerReading: 27500, recordedAt: '2025-10-04T09:15:00Z', vendor: 'BP Express Queens' },
  { id: 'fl-03', vehicleId: 'RST-276', fuelType: 'Diesel', quantity: 80.0, pricePerLitre: 1.85, totalCost: 148.00, odometerReading: 41200, recordedAt: '2025-10-05T14:20:00Z', vendor: 'Sunoco Commercial' },
  { id: 'fl-04', vehicleId: 'RST-265', fuelType: 'Diesel', quantity: 55.4, pricePerLitre: 1.80, totalCost: 99.72, odometerReading: 5400, recordedAt: '2025-10-07T11:45:00Z', vendor: 'Exxon Jersey Gateway' },
  { id: 'fl-05', vehicleId: 'RST-263', fuelType: 'Gasoline', quantity: 64.0, pricePerLitre: 1.76, totalCost: 112.64, odometerReading: 30800, recordedAt: '2025-10-09T16:10:00Z', vendor: 'Mobil Bronx North' },
  { id: 'fl-06', vehicleId: 'RST-251', fuelType: 'Diesel', quantity: 70.2, pricePerLitre: 1.84, totalCost: 129.17, odometerReading: 18100, recordedAt: '2025-10-10T07:50:00Z', vendor: 'Shell Staten Island' },
  { id: 'fl-07', vehicleId: 'RST-291', fuelType: 'Diesel', quantity: 66.8, pricePerLitre: 1.86, totalCost: 124.25, odometerReading: 12420, recordedAt: '2025-10-13T10:00:00Z', vendor: 'Shell Metro Depot' },
  { id: 'fl-08', vehicleId: 'RST-284', fuelType: 'Diesel', quantity: 74.5, pricePerLitre: 1.83, totalCost: 136.34, odometerReading: 27980, recordedAt: '2025-10-15T13:30:00Z', vendor: 'BP Express Queens' },
  { id: 'fl-09', vehicleId: 'RST-263', fuelType: 'Gasoline', quantity: 62.0, pricePerLitre: 1.78, totalCost: 110.36, odometerReading: 31220, recordedAt: '2025-10-18T15:20:00Z', vendor: 'Mobil Bronx North' },
  { id: 'fl-10', vehicleId: 'RST-291', fuelType: 'Diesel', quantity: 65.0, pricePerLitre: 1.85, totalCost: 120.25, odometerReading: 12840, recordedAt: '2025-10-21T08:15:00Z', vendor: 'Shell Metro Depot' },
  { id: 'fl-11', vehicleId: 'RST-284', fuelType: 'Diesel', quantity: 70.0, pricePerLitre: 1.84, totalCost: 128.80, odometerReading: 28410, recordedAt: '2025-10-23T11:00:00Z', vendor: 'BP Express Queens' },
  { id: 'fl-12', vehicleId: 'RST-251', fuelType: 'Diesel', quantity: 68.0, pricePerLitre: 1.85, totalCost: 125.80, odometerReading: 18900, recordedAt: '2025-10-24T09:40:00Z', vendor: 'Shell Staten Island' },
  { id: 'fl-13', vehicleId: 'RST-265', fuelType: 'Diesel', quantity: 58.2, pricePerLitre: 1.81, totalCost: 105.34, odometerReading: 6120, recordedAt: '2025-10-24T14:10:00Z', vendor: 'Exxon Jersey Gateway' }
];

// 2. Granular Daily Mileage Records (October 2025)
export const mockMileageRecords = [
  { id: 'mil-01', vehicleId: 'RST-291', startOdo: 11980, endOdo: 12110, distance: 130, date: '2025-10-18' },
  { id: 'mil-02', vehicleId: 'RST-291', startOdo: 12110, endOdo: 12285, distance: 175, date: '2025-10-19' },
  { id: 'mil-03', vehicleId: 'RST-291', startOdo: 12285, endOdo: 12460, distance: 175, date: '2025-10-20' },
  { id: 'mil-04', vehicleId: 'RST-291', startOdo: 12460, endOdo: 12650, distance: 190, date: '2025-10-21' },
  { id: 'mil-05', vehicleId: 'RST-291', startOdo: 12650, endOdo: 12840, distance: 190, date: '2025-10-22' },

  { id: 'mil-06', vehicleId: 'RST-284', startOdo: 27500, endOdo: 27690, distance: 190, date: '2025-10-18' },
  { id: 'mil-07', vehicleId: 'RST-284', startOdo: 27690, endOdo: 27890, distance: 200, date: '2025-10-19' },
  { id: 'mil-08', vehicleId: 'RST-284', startOdo: 27890, endOdo: 28080, distance: 190, date: '2025-10-20' },
  { id: 'mil-09', vehicleId: 'RST-284', startOdo: 28080, endOdo: 28240, distance: 160, date: '2025-10-21' },
  { id: 'mil-10', vehicleId: 'RST-284', startOdo: 28240, endOdo: 28410, distance: 170, date: '2025-10-22' },

  { id: 'mil-11', vehicleId: 'RST-276', startOdo: 41950, endOdo: 42080, distance: 130, date: '2025-10-18' },
  { id: 'mil-12', vehicleId: 'RST-276', startOdo: 42080, endOdo: 42180, distance: 100, date: '2025-10-19' }, // In service afterwards

  { id: 'mil-13', vehicleId: 'RST-265', startOdo: 5980, endOdo: 6050, distance: 70, date: '2025-10-18' },
  { id: 'mil-14', vehicleId: 'RST-265', startOdo: 6050, endOdo: 6120, distance: 70, date: '2025-10-21' }, // Mostly idle

  { id: 'mil-15', vehicleId: 'RST-263', startOdo: 30980, endOdo: 31180, distance: 200, date: '2025-10-18' },
  { id: 'mil-16', vehicleId: 'RST-263', startOdo: 31180, endOdo: 31340, distance: 160, date: '2025-10-20' },
  { id: 'mil-17', vehicleId: 'RST-263', startOdo: 31340, endOdo: 31500, distance: 160, date: '2025-10-22' },

  { id: 'mil-18', vehicleId: 'RST-251', startOdo: 18450, endOdo: 18620, distance: 170, date: '2025-10-18' },
  { id: 'mil-19', vehicleId: 'RST-251', startOdo: 18620, endOdo: 18780, distance: 160, date: '2025-10-20' },
  { id: 'mil-20', vehicleId: 'RST-251', startOdo: 18780, endOdo: 18900, distance: 120, date: '2025-10-22' }
];

// 3. Vehicle Operating & Usage Logs (Hours for Utilization Calculations)
// Standard Available Operating Time: 8.0 hours/day per vehicle (or 240 hrs/month)
export const mockUsageLogs = [
  { id: 'usg-01', vehicleId: 'RST-291', activeHours: 7.2, idleHours: 0.8, maintenanceHours: 0.0, date: '2025-10-22', availableHours: 8.0 },
  { id: 'usg-02', vehicleId: 'RST-284', activeHours: 7.4, idleHours: 0.6, maintenanceHours: 0.0, date: '2025-10-22', availableHours: 8.0 },
  { id: 'usg-03', vehicleId: 'RST-276', activeHours: 0.0, idleHours: 1.5, maintenanceHours: 6.5, date: '2025-10-22', availableHours: 8.0 },
  { id: 'usg-04', vehicleId: 'RST-265', activeHours: 2.1, idleHours: 5.9, maintenanceHours: 0.0, date: '2025-10-22', availableHours: 8.0 },
  { id: 'usg-05', vehicleId: 'RST-263', activeHours: 6.8, idleHours: 1.2, maintenanceHours: 0.0, date: '2025-10-22', availableHours: 8.0 },
  { id: 'usg-06', vehicleId: 'RST-251', activeHours: 6.9, idleHours: 1.1, maintenanceHours: 0.0, date: '2025-10-22', availableHours: 8.0 },

  // Cumulative monthly stats for 30-day period
  { id: 'usg-m01', vehicleId: 'RST-291', activeHours: 198.5, idleHours: 35.5, maintenanceHours: 6.0, availableHours: 240.0 }, // 82.7%
  { id: 'usg-m02', vehicleId: 'RST-284', activeHours: 212.0, idleHours: 24.0, maintenanceHours: 4.0, availableHours: 240.0 }, // 88.3%
  { id: 'usg-m03', vehicleId: 'RST-276', activeHours: 142.0, idleHours: 46.0, maintenanceHours: 52.0, availableHours: 240.0 }, // 59.2%
  { id: 'usg-m04', vehicleId: 'RST-265', activeHours: 86.0, idleHours: 154.0, maintenanceHours: 0.0, availableHours: 240.0 },  // 35.8% (Underutilized)
  { id: 'usg-m05', vehicleId: 'RST-263', activeHours: 188.0, idleHours: 42.0, maintenanceHours: 10.0, availableHours: 240.0 }, // 78.3%
  { id: 'usg-m06', vehicleId: 'RST-251', activeHours: 194.0, idleHours: 38.0, maintenanceHours: 8.0, availableHours: 240.0 }  // 80.8%
];

// 4. Granular Operational Expenses Breakdown (October 2025)
export const mockOperationalExpenses = [
  { id: 'exp-01', vehicleId: 'RST-291', category: 'Fuel', amount: 370.54, description: '3x Diesel Refueling Cycles', date: '2025-10-21' },
  { id: 'exp-02', vehicleId: 'RST-284', category: 'Fuel', amount: 396.18, description: '3x Diesel Refueling Cycles', date: '2025-10-23' },
  { id: 'exp-03', vehicleId: 'RST-276', category: 'Fuel', amount: 148.00, description: '1x Diesel Refueling Cycle', date: '2025-10-05' },
  { id: 'exp-04', vehicleId: 'RST-265', category: 'Fuel', amount: 205.06, description: '2x Diesel Refueling Cycles', date: '2025-10-24' },
  { id: 'exp-05', vehicleId: 'RST-263', category: 'Fuel', amount: 223.00, description: '2x Gasoline Refueling Cycles', date: '2025-10-18' },
  { id: 'exp-06', vehicleId: 'RST-251', category: 'Fuel', amount: 254.97, description: '2x Diesel Refueling Cycles', date: '2025-10-24' },

  { id: 'exp-07', vehicleId: 'RST-291', category: 'Maintenance', amount: 185.00, description: 'Synthetic Oil & Filter Replacement', date: '2025-10-18' },
  { id: 'exp-08', vehicleId: 'RST-284', category: 'Repairs', amount: 420.00, description: 'Brake Pad & Rotor Inspection/Replacement', date: '2025-10-10' },
  { id: 'exp-09', vehicleId: 'RST-276', category: 'Repairs', amount: 560.00, description: 'Transmission Fluid Flush & Coolant Sensor', date: '2025-10-22' },
  { id: 'exp-10', vehicleId: 'RST-265', category: 'Maintenance', amount: 120.00, description: 'Quarterly Safety State Inspection', date: '2025-10-15' },

  { id: 'exp-11', vehicleId: 'RST-291', category: 'Insurance', amount: 310.00, description: 'Commercial Vehicle Comprehensive Policy', date: '2025-10-01' },
  { id: 'exp-12', vehicleId: 'RST-284', category: 'Insurance', amount: 310.00, description: 'Commercial Vehicle Comprehensive Policy', date: '2025-10-01' },
  { id: 'exp-13', vehicleId: 'RST-276', category: 'Insurance', amount: 310.00, description: 'Commercial Vehicle Comprehensive Policy', date: '2025-10-01' },
  { id: 'exp-14', vehicleId: 'RST-265', category: 'Insurance', amount: 310.00, description: 'Commercial Vehicle Comprehensive Policy', date: '2025-10-01' },
  { id: 'exp-15', vehicleId: 'RST-263', category: 'Insurance', amount: 310.00, description: 'Commercial Vehicle Comprehensive Policy', date: '2025-10-01' },
  { id: 'exp-16', vehicleId: 'RST-251', category: 'Insurance', amount: 310.00, description: 'Commercial Vehicle Comprehensive Policy', date: '2025-10-01' },

  { id: 'exp-17', vehicleId: 'RST-291', category: 'Driver Wages', amount: 720.00, description: 'Fortnightly Route Operator Base + Allowance', date: '2025-10-15' },
  { id: 'exp-18', vehicleId: 'RST-284', category: 'Driver Wages', amount: 720.00, description: 'Fortnightly Route Operator Base + Allowance', date: '2025-10-15' },
  { id: 'exp-19', vehicleId: 'RST-276', category: 'Driver Wages', amount: 720.00, description: 'Fortnightly Route Operator Base + Allowance', date: '2025-10-15' },
  { id: 'exp-20', vehicleId: 'RST-265', category: 'Driver Wages', amount: 720.00, description: 'Fortnightly Route Operator Base + Allowance', date: '2025-10-15' },
  { id: 'exp-21', vehicleId: 'RST-263', category: 'Driver Wages', amount: 720.00, description: 'Fortnightly Route Operator Base + Allowance', date: '2025-10-15' },
  { id: 'exp-22', vehicleId: 'RST-251', category: 'Driver Wages', amount: 720.00, description: 'Fortnightly Route Operator Base + Allowance', date: '2025-10-15' },

  { id: 'exp-23', vehicleId: 'RST-291', category: 'Tolls & Permits', amount: 145.00, description: 'E-ZPass Metro Corridor Crossings', date: '2025-10-24' },
  { id: 'exp-24', vehicleId: 'RST-284', category: 'Tolls & Permits', amount: 165.00, description: 'E-ZPass Metro Corridor Crossings', date: '2025-10-24' }
];

// Historical 5-Month Summary for Trend Visualizations
export const mockHistoricalMonthlyAnalytics = [
  { month: 'Jun', distance: 16800, fuelQuantity: 1420, fuelCost: 2612.80, totalExpenses: 8940.00, activeVehicles: 22, utilization: 81.2 },
  { month: 'Jul', distance: 17400, fuelQuantity: 1530, fuelCost: 2784.60, totalExpenses: 9210.00, activeVehicles: 23, utilization: 82.5 },
  { month: 'Aug', distance: 18100, fuelQuantity: 1610, fuelCost: 2946.30, totalExpenses: 9680.00, activeVehicles: 24, utilization: 84.8 },
  { month: 'Sep', distance: 17600, fuelQuantity: 1490, fuelCost: 2756.50, totalExpenses: 9350.00, activeVehicles: 23, utilization: 83.1 },
  { month: 'Oct', distance: 18420, fuelQuantity: 1547, fuelCost: 2862.00, totalExpenses: 9845.00, activeVehicles: 24, utilization: 85.7 }
];

