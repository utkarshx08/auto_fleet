import React from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import VehicleOverview from '../components/dashboard/VehicleOverview';
import DistanceChart from '../components/dashboard/DistanceChart';
import VehicleTable from '../components/dashboard/VehicleTable';
import MaintenanceAlerts from '../components/dashboard/MaintenanceAlerts';
import Button from '../components/common/Button';
import TrueFocus from '../components/common/TrueFocus';
import { useAuth } from '../context/AuthContext';
import { Download, Plus } from 'lucide-react';

export default function Dashboard({
  vehicles = [],
  alerts = [],
  onAddVehicle,
  onExportReport,
  onViewVehicleDetails,
  onViewAllVehicles,
  onViewAllAlerts,
  onSelectVehicle,
  onPeriodChange
}) {
  const activeCount = vehicles.filter((v) => v.status === 'active').length;
  const totalCount = vehicles.length;
  const spotlightVehicle = vehicles[0];
  const { profile } = useAuth();
  const operatorGreetingName = profile?.fullName ? profile.fullName.split(' ')[0] : 'Operator';

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <section className="flex items-end justify-between py-2 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-2">
            <span>{formattedDate}</span>
            <span className="text-slate-300">•</span>
            <span>Welcome back, {operatorGreetingName}</span>
          </p>
          <div className="py-0.5">
            <TrueFocus
              sentence="Fleet Command & Intelligence"
            />
          </div>
          <p className="text-xs text-slate-600 mt-1 mb-0 font-normal">
            Real-time telemetry, asset utilization and operational intelligence across active logistics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 max-md:w-full">
          <Button
            variant="default"
            size="md"
            onClick={onExportReport}
            icon={Download}
            className="max-md:flex-1"
          >
            Export report
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onAddVehicle}
            icon={Plus}
            className="max-md:flex-1"
          >
            Add vehicle
          </Button>
        </div>
      </section>

      {/* 4 Metric Cards Grid */}
      <section className="grid grid-cols-4 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-4">
        <MetricCard
          title="Active Vehicles"
          value={`${activeCount}`}
          unit={`/ ${totalCount} assets`}
          changeText="+8.2%"
          changeType="positive"
          comparisonText="vs. last month"
          sparkline={[35, 48, 42, 60, 55, 78, 90]}
        />

        <MetricCard
          title="Total Distance"
          value="18,420"
          unit="km"
          changeText="+12.4%"
          changeType="positive"
          comparisonText="vs. last month"
          sparkline={[45, 30, 54, 47, 68, 60, 90]}
        />

        <MetricCard
          title="Fuel Efficiency"
          value="8.4"
          unit="L/100km"
          changeText="-3.1%"
          changeType="positive"
          comparisonText="vs. last month"
          sparkline={[80, 70, 64, 58, 50, 42, 35]}
        />

        <MetricCard
          title="Maintenance Due"
          isSymbolWarning={true}
          value="03"
          unit="vehicles"
          changeText="Attention needed"
          changeType="warning"
          comparisonText="Next 7 days"
          sparkline={[8, 13, 19, 8, 13, 8, 8]}
        />
      </section>

      {/* Middle Grid: Spotlight + Distance Chart */}
      <section className="grid grid-cols-[1.1fr_1fr] max-lg:grid-cols-1 gap-4">
        <VehicleOverview
          vehicle={spotlightVehicle}
          currentIndex={1}
          totalVehicles={totalCount}
          onViewDetails={onViewVehicleDetails}
          onMoreActions={() => onViewVehicleDetails && onViewVehicleDetails(spotlightVehicle)}
        />
        <DistanceChart onPeriodChange={onPeriodChange} />
      </section>

      {/* Bottom Grid: Fleet Status Table + Attention Alerts */}
      <section className="grid grid-cols-[1.6fr_1fr] max-lg:grid-cols-1 gap-4">
        <VehicleTable
          vehicles={vehicles}
          onViewAll={onViewAllVehicles}
          onSelectVehicle={onSelectVehicle}
        />
        <MaintenanceAlerts
          alerts={alerts}
          onViewAllAlerts={onViewAllAlerts}
          onAlertClick={onSelectVehicle}
        />
      </section>
    </div>
  );
}
