import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { ArrowUpRight, MoreHorizontal, Gauge, Fuel } from 'lucide-react';

export default function VehicleOverview({
  vehicle,
  currentIndex = 1,
  totalVehicles = 28,
  onViewDetails,
  onMoreActions
}) {
  const current = vehicle || {
    id: 'RST-291',
    plate: 'RST-291',
    model: 'Mercedes-Benz Sprinter',
    driver: 'Aarav Sharma',
    location: 'New York, NY',
    odometer: 12840,
    fuel: 78,
    status: 'active',
    nextService: 'In 1,240 km · 12 Nov 2025'
  };

  return (
    <article className="glass-card glass-card-hover p-5 sm:p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-200">
      {/* Panel Heading */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
            Fleet Spotlight
          </span>
          <h2 className="text-base font-bold tracking-tight text-slate-900 m-0">
            Vehicle Telemetry
          </h2>
        </div>
        <button
          type="button"
          onClick={onMoreActions}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Spotlight options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Feature Section */}
      <div className="flex items-center min-h-[190px] relative overflow-hidden my-1">
        {/* Left Copy */}
        <div className="z-10 w-[52%] max-md:w-[60%] pt-1 flex flex-col">
          <StatusBadge status={current.status} type="pill" className="w-fit" />

          <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-2.5 mb-0.5 leading-tight font-mono">
            {current.plate}
          </h3>
          <p className="text-xs text-slate-600 m-0 font-medium truncate">
            {current.model}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-3.5 bg-slate-50/90 border border-slate-200/80 p-2.5 rounded-xl shadow-2xs">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Driver
              </span>
              <span className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                {current.driver}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Location
              </span>
              <span className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                {current.location}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-medium mt-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-[#2879E8] border border-blue-200/60 tabular-nums">
              <Gauge className="w-3.5 h-3.5" />
              {current.odometer ? current.odometer.toLocaleString() : '12,840'} km
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 tabular-nums">
              <Fuel className="w-3.5 h-3.5" />
              {current.fuel}% fuel
            </span>
          </div>
        </div>

        {/* Automotive Van Scene */}
        <div className="van-scene max-md:opacity-80">
          <div className="van-shadow" />
          <div className="van">
            <div className="van-window" />
            <div className="van-side-window" />
            <div className="van-line" />
            <div className="van-wheel wheel-one" />
            <div className="van-wheel wheel-two" />
            <div className="van-light" />
          </div>
          <span className="font-mono text-[10px] font-medium text-slate-500 absolute bottom-2 right-3 bg-white/90 px-2 py-0.5 rounded border border-slate-200 shadow-2xs tabular-nums">
            {String(currentIndex).padStart(2, '0')} / {String(totalVehicles).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Vehicle Footer */}
      <div className="border-t border-slate-100 pt-3 mt-2 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            Next scheduled service
          </span>
          <span className="text-xs font-semibold text-slate-800 mt-0.5">
            {current.nextService}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onViewDetails && onViewDetails(current)}
          className="text-[#2879E8] hover:text-[#1765CC] text-xs font-semibold flex items-center gap-1 transition-colors group cursor-pointer px-2.5 py-1 rounded-lg hover:bg-blue-50"
        >
          <span>View vehicle telemetry</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </article>
  );
}
