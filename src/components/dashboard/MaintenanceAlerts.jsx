import React from 'react';
import { Settings, AlertTriangle, User, ArrowUpRight, ArrowRight } from 'lucide-react';

export default function MaintenanceAlerts({
  alerts = [],
  onViewAllAlerts,
  onAlertClick,
  className = ''
}) {
  const getAlertIcon = (type, color) => {
    switch (type) {
      case 'maintenance':
        return (
          <span className="w-7 h-7 rounded-[7px] flex items-center justify-center shrink-0 bg-[#382c25] text-[#e9a36d]">
            <Settings className="w-3.5 h-3.5" />
          </span>
        );
      case 'fuel':
        return (
          <span className="w-7 h-7 rounded-[7px] flex items-center justify-center shrink-0 bg-[#302a40] text-[#bda5ff]">
            <AlertTriangle className="w-3.5 h-3.5" />
          </span>
        );
      case 'document':
      default:
        return (
          <span className="w-7 h-7 rounded-[7px] flex items-center justify-center shrink-0 bg-[#263541] text-[#86c9ed]">
            <User className="w-3.5 h-3.5" />
          </span>
        );
    }
  };

  return (
    <article
      className={`bg-[#17191f] border border-[#292c35] rounded-[10px] p-[18px] pb-2.5 flex flex-col justify-between transition-all duration-200 hover:border-[#383c4a] ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-1">
            Stay ahead
          </p>
          <h2 className="text-[14px] font-bold tracking-[-0.2px] text-[#f0f0f4] m-0">
            Attention needed
          </h2>
        </div>
        <span className="bg-[#46352c] text-[#eab17d] px-2 py-1 rounded-[5px] font-mono text-[10px] font-medium leading-none">
          {alerts.length}
        </span>
      </div>

      {/* Alert Items List */}
      <div className="flex flex-col">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => onAlertClick && onAlertClick(alert)}
            className="flex items-start gap-2.5 py-4 border-b border-[#2a2c35] hover:bg-[#1c1e25]/60 -mx-2 px-2 rounded-md transition-colors cursor-pointer group"
          >
            {getAlertIcon(alert.type, alert.color)}
            <div className="flex-1 min-w-0">
              <b className="text-[10px] font-semibold text-[#f0f0f4] group-hover:text-[#b49aff] transition-colors leading-tight block">
                {alert.title}
              </b>
              <p className="text-[9px] text-[#999ca7] my-1 font-sans truncate">
                {alert.desc}
              </p>
              <small className="font-mono text-[8px] text-[#70737f]">
                {alert.timestamp}
              </small>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#7f8290] group-hover:text-[#b49aff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
          </div>
        ))}
      </div>

      {/* View All Button */}
      <button
        type="button"
        onClick={onViewAllAlerts}
        className="w-full text-left text-[#b7a0ff] hover:text-[#d3c4ff] text-[9px] font-medium py-3.5 flex items-center justify-between transition-colors cursor-pointer group"
      >
        <span>View all notifications</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </button>
    </article>
  );
}

