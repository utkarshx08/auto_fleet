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
        return 'bg-[#FDF2F2] text-[#E05252] border-[#FAD2D2]';
      case 'High':
        return 'bg-[#FEF7EA] text-[#E7A329] border-[#F8DFB4]';
      case 'Medium':
        return 'bg-[#EAF3FF] text-[#2879E8] border-[#D5E6FB]';
      case 'Low':
      default:
        return 'bg-[#F1F5F9] text-[#68758A] border-[#E2E8F0]';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Overdue':
        return 'bg-[#FDF2F2] text-[#E05252] border-[#FAD2D2] font-semibold animate-pulse';
      case 'Due':
        return 'bg-[#FEF7EA] text-[#E7A329] border-[#F8DFB4] font-semibold';
      case 'Upcoming':
        return 'bg-[#EAF3FF] text-[#2879E8] border-[#D5E6FB] font-semibold';
      case 'Active':
      default:
        return 'bg-[#E8F7F0] text-[#16A36A] border-[#C2E8D7] font-semibold';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4 shadow-liquid-subtle">
      {/* Header and Controls */}
      <div className="flex items-center justify-between gap-3 max-md:flex-col max-md:items-stretch">
        <div>
          <span className="font-mono text-[10px] text-[#2879E8] font-semibold uppercase tracking-wider block">
            Automated Preventive Engine
          </span>
          <h3 className="text-base font-bold text-[#172033] tracking-tight mt-0.5">
            Active Maintenance Schedules
          </h3>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
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
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 flex-wrap gap-2 text-[11px] font-mono">
        <div className="flex items-center gap-1 bg-[#F8FAFD] border border-[#D5E2F1] rounded-xl p-1 shadow-2xs">
          {['ALL', 'Overdue', 'Due', 'Upcoming', 'Active'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs transition-colors font-medium cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#EAF3FF] text-[#2879E8] font-bold shadow-2xs'
                  : 'text-[#68758A] hover:text-[#172033]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#68758A]">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-2.5 py-1 text-xs text-[#172033] outline-none font-mono cursor-pointer shadow-2xs"
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
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap font-sans">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[#68758A] font-mono text-[10px] uppercase tracking-wider">
              <th className="py-3 px-3.5">Vehicle</th>
              <th className="py-3 px-3.5">Category</th>
              <th className="py-3 px-3.5">Configured Interval</th>
              <th className="py-3 px-3.5">Next Threshold</th>
              <th className="py-3 px-3.5">Live Status</th>
              <th className="py-3 px-3.5">Priority</th>
              <th className="py-3 px-3.5">Service Centre</th>
              <th className="py-3 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#8A97AB]">
                  <Wrench className="w-8 h-8 mx-auto text-[#CBD5E1] mb-2" />
                  <p className="font-semibold text-sm text-[#172033]">No maintenance schedules found</p>
                  <p className="text-xs text-[#68758A]">Try adjusting your search query or filter tags.</p>
                </td>
              </tr>
            ) : (
              filteredSchedules.map((sch) => (
                <tr
                  key={sch.id}
                  className="border-b border-[#F1F5F9] hover:bg-[#F0F5FC]/60 transition-colors last:border-0"
                >
                  {/* Vehicle */}
                  <td className="py-3.5 px-3.5">
                    <b className="font-mono text-xs text-[#172033] font-bold block">{sch.vehicleId}</b>
                    <span className="font-mono text-[10px] text-[#8A97AB]">
                      Current: {sch.currentVehicleOdo?.toLocaleString() || 0} km
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-3.5">
                    <div className="flex items-center gap-2 text-[#172033] font-medium">
                      <Wrench className="w-3.5 h-3.5 text-[#2879E8] shrink-0" />
                      <span>{sch.maintenanceType}</span>
                    </div>
                  </td>

                  {/* Interval */}
                  <td className="py-3.5 px-3.5 font-mono text-[11px] text-[#68758A]">
                    <span>{sch.intervalKm.toLocaleString()} km</span>
                    <span className="text-[#CBD5E1] mx-1">/</span>
                    <span>{sch.intervalDays} days</span>
                  </td>

                  {/* Next Threshold */}
                  <td className="py-3.5 px-3.5 font-mono text-[11px]">
                    <span className="text-[#16A36A] font-bold block">
                      {sch.nextServiceOdometer.toLocaleString()} km
                    </span>
                    <span className="text-[#8A97AB] text-[10px]">{sch.nextServiceDate}</span>
                  </td>

                  {/* Live Status */}
                  <td className="py-3.5 px-3.5">
                    <span
                      className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        sch.liveStatus
                      )}`}
                    >
                      ● {sch.liveStatus.toUpperCase()} ({sch.liveLabel})
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-3.5">
                    <span
                      className={`font-mono text-[10px] px-2.5 py-0.5 rounded-lg border font-medium ${getPriorityBadge(
                        sch.priority
                      )}`}
                    >
                      {sch.priority}
                    </span>
                  </td>

                  {/* Service Centre */}
                  <td className="py-3.5 px-3.5 text-[#68758A] text-xs font-medium">
                    {sch.serviceCenter || 'Central Bay'}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3.5 text-right">
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
                        className="p-1.5 rounded-lg text-[#68758A] hover:text-[#2879E8] hover:bg-[#F0F5FC] transition-colors cursor-pointer"
                        title="Edit schedule"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSchedule(sch)}
                        className="p-1.5 rounded-lg text-[#68758A] hover:text-[#E05252] hover:bg-[#FDF2F2] transition-colors cursor-pointer"
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

