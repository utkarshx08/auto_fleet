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
      accentColor: 'text-[#2879E8]',
      badgeBg: 'bg-[#EAF3FF]'
    },
    {
      id: 'fuel_consumption',
      title: 'AVG FUEL CONSUMPTION',
      data: kpiMetrics.avgFuelConsumption,
      icon: Fuel,
      accentColor: 'text-[#0284C7]',
      badgeBg: 'bg-[#E0F2FE]'
    },
    {
      id: 'fuel_expenses',
      title: 'TOTAL FUEL EXPENSES',
      data: kpiMetrics.totalFuelExpenses,
      icon: DollarSign,
      accentColor: 'text-[#E7A329]',
      badgeBg: 'bg-[#FEF7EA]'
    },
    {
      id: 'utilization',
      title: 'VEHICLE UTILIZATION RATE',
      data: kpiMetrics.vehicleUtilization,
      icon: Gauge,
      accentColor: 'text-[#16A36A]',
      badgeBg: 'bg-[#E8F7F0]'
    },
    {
      id: 'operational_expenses',
      title: 'TOTAL OPERATIONAL EXPENSES',
      data: kpiMetrics.totalOperationalExpenses,
      icon: PieChart,
      accentColor: 'text-[#2879E8]',
      badgeBg: 'bg-[#EAF3FF]'
    },
    {
      id: 'cost_per_km',
      title: 'AVERAGE COST PER KILOMETRE',
      data: kpiMetrics.avgCostPerKm,
      icon: TrendingDown,
      accentColor: 'text-[#16A36A]',
      badgeBg: 'bg-[#E8F7F0]'
    }
  ];

  return (
    <div className="grid grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const item = card.data;
        if (!item) return null;

        return (
          <div
            key={card.id}
            className="glass-card glass-card-hover rounded-2xl p-5 min-h-[140px] flex flex-col justify-between transition-all duration-300 group"
          >
            {/* Header */}
            <div className="flex items-center justify-between text-[#8A97AB] font-mono text-[10px] tracking-[1.2px] uppercase font-semibold">
              <span>{card.title}</span>
              <div className={`w-8 h-8 rounded-xl ${card.badgeBg} ${card.accentColor} flex items-center justify-center border border-white/60 shadow-2xs group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Current Value */}
            <div className="text-[28px] font-black tracking-tight text-[#172033] my-2 leading-none font-mono">
              {item.value}
            </div>

            {/* Comparison Foot */}
            <div className="flex items-center justify-between text-[#68758A] text-[11px] pt-2 border-t border-[#E2E8F0]/80 mt-auto">
              <div className="flex items-center gap-2 font-mono">
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.isPositive
                      ? 'bg-[#E8F7F0] text-[#16A36A] border-[#C2E8D7]'
                      : 'bg-[#FEF7EA] text-[#E7A329] border-[#F8DCB0]'
                  }`}
                >
                  {item.isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {item.change}
                </span>
                <span className="text-[#8A97AB] text-[10px] font-sans">vs prev ({item.previous})</span>
              </div>

              {/* Indicator Pill */}
              <span
                className={`w-2 h-2 rounded-full ${
                  item.isPositive ? 'bg-[#16A36A] shadow-[0_0_6px_#16A36A]' : 'bg-[#E7A329] shadow-[0_0_6px_#E7A329]'
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
