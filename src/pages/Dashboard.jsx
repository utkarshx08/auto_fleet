import React from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import VehicleOverview from '../components/dashboard/VehicleOverview';
import DistanceChart from '../components/dashboard/DistanceChart';
import VehicleTable from '../components/dashboard/VehicleTable';
import MaintenanceAlerts from '../components/dashboard/MaintenanceAlerts';
import Button from '../components/common/Button';
import TrueFocus from '../components/common/TrueFocus';
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

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date()).toUpperCase();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 18) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  return (
    <div className="space-y-4">
      {/* Page Heading */}
      <section className="flex items-end justify-between py-6 max-md:flex-col max-md:items-start max-md:gap-4 max-md:py-4">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-2">
            {formattedDate} <span className="text-[#ad91ff] px-1">•</span> {getGreeting()}, JORDAN
          </p>
          <div className="-ml-3 py-1">
            <TrueFocus
              sentence="Fleet Command Intelligence"
              manualMode={false}
              focusStyle="brackets"
              easing="smooth"
              borderColor="#b49aff"
              glowColor="rgba(180, 154, 255, 0.45)"
              blurAmount={2.5}
              focusScale={1.04}
              cornerSize={14}
              borderWidth={2.5}
              frameGap={8}
              animationDuration={0.5}
              pauseBetweenAnimations={1.4}
              fontSize="1.75rem"
              wordClassName="text-[#f0f0f4] font-bold tracking-tight"
            />
          </div>
          <p className="text-[12px] text-[#898c98] mt-1.5 mb-0">
            Here’s what’s happening across your fleet today.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 max-md:w-full">
          <Button
            variant="quiet"
            onClick={onExportReport}
            icon={Download}
            className="max-md:flex-1"
          >
            Export report
          </Button>
          <Button
            variant="primary"
            onClick={onAddVehicle}
            icon={Plus}
            className="max-md:flex-1"
          >
            Add vehicle
          </Button>
        </div>
      </section>

      {/* 4 Metric Cards Grid */}
      <section className="grid grid-cols-4 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-3.5">
        <MetricCard
          title="ACTIVE VEHICLES"
          symbol="↗"
          value={`${activeCount}`}
          unit={`/ ${totalCount}`}
          changeText="↑ 8.2%"
          changeType="positive"
          comparisonText="vs. last month"
          sparklineTheme="purple"
          sparkline={[35, 48, 42, 60, 55, 78, 90]}
        />

        <MetricCard
          title="TOTAL DISTANCE"
          symbol="⌁"
          value="18,420"
          unit="km"
          changeText="↑ 12.4%"
          changeType="positive"
          comparisonText="vs. last month"
          sparklineTheme="teal"
          sparkline={[45, 30, 54, 47, 68, 60, 90]}
        />

        <MetricCard
          title="FUEL EFFICIENCY"
          symbol="◉"
          value="8.4"
          unit="L/100km"
          changeText="↓ 3.1%"
          changeType="positive"
          comparisonText="vs. last month"
          sparklineTheme="violet"
          sparkline={[80, 70, 64, 58, 50, 42, 35]}
        />

        <MetricCard
          title="MAINTENANCE DUE"
          symbol="!"
          isSymbolWarning={true}
          value="03"
          unit="vehicles"
          changeText="Needs attention"
          changeType="warning"
          comparisonText="Next 7 days"
          sparklineTheme="steps"
          sparkline={[8, 13, 19, 8, 13, 8, 8]}
        />
      </section>

      {/* Middle Grid: Spotlight + Distance Chart */}
      <section className="grid grid-cols-[1.06fr_1fr] max-lg:grid-cols-1 gap-3.5">
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
      <section className="grid grid-cols-[1.6fr_1fr] max-lg:grid-cols-1 gap-3.5">
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

