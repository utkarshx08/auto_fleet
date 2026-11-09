import React, { useState, useMemo } from 'react';
import SearchBar from '../common/SearchBar';
import StatusBadge from '../common/StatusBadge';
import { SlidersHorizontal, ArrowUpRight, MoreHorizontal } from 'lucide-react';

export default function VehicleTable({
  vehicles = [],
  onViewAll,
  onSelectVehicle,
  onEditVehicle,
  onDeleteVehicle,
  className = ''
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, active, service, idle
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return vehicles.filter((v) => {
      const matchesSearch =
        (v.plate || '').toLowerCase().includes(term) ||
        (v.model || v.type || '').toLowerCase().includes(term) ||
        (v.driver || '').toLowerCase().includes(term) ||
        (v.location || '').toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === 'ALL' ||
        (v.status || '').toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [vehicles, searchTerm, statusFilter]);

  const getThumbColor = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-[#263543] text-[#8dc8ed]';
      case 'amber':
        return 'bg-[#403329] text-[#e3ac77]';
      case 'green':
        return 'bg-[#263a34] text-[#83d6ad]';
      case 'purple':
      default:
        return 'bg-[#35323f] text-[#c0aaff]';
    }
  };

  const getFuelColor = (fuel) => {
    if (fuel > 50) return 'bg-[#82d4a8]';
    if (fuel > 20) return 'bg-[#e5a46e]';
    return 'bg-[#e56868]';
  };

  return (
    <article
      className={`bg-[#17191f] border border-[#292c35] rounded-[10px] p-[18px] transition-all duration-200 hover:border-[#383c4a] ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-1">
            Your fleet
          </p>
          <h2 className="text-[14px] font-bold tracking-[-0.2px] text-[#f0f0f4] m-0">
            Vehicle status
          </h2>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[#b8a2ff] hover:text-[#d4c6ff] text-[10px] font-medium flex items-center gap-1 transition-colors group cursor-pointer"
        >
          <span>View all vehicles</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Tools: Search + Filters */}
      <div className="flex items-center justify-between gap-2.5 my-4 max-sm:flex-col max-sm:items-stretch">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search vehicle or driver..."
          width="w-[245px] max-sm:w-full"
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-1.5 border border-[#343641] bg-[#20222a] hover:bg-[#252833] rounded-[6px] text-[#bcbec8] px-2.5 py-1.5 text-[10px] font-sans transition-colors cursor-pointer select-none"
          >
            <SlidersHorizontal className="w-3 h-3 text-[#a7a9b5]" />
            <span>Filters</span>
            <span className="bg-[#40375b] text-[#c7b6ff] px-1.5 py-0.5 rounded-[4px] ml-1 font-mono text-[9px]">
              {statusFilter === 'ALL' ? 'All' : statusFilter}
            </span>
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 mt-1.5 w-36 bg-[#1c1e25] border border-[#343641] rounded-md shadow-xl py-1 z-20 text-[10px]">
              {['ALL', 'active', 'service', 'idle'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setStatusFilter(st);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-[#252833] transition-colors capitalize ${
                    statusFilter === st ? 'text-[#b49aff] font-bold' : 'text-[#aeb0ba]'
                  }`}
                >
                  {st === 'ALL' ? 'All Statuses' : st === 'service' ? 'In service' : st}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left whitespace-nowrap">
          <thead>
            <tr className="border-b border-[#30323b]">
              <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">
                Vehicle
              </th>
              <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">
                Driver
              </th>
              <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">
                Status
              </th>
              <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">
                Location
              </th>
              <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">
                Fuel
              </th>
              <th className="py-2.5 px-2 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[#777b87] text-[11px]">
                  No vehicles found matching "{searchTerm}".
                </td>
              </tr>
            ) : (
              filteredVehicles.slice(0, 5).map((veh) => (
                <tr
                  key={veh.id}
                  onClick={() => onSelectVehicle && onSelectVehicle(veh)}
                  className="border-b border-[#282a33] hover:bg-[#1f212a] transition-colors cursor-pointer group last:border-0"
                >
                  {/* Vehicle Plate & Model */}
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-[29px] h-[23px] rounded-[5px] flex items-center justify-center font-bold text-sm shrink-0 ${getThumbColor(
                          veh.colorThumb
                        )}`}
                      >
                        ▰
                      </span>
                      <div className="flex flex-col">
                        <b className="text-[10px] text-[#e0e0e7] group-hover:text-white transition-colors leading-tight">
                          {veh.plate}
                        </b>
                        <small className="text-[8px] text-[#777b87] leading-tight font-sans">
                          {veh.model}
                        </small>
                      </div>
                    </div>
                  </td>

                  {/* Driver */}
                  <td className="py-2.5 px-2 text-[#aeb0ba] text-[9px] font-sans">
                    {veh.driver}
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-2">
                    <StatusBadge status={veh.status} type="table" />
                  </td>

                  {/* Location */}
                  <td className="py-2.5 px-2 text-[#aeb0ba] text-[9px] font-sans">
                    {veh.location}
                  </td>

                  {/* Fuel with animated/custom progress bar */}
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-[#aeb0ba] w-6">
                        {veh.fuel}%
                      </span>
                      <i className="w-[38px] h-[3px] rounded-full bg-[#343640] block overflow-hidden not-italic">
                        <b
                          style={{ width: `${veh.fuel}%` }}
                          className={`block h-full rounded-full transition-all duration-300 ${getFuelColor(
                            veh.fuel
                          )}`}
                        />
                      </i>
                    </div>
                  </td>

                  {/* Action More */}
                  <td className="py-2.5 px-2 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVehicle && onSelectVehicle(veh);
                      }}
                      className="text-[#858894] hover:text-[#f0f0f4] p-1 rounded transition-colors"
                      aria-label="Vehicle actions"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}

