import { useState, useMemo } from 'react';
import {
  filterAnalyticsDataset,
  computeAnalyticsKPIs,
  computeFuelAnalytics,
  computeMileageAnalytics,
  computeUtilizationAnalytics,
  computeExpenseAnalytics,
  exportAnalyticsToCSV
} from '../services/analyticsService';
import { initialVehicles } from '../data/mockData';
import {
  mockFuelRecords,
  mockMileageRecords,
  mockUsageLogs,
  mockOperationalExpenses
} from '../data/analyticsMockData';

export default function useFleetAnalytics() {
  const [dateFilter, setDateFilter] = useState('this_month');
  const [selectedVehicleId, setSelectedVehicleId] = useState('ALL');
  const [selectedFuelType, setSelectedFuelType] = useState('ALL');
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState('ALL');
  const [vehicles] = useState(initialVehicles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Compute filtered dataset
  const filteredData = useMemo(() => {
    return filterAnalyticsDataset({
      fuelRecords: mockFuelRecords,
      mileageRecords: mockMileageRecords,
      usageLogs: mockUsageLogs,
      expenses: mockOperationalExpenses,
      dateFilter,
      vehicleId: selectedVehicleId,
      fuelType: selectedFuelType,
      expenseCategory: selectedExpenseCategory
    });
  }, [dateFilter, selectedVehicleId, selectedFuelType, selectedExpenseCategory]);

  // Aggregate Computations
  const kpiMetrics = useMemo(() => {
    return computeAnalyticsKPIs(filteredData, vehicles);
  }, [filteredData, vehicles]);

  const fuelAnalytics = useMemo(() => {
    return computeFuelAnalytics(filteredData.fuelRecords, vehicles);
  }, [filteredData.fuelRecords, vehicles]);

  const mileageAnalytics = useMemo(() => {
    return computeMileageAnalytics(filteredData.mileageRecords, vehicles);
  }, [filteredData.mileageRecords, vehicles]);

  const utilizationAnalytics = useMemo(() => {
    return computeUtilizationAnalytics(filteredData.usageLogs, vehicles);
  }, [filteredData.usageLogs, vehicles]);

  const expenseAnalytics = useMemo(() => {
    const totalDist = mileageAnalytics.totalDistance || 18420;
    return computeExpenseAnalytics(filteredData.expenses, totalDist);
  }, [filteredData.expenses, mileageAnalytics.totalDistance]);

  const handleExportCSV = () => {
    exportAnalyticsToCSV({
      kpiData: kpiMetrics,
      fuelData: fuelAnalytics,
      mileageData: mileageAnalytics,
      utilizationData: utilizationAnalytics,
      expenseData: expenseAnalytics,
      fileName: `autrail-analytics-${dateFilter}-${new Date().toISOString().split('T')[0]}.csv`
    });
  };

  const resetFilters = () => {
    setDateFilter('this_month');
    setSelectedVehicleId('ALL');
    setSelectedFuelType('ALL');
    setSelectedExpenseCategory('ALL');
  };

  return {
    // Filter State & Setters
    dateFilter,
    setDateFilter,
    selectedVehicleId,
    setSelectedVehicleId,
    selectedFuelType,
    setSelectedFuelType,
    selectedExpenseCategory,
    setSelectedExpenseCategory,
    resetFilters,

    // Raw & Computed Data
    vehicles,
    kpiMetrics,
    fuelAnalytics,
    mileageAnalytics,
    utilizationAnalytics,
    expenseAnalytics,

    // Actions & State
    handleExportCSV,
    loading,
    error
  };
}

