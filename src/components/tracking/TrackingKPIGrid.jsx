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
      color: 'text-[#b49aff]',
      bg: 'bg-[#b49aff]/10'
    },
    {
      id: 'moving',
      title: 'CURRENTLY MOVING',
      value: movingVehicles,
      unit: 'active',
      sub: 'Speed > 5 km/h',
      icon: Navigation,
      color: 'text-[#8be0b3]',
      bg: 'bg-[#8be0b3]/10'
    },
    {
      id: 'stopped',
      title: 'IDLE / STOPPED',
      value: idleOrStopped,
      unit: 'depot/bay',
      sub: 'Stationary units',
      icon: Clock,
      color: 'text-[#e5a46e]',
      bg: 'bg-[#e5a46e]/10'
    },
    {
      id: 'offline',
      title: 'OFFLINE / NO SIGNAL',
      value: offlineVehicles,
      unit: 'units',
      sub: 'No ping > 15m',
      icon: WifiOff,
      color: 'text-[#747783]',
      bg: 'bg-[#747783]/10'
    },
    {
      id: 'distance',
      title: 'FLEET DISTANCE TODAY',
      value: totalDistanceToday,
      unit: 'km',
      sub: 'Cumulative today',
      icon: Milestone,
      color: 'text-[#c4b3ff]',
      bg: 'bg-[#c4b3ff]/10'
    },
    {
      id: 'overspeed',
      title: 'OVERSPEED ALERTS',
      value: overspeedAlerts,
      unit: 'events',
      sub: overspeedAlerts > 0 ? 'Click to inspect events ↗' : 'Speed > 80 km/h threshold',
      icon: AlertTriangle,
      color: overspeedAlerts > 0 ? 'text-red-400' : 'text-[#8be0b3]',
      bg: overspeedAlerts > 0 ? 'bg-red-400/10' : 'bg-[#8be0b3]/10'
    }
  ];

  return (
    <div className="grid grid-cols-6 max-xl:grid-cols-3 max-sm:grid-cols-2 gap-3">
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
            className={`bg-[#17191f] border border-[#292c35] rounded-[9px] p-3 flex flex-col justify-between transition-all group ${
              card.id === 'overspeed'
                ? 'cursor-pointer hover:border-red-500/50 hover:bg-[#1a1720] active:scale-[0.99]'
                : 'hover:border-[#383c4a]'
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

            <div className="my-2 flex items-baseline gap-1.5">
              <b className="text-xl font-bold font-mono text-[#f0f0f4]">{card.value}</b>
              <small className="text-[10px] text-[#888b97] font-mono">{card.unit}</small>
            </div>

            <span className="text-[9px] text-[#717480] font-mono">{card.sub}</span>
          </div>
        );
      })}
    </div>
  );
}

