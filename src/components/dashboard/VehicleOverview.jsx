import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { ArrowUpRight, MoreHorizontal } from 'lucide-react';

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
    driver: 'Alex Morgan',
    location: 'New York, NY',
    odometer: 12840,
    fuel: 78,
    status: 'active',
    nextService: 'In 1,240 km · 12 Nov 2025'
  };

  return (
    <article className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-[18px] flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:border-[#383c4a]">
      {/* Panel Heading */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-1">
            Fleet spotlight
          </p>
          <h2 className="text-[14px] font-bold tracking-[-0.2px] text-[#f0f0f4] m-0">
            Vehicle overview
          </h2>
        </div>
        <button
          type="button"
          onClick={onMoreActions}
          className="text-[#8d8f9b] hover:text-[#f0f0f4] p-1 rounded transition-colors"
          aria-label="Spotlight options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Feature Section */}
      <div className="flex items-center min-h-[195px] relative overflow-hidden my-1">
        {/* Left Copy */}
        <div className="z-10 w-[47%] max-md:w-[58%] pt-2 flex flex-col">
          <StatusBadge status={current.status} type="pill" className="w-fit" />

          <h3 className="text-[23px] font-bold tracking-[-0.7px] text-[#f0f0f4] mt-3 mb-0.5 leading-tight">
            {current.plate}
          </h3>
          <p className="text-[10px] text-[#888b97] m-0 font-medium truncate">
            {current.model}
          </p>

          <div className="flex gap-6 mt-4">
            <span className="flex flex-col gap-1">
              <small className="font-mono text-[8px] tracking-[0.8px] text-[#747783] uppercase">
                Driver
              </small>
              <b className="text-[10px] font-semibold text-[#d1d1da] truncate">
                {current.driver}
              </b>
            </span>
            <span className="flex flex-col gap-1">
              <small className="font-mono text-[8px] tracking-[0.8px] text-[#747783] uppercase">
                Location
              </small>
              <b className="text-[10px] font-semibold text-[#d1d1da] truncate">
                {current.location}
              </b>
            </span>
          </div>

          <div className="flex gap-3.5 text-[#9a9ca7] font-mono text-[9px] mt-4">
            <span>↗ {current.odometer ? current.odometer.toLocaleString() : '12,840'} km</span>
            <span>◉ {current.fuel}% fuel</span>
          </div>
        </div>

        {/* 3D Automotive Van Scene (Original CSS visual preserved 1:1) */}
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
          <span className="scene-tag font-mono text-[9px] text-[#717480] absolute bottom-2 right-3">
            {String(currentIndex).padStart(2, '0')} / {String(totalVehicles).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Vehicle Footer */}
      <div className="border-t border-[#2b2d36] pt-3.5 mt-2 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-2">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[8px] tracking-[0.8px] text-[#747783] uppercase">
            Next service
          </span>
          <b className="text-[10px] font-semibold text-[#d1d1da]">
            {current.nextService}
          </b>
        </div>
        <button
          type="button"
          onClick={() => onViewDetails && onViewDetails(current)}
          className="text-[#b8a2ff] hover:text-[#d4c6ff] text-[10px] font-medium flex items-center gap-1 transition-colors group cursor-pointer"
        >
          <span>View vehicle details</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </article>
  );
}

