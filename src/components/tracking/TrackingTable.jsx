import React, { useState, useMemo } from 'react';
import SearchBar from '../common/SearchBar';
import Button from '../common/Button';
import { Crosshair, Navigation, AlertTriangle, ArrowUpRight, Truck } from 'lucide-react';

export default function TrackingTable({
  telemetryList = [],
  selectedVehicleId,
  onSelectVehicle,
  onFocusVehicle
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredList = useMemo(() => {
    return telemetryList.filter((v) => {
      const matchSearch =
        v.plate.toLowerCase().includes(search.toLowerCase()) ||
        v.driver.toLowerCase().includes(search.toLowerCase()) ||
        v.locationName.toLowerCase().includes(search.toLowerCase()) ||
        v.assignedRoute.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [telemetryList, search, statusFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'moving':
        return 'text-[#16A36A] bg-[#E8F7F0] border-[#C2E8D7]';
      case 'idle':
        return 'text-[#E7A329] bg-[#FEF7EA] border-[#F8DCB0]';
      case 'offline':
        return 'text-[#8A97AB] bg-[#F1F5F9] border-[#E2E8F0]';
      case 'stopped':
      default:
        return 'text-[#2879E8] bg-[#EAF3FF] border-[#D5E6FB]';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4 shadow-liquid-subtle">
      {/* Table Header & Search Tools */}
      <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
        <div>
          <span className="font-mono text-[9px] text-[#8A97AB] uppercase tracking-wider block font-semibold">
            Fleet Telemetry Matrix
          </span>
          <h3 className="text-base font-bold text-[#172033] m-0">
            Active Vehicle Transponders
          </h3>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search plate, driver, corridor..."
            width="w-[280px] max-md:w-full"
          />

          <div className="flex items-center bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl p-1 text-[11px] font-semibold">
            {['ALL', 'moving', 'idle', 'stopped', 'offline'].map((st) => (
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
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-[#E2E8F0]/80">
              <th className="py-3 px-3 text-[#8A97AB] font-mono text-[9px] uppercase tracking-wider font-semibold">Vehicle</th>
              <th className="py-3 px-3 text-[#8A97AB] font-mono text-[9px] uppercase tracking-wider font-semibold">Driver</th>
              <th className="py-3 px-3 text-[#8A97AB] font-mono text-[9px] uppercase tracking-wider font-semibold">Status</th>
              <th className="py-3 px-3 text-[#8A97AB] font-mono text-[9px] uppercase tracking-wider font-semibold">Live Speed</th>
              <th className="py-3 px-3 text-[#8A97AB] font-mono text-[9px] uppercase tracking-wider font-semibold">Heading</th>
              <th className="py-3 px-3 text-[#8A97AB] font-mono text-[9px] uppercase tracking-wider font-semibold">Coordinates</th>
              <th className="py-3 px-3 text-[#8A97AB] font-mono text-[9px] uppercase tracking-wider font-semibold">Vicinity / Corridor</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((veh) => {
              const isSelected = selectedVehicleId === veh.vehicleId;
              const isOverspeed = (veh.speed || 0) > 80;

              return (
                <tr
                  key={veh.vehicleId}
                  onClick={() => onSelectVehicle && onSelectVehicle(veh)}
                  className={`border-b border-[#F1F5F9] transition-colors cursor-pointer group last:border-0 ${
                    isSelected ? 'bg-[#EAF3FF]/80 font-medium' : 'hover:bg-[#F8FAFD]'
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#2879E8] flex items-center justify-center font-bold text-xs border border-[#D5E6FB]">
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <b className="text-[#172033] block font-mono text-xs">{veh.plate}</b>
                        <span className="text-[10px] text-[#68758A] block font-sans">{veh.model}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#172033] font-semibold">{veh.driver}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block font-mono text-[9px] px-2 py-0.5 rounded-full border font-semibold ${getStatusBadge(veh.status)}`}>
                      ● {veh.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <span className={`font-bold ${isOverspeed ? 'text-[#E05252] animate-pulse' : 'text-[#16A36A]'}`}>
                      {veh.speed} km/h
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[#68758A]">
                    {veh.headingText || `${veh.heading}°`}
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-[#8A97AB]">
                    {Number(veh.latitude).toFixed(4)}, {Number(veh.longitude).toFixed(4)}
                  </td>
                  <td className="py-3 px-3 text-[#172033] max-w-[220px] truncate">
                    {veh.locationName}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="quiet"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onFocusVehicle) onFocusVehicle(veh);
                        }}
                        icon={Crosshair}
                      >
                        Center
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
