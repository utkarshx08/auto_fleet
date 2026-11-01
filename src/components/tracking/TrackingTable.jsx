import React, { useState, useMemo } from 'react';
import SearchBar from '../common/SearchBar';
import Button from '../common/Button';
import { Crosshair, Navigation, AlertTriangle, ArrowUpRight } from 'lucide-react';

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
        return 'text-[#83d7a9] bg-[#1c302a] border-[#2c493d]';
      case 'idle':
        return 'text-[#e5a46e] bg-[#382c25] border-[#523d30]';
      case 'offline':
        return 'text-[#747783] bg-[#1c1e25] border-[#30333d]';
      case 'stopped':
      default:
        return 'text-[#a5a7b0] bg-[#24212f] border-[#353242]';
    }
  };

  return (
    <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-4 space-y-3.5">
      {/* Table Header & Search Tools */}
      <div className="flex items-center justify-between gap-3 max-md:flex-col max-md:items-stretch">
        <div>
          <span className="font-mono text-[9px] text-[#858894] uppercase tracking-wider block">
            Fleet Telemetry Matrix
          </span>
          <h3 className="text-sm font-bold text-[#f0f0f4] m-0">
            Active Vehicle Transponders
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search plate, driver, corridor..."
            width="w-[260px] max-md:w-full"
          />

          <div className="flex items-center bg-[#20222a] border border-[#30333d] rounded-[6px] p-0.5 text-[10px] font-mono">
            {['ALL', 'moving', 'idle', 'stopped', 'offline'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-[#40375b] text-[#c4b3ff] font-bold'
                    : 'text-[#858894] hover:text-[#d1d1da]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[10px] whitespace-nowrap">
          <thead>
            <tr className="border-b border-[#30323b] text-[#747783] font-mono text-[8px] uppercase">
              <th className="py-2.5 px-2">Transponder / Vehicle</th>
              <th className="py-2.5 px-2">Operator</th>
              <th className="py-2.5 px-2">Current Speed</th>
              <th className="py-2.5 px-2">Location & Coordinates</th>
              <th className="py-2.5 px-2">Status</th>
              <th className="py-2.5 px-2">Heartbeat</th>
              <th className="py-2.5 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#747783]">
                  No vehicle transponders match your search criteria.
                </td>
              </tr>
            ) : (
              filteredList.map((veh) => {
                const isSelected = veh.vehicleId === selectedVehicleId;
                const isOverspeed = veh.speed > 80;

                return (
                  <tr
                    key={veh.vehicleId}
                    onClick={() => onSelectVehicle && onSelectVehicle(veh)}
                    className={`border-b border-[#242633] hover:bg-[#1f212a] transition-colors cursor-pointer last:border-0 ${
                      isSelected ? 'bg-[#24212f]/40' : ''
                    }`}
                  >
                    {/* Vehicle */}
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-[#2a2736] text-[#c4b3ff] flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                          ▰
                        </span>
                        <div>
                          <b className="font-mono text-[#f0f0f4] text-xs leading-tight block">
                            {veh.plate}
                          </b>
                          <small className="text-[8px] text-[#777b87] block">{veh.model}</small>
                        </div>
                      </div>
                    </td>

                    {/* Driver */}
                    <td className="py-2.5 px-2 text-[#d1d1da]">{veh.driver}</td>

                    {/* Speed */}
                    <td className="py-2.5 px-2 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold ${isOverspeed ? 'text-red-400' : 'text-[#f0f0f4]'}`}>
                          {veh.speed} km/h
                        </span>
                        {isOverspeed && (
                          <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 text-[8px] border border-red-500/30">
                            OVERSPEED
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-2.5 px-2 text-[#aeb0ba]">
                      <span className="block truncate max-w-[200px]">{veh.locationName}</span>
                      <small className="font-mono text-[8px] text-[#747783]">
                        {Number(veh.latitude).toFixed(4)}, {Number(veh.longitude).toFixed(4)}
                      </small>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-2">
                      <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border uppercase ${getStatusBadge(veh.status)}`}>
                        ● {veh.status}
                      </span>
                    </td>

                    {/* Last Updated */}
                    <td className="py-2.5 px-2 font-mono text-[9px] text-[#858894]">
                      {veh.lastUpdated}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-2 text-right">
                      <Button
                        variant="text"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onFocusVehicle) onFocusVehicle(veh);
                        }}
                      >
                        <Crosshair className="w-3 h-3 mr-1" />
                        <span>View on Map</span>
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

