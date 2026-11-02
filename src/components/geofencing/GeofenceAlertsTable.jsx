import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  Eye,
  Crosshair,
  Clock,
  Gauge
} from 'lucide-react';

export default function GeofenceAlertsTable({
  alerts = [],
  onAcknowledgeAlert,
  onResolveAlert,
  onFocusAlert
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');

  const filteredAlerts = alerts.filter((alert) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      alert.plate?.toLowerCase().includes(term) ||
      alert.vehicleId?.toLowerCase().includes(term) ||
      alert.geofenceName?.toLowerCase().includes(term) ||
      alert.message?.toLowerCase().includes(term);

    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesType = eventTypeFilter === 'all' || alert.eventType === eventTypeFilter;

    return matchesSearch && matchesSeverity && matchesStatus && matchesType;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#8be0b3]/15 text-[#8be0b3] border border-[#8be0b3]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8be0b3]" />
            ROUTINE
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#ef4444]/10 text-[#f87171] border border-[#ef4444]/20 font-bold">
            NEW INCIDENT
          </span>
        );
      case 'acknowledged':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#f59e0b]/10 text-[#fbbf24] border border-[#f59e0b]/20 font-bold">
            ACKNOWLEDGED
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#8be0b3]/10 text-[#8be0b3] border border-[#8be0b3]/20 font-bold">
            RESOLVED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#17191f] border border-[#252730] rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* Filter Bar */}
      <div className="p-4 border-b border-[#252730] flex flex-wrap items-center justify-between gap-3 bg-[#13141a]">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#71737e] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search breaches by vehicle or zone name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#101116] border border-[#252730] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#f4f3f8] placeholder-[#555] focus:outline-none focus:border-[#b49aff]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#101116] border border-[#252730] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#8b8d98] focus:outline-none focus:border-[#b49aff]"
          >
            <option value="all">ALL SEVERITIES</option>
            <option value="critical">CRITICAL ONLY</option>
            <option value="high">HIGH ONLY</option>
            <option value="medium">MEDIUM ONLY</option>
            <option value="low">ROUTINE ONLY</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#101116] border border-[#252730] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#8b8d98] focus:outline-none focus:border-[#b49aff]"
          >
            <option value="all">ALL STATUSES</option>
            <option value="new">NEW INCIDENTS</option>
            <option value="acknowledged">ACKNOWLEDGED</option>
            <option value="resolved">RESOLVED</option>
          </select>

          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="bg-[#101116] border border-[#252730] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#8b8d98] focus:outline-none focus:border-[#b49aff]"
          >
            <option value="all">ALL EVENT TYPES</option>
            <option value="restricted_breach">RESTRICTED BREACH</option>
            <option value="zone_overspeed">ZONE OVERSPEED</option>
            <option value="excessive_dwell">EXCESSIVE DWELL</option>
            <option value="geofence_entry">ZONE ENTRY</option>
            <option value="geofence_exit">ZONE EXIT</option>
          </select>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#252730] bg-[#121319] text-[#71737e] font-mono text-[11px]">
              <th className="py-3 px-4 font-normal">SEVERITY</th>
              <th className="py-3 px-3 font-normal">VEHICLE TRANSPONDER</th>
              <th className="py-3 px-3 font-normal">MONITORED ZONE</th>
              <th className="py-3 px-3 font-normal">BREACH DETAIL</th>
              <th className="py-3 px-3 font-normal text-right">TELEMETRY</th>
              <th className="py-3 px-3 font-normal text-center">STATUS</th>
              <th className="py-3 px-4 font-normal text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#20222a]">
            {filteredAlerts.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-[#71737e] font-mono">
                  No geofence breach incidents logged matching current filters.
                </td>
              </tr>
            ) : (
              filteredAlerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="hover:bg-[#1c1e27] transition-colors cursor-pointer group"
                  onClick={() => onFocusAlert && onFocusAlert(alert)}
                >
                  {/* Severity */}
                  <td className="py-3 px-4">
                    {getSeverityBadge(alert.severity)}
                  </td>

                  {/* Vehicle */}
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-[#f4f3f8]">
                      {alert.plate || alert.vehicleId}
                    </div>
                    <div className="text-[10px] text-[#71737e] font-mono">
                      {alert.timestamp || 'Just now'}
                    </div>
                  </td>

                  {/* Monitored Zone */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#e0e0e7] max-w-[200px] truncate">
                      {alert.geofenceName || 'Monitored Perimeter'}
                    </div>
                    <div className="text-[10px] text-[#8b8d98] font-mono uppercase">
                      {alert.zoneType || 'Security Boundary'}
                    </div>
                  </td>

                  {/* Breach Detail */}
                  <td className="py-3 px-3">
                    <p className="text-[#8b8d98] line-clamp-2 max-w-sm text-[11px] leading-relaxed">
                      {alert.message}
                    </p>
                  </td>

                  {/* Telemetry */}
                  <td className="py-3 px-3 text-right font-mono">
                    <div className="text-[#f4f3f8] flex items-center justify-end gap-1">
                      <Gauge className="w-3 h-3 text-[#b49aff]" />
                      <span>{alert.speed || 0} km/h</span>
                    </div>
                    {alert.latitude && (
                      <div className="text-[10px] text-[#71737e]">
                        {Number(alert.latitude).toFixed(4)}, {Number(alert.longitude).toFixed(4)}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center">
                    {getStatusBadge(alert.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onFocusAlert && onFocusAlert(alert)}
                        className="p-1.5 text-[#8b8d98] hover:text-[#b49aff] rounded hover:bg-[#252730] transition-colors"
                        title="Focus on Coordinates"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                      </button>

                      {alert.status === 'new' && (
                        <button
                          type="button"
                          onClick={() => onAcknowledgeAlert(alert.id)}
                          className="px-2 py-1 rounded bg-[#f59e0b]/10 text-[#fbbf24] hover:bg-[#f59e0b]/20 border border-[#f59e0b]/20 font-mono text-[10px] transition-colors"
                        >
                          ACK
                        </button>
                      )}

                      {alert.status !== 'resolved' && (
                        <button
                          type="button"
                          onClick={() => onResolveAlert(alert.id)}
                          className="px-2 py-1 rounded bg-[#8be0b3]/10 text-[#8be0b3] hover:bg-[#8be0b3]/20 border border-[#8be0b3]/20 font-mono text-[10px] transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>RESOLVE</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

