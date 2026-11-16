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
      color: 'text-[#2879E8]',
      bg: 'bg-[#EAF3FF] border-[#2879E8]/20'
    },
    {
      id: 'expenditure',
      title: 'TOTAL FUEL EXPENDITURE',
      value: `$${kpis.totalExpenditure.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      unit: 'total spend',
      sub: 'All fleet card receipts',
      icon: DollarSign,
      color: 'text-[#16A36A]',
      bg: 'bg-[#DCFCE7] border-[#BBF7D0]'
    },
    {
      id: 'price',
      title: 'AVERAGE FUEL PRICE',
      value: `$${kpis.averagePricePerLitre.toFixed(2)}`,
      unit: 'per litre',
      sub: 'Volume-weighted average',
      icon: TrendingDown,
      color: 'text-[#2879E8]',
      bg: 'bg-[#EAF3FF] border-[#2879E8]/20'
    },
    {
      id: 'monthly',
      title: 'MONTHLY CONSUMPTION',
      value: `${kpis.monthlyConsumption.toLocaleString()}`,
      unit: 'litres',
      sub: 'Current billing period',
      icon: Calendar,
      color: 'text-[#2879E8]',
      bg: 'bg-[#EAF3FF] border-[#2879E8]/20'
    },
    {
      id: 'efficiency',
      title: 'AVERAGE FUEL EFFICIENCY',
      value: `${kpis.averageFuelEfficiency}`,
      unit: 'L/100km',
      sub: `Fleet baseline: $${kpis.costPerKm}/km`,
      icon: Gauge,
      color: 'text-[#16A36A]',
      bg: 'bg-[#DCFCE7] border-[#BBF7D0]'
    },
    {
      id: 'anomalies',
      title: 'ANOMALY ALERTS',
      value: kpis.anomalyCount,
      unit: 'flagged',
      sub: kpis.anomalyCount > 0 ? 'Requires manager audit' : 'All transactions normal',
      icon: kpis.anomalyCount > 0 ? ShieldAlert : AlertTriangle,
      color: kpis.anomalyCount > 0 ? 'text-[#E05252]' : 'text-[#16A36A]',
      bg: kpis.anomalyCount > 0 ? 'bg-[#FEF2F2] border-[#FECACA]' : 'bg-[#DCFCE7] border-[#BBF7D0]'
    }
  ];

  return (
    <div className="grid grid-cols-6 max-xl:grid-cols-3 max-sm:grid-cols-2 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onCardClick && onCardClick(card.id)}
            className={`glass-card border rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 group ${
              onCardClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]' : ''
            } ${
              isSelected
                ? 'border-[#2879E8] bg-[#EAF3FF]/40 shadow-sm'
                : 'border-white/95 shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-[#68758A] uppercase tracking-wider font-semibold">
                {card.title}
              </span>
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center border ${card.bg} shadow-2xs`}>
                <Icon className={`w-3.5 h-3.5 ${card.color}`} />
              </div>
            </div>

            <div className="my-2.5 flex items-baseline gap-1.5 flex-wrap">
              <b className="text-xl font-black font-mono text-[#172033] tracking-tight">{card.value}</b>
              <small className="text-[10px] text-[#8A97AB] font-mono font-medium">{card.unit}</small>
            </div>

            <span className="text-[10px] text-[#68758A] font-mono truncate font-medium">{card.sub}</span>
          </div>
        );
      })}
    </div>
  );
}
