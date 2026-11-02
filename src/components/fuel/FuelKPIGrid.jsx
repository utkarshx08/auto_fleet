import React from 'react';
import {
  Fuel,
  DollarSign,
  TrendingDown,
  Calendar,
  Gauge,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';

export default function FuelKPIGrid({ kpis, onCardClick, activeFilter }) {
  const cards = [
    {
      id: 'purchased',
      title: 'TOTAL FUEL PURCHASED',
      value: `${kpis.totalFuelPurchased.toLocaleString()}`,
      unit: 'litres',
      sub: 'Cumulative fleet fuel volume',
      icon: Fuel,
      color: 'text-[#b49aff]',
      bg: 'bg-[#b49aff]/10'
    },
    {
      id: 'expenditure',
      title: 'TOTAL FUEL EXPENDITURE',
      value: `$${kpis.totalExpenditure.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      unit: 'total spend',
      sub: 'All fleet card receipts',
      icon: DollarSign,
      color: 'text-[#8be0b3]',
      bg: 'bg-[#8be0b3]/10'
    },
    {
      id: 'price',
      title: 'AVERAGE FUEL PRICE',
      value: `$${kpis.averagePricePerLitre.toFixed(2)}`,
      unit: 'per litre',
      sub: 'Volume-weighted average',
      icon: TrendingDown,
      color: 'text-[#8dc8ed]',
      bg: 'bg-[#8dc8ed]/10'
    },
    {
      id: 'monthly',
      title: 'MONTHLY CONSUMPTION',
      value: `${kpis.monthlyConsumption.toLocaleString()}`,
      unit: 'litres',
      sub: 'Current billing period',
      icon: Calendar,
      color: 'text-[#c4b3ff]',
      bg: 'bg-[#c4b3ff]/10'
    },
    {
      id: 'efficiency',
      title: 'AVERAGE FUEL EFFICIENCY',
      value: `${kpis.averageFuelEfficiency}`,
      unit: 'L/100km',
      sub: `Fleet baseline: $${kpis.costPerKm}/km`,
      icon: Gauge,
      color: 'text-[#82d4a8]',
      bg: 'bg-[#82d4a8]/10'
    },
    {
      id: 'anomalies',
      title: 'ANOMALY ALERTS',
      value: kpis.anomalyCount,
      unit: 'flagged',
      sub: kpis.anomalyCount > 0 ? 'Requires manager audit' : 'All transactions normal',
      icon: kpis.anomalyCount > 0 ? ShieldAlert : AlertTriangle,
      color: kpis.anomalyCount > 0 ? 'text-red-400' : 'text-[#8be0b3]',
      bg: kpis.anomalyCount > 0 ? 'bg-red-400/10' : 'bg-[#8be0b3]/10'
    }
  ];

  return (
    <div className="grid grid-cols-6 max-xl:grid-cols-3 max-sm:grid-cols-2 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onCardClick && onCardClick(card.id)}
            className={`bg-[#17191f] border rounded-[9px] p-3.5 flex flex-col justify-between transition-all group ${
              onCardClick ? 'cursor-pointer hover:border-[#423d54] active:scale-[0.99]' : ''
            } ${
              isSelected ? 'border-[#b49aff] bg-[#1d1929]' : 'border-[#292c35]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] text-[#858894] uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`w-5 h-5 rounded flex items-center justify-center ${card.bg}`}>
                <Icon className={`w-3 h-3 ${card.color}`} />
              </div>
            </div>

            <div className="my-2 flex items-baseline gap-1.5 flex-wrap">
              <b className="text-xl font-bold font-mono text-[#f0f0f4]">{card.value}</b>
              <small className="text-[10px] text-[#888b97] font-mono">{card.unit}</small>
            </div>

            <span className="text-[9px] text-[#717480] font-mono truncate">{card.sub}</span>
          </div>
        );
      })}
    </div>
  );
}

