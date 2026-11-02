import React, { useState } from 'react';
import {
  Search,
  Filter,
  Shield,
  Circle,
  Square,
  Crosshair,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import { GEOFENCE_ZONE_TYPES } from '../../data/geofenceMockData';

export default function GeofenceListTable({
  geofences = [],
  onEditGeofence,
  onDeleteGeofence,
  onToggleStatus,
  onFocusGeofence
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredGeofences = geofences.filter((zone) => {
    const matchesSearch =
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (zone.description && zone.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'all' || zone.zoneType === selectedType;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && zone.isActive) ||
      (statusFilter === 'inactive' && !zone.isActive);

    return matchesSearch && matchesType && matchesStatus;
  });

  const getZoneTypeBadge = (type) => {
    const found = GEOFENCE_ZONE_TYPES.find((t) => t.value === type);
    const color = found?.color || '#b49aff';
    const label = found?.label || type;

    return (
      <span
        className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider inline-flex items-center gap-1.5"
        style={{
          backgroundColor: `${color}18`,
          color: color,
          border: `1px solid ${color}33`
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        {label.split('/')[0].trim()}
      </span>
    );
  };

  return (
    <div className="bg-[#17191f] border border-[#252730] rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-[#252730] flex flex-wrap items-center justify-between gap-3 bg-[#13141a]">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#71737e] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by zone name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#101116] border border-[#252730] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#f4f3f8] placeholder-[#555] focus:outline-none focus:border-[#b49aff]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#101116] border border-[#252730] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#8b8d98] focus:outline-none focus:border-[#b49aff]"
          >
            <option value="all">ALL ZONE TYPES</option>
            {GEOFENCE_ZONE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#101116] border border-[#252730] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#8b8d98] focus:outline-none focus:border-[#b49aff]"
          >
            <option value="all">ALL STATUSES</option>
            <option value="active">ACTIVE ONLY</option>
            <option value="inactive">PAUSED ONLY</option>
          </select>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#252730] bg-[#121319] text-[#71737e] font-mono text-[11px]">
              <th className="py-3 px-4 font-normal">ZONE NAME & DIRECTIVE</th>
              <th className="py-3 px-3 font-normal">CATEGORY</th>
              <th className="py-3 px-3 font-normal">GEOMETRY</th>
              <th className="py-3 px-3 font-normal text-right">SPEED LIMIT</th>
              <th className="py-3 px-3 font-normal text-right">MAX DWELL</th>
              <th className="py-3 px-3 font-normal text-center">TRIGGERS</th>
              <th className="py-3 px-3 font-normal text-center">STATUS</th>
              <th className="py-3 px-4 font-normal text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#20222a]">
            {filteredGeofences.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-[#71737e] font-mono">
                  No geofence perimeters matching current filters.
                </td>
              </tr>
            ) : (
              filteredGeofences.map((zone) => (
                <tr
                  key={zone.id}
                  className="hover:bg-[#1c1e27] transition-colors group cursor-pointer"
                  onClick={() => onFocusGeofence && onFocusGeofence(zone)}
                >
                  {/* Name & Directive */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#f4f3f8] flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: zone.color || '#b49aff' }}
                      />
                      <span>{zone.name}</span>
                    </div>
                    {zone.description && (
                      <p className="text-[11px] text-[#71737e] mt-0.5 line-clamp-1 max-w-sm">
                        {zone.description}
                      </p>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    {getZoneTypeBadge(zone.zoneType)}
                  </td>

                  {/* Geometry */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 font-mono text-[#8b8d98]">
                      {zone.geometryType === 'circle' ? (
                        <>
                          <Circle className="w-3.5 h-3.5 text-[#b49aff]" />
                          <span>Circle ({zone.radius}m)</span>
                        </>
                      ) : (
                        <>
                          <Square className="w-3.5 h-3.5 text-[#8be0b3]" />
                          <span>Polygon ({zone.coordinates?.length || 4} pts)</span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Speed Limit */}
                  <td className="py-3 px-3 text-right font-mono text-[#f4f3f8]">
                    {zone.speedLimit} km/h
                  </td>

                  {/* Max Dwell */}
                  <td className="py-3 px-3 text-right font-mono text-[#8b8d98]">
                    {zone.maxDwellMinutes > 0 ? `${zone.maxDwellMinutes}m` : '0m (No Stop)'}
                  </td>

                  {/* Triggers */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1 font-mono text-[10px]">
                      {zone.entryAlert && (
                        <span className="px-1.5 py-0.5 rounded bg-[#b49aff]/10 text-[#b49aff] border border-[#b49aff]/20">
                          ENTRY
                        </span>
                      )}
                      {zone.exitAlert && (
                        <span className="px-1.5 py-0.5 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">
                          EXIT
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(zone.id)}
                      className="inline-flex items-center gap-1 font-mono text-xs cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {zone.isActive ? (
                        <span className="text-[#8be0b3] flex items-center gap-1">
                          <ToggleRight className="w-5 h-5 text-[#8be0b3]" />
                          <span>ACTIVE</span>
                        </span>
                      ) : (
                        <span className="text-[#71737e] flex items-center gap-1">
                          <ToggleLeft className="w-5 h-5 text-[#555]" />
                          <span>PAUSED</span>
                        </span>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onFocusGeofence && onFocusGeofence(zone)}
                        className="p-1.5 text-[#8b8d98] hover:text-[#b49aff] rounded hover:bg-[#252730] transition-colors"
                        title="Focus on Radar Map"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditGeofence(zone)}
                        className="p-1.5 text-[#8b8d98] hover:text-white rounded hover:bg-[#252730] transition-colors"
                        title="Edit Zone Parameters"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteGeofence(zone.id)}
                        className="p-1.5 text-[#8b8d98] hover:text-[#ef4444] rounded hover:bg-[#252730] transition-colors"
                        title="Delete Zone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

