import React, { useState, useMemo } from 'react';
import SearchBar from '../components/common/SearchBar';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import {
  Plus,
  LayoutGrid,
  List,
  MoreHorizontal,
  ArrowUpRight,
  Truck
} from 'lucide-react';

export default function Vehicles({
  vehicles = [],
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
  onViewDetails
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const filteredVehicles = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return vehicles.filter((v) => {
      const matchSearch =
        (v.plate || '').toLowerCase().includes(term) ||
        (v.model || v.type || '').toLowerCase().includes(term) ||
        (v.driver || '').toLowerCase().includes(term) ||
        (v.location || '').toLowerCase().includes(term);
      const matchStatus =
        statusFilter === 'ALL' || (v.status || '').toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [vehicles, searchTerm, statusFilter]);

  const activeCount = vehicles.filter((v) => v.status === 'active').length;
  const serviceCount = vehicles.filter((v) => v.status === 'service' || v.status === 'maintenance').length;
  const idleCount = vehicles.filter((v) => v.status === 'idle').length;

  const getFuelFill = (fuel) => {
    if (fuel > 50) return 'bg-emerald-500';
    if (fuel > 20) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-end justify-between py-2 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
            Fleet Asset Directory
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 m-0">
            Vehicles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage fleet telemetry, service intervals, and real-time operator assignments.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={onAddVehicle} icon={Plus}>
          Add vehicle
        </Button>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4">
        <div className="glass-card glass-card-hover p-4 rounded-xl flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500">Total Assets</span>
          <p className="text-2xl font-bold text-slate-900 mt-2 mb-0 tabular-nums">{vehicles.length}</p>
        </div>
        <div className="glass-card glass-card-hover p-4 rounded-xl flex flex-col justify-between">
          <span className="text-xs font-medium text-emerald-700">In Service</span>
          <p className="text-2xl font-bold text-emerald-600 mt-2 mb-0 tabular-nums">{activeCount}</p>
        </div>
        <div className="glass-card glass-card-hover p-4 rounded-xl flex flex-col justify-between">
          <span className="text-xs font-medium text-amber-800">In Maintenance</span>
          <p className="text-2xl font-bold text-amber-600 mt-2 mb-0 tabular-nums">{serviceCount}</p>
        </div>
        <div className="glass-card glass-card-hover p-4 rounded-xl flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500">Idle / Depot</span>
          <p className="text-2xl font-bold text-slate-700 mt-2 mb-0 tabular-nums">{idleCount}</p>
        </div>
      </div>

      {/* Filter and View Toolbar */}
      <div className="glass-card p-3 rounded-xl flex items-center justify-between gap-3 max-md:flex-col max-md:items-stretch">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Filter by plate, model, driver, city..."
          width="w-[320px] max-md:w-full"
        />

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status Filter Buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            {['ALL', 'active', 'service', 'idle'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' ? 'All' : st === 'service' ? 'Service' : st}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#2879E8] shadow-2xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#2879E8] shadow-2xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles Grid / Table View */}
      {filteredVehicles.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No vehicles found"
          description={`No vehicles matched your search "${searchTerm || statusFilter}".`}
          actionLabel="Reset filters"
          onAction={() => {
            setSearchTerm('');
            setStatusFilter('ALL');
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-4">
          {filteredVehicles.map((veh) => (
            <div
              key={veh.id}
              className="glass-card glass-card-hover rounded-xl p-4.5 flex flex-col justify-between transition-all duration-200 group"
            >
              {/* Card Top */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2879E8] border border-blue-200/60 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      <Truck className="w-4 h-4" />
                    </span>
                    <div className="min-w-0 truncate">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#2879E8] transition-colors leading-tight truncate font-mono">
                        {veh.plate}
                      </h3>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate font-medium">
                        {veh.model}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={veh.status} type="pill" />
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Driver</span>
                    <span className="text-slate-800 font-medium truncate block mt-0.5">{veh.driver || 'Unassigned'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Location</span>
                    <span className="text-slate-800 font-medium truncate block mt-0.5">{veh.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Odometer</span>
                    <span className="font-medium text-slate-800 tabular-nums block mt-0.5">{veh.odometer?.toLocaleString()} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Fuel Level</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-slate-800 tabular-nums">{veh.fuel}%</span>
                      <div className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          style={{ width: `${veh.fuel}%` }}
                          className={`h-full rounded-full transition-all duration-300 ${getFuelFill(veh.fuel)}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 truncate max-w-[160px]">
                  {veh.nextService}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onViewDetails && onViewDetails(veh)}
                    className="text-[#2879E8] hover:text-[#1765CC] text-xs font-semibold flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-blue-50 cursor-pointer"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditVehicle && onEditVehicle(veh)}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Edit vehicle"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-card rounded-xl p-3 overflow-x-auto">
          <table className="w-full border-collapse text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold">
                <th className="py-2 px-3 uppercase tracking-wider text-[11px]">Vehicle</th>
                <th className="py-2 px-3 uppercase tracking-wider text-[11px]">Driver</th>
                <th className="py-2 px-3 uppercase tracking-wider text-[11px]">Status</th>
                <th className="py-2 px-3 uppercase tracking-wider text-[11px]">Location</th>
                <th className="py-2 px-3 uppercase tracking-wider text-[11px]">Odometer</th>
                <th className="py-2 px-3 uppercase tracking-wider text-[11px]">Fuel</th>
                <th className="py-2 px-3 text-right uppercase tracking-wider text-[11px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((veh) => (
                <tr
                  key={veh.id}
                  className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors last:border-0"
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-md bg-blue-50 text-[#2879E8] flex items-center justify-center font-bold text-xs shrink-0 border border-blue-200/60">
                        <Truck className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight font-mono">{veh.plate}</span>
                        <span className="text-[10px] text-slate-500 block font-medium">{veh.model}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-800 text-xs font-medium">{veh.driver || 'Unassigned'}</td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={veh.status} type="table" />
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-xs">{veh.location}</td>
                  <td className="py-2.5 px-3 text-xs font-medium text-slate-800 tabular-nums">
                    {veh.odometer?.toLocaleString()} km
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-800 w-7 tabular-nums">{veh.fuel}%</span>
                      <div className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          style={{ width: `${veh.fuel}%` }}
                          className={`h-full rounded-full transition-all duration-300 ${getFuelFill(veh.fuel)}`}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="text"
                        size="sm"
                        onClick={() => onViewDetails && onViewDetails(veh)}
                      >
                        Details
                      </Button>
                      <button
                        type="button"
                        onClick={() => onEditVehicle && onEditVehicle(veh)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
