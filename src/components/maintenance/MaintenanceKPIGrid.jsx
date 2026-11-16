import React from 'react';
import {
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function MaintenanceKPIGrid({ kpis, activeFilter, onCardClick }) {
  if (!kpis) return null;

  const cards = [
    {
      id: 'active',
      title: 'ACTIVE MONITORING',
      value: kpis.activeVehicles,
      unit: 'vehicles',
      sub: 'Sensors linked',
      icon: Wrench,
      color: 'text-[#2879E8]',
      bg: 'bg-[#EAF3FF]'
    },
    {
      id: 'due',
      title: 'MAINTENANCE DUE',
      value: kpis.dueCount,
      unit: 'vehicles',
      sub: 'Action required',
      icon: Clock,
      color: 'text-[#E7A329]',
      bg: 'bg-[#FEF7EA]'
    },
    {
      id: 'overdue',
      title: 'OVERDUE SERVICES',
      value: kpis.overdueCount,
      unit: 'critical',
      sub: 'Exceeded interval',
      icon: AlertTriangle,
      color: 'text-[#E05252]',
      bg: 'bg-[#FDF2F2]'
    },
    {
      id: 'upcoming',
      title: 'UPCOMING (30 DAYS)',
      value: kpis.upcomingCount,
      unit: 'scheduled',
      sub: 'Approaching target',
      icon: Calendar,
      color: 'text-[#0284C7]',
      bg: 'bg-[#E0F2FE]'
    },
    {
      id: 'completed',
      title: 'SERVICES COMPLETED',
      value: kpis.completedCount,
      unit: 'records',
      sub: 'Logged in ledger',
      icon: CheckCircle2,
      color: 'text-[#16A36A]',
      bg: 'bg-[#E8F7F0]'
    },
    {
      id: 'expenses',
      title: 'MAINTENANCE OUTLAY',
      value: `$${(kpis.totalCost || 0).toLocaleString()}`,
      unit: 'USD',
      sub: 'YTD shop costs',
      icon: DollarSign,
      color: 'text-[#16A36A]',
      bg: 'bg-[#E8F7F0]'
    }
  ];

  return (
    <div className="grid grid-cols-6 max-xl:grid-cols-3 max-sm:grid-cols-2 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onCardClick && onCardClick(card.id)}
            className={`glass-card glass-card-hover rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer group ${
              isSelected ? 'ring-2 ring-[#2879E8] shadow-liquid-dropdown' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-[#8A97AB] uppercase tracking-wider font-semibold">
                {card.title}
              </span>
              <div className={`w-7 h-7 rounded-xl ${card.bg} ${card.color} flex items-center justify-center border border-white/60 shadow-2xs`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-black tracking-tight font-mono ${card.id === 'overdue' && card.value > 0 ? 'text-[#E05252]' : 'text-[#172033]'}`}>
                  {card.value}
                </span>
                <span className="text-[11px] font-sans text-[#68758A] font-medium">
                  {card.unit}
                </span>
              </div>
            </div>

            <span className="text-[10px] text-[#8A97AB] font-mono truncate">
              {card.sub}
            </span>
          </div>
        );
      })}
    </div>
  );
}
