import React from 'react';
import { Shield, ShieldAlert, MapPin, AlertTriangle, CheckCircle, Navigation } from 'lucide-react';

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
      color: '#b49aff',
      bgColor: 'rgba(180, 154, 255, 0.08)'
    },
    {
      title: 'RESTRICTED ZONES',
      value: restrictedZones,
      subtitle: 'Strict hazmat & pedestrian perimeters',
      icon: ShieldAlert,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.08)'
    },
    {
      title: 'ACTIVE BREACH ALERTS',
      value: pendingAlerts,
      subtitle: `${criticalBreaches} critical unaddressed`,
      icon: AlertTriangle,
      color: criticalBreaches > 0 ? '#ef4444' : '#e5a46e',
      bgColor: criticalBreaches > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(229, 164, 110, 0.08)'
    },
    {
      title: 'MONITORED INCIDENTS',
      value: todayBreaches,
      subtitle: 'Entry, exit, dwell & speed events',
      icon: Shield,
      color: '#8be0b3',
      bgColor: 'rgba(139, 224, 179, 0.08)'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const IconComponent = kpi.icon;
        return (
          <div
            key={idx}
            className="bg-[#17191f] border border-[#252730] rounded-xl p-4 flex flex-col justify-between hover:border-[#353945] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono tracking-wider text-[#8b8d98]">
                {kpi.title}
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: kpi.bgColor }}
              >
                <IconComponent className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-[#f4f3f8] mb-1">
                {kpi.value}
              </div>
              <div className="text-[11px] text-[#71737e] flex items-center gap-1.5 font-mono">
                {kpi.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

