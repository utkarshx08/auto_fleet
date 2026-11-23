import React, { useState, useMemo } from 'react';
import SearchBar from '../common/SearchBar';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import { SlidersHorizontal, ArrowUpRight, MoreHorizontal, Truck } from 'lucide-react';

export default function VehicleTable({
  vehicles = [],
  onViewAll,
  onSelectVehicle,
  className = ''
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
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

  const getFuelFill = (fuel) => {
    if (fuel > 50) return 'bg-emerald-500';
    if (fuel > 20) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <article
      className={`glass-card glass-card-hover p-5 sm:p-6 rounded-2xl transition-all duration-200 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
            Fleet Directory
          </span>
          <h2 className="text-base font-bold tracking-tight text-slate-900 m-0">
            Fleet Asset Status
          </h2>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[#2879E8] hover:text-[#1765CC] text-xs font-semibold flex items-center gap-1 transition-colors group cursor-pointer px-2.5 py-1 rounded-lg hover:bg-blue-50"
        >
          <span>View all assets</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Tools: Search + Filters */}
      <div className="flex items-center justify-between gap-3 my-4 max-sm:flex-col max-sm:items-stretch">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search plate, driver, model..."
          width="w-[280px] max-sm:w-full"
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-slate-800 px-3 py-1.5 text-xs font-medium transition-all cursor-pointer shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#2879E8]" />
            <span>Status:</span>
            <span className="bg-blue-50 text-[#2879E8] px-1.5 py-0.5 rounded text-[11px] font-semibold">
              {statusFilter === 'ALL' ? 'All' : statusFilter}
            </span>
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white/98 backdrop-blur-xl border border-slate-200/90 rounded-xl shadow-lg py-1 z-30 text-xs animate-in fade-in zoom-in-95 duration-150">
              {['ALL', 'active', 'service', 'idle'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setStatusFilter(st);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors capitalize cursor-pointer font-medium ${
                    statusFilter === st
                      ? 'text-[#2879E8] font-semibold bg-blue-50/70'
                      : 'text-slate-700'
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
            <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold">
              <th className="py-2.5 px-3 uppercase tracking-wider text-[11px]">Vehicle</th>
              <th className="py-2.5 px-3 uppercase tracking-wider text-[11px]">Driver</th>
              <th className="py-2.5 px-3 uppercase tracking-wider text-[11px]">Status</th>
              <th className="py-2.5 px-3 uppercase tracking-wider text-[11px]">Location</th>
              <th className="py-2.5 px-3 uppercase tracking-wider text-[11px]">Fuel Level</th>
              <th className="py-2.5 px-3 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4">
                  <EmptyState
                    icon={Truck}
                    title="No vehicles found"
                    description={`No vehicles matched "${searchTerm || statusFilter}". Try adjusting your filters.`}
                    actionLabel="Reset filters"
                    onAction={() => {
                      setSearchTerm('');
                      setStatusFilter('ALL');
                    }}
                  />
                </td>
              </tr>
            ) : (
              filteredVehicles.slice(0, 5).map((veh) => (
                <tr
                  key={veh.id}
                  onClick={() => onSelectVehicle && onSelectVehicle(veh)}
                  className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer group last:border-0"
                >
                  {/* Vehicle Plate & Model */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 bg-blue-50 text-[#2879E8] border border-blue-200/60 shadow-2xs">
                        <Truck className="w-4 h-4" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-[#2879E8] transition-colors leading-tight font-mono">
                          {veh.plate}
                        </span>
                        <span className="text-[11px] text-slate-500 leading-tight font-medium mt-0.5">
                          {veh.model}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Driver */}
                  <td className="py-3 px-3 text-slate-800 text-xs font-medium">
                    {veh.driver || 'Unassigned'}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <StatusBadge status={veh.status} type="table" />
                  </td>

                  {/* Location */}
                  <td className="py-3 px-3 text-slate-500 text-xs">
                    {veh.location}
                  </td>

                  {/* Fuel Progress Bar */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-semibold text-slate-800 w-8 tabular-nums">
                        {veh.fuel}%
                      </span>
                      <div className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          style={{ width: `${veh.fuel}%` }}
                          className={`h-full rounded-full transition-all duration-300 ${getFuelFill(
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
                      className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-white transition-colors cursor-pointer"
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
