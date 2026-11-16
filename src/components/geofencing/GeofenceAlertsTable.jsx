import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Search,
  CheckCircle,
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FDF2F2] text-[#E05252] border border-[#F8D7DA]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E05252] animate-pulse" />
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FEF7EA] text-[#E7A329] border border-[#F8DCB0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E7A329]" />
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EAF3FF] text-[#2879E8] border border-[#D5E6FB]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2879E8]" />
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8F7F0] text-[#16A36A] border border-[#C2E8D7]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A]" />
            ROUTINE
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#FDF2F2] text-[#E05252] border border-[#F8D7DA] font-bold">
            NEW INCIDENT
          </span>
        );
      case 'acknowledged':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#FEF7EA] text-[#E7A329] border border-[#F8DCB0] font-semibold">
            ACKNOWLEDGED
          </span>
        );
      case 'resolved':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#E8F7F0] text-[#16A36A] border border-[#C2E8D7] font-semibold">
            RESOLVED
          </span>
        );
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-liquid-subtle flex flex-col">
      {/* Filter Toolbar */}
      <div className="p-4 border-b border-[#E2E8F0]/80 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-white to-[#F8FAFD]">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8A97AB] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search breaches by vehicle, driver or perimeter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl pl-10 pr-3.5 py-2 text-xs text-[#172033] placeholder-[#8A97AB] focus:outline-none focus:border-[#2879E8] focus:bg-white shadow-2xs transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-mono font-semibold text-[#172033] focus:outline-none focus:border-[#2879E8] shadow-2xs transition-all cursor-pointer"
          >
            <option value="all">ALL SEVERITIES</option>
            <option value="critical">CRITICAL ONLY</option>
            <option value="high">HIGH ONLY</option>
            <option value="medium">MEDIUM ONLY</option>
            <option value="low">LOW / ROUTINE</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-mono font-semibold text-[#172033] focus:outline-none focus:border-[#2879E8] shadow-2xs transition-all cursor-pointer"
          >
            <option value="all">ALL STATUSES</option>
            <option value="new">NEW ALERTS</option>
            <option value="acknowledged">ACKNOWLEDGED</option>
            <option value="resolved">RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-[#E2E8F0]/80 bg-[#F8FAFD] text-[#8A97AB] font-mono text-[10px] font-semibold uppercase">
              <th className="py-3 px-4">VEHICLE TRANSPONDER</th>
              <th className="py-3 px-3">GEOFENCE PERIMETER</th>
              <th className="py-3 px-3">BREACH DIRECTIVE</th>
              <th className="py-3 px-3 text-center">SEVERITY</th>
              <th className="py-3 px-3 text-right">VELOCITY</th>
              <th className="py-3 px-3">INCIDENT TIMESTAMP</th>
              <th className="py-3 px-3 text-center">STATUS</th>
              <th className="py-3 px-4 text-right">CONTROLLER ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {filteredAlerts.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-[#68758A] font-mono">
                  No breach incidents matching criteria. All perimeters secure.
                </td>
              </tr>
            ) : (
              filteredAlerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="hover:bg-[#F8FAFD] transition-colors group cursor-pointer"
                  onClick={() => onFocusAlert && onFocusAlert(alert)}
                >
                  {/* Vehicle */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#172033] font-mono flex items-center gap-1.5">
                      <span>{alert.plate || alert.vehicleId}</span>
                    </div>
                  </td>

                  {/* Geofence Name */}
                  <td className="py-3 px-3">
                    <b className="text-[#172033]">{alert.geofenceName}</b>
                  </td>

                  {/* Message */}
                  <td className="py-3 px-3 max-w-xs truncate text-[#68758A]">
                    {alert.message}
                  </td>

                  {/* Severity */}
                  <td className="py-3 px-3 text-center">
                    {getSeverityBadge(alert.severity)}
                  </td>

                  {/* Speed */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#172033]">
                    {alert.speed || 0} km/h
                  </td>

                  {/* Timestamp */}
                  <td className="py-3 px-3 font-mono text-[#8A97AB]">
                    {alert.timestamp}
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
                        className="p-1.5 text-[#68758A] hover:text-[#2879E8] hover:bg-[#EAF3FF] rounded-lg transition-colors cursor-pointer"
                        title="Focus on Radar Map"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                      </button>

                      {alert.status === 'new' && (
                        <button
                          type="button"
                          onClick={() => onAcknowledgeAlert && onAcknowledgeAlert(alert.id)}
                          className="px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg bg-[#FEF7EA] text-[#E7A329] border border-[#F8DCB0] hover:bg-[#FCEFD8] transition-colors cursor-pointer"
                        >
                          ACK
                        </button>
                      )}

                      {alert.status !== 'resolved' && (
                        <button
                          type="button"
                          onClick={() => onResolveAlert && onResolveAlert(alert.id)}
                          className="px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg bg-[#E8F7F0] text-[#16A36A] border border-[#C2E8D7] hover:bg-[#D5EFE3] transition-colors cursor-pointer"
                        >
                          RESOLVE
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
