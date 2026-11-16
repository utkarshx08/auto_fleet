import React from 'react';
import { Shield, ShieldAlert, MapPin, AlertTriangle } from 'lucide-react';

export default function GeofenceKPIGrid({
  geofences = [],
  alerts = [],
  onOpenCreateModal
}) {
  const totalZones = geofences.length;
  const activeZones = geofences.filter((g) => g.isActive).length;
  const restrictedZones = geofences.filter(
    (g) => g.zoneType === 'restricted' || g.zoneType === 'prohibited'
  ).length;

  const todayBreaches = alerts.length;
  const criticalBreaches = alerts.filter(
    (a) => a.severity === 'critical' && a.status !== 'resolved'
  ).length;
  const pendingAlerts = alerts.filter((a) => a.status === 'new').length;

  const kpis = [
    {
      title: 'TOTAL GEOFENCES',
      value: totalZones,
      subtitle: `${activeZones} active · ${totalZones - activeZones} paused`,
      icon: MapPin,
      color: 'text-[#2879E8]',
      bg: 'bg-[#EAF3FF]'
    },
    {
      title: 'RESTRICTED ZONES',
      value: restrictedZones,
      subtitle: 'Strict containment perimeters',
      icon: ShieldAlert,
      color: 'text-[#E05252]',
      bg: 'bg-[#FDF2F2]'
    },
    {
      title: 'ACTIVE BREACH ALERTS',
      value: pendingAlerts,
      subtitle: `${criticalBreaches} critical unaddressed`,
      icon: AlertTriangle,
      color: criticalBreaches > 0 ? 'text-[#E05252]' : 'text-[#E7A329]',
      bg: criticalBreaches > 0 ? 'bg-[#FDF2F2]' : 'bg-[#FEF7EA]'
    },
    {
      title: 'MONITORED INCIDENTS',
      value: todayBreaches,
      subtitle: 'Entry, exit, dwell & speed events',
      icon: Shield,
      color: 'text-[#16A36A]',
      bg: 'bg-[#E8F7F0]'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const IconComponent = kpi.icon;
        return (
          <div
            key={idx}
            className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono tracking-wider text-[#8A97AB] uppercase font-semibold">
                {kpi.title}
              </span>
              <div className={`w-8 h-8 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center border border-white/60 shadow-2xs`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            <div className="my-1.5">
              <span className="text-3xl font-black tracking-tight text-[#172033]">
                {kpi.value}
              </span>
            </div>

            <p className="text-[11px] text-[#68758A] font-medium m-0">
              {kpi.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
