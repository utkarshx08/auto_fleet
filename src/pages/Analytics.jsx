import React, { useState } from 'react';
import useFleetAnalytics from '../hooks/useFleetAnalytics';
import AnalyticsFilterBar from '../components/analytics/AnalyticsFilterBar';
import AnalyticsKPIGrid from '../components/analytics/AnalyticsKPIGrid';
import FuelAnalyticsSection from '../components/analytics/FuelAnalyticsSection';
import DistanceMileageSection from '../components/analytics/DistanceMileageSection';
import VehicleUtilizationSection from '../components/analytics/VehicleUtilizationSection';
import OperationalExpensesSection from '../components/analytics/OperationalExpensesSection';
import AnalyticsReportExportModal from '../components/analytics/AnalyticsReportExportModal';
import Button from '../components/common/Button';
import { Download, TrendingUp, Sparkles, Filter } from 'lucide-react';

export default function Analytics() {
  const {
    dateFilter,
    setDateFilter,
    selectedVehicleId,
    setSelectedVehicleId,
    selectedFuelType,
    setSelectedFuelType,
    selectedExpenseCategory,
    setSelectedExpenseCategory,
    resetFilters,
    vehicles,
    kpiMetrics,
    fuelAnalytics,
    mileageAnalytics,
    utilizationAnalytics,
    expenseAnalytics,
    handleExportCSV
  } = useFleetAnalytics();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-end justify-between py-2 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#475569] uppercase mb-1 font-bold">
            Performance Intelligence & Business Insights
          </p>
          <h1 className="text-[28px] tracking-tight font-black text-[#0B132B] m-0">
            Fleet Analytics<span className="text-[#2879E8]">.</span>
          </h1>
          <p className="text-[13px] text-[#334155] mt-1 font-semibold">
            Holistic telemetry analysis across fuel efficiency, operating mileage, asset utilization, and financial expenditures.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            onClick={() => setIsExportModalOpen(true)}
            icon={Download}
          >
            Export intelligence report
          </Button>
        </div>
      </div>

      {/* Global Interactive Filter Toolbar */}
      <AnalyticsFilterBar
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        selectedVehicleId={selectedVehicleId}
        setSelectedVehicleId={setSelectedVehicleId}
        selectedFuelType={selectedFuelType}
        setSelectedFuelType={setSelectedFuelType}
        selectedExpenseCategory={selectedExpenseCategory}
        setSelectedExpenseCategory={setSelectedExpenseCategory}
        vehicles={vehicles}
        onReset={resetFilters}
      />

      {/* Top 6 KPI Performance Cards */}
      <AnalyticsKPIGrid kpiMetrics={kpiMetrics} />

      {/* Section 1: Fuel Consumption Analytics */}
      <FuelAnalyticsSection fuelData={fuelAnalytics} />

      {/* Section 2: Distance & Mileage Analytics */}
      <DistanceMileageSection mileageData={mileageAnalytics} />

      {/* Section 3: Vehicle Utilization Analytics */}
      <VehicleUtilizationSection utilizationData={utilizationAnalytics} />

      {/* Section 4: Monthly Operational Expenses */}
      <OperationalExpensesSection expenseData={expenseAnalytics} />

      {/* Report Export Dialog */}
      <AnalyticsReportExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        kpiMetrics={kpiMetrics}
        fuelData={fuelAnalytics}
        mileageData={mileageAnalytics}
        utilizationData={utilizationAnalytics}
        expenseData={expenseAnalytics}
        onExportCSV={handleExportCSV}
      />
    </div>
  );
}
