import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Gauge,
  Fuel,
  DollarSign,
  PieChart,
  Milestone
} from 'lucide-react';

export default function AnalyticsKPIGrid({ kpiMetrics }) {
  if (!kpiMetrics) return null;

  const cards = [
    {
      id: 'distance',
      title: 'TOTAL FLEET DISTANCE',
      data: kpiMetrics.totalDistance,
      icon: Milestone,
      accentColor: 'text-[#b49aff]',
      sparkColor: 'bg-[#b49aff]'
    },
    {
      id: 'fuel_consumption',
      title: 'AVG FUEL CONSUMPTION',
      data: kpiMetrics.avgFuelConsumption,
      icon: Fuel,
      accentColor: 'text-[#8dc8ed]',
      sparkColor: 'bg-[#8dc8ed]'
    },
    {
      id: 'fuel_expenses',
      title: 'TOTAL FUEL EXPENSES',
      data: kpiMetrics.totalFuelExpenses,
      icon: DollarSign,
      accentColor: 'text-[#e5a46e]',
      sparkColor: 'bg-[#e5a46e]'
    },
    {
      id: 'utilization',
      title: 'VEHICLE UTILIZATION RATE',
      data: kpiMetrics.vehicleUtilization,
      icon: Gauge,
      accentColor: 'text-[#8be0b3]',
      sparkColor: 'bg-[#8be0b3]'
    },
    {
      id: 'operational_expenses',
      title: 'TOTAL OPERATIONAL EXPENSES',
      data: kpiMetrics.totalOperationalExpenses,
      icon: PieChart,
      accentColor: 'text-[#c4b3ff]',
      sparkColor: 'bg-[#c4b3ff]'
    },
    {
      id: 'cost_per_km',
      title: 'AVERAGE COST PER KILOMETRE',
      data: kpiMetrics.avgCostPerKm,
      icon: TrendingDown,
      accentColor: 'text-[#80d9a9]',
      sparkColor: 'bg-[#80d9a9]'
    }
  ];

  return (
    <div className="grid grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const item = card.data;
        if (!item) return null;

        return (
          <div
            key={card.id}
            className="bg-[#17191f] border border-[#292c35] hover:border-[#3a3749] rounded-[10px] p-[17px] pb-[14px] min-h-[132px] flex flex-col justify-between transition-all duration-200 group"
          >
            {/* Header */}
            <div className="flex items-center justify-between text-[#8b8e9a] font-mono text-[9px] tracking-[1px] uppercase">
              <span>{card.title}</span>
              <Icon className={`w-4 h-4 ${card.accentColor} group-hover:scale-110 transition-transform`} />
            </div>

            {/* Current Value */}
            <div className="text-[25px] font-bold tracking-[-0.8px] text-[#f0f0f4] my-2 leading-none font-mono">
              {item.value}
            </div>

            {/* Comparison Foot */}
            <div className="flex items-center justify-between text-[#777b87] text-[9px] pt-1 border-t border-[#22242d] mt-auto">
              <div className="flex items-center gap-1.5 font-mono">
                <span
                  className={`flex items-center gap-0.5 text-[10px] font-semibold ${
                    item.isPositive ? 'text-[#80d9a9]' : 'text-[#e5a46e]'
                  }`}
                >
                  {item.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {item.change}
                </span>
                <span className="text-[#686c78] font-sans">vs prev ({item.previous})</span>
              </div>

              {/* Indicator Pill */}
              <span
                className={`w-2 h-2 rounded-full ${
                  item.isPositive ? 'bg-[#75d5a2] shadow-[0_0_6px_#75d5a2]' : 'bg-[#e5a46e] shadow-[0_0_6px_#e5a46e]'
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

