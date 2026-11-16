import React, { useState, useMemo } from 'react';
import SearchBar from '../components/common/SearchBar';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';
import {
  Plus,
  LayoutGrid,
  List,
  MoreHorizontal,
  ArrowUpRight,
  Truck,
  Fuel,
  Navigation,
  Gauge
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
  const serviceCount = vehicles.filter((v) => v.status === 'service').length;
  const idleCount = vehicles.filter((v) => v.status === 'idle').length;

  const getFuelFill = (fuel) => {
    if (fuel > 50) return 'bg-gradient-to-r from-[#16A36A] to-[#34D399]';
    if (fuel > 20) return 'bg-gradient-to-r from-[#D97706] to-[#FBBF24]';
    return 'bg-gradient-to-r from-[#E05252] to-[#F87171]';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-end justify-between py-2 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#475569] uppercase mb-1 font-bold">
            Fleet Directory
          </p>
          <h1 className="text-[28px] tracking-tight font-black text-[#0B132B] m-0">
            Vehicles<span className="text-[#2879E8]">.</span>
          </h1>
          <p className="text-[13px] text-[#334155] mt-1 font-semibold">
            Manage your fleet telemetry, availability, and vehicle assignments.
          </p>
        </div>
        <Button variant="primary" onClick={onAddVehicle} icon={Plus}>
          Add vehicle
        </Button>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4">
        <div className="glass-card glass-card-hover p-4 rounded-2xl flex flex-col justify-between">
          <span className="font-mono text-[10px] text-[#475569] uppercase font-bold">Total Fleet</span>
          <p className="text-2xl font-black text-[#0B132B] mt-2 mb-0">{vehicles.length}</p>
        </div>
        <div className="glass-card glass-card-hover p-4 rounded-2xl flex flex-col justify-between">
          <span className="font-mono text-[10px] text-[#16A36A] uppercase font-bold">Active on Road</span>
          <p className="text-2xl font-black text-[#16A36A] mt-2 mb-0">{activeCount}</p>
        </div>
        <div className="glass-card glass-card-hover p-4 rounded-2xl flex flex-col justify-between">
          <span className="font-mono text-[10px] text-[#E7A329] uppercase font-bold">In Service</span>
          <p className="text-2xl font-black text-[#E7A329] mt-2 mb-0">{serviceCount}</p>
        </div>
        <div className="glass-card glass-card-hover p-4 rounded-2xl flex flex-col justify-between">
          <span className="font-mono text-[10px] text-[#475569] uppercase font-bold">Idle / Depot</span>
          <p className="text-2xl font-black text-[#334155] mt-2 mb-0">{idleCount}</p>
        </div>
      </div>

      {/* Filter and View Toolbar */}
      <div className="glass-card p-3.5 rounded-2xl flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch shadow-liquid-subtle">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Filter by license plate, model, driver, city..."
          width="w-[340px] max-md:w-full"
        />

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter Buttons */}
          <div className="flex items-center bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl p-1 text-[11px] font-semibold">
            {['ALL', 'active', 'service', 'idle'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#2879E8] text-white shadow-2xs font-bold'
                    : 'text-[#68758A] hover:text-[#172033]'
                }`}
              >
                {st === 'ALL' ? 'All' : st === 'service' ? 'Service' : st}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#2879E8] shadow-2xs'
                  : 'text-[#8A97AB] hover:text-[#172033]'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#2879E8] shadow-2xs'
                  : 'text-[#8A97AB] hover:text-[#172033]'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles Grid / Table View */}
      {filteredVehicles.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Truck className="w-10 h-10 text-[#8A97AB] mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-[#172033] mb-1">No vehicles found</h3>
          <p className="text-xs text-[#68758A] max-w-sm mx-auto mb-4">
            No vehicle records matched your search query or selected filter criteria.
          </p>
          <Button variant="default" size="sm" onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}>
            Reset Filters
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-4">
          {filteredVehicles.map((veh) => (
            <div
              key={veh.id}
              className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group"
            >
              {/* Card Top */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#2879E8] border border-[#D5E6FB] flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                      <Truck className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-[#0B132B] group-hover:text-[#2879E8] transition-colors leading-tight">
                        {veh.plate}
                      </h3>
                      <p className="text-[11px] text-[#334155] leading-tight mt-0.5 font-semibold">
                        {veh.model}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={veh.status} type="pill" />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#E2E8F0]/80 text-[11px]">
                  <div>
                    <span className="font-mono text-[9px] text-[#475569] uppercase block font-bold">Driver</span>
                    <b className="text-[#0B132B] font-bold truncate block">{veh.driver}</b>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#475569] uppercase block font-bold">Location</span>
                    <b className="text-[#0B132B] font-bold truncate block">{veh.location}</b>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#475569] uppercase block font-bold">Odometer</span>
                    <span className="font-mono font-bold text-[#0B132B]">{veh.odometer?.toLocaleString()} km</span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-[#475569] uppercase block font-bold">Fuel Level</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[10px] font-bold text-[#0B132B]">{veh.fuel}%</span>
                      <div className="w-14 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden shadow-inner">
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
              <div className="mt-4 pt-3 border-t border-[#E2E8F0]/80 flex items-center justify-between">
                <span className="text-[10px] text-[#8A97AB] font-mono truncate max-w-[170px]">
                  {veh.nextService}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onViewDetails && onViewDetails(veh)}
                    className="text-[#2879E8] hover:text-[#1765CC] text-[11px] font-bold flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-[#EAF3FF] cursor-pointer"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditVehicle && onEditVehicle(veh)}
                    className="text-[#8A97AB] hover:text-[#172033] p-1.5 rounded-lg hover:bg-[#F0F5FC] transition-colors cursor-pointer"
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
        <div className="glass-card rounded-2xl p-4 overflow-x-auto shadow-liquid-subtle">
          <table className="w-full border-collapse text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="text-[#475569] font-mono text-[9px] tracking-wider py-3 px-3 uppercase font-bold">Vehicle</th>
                <th className="text-[#475569] font-mono text-[9px] tracking-wider py-3 px-3 uppercase font-bold">Driver</th>
                <th className="text-[#475569] font-mono text-[9px] tracking-wider py-3 px-3 uppercase font-bold">Status</th>
                <th className="text-[#475569] font-mono text-[9px] tracking-wider py-3 px-3 uppercase font-bold">Location</th>
                <th className="text-[#475569] font-mono text-[9px] tracking-wider py-3 px-3 uppercase font-bold">Odometer</th>
                <th className="text-[#475569] font-mono text-[9px] tracking-wider py-3 px-3 uppercase font-bold">Fuel</th>
                <th className="py-3 px-3 text-right font-bold text-[#475569]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((veh) => (
                <tr
                  key={veh.id}
                  className="border-b border-[#F1F5F9] hover:bg-[#F8FAFD] transition-colors last:border-0"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#2879E8] flex items-center justify-center font-bold text-xs shrink-0 border border-[#D5E6FB]">
                        <Truck className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <b className="text-[12px] text-[#172033] block leading-tight font-bold">{veh.plate}</b>
                        <small className="text-[10px] text-[#68758A] block font-medium">{veh.model}</small>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#172033] text-[11px] font-semibold">{veh.driver}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={veh.status} type="table" />
                  </td>
                  <td className="py-3 px-3 text-[#68758A] text-[11px]">{veh.location}</td>
                  <td className="py-3 px-3 font-mono text-[11px] font-bold text-[#172033]">
                    {veh.odometer?.toLocaleString()} km
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-[#172033] w-7">{veh.fuel}%</span>
                      <div className="w-14 h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden shadow-inner">
                        <div
                          style={{ width: `${veh.fuel}%` }}
                          className={`h-full rounded-full transition-all duration-300 ${getFuelFill(veh.fuel)}`}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
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
                        className="text-[#8A97AB] hover:text-[#172033] p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
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
