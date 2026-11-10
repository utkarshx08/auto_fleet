import React, { useState, useMemo } from 'react';
import SearchBar from '../common/SearchBar';
import Button from '../common/Button';
import {
  Wrench,
  CheckCircle2,
  Edit2,
  Trash2,
  Clock,
  AlertTriangle,
  Plus,
  ShieldAlert,
  Building,
  Filter
} from 'lucide-react';
import { evaluateScheduleStatus } from '../../services/maintenanceService';

export default function MaintenanceScheduleTable({
  schedules = [],
  vehicles = [],
  onCreateSchedule,
  onEditSchedule,
  onDeleteSchedule,
  onCompleteSchedule
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Compute live evaluation for each schedule
  const enrichedSchedules = useMemo(() => {
    return schedules.map((sch) => {
      const vehicle = vehicles.find((v) => v.plate === sch.vehicleId || v.id === sch.vehicleId);
      const currentOdo = vehicle ? vehicle.odometer : sch.lastServiceOdometer;
      const evaluation = evaluateScheduleStatus(sch, currentOdo);
      return {
        ...sch,
        currentVehicleOdo: currentOdo,
        liveStatus: evaluation.status,
        liveLabel: evaluation.label,
        severity: evaluation.severity
      };
    });
  }, [schedules, vehicles]);

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    const term = (search || '').toLowerCase();
    return enrichedSchedules.filter((sch) => {
      const matchSearch =
        (sch.vehicleId || '').toLowerCase().includes(term) ||
        (sch.maintenanceType || '').toLowerCase().includes(term) ||
        (sch.serviceCenter || '').toLowerCase().includes(term);

      const matchStatus =
        statusFilter === 'ALL' || (sch.liveStatus || '').toLowerCase() === statusFilter.toLowerCase();

      const matchPriority =
        priorityFilter === 'ALL' || (sch.priority || '').toLowerCase() === priorityFilter.toLowerCase();

      return matchSearch && matchStatus && matchPriority;
    });
  }, [enrichedSchedules, search, statusFilter, priorityFilter]);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'High':
        return 'bg-[#382c25] text-[#e5a46e] border-[#523d30]';
      case 'Medium':
        return 'bg-[#24212f] text-[#c4b3ff] border-[#40375b]';
      case 'Low':
      default:
        return 'bg-[#20222a] text-[#858894] border-[#30333d]';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse';
      case 'Due':
        return 'bg-[#382c25] text-[#e5a46e] border-[#523d30]';
      case 'Upcoming':
        return 'bg-[#182736] text-[#8dc8ed] border-[#223b52]';
      case 'Active':
      default:
        return 'bg-[#1c302a] text-[#83d7a9] border-[#2c493d]';
    }
  };

  return (
    <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5 space-y-4">
      {/* Header and Controls */}
      <div className="flex items-center justify-between gap-3 max-md:flex-col max-md:items-stretch">
        <div>
          <span className="font-mono text-[9px] text-[#858894] uppercase tracking-wider block">
            Automated Preventive Engine
          </span>
          <h3 className="text-sm font-bold text-[#f0f0f4] m-0">
            Active Maintenance Schedules
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search vehicle, category, depot..."
            width="w-[260px] max-md:w-full"
          />

          <Button variant="primary" size="sm" onClick={onCreateSchedule} icon={Plus}>
            New Schedule
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#252730] pb-3 flex-wrap gap-2 text-[10px] font-mono">
        <div className="flex items-center gap-1 bg-[#20222a] border border-[#30333d] rounded-[6px] p-0.5">
          {['ALL', 'Overdue', 'Due', 'Upcoming', 'Active'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded transition-colors ${
                statusFilter === st
                  ? 'bg-[#40375b] text-[#c4b3ff] font-bold'
                  : 'text-[#858894] hover:text-[#d1d1da]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#747783]">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#20222a] border border-[#30333d] rounded-[6px] px-2 py-1 text-xs text-[#eee] outline-none font-mono cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap font-sans">
          <thead>
            <tr className="border-b border-[#30323b] text-[#747783] font-mono text-[8px] uppercase">
              <th className="py-2.5 px-3">Vehicle</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Configured Interval</th>
              <th className="py-2.5 px-3">Next Threshold</th>
              <th className="py-2.5 px-3">Live Status</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Service Centre</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#747783]">
                  No maintenance schedules match your criteria.
                </td>
              </tr>
            ) : (
              filteredSchedules.map((sch) => (
                <tr
                  key={sch.id}
                  className="border-b border-[#242633] hover:bg-[#1b1d26] transition-colors last:border-0"
                >
                  {/* Vehicle */}
                  <td className="py-3 px-3">
                    <b className="font-mono text-xs text-[#f0f0f4] block">{sch.vehicleId}</b>
                    <span className="font-mono text-[9px] text-[#747783]">
                      Current: {sch.currentVehicleOdo?.toLocaleString() || 0} km
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 text-[#d1d1da] font-medium">
                      <Wrench className="w-3.5 h-3.5 text-[#b49aff] shrink-0" />
                      <span>{sch.maintenanceType}</span>
                    </div>
                  </td>

                  {/* Interval */}
                  <td className="py-3 px-3 font-mono text-[10px] text-[#aeb0ba]">
                    <span>{sch.intervalKm.toLocaleString()} km</span>
                    <span className="text-[#656875] mx-1">/</span>
                    <span>{sch.intervalDays} days</span>
                  </td>

                  {/* Next Threshold */}
                  <td className="py-3 px-3 font-mono text-[10px]">
                    <span className="text-[#8be0b3] font-bold block">
                      {sch.nextServiceOdometer.toLocaleString()} km
                    </span>
                    <span className="text-[#858894] text-[9px]">{sch.nextServiceDate}</span>
                  </td>

                  {/* Live Status */}
                  <td className="py-3 px-3">
                    <span
                      className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${getStatusBadge(
                        sch.liveStatus
                      )}`}
                    >
                      ● {sch.liveStatus.toUpperCase()} ({sch.liveLabel})
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-3">
                    <span
                      className={`font-mono text-[9px] px-2 py-0.5 rounded border ${getPriorityBadge(
                        sch.priority
                      )}`}
                    >
                      {sch.priority}
                    </span>
                  </td>

                  {/* Service Centre */}
                  <td className="py-3 px-3 text-[#aeb0ba] text-[10px]">
                    {sch.serviceCenter || 'Central Bay'}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onCompleteSchedule(sch)}
                        icon={CheckCircle2}
                      >
                        Complete
                      </Button>
                      <button
                        type="button"
                        onClick={() => onEditSchedule(sch)}
                        className="p-1.5 rounded text-[#858894] hover:text-[#b49aff] hover:bg-[#20222a] transition-colors"
                        title="Edit schedule"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSchedule(sch)}
                        className="p-1.5 rounded text-[#858894] hover:text-red-400 hover:bg-[#20222a] transition-colors"
                        title="Delete schedule"
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

