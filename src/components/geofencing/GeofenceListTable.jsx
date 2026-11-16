import React, { useState } from 'react';
import {
  Search,
  Circle,
  Square,
  Crosshair,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight
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
    const color = found?.color || '#2879E8';
    const label = found?.label || type;

    return (
      <span
        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider inline-flex items-center gap-1.5 border shadow-2xs"
        style={{
          backgroundColor: `${color}15`,
          color: color,
          borderColor: `${color}35`
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        {label.split('/')[0].trim()}
      </span>
    );
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-liquid-subtle flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-[#E2E8F0]/80 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-white to-[#F8FAFD]">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8A97AB] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by zone name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl pl-10 pr-3.5 py-2 text-xs text-[#172033] placeholder-[#8A97AB] focus:outline-none focus:border-[#2879E8] focus:bg-white shadow-2xs transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-mono font-semibold text-[#172033] focus:outline-none focus:border-[#2879E8] shadow-2xs transition-all cursor-pointer"
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
            className="bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-mono font-semibold text-[#172033] focus:outline-none focus:border-[#2879E8] shadow-2xs transition-all cursor-pointer"
          >
            <option value="all">ALL STATUSES</option>
            <option value="active">ACTIVE ONLY</option>
            <option value="inactive">PAUSED ONLY</option>
          </select>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-[#E2E8F0]/80 bg-[#F8FAFD] text-[#8A97AB] font-mono text-[10px] font-semibold uppercase">
              <th className="py-3 px-4">ZONE NAME & DIRECTIVE</th>
              <th className="py-3 px-3">CATEGORY</th>
              <th className="py-3 px-3">GEOMETRY</th>
              <th className="py-3 px-3 text-right">SPEED LIMIT</th>
              <th className="py-3 px-3 text-right">MAX DWELL</th>
              <th className="py-3 px-3 text-center">TRIGGERS</th>
              <th className="py-3 px-3 text-center">STATUS</th>
              <th className="py-3 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {filteredGeofences.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-[#68758A] font-mono">
                  No geofence perimeters matching current filters.
                </td>
              </tr>
            ) : (
              filteredGeofences.map((zone) => (
                <tr
                  key={zone.id}
                  className="hover:bg-[#F8FAFD] transition-colors group cursor-pointer"
                  onClick={() => onFocusGeofence && onFocusGeofence(zone)}
                >
                  {/* Name & Directive */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#172033] flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: zone.color || '#2879E8' }}
                      />
                      <span>{zone.name}</span>
                    </div>
                    {zone.description && (
                      <p className="text-[11px] text-[#68758A] mt-0.5 line-clamp-1 max-w-sm">
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
                    <div className="flex items-center gap-1.5 font-mono text-[#68758A]">
                      {zone.geometryType === 'circle' ? (
                        <>
                          <Circle className="w-3.5 h-3.5 text-[#2879E8]" />
                          <span>Circle ({zone.radius}m)</span>
                        </>
                      ) : (
                        <>
                          <Square className="w-3.5 h-3.5 text-[#16A36A]" />
                          <span>Polygon ({zone.coordinates?.length || 4} pts)</span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Speed Limit */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#172033]">
                    {zone.speedLimit} km/h
                  </td>

                  {/* Max Dwell */}
                  <td className="py-3 px-3 text-right font-mono text-[#68758A]">
                    {zone.maxDwellMinutes > 0 ? `${zone.maxDwellMinutes}m` : '0m (No Stop)'}
                  </td>

                  {/* Trigger Types */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1 font-mono text-[9px]">
                      {zone.triggerOnEnter && (
                        <span className="px-1.5 py-0.5 rounded bg-[#E8F7F0] text-[#16A36A] font-bold">
                          ENT
                        </span>
                      )}
                      {zone.triggerOnExit && (
                        <span className="px-1.5 py-0.5 rounded bg-[#FEF7EA] text-[#E7A329] font-bold">
                          EXT
                        </span>
                      )}
                      {zone.triggerOnDwell && (
                        <span className="px-1.5 py-0.5 rounded bg-[#EAF3FF] text-[#2879E8] font-bold">
                          DWL
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onToggleStatus && onToggleStatus(zone.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase transition-all border ${
                        zone.isActive
                          ? 'bg-[#E8F7F0] text-[#16A36A] border-[#C2E8D7]'
                          : 'bg-[#F1F5F9] text-[#8A97AB] border-[#E2E8F0]'
                      }`}
                      title={zone.isActive ? 'Deactivate Zone' : 'Activate Zone'}
                    >
                      {zone.isActive ? (
                        <>
                          <ToggleRight className="w-3.5 h-3.5 text-[#16A36A]" />
                          <span>ACTIVE</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-3.5 h-3.5 text-[#8A97AB]" />
                          <span>PAUSED</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onFocusGeofence && onFocusGeofence(zone)}
                        className="p-1.5 text-[#68758A] hover:text-[#2879E8] hover:bg-[#EAF3FF] rounded-lg transition-colors cursor-pointer"
                        title="Locate on Radar Map"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditGeofence && onEditGeofence(zone)}
                        className="p-1.5 text-[#68758A] hover:text-[#172033] hover:bg-[#F0F5FC] rounded-lg transition-colors cursor-pointer"
                        title="Edit Zone Parameters"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteGeofence && onDeleteGeofence(zone.id)}
                        className="p-1.5 text-[#E05252] hover:bg-[#FDF2F2] rounded-lg transition-colors cursor-pointer"
                        title="Delete Geofence"
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
