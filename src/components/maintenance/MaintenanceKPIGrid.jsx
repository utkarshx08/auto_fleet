import React from 'react';
import {
  Truck,
  AlertTriangle,
  Clock,
  ShieldAlert,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export default function MaintenanceKPIGrid({ kpis, onCardClick, activeFilter }) {
  const cards = [
    {
      id: 'total',
      title: 'TOTAL REGISTERED VEHICLES',
      value: kpis.totalVehicles,
      unit: 'fleet units',
      sub: 'Monitored across depot',
      icon: Truck,
      color: 'text-[#b49aff]',
      bg: 'bg-[#b49aff]/10'
    },
    {
      id: 'due',
      title: 'DUE FOR MAINTENANCE',
      value: kpis.dueCount,
      unit: 'vehicles',
      sub: 'Reaching service window',
      icon: Clock,
      color: 'text-[#e5a46e]',
      bg: 'bg-[#e5a46e]/10'
    },
    {
      id: 'upcoming',
      title: 'UPCOMING SERVICE',
      value: kpis.upcomingCount,
      unit: 'schedules',
      sub: 'Scheduled next 30 days',
      icon: AlertTriangle,
      color: 'text-[#8dc8ed]',
      bg: 'bg-[#8dc8ed]/10'
    },
    {
      id: 'overdue',
      title: 'OVERDUE MAINTENANCE',
      value: kpis.overdueCount,
      unit: 'critical',
      sub: kpis.overdueCount > 0 ? 'Requires immediate bay triage' : 'Zero overdue items',
      icon: ShieldAlert,
      color: kpis.overdueCount > 0 ? 'text-red-400' : 'text-[#8be0b3]',
      bg: kpis.overdueCount > 0 ? 'bg-red-400/10' : 'bg-[#8be0b3]/10'
    },
    {
      id: 'completed',
      title: 'COMPLETED THIS MONTH',
      value: kpis.completedThisMonth,
      unit: 'work orders',
      sub: 'Inspections & repairs closed',
      icon: CheckCircle2,
      color: 'text-[#8be0b3]',
      bg: 'bg-[#8be0b3]/10'
    },
    {
      id: 'expenses',
      title: 'MAINTENANCE EXPENSES',
      value: `$${kpis.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      unit: 'total spend',
      sub: 'Parts, labour & diagnostics',
      icon: DollarSign,
      color: 'text-[#c4b3ff]',
      bg: 'bg-[#c4b3ff]/10'
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

