import React from 'react';
import { Settings, AlertTriangle, User, ArrowUpRight, ArrowRight } from 'lucide-react';

export default function MaintenanceAlerts({
  alerts = [],
  onViewAllAlerts,
  onAlertClick,
  className = ''
}) {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'maintenance':
        return (
          <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-amber-50 text-amber-700 border border-amber-200/70 shadow-2xs">
            <Settings className="w-4 h-4" />
          </span>
        );
      case 'fuel':
        return (
          <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-[#2879E8] border border-blue-200/70 shadow-2xs">
            <AlertTriangle className="w-4 h-4" />
          </span>
        );
      case 'document':
      default:
        return (
          <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs">
            <User className="w-4 h-4" />
          </span>
        );
    }
  };

  return (
    <article
      className={`glass-card glass-card-hover p-5 sm:p-6 pb-2.5 flex flex-col justify-between rounded-2xl transition-all duration-200 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
            Fleet Safety
          </span>
          <h2 className="text-base font-bold tracking-tight text-slate-900 m-0">
            Attention Needed
          </h2>
        </div>
        <span className="bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-md text-xs font-semibold tabular-nums">
          {alerts.length} Pending
        </span>
      </div>

      {/* Alert Items List */}
      <div className="flex flex-col divide-y divide-slate-100 my-1">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => onAlertClick && onAlertClick(alert)}
            className="flex items-start gap-3 py-3 hover:bg-slate-50/80 -mx-2 px-2 rounded-lg transition-all cursor-pointer group"
          >
            {getAlertIcon(alert.type)}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-slate-900 group-hover:text-[#2879E8] transition-colors leading-tight block truncate">
                {alert.title}
              </span>
              <p className="text-xs text-slate-500 my-0.5 truncate">
                {alert.desc}
              </p>
              <span className="text-[10px] text-slate-400 tabular-nums">
                {alert.timestamp}
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2879E8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
          </div>
        ))}
      </div>

      {/* View All Button */}
      <button
        type="button"
        onClick={onViewAllAlerts}
        className="w-full text-left text-[#2879E8] hover:text-[#1765CC] text-xs font-semibold py-3 flex items-center justify-between border-t border-slate-100 transition-colors cursor-pointer group"
      >
        <span>View all operational alerts</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </article>
  );
}
