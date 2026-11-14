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
    <article className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300">
      {/* Ambient Top Light Reflection */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#2879E8]/30 to-transparent" />

      {/* Panel Heading */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#8A97AB] uppercase mb-1 font-semibold">
            Fleet spotlight
          </p>
          <h2 className="text-[15px] font-bold tracking-tight text-[#172033] m-0">
            Vehicle Overview
          </h2>
        </div>
        <button
          type="button"
          onClick={onMoreActions}
          className="text-[#8A97AB] hover:text-[#172033] p-1.5 rounded-xl hover:bg-[#F0F5FC] border border-transparent hover:border-[#E2E8F0] transition-all cursor-pointer"
          aria-label="Spotlight options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Feature Section */}
      <div className="flex items-center min-h-[200px] relative overflow-hidden my-1">
        {/* Left Copy */}
        <div className="z-10 w-[52%] max-md:w-[60%] pt-2 flex flex-col">
          <StatusBadge status={current.status} type="pill" className="w-fit" />

          <h3 className="text-[25px] font-black tracking-tight text-[#172033] mt-3 mb-0.5 leading-tight">
            {current.plate}
          </h3>
          <p className="text-[12px] text-[#68758A] m-0 font-medium truncate">
            {current.model}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-4 bg-white/70 backdrop-blur-md p-3 rounded-xl border border-white/80 shadow-2xs">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-mono text-[9px] tracking-[0.8px] text-[#8A97AB] uppercase">
                Driver
              </span>
              <b className="text-[11px] font-bold text-[#172033] truncate">
                {current.driver}
              </b>
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-mono text-[9px] tracking-[0.8px] text-[#8A97AB] uppercase">
                Location
              </span>
              <b className="text-[11px] font-bold text-[#172033] truncate">
                {current.location}
              </b>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#172033] font-mono text-[10px] mt-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EAF3FF] text-[#2879E8] font-semibold">
              <Gauge className="w-3.5 h-3.5" />
              {current.odometer ? current.odometer.toLocaleString() : '12,840'} km
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E8F7F0] text-[#16A36A] font-semibold">
              <Fuel className="w-3.5 h-3.5" />
              {current.fuel}% fuel
            </span>
          </div>
        </div>

        {/* 3D Automotive Van Scene */}
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
          <span className="scene-tag font-mono text-[10px] font-semibold text-[#8A97AB] absolute bottom-2 right-3 bg-white/80 px-2 py-0.5 rounded-md border border-[#E2E8F0]">
            {String(currentIndex).padStart(2, '0')} / {String(totalVehicles).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Vehicle Footer */}
      <div className="border-t border-[#E2E8F0]/80 pt-3.5 mt-2 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[9px] tracking-[0.8px] text-[#8A97AB] uppercase font-medium">
            Next scheduled service
          </span>
          <b className="text-[11px] font-bold text-[#172033]">
            {current.nextService}
          </b>
        </div>
        <button
          type="button"
          onClick={() => onViewDetails && onViewDetails(current)}
          className="text-[#2879E8] hover:text-[#1765CC] text-[11px] font-semibold flex items-center gap-1.5 transition-colors group cursor-pointer px-3 py-1.5 rounded-xl hover:bg-[#EAF3FF]"
        >
          <span>View vehicle telemetry</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </article>
  );
}
