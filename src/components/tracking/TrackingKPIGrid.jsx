import React from 'react';
import {
  Truck,
  Navigation,
  Clock,
  WifiOff,
  Milestone,
  AlertTriangle
} from 'lucide-react';

export default function TrackingKPIGrid({ telemetryList = [], alerts = [], onOverspeedClick }) {
  const totalVehicles = telemetryList.length;
  const movingVehicles = telemetryList.filter((v) => v.status === 'moving').length;
  const idleOrStopped = telemetryList.filter((v) => v.status === 'idle' || v.status === 'stopped').length;
  const offlineVehicles = telemetryList.filter((v) => v.status === 'offline').length;

  const totalDistanceToday = telemetryList
    .reduce((sum, v) => sum + (v.todayDistance || 0), 0)
    .toFixed(1);

  const overspeedAlerts = alerts.filter((a) => !a.isResolved && a.alertType === 'overspeed').length;

  const cards = [
    {
      id: 'total',
      title: 'TOTAL TRANSPONDERS',
      value: totalVehicles,
      unit: 'units',
      sub: 'All deployed vehicles',
      icon: Truck,
      color: 'text-[#2879E8]',
      bg: 'bg-[#EAF3FF]'
    },
    {
      id: 'moving',
      title: 'CURRENTLY MOVING',
      value: movingVehicles,
      unit: 'active',
      sub: 'Speed > 5 km/h',
      icon: Navigation,
      color: 'text-[#16A36A]',
      bg: 'bg-[#E8F7F0]'
    },
    {
      id: 'stopped',
      title: 'IDLE / STOPPED',
      value: idleOrStopped,
      unit: 'depot/bay',
      sub: 'Stationary units',
      icon: Clock,
      color: 'text-[#E7A329]',
      bg: 'bg-[#FEF7EA]'
    },
    {
      id: 'offline',
      title: 'OFFLINE / NO SIGNAL',
      value: offlineVehicles,
      unit: 'units',
      sub: 'No ping > 15m',
      icon: WifiOff,
      color: 'text-[#8A97AB]',
      bg: 'bg-[#F1F5F9]'
    },
    {
      id: 'distance',
      title: 'FLEET DISTANCE TODAY',
      value: totalDistanceToday,
      unit: 'km',
      sub: 'Cumulative today',
      icon: Milestone,
      color: 'text-[#2879E8]',
      bg: 'bg-[#EAF3FF]'
    },
    {
      id: 'overspeed',
      title: 'OVERSPEED ALERTS',
      value: overspeedAlerts,
      unit: 'events',
      sub: overspeedAlerts > 0 ? 'Click to inspect events ↗' : 'Speed > 80 km/h limit',
      icon: AlertTriangle,
      color: overspeedAlerts > 0 ? 'text-[#E05252]' : 'text-[#16A36A]',
      bg: overspeedAlerts > 0 ? 'bg-[#FDF2F2]' : 'bg-[#E8F7F0]'
    }
  ];

  return (
    <div className="grid grid-cols-6 max-xl:grid-cols-3 max-sm:grid-cols-2 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => {
              if (card.id === 'overspeed' && onOverspeedClick) {
                onOverspeedClick();
              }
            }}
            className={`glass-card glass-card-hover rounded-2xl p-4 flex flex-col justify-between transition-all group ${
              card.id === 'overspeed'
                ? 'cursor-pointer hover:border-[#E05252]/40 active:scale-[0.99]'
                : ''
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

            <div className="my-2.5">
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-black tracking-tight ${card.id === 'overspeed' && card.value > 0 ? 'text-[#E05252]' : 'text-[#172033]'}`}>
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
