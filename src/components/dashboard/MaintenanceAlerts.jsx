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
          <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-[#FEF7EA] text-[#E7A329] border border-[#F8DCB0] shadow-2xs">
            <Settings className="w-4 h-4" />
          </span>
        );
      case 'fuel':
        return (
          <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-[#EAF3FF] text-[#2879E8] border border-[#D5E6FB] shadow-2xs">
            <AlertTriangle className="w-4 h-4" />
          </span>
        );
      case 'document':
      default:
        return (
          <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-[#E8F7F0] text-[#16A36A] border border-[#C2E8D7] shadow-2xs">
            <User className="w-4 h-4" />
          </span>
        );
    }
  };

  return (
    <article
      className={`glass-card glass-card-hover p-6 pb-2.5 flex flex-col justify-between rounded-2xl transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#475569] uppercase mb-0.5 font-bold">
            Stay ahead
          </p>
          <h2 className="text-[16px] font-black tracking-tight text-[#0B132B] m-0">
            Attention Needed
          </h2>
        </div>
        <span className="bg-[#FEF7EA] text-[#E7A329] border border-[#F8DCB0] px-2.5 py-1 rounded-xl font-mono text-[11px] font-bold leading-none shadow-2xs">
          {alerts.length} Pending
        </span>
      </div>

      {/* Alert Items List */}
      <div className="flex flex-col divide-y divide-[#F1F5F9] my-1">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => onAlertClick && onAlertClick(alert)}
            className="flex items-start gap-3 py-3.5 hover:bg-[#F8FAFD] -mx-3 px-3 rounded-xl transition-all cursor-pointer group"
          >
            {getAlertIcon(alert.type)}
            <div className="flex-1 min-w-0">
              <b className="text-[12px] font-bold text-[#172033] group-hover:text-[#2879E8] transition-colors leading-tight block truncate">
                {alert.title}
              </b>
              <p className="text-[11px] text-[#68758A] my-1 font-sans truncate">
                {alert.desc}
              </p>
              <small className="font-mono text-[9px] text-[#8A97AB]">
                {alert.timestamp}
              </small>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#8A97AB] group-hover:text-[#2879E8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
          </div>
        ))}
      </div>

      {/* View All Button */}
      <button
        type="button"
        onClick={onViewAllAlerts}
        className="w-full text-left text-[#2879E8] hover:text-[#1765CC] text-[11px] font-semibold py-3 flex items-center justify-between border-t border-[#E2E8F0]/70 transition-colors cursor-pointer group"
      >
        <span>View all operational alerts</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </button>
    </article>
  );
}
