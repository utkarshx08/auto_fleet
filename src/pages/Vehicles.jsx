import React, { useState, useMemo } from 'react';
import SearchBar from '../components/common/SearchBar';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';
import {
  Plus,
  LayoutGrid,
  List,
  SlidersHorizontal,
  MoreHorizontal,
  ArrowUpRight,
  Truck,
  Fuel,
  Navigation
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
    return vehicles.filter((v) => {
      const matchSearch =
        v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === 'ALL' || v.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [vehicles, searchTerm, statusFilter]);

  const activeCount = vehicles.filter((v) => v.status === 'active').length;
  const serviceCount = vehicles.filter((v) => v.status === 'service').length;
  const idleCount = vehicles.filter((v) => v.status === 'idle').length;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-end justify-between py-4 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-1">
            Fleet Directory
          </p>
          <h1 className="text-[28px] tracking-[-1px] font-bold text-[#f0f0f4] m-0">
            Vehicles<span className="text-[#ad91ff]">.</span>
          </h1>
          <p className="text-[12px] text-[#898c98] mt-1">
            Manage your fleet telemetry, availability, and vehicle assignments.
          </p>
        </div>
        <Button variant="primary" onClick={onAddVehicle} icon={Plus}>
          Add vehicle
        </Button>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-3">
        <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#858894] uppercase">Total Fleet</span>
          <p className="text-xl font-bold text-[#f0f0f4] mt-1 mb-0">{vehicles.length}</p>
        </div>
        <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#83d7a9] uppercase">Active on Road</span>
          <p className="text-xl font-bold text-[#83d7a9] mt-1 mb-0">{activeCount}</p>
        </div>
        <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#e3ac77] uppercase">In Service</span>
          <p className="text-xl font-bold text-[#e3ac77] mt-1 mb-0">{serviceCount}</p>
        </div>
        <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#a5a7b0] uppercase">Idle / Depot</span>
          <p className="text-xl font-bold text-[#a5a7b0] mt-1 mb-0">{idleCount}</p>
        </div>
      </div>

      {/* Filter and View Toolbar */}
      <div className="flex items-center justify-between gap-3 bg-[#17191f] border border-[#292c35] p-3 rounded-[9px] max-md:flex-col max-md:items-stretch">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Filter by plate, model, driver, city..."
          width="w-[320px] max-md:w-full"
        />

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter Buttons */}
          <div className="flex items-center bg-[#20222a] border border-[#30333d] rounded-[6px] p-0.5 text-[10px]">
            {['ALL', 'active', 'service', 'idle'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-[5px] font-sans capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-[#40375b] text-[#c7b6ff] font-semibold'
                    : 'text-[#858894] hover:text-[#d1d1da]'
                }`}
              >
                {st === 'ALL' ? 'All' : st === 'service' ? 'Service' : st}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#20222a] border border-[#30333d] rounded-[6px] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-[4px] transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#40375b] text-[#c7b6ff]'
                  : 'text-[#858894] hover:text-[#d1d1da]'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-[4px] transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#40375b] text-[#c7b6ff]'
                  : 'text-[#858894] hover:text-[#d1d1da]'
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
        <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-12 text-center">
          <Truck className="w-8 h-8 text-[#777b87] mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-[#f0f0f4] mb-1">No vehicles found</h3>
          <p className="text-xs text-[#858894] max-w-sm mx-auto mb-4">
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
              className="bg-[#17191f] border border-[#292c35] hover:border-[#383c4a] rounded-[10px] p-4 flex flex-col justify-between transition-all duration-200 group"
            >
              {/* Card Top */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-[6px] bg-[#35323f] text-[#c0aaff] flex items-center justify-center font-bold text-xs">
                      ▰
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#f0f0f4] group-hover:text-[#b49aff] transition-colors leading-tight">
                        {veh.plate}
                      </h3>
                      <p className="text-[10px] text-[#888b97] leading-tight mt-0.5">
                        {veh.model}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={veh.status} type="pill" />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#252730] text-[10px]">
                  <div>
                    <span className="font-mono text-[8px] text-[#747783] uppercase block">Driver</span>
                    <b className="text-[#d1d1da] font-medium truncate block">{veh.driver}</b>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] text-[#747783] uppercase block">Location</span>
                    <b className="text-[#d1d1da] font-medium truncate block">{veh.location}</b>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] text-[#747783] uppercase block">Odometer</span>
                    <span className="font-mono text-[#aeb0ba]">{veh.odometer?.toLocaleString()} km</span>
                  </div>
                  <div>
                    <span className="font-mono text-[8px] text-[#747783] uppercase block">Fuel Level</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[9px] text-[#d1d1da]">{veh.fuel}%</span>
                      <i className="w-12 h-1.5 rounded-full bg-[#343640] block overflow-hidden not-italic">
                        <b
                          style={{ width: `${veh.fuel}%` }}
                          className={`block h-full rounded-full ${
                            veh.fuel > 50 ? 'bg-[#82d4a8]' : veh.fuel > 20 ? 'bg-[#e5a46e]' : 'bg-[#e56868]'
                          }`}
                        />
                      </i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-[#252730] flex items-center justify-between">
                <span className="text-[9px] text-[#747783] font-mono truncate max-w-[170px]">
                  {veh.nextService}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onViewDetails && onViewDetails(veh)}
                    className="text-[#b8a2ff] hover:text-[#d3c4ff] text-[10px] font-medium flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditVehicle && onEditVehicle(veh)}
                    className="text-[#858894] hover:text-[#f0f0f4] p-1 rounded hover:bg-[#20222a]"
                    aria-label="Edit vehicle"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-4 overflow-x-auto">
          <table className="w-full border-collapse text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#30323b]">
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Vehicle</th>
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Driver</th>
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Status</th>
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Location</th>
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Odometer</th>
                <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-2 uppercase">Fuel</th>
                <th className="py-2.5 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((veh) => (
                <tr
                  key={veh.id}
                  className="border-b border-[#282a33] hover:bg-[#1f212a] transition-colors last:border-0"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-[#35323f] text-[#c0aaff] flex items-center justify-center font-bold text-xs">
                        ▰
                      </span>
                      <div>
                        <b className="text-[11px] text-[#e0e0e7] block leading-tight">{veh.plate}</b>
                        <small className="text-[9px] text-[#777b87] block font-sans">{veh.model}</small>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-[#aeb0ba] text-[10px]">{veh.driver}</td>
                  <td className="py-3 px-2">
                    <StatusBadge status={veh.status} type="table" />
                  </td>
                  <td className="py-3 px-2 text-[#aeb0ba] text-[10px]">{veh.location}</td>
                  <td className="py-3 px-2 font-mono text-[10px] text-[#aeb0ba]">
                    {veh.odometer?.toLocaleString()} km
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-[#aeb0ba]">{veh.fuel}%</span>
                      <i className="w-10 h-1.5 rounded-full bg-[#343640] block overflow-hidden not-italic">
                        <b
                          style={{ width: `${veh.fuel}%` }}
                          className={`block h-full rounded-full ${
                            veh.fuel > 50 ? 'bg-[#82d4a8]' : veh.fuel > 20 ? 'bg-[#e5a46e]' : 'bg-[#e56868]'
                          }`}
                        />
                      </i>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
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
                        className="text-[#858894] hover:text-[#f0f0f4] p-1 rounded"
                        title="Edit"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
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
