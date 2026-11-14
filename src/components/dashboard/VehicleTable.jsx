import React, { useState, useMemo } from 'react';
import SearchBar from '../common/SearchBar';
import StatusBadge from '../common/StatusBadge';
import { SlidersHorizontal, ArrowUpRight, MoreHorizontal, Truck } from 'lucide-react';

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
        return 'bg-[#EAF3FF] text-[#2879E8] border-[#D5E6FB]';
      case 'amber':
        return 'bg-[#FEF7EA] text-[#E7A329] border-[#F8DCB0]';
      case 'green':
        return 'bg-[#E8F7F0] text-[#16A36A] border-[#C2E8D7]';
      case 'purple':
      default:
        return 'bg-[#F3E8FF] text-[#7C3AED] border-[#E9D5FF]';
    }
  };

  const getFuelFill = (fuel) => {
    if (fuel > 50) return 'bg-gradient-to-r from-[#16A36A] to-[#34D399]';
    if (fuel > 20) return 'bg-gradient-to-r from-[#D97706] to-[#FBBF24]';
    return 'bg-gradient-to-r from-[#E05252] to-[#F87171]';
  };

  return (
    <article
      className={`glass-card glass-card-hover p-6 rounded-2xl transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#8A97AB] uppercase mb-1 font-semibold">
            Your fleet directory
          </p>
          <h2 className="text-[15px] font-bold tracking-tight text-[#172033] m-0">
            Fleet Asset Status
          </h2>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[#2879E8] hover:text-[#1765CC] text-[11px] font-semibold flex items-center gap-1.5 transition-colors group cursor-pointer px-3 py-1.5 rounded-xl hover:bg-[#EAF3FF]"
        >
          <span>View all vehicles</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Tools: Search + Filters */}
      <div className="flex items-center justify-between gap-3 my-4 max-sm:flex-col max-sm:items-stretch">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search by license plate, driver, or location..."
          width="w-[280px] max-sm:w-full"
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 border border-[#E2E8F0] bg-[#F8FAFD] hover:bg-[#F0F5FC] hover:border-[#2879E8]/30 rounded-xl text-[#172033] px-3 py-2 text-[11px] font-semibold transition-all cursor-pointer select-none shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#2879E8]" />
            <span>Filter</span>
            <span className="bg-[#EAF3FF] text-[#2879E8] px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
              {statusFilter === 'ALL' ? 'All' : statusFilter}
            </span>
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white/98 backdrop-blur-2xl border border-white/90 rounded-2xl shadow-liquid-dropdown py-1.5 z-30 text-[11px]">
              {['ALL', 'active', 'service', 'idle'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setStatusFilter(st);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-[#F0F5FC] transition-colors capitalize cursor-pointer font-medium ${
                    statusFilter === st ? 'text-[#2879E8] font-bold bg-[#EAF3FF]/60' : 'text-[#172033]'
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
            <tr className="border-b border-[#E2E8F0]/80">
              <th className="text-[#8A97AB] font-mono text-[9px] tracking-wider py-3 px-3 uppercase font-semibold">
                Vehicle
              </th>
              <th className="text-[#8A97AB] font-mono text-[9px] tracking-wider py-3 px-3 uppercase font-semibold">
                Driver
              </th>
              <th className="text-[#8A97AB] font-mono text-[9px] tracking-wider py-3 px-3 uppercase font-semibold">
                Status
              </th>
              <th className="text-[#8A97AB] font-mono text-[9px] tracking-wider py-3 px-3 uppercase font-semibold">
                Location
              </th>
              <th className="text-[#8A97AB] font-mono text-[9px] tracking-wider py-3 px-3 uppercase font-semibold">
                Fuel Level
              </th>
              <th className="py-3 px-3 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[#68758A] text-xs">
                  No vehicles found matching "{searchTerm}".
                </td>
              </tr>
            ) : (
              filteredVehicles.slice(0, 5).map((veh) => (
                <tr
                  key={veh.id}
                  onClick={() => onSelectVehicle && onSelectVehicle(veh)}
                  className="border-b border-[#F1F5F9] hover:bg-[#F8FAFD] transition-colors cursor-pointer group last:border-0"
                >
                  {/* Vehicle Plate & Model */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border shadow-2xs ${getThumbColor(
                          veh.colorThumb
                        )}`}
                      >
                        <Truck className="w-4 h-4" />
                      </span>
                      <div className="flex flex-col">
                        <b className="text-[12px] text-[#172033] group-hover:text-[#2879E8] transition-colors leading-tight font-bold">
                          {veh.plate}
                        </b>
                        <small className="text-[10px] text-[#68758A] leading-tight font-medium">
                          {veh.model}
                        </small>
                      </div>
                    </div>
                  </td>

                  {/* Driver */}
                  <td className="py-3 px-3 text-[#172033] text-[11px] font-semibold">
                    {veh.driver}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <StatusBadge status={veh.status} type="table" />
                  </td>

                  {/* Location */}
                  <td className="py-3 px-3 text-[#68758A] text-[11px]">
                    {veh.location}
                  </td>

                  {/* Fuel with animated progress bar */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-mono font-bold text-[#172033] w-8">
                        {veh.fuel}%
                      </span>
                      <div className="w-[60px] h-2 rounded-full bg-[#E2E8F0] overflow-hidden shadow-inner">
                        <div
                          style={{ width: `${veh.fuel}%` }}
                          className={`h-full rounded-full transition-all duration-300 shadow-2xs ${getFuelFill(
                            veh.fuel
                          )}`}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Action More */}
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVehicle && onSelectVehicle(veh);
                      }}
                      className="text-[#8A97AB] hover:text-[#172033] p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      aria-label="Vehicle actions"
                    >
                      <MoreHorizontal className="w-4 h-4" />
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
