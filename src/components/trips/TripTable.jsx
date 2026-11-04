import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Play,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
  MoreVertical,
  ChevronRight,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import TripStatusBadge from './TripStatusBadge';
import { calculateTripExpenses, canTransitionTripStatus } from '../../services/tripService';

export default function TripTable({
  trips = [],
  onViewDetails,
  onEditTrip,
  onDeleteTrip,
  onStatusTransition,
  className = ''
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortField, setSortField] = useState('scheduledDeparture');
  const [sortAsc, setSortAsc] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filter & Sort Logic
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          trip.id?.toLowerCase().includes(q) ||
          trip.tripName?.toLowerCase().includes(q) ||
          trip.customerName?.toLowerCase().includes(q) ||
          trip.assignedVehicleId?.toLowerCase().includes(q) ||
          trip.assignedDriverId?.toLowerCase().includes(q) ||
          trip.pickupLocation?.toLowerCase().includes(q) ||
          trip.destinationLocation?.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // 2. Status Filter
      if (statusFilter !== 'ALL' && trip.status !== statusFilter) {
        return false;
      }

      // 3. Priority Filter
      if (priorityFilter !== 'ALL' && trip.priority !== priorityFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'expenses') {
        valA = calculateTripExpenses(a).totalExpense;
        valB = calculateTripExpenses(b).totalExpense;
      }

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (sortAsc) {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
  }, [trips, searchQuery, statusFilter, priorityFilter, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const formatDateTime = (iso) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return '—';
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '—';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#17191f] border border-[#292c35] p-3.5 rounded-[10px]">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#737684]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, trip, client, vehicle, or route..."
            className="w-full bg-[#121319] border border-[#2b2e38] text-sm text-[#f0f0f4] pl-9 pr-3 py-2 rounded-[7px] focus:outline-none focus:border-[#ad91ff] placeholder-[#626573] transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#8e919f]">
            <Filter className="w-3.5 h-3.5 text-[#ad91ff]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#121319] border border-[#2b2e38] text-xs text-[#d4d4dc] px-2.5 py-1.5 rounded-[6px] focus:outline-none focus:border-[#ad91ff] cursor-pointer"
            >
              <option value="ALL">All Statuses ({trips.length})</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#121319] border border-[#2b2e38] text-xs text-[#d4d4dc] px-2.5 py-1.5 rounded-[6px] focus:outline-none focus:border-[#ad91ff] cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#292c35] bg-[#14151b] text-[#818491] font-mono text-[10px] uppercase tracking-[1px] select-none">
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-4 cursor-pointer hover:text-[#f0f0f4] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Trip Details</span>
                    <ArrowUpDown className="w-3 h-3 text-[#585a66]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('customerName')}
                  className="py-3 px-3 cursor-pointer hover:text-[#f0f0f4] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Customer</span>
                    <ArrowUpDown className="w-3 h-3 text-[#585a66]" />
                  </div>
                </th>
                <th className="py-3 px-3">Route / Waypoints</th>
                <th className="py-3 px-3">Vehicle & Driver</th>
                <th
                  onClick={() => handleSort('scheduledDeparture')}
                  className="py-3 px-3 cursor-pointer hover:text-[#f0f0f4] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Schedule</span>
                    <ArrowUpDown className="w-3 h-3 text-[#585a66]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('estimatedDistanceKm')}
                  className="py-3 px-3 cursor-pointer hover:text-[#f0f0f4] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Distance</span>
                    <ArrowUpDown className="w-3 h-3 text-[#585a66]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('expenses')}
                  className="py-3 px-3 cursor-pointer hover:text-[#f0f0f4] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Expenses</span>
                    <ArrowUpDown className="w-3 h-3 text-[#585a66]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-3 cursor-pointer hover:text-[#f0f0f4] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-[#585a66]" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242631]">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-[#747683]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-sm font-medium text-[#9a9ca8]">No trips match your filters</p>
                      <p className="text-xs text-[#676a77]">Try adjusting search keywords or clearing status filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => {
                  const { totalExpense, costPerKm } = calculateTripExpenses(trip);
                  const isDelConfirm = deleteConfirmId === trip.id;

                  return (
                    <tr
                      key={trip.id}
                      className="hover:bg-[#1c1e26] transition-colors group"
                    >
                      {/* Trip Details */}
                      <td className="py-3.5 px-4 font-normal">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-mono text-xs font-semibold text-[#ad91ff]">
                              {trip.id}
                            </span>
                            {trip.priority === 'High' && (
                              <span className="font-mono text-[9px] px-1 rounded bg-[#381e24] text-[#f87171] border border-[#5c2d36]">
                                High
                              </span>
                            )}
                          </div>
                          <span
                            onClick={() => onViewDetails && onViewDetails(trip)}
                            className="font-medium text-[#e4e4eb] group-hover:text-[#c4b3ff] transition-colors truncate max-w-[200px] cursor-pointer"
                            title={trip.tripName}
                          >
                            {trip.tripName}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-3">
                        <span className="text-[#c4c6d0] truncate block max-w-[150px]" title={trip.customerName}>
                          {trip.customerName}
                        </span>
                      </td>

                      {/* Route */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-0.5 max-w-[220px]">
                          <span className="text-[#a6a8b4] truncate text-[11px]" title={trip.pickupLocation}>
                            <span className="text-[#8be0b3] font-bold mr-1">●</span>
                            {trip.pickupLocation}
                          </span>
                          <span className="text-[#a6a8b4] truncate text-[11px]" title={trip.destinationLocation}>
                            <span className="text-[#f87171] font-bold mr-1">■</span>
                            {trip.destinationLocation}
                          </span>
                          {Array.isArray(trip.stops) && trip.stops.length > 0 && (
                            <span className="text-[10px] font-mono text-[#ad91ff]">
                              +{trip.stops.length} stop{trip.stops.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Vehicle & Driver */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-[#e0e0e7]">
                            {trip.assignedVehicleId || (
                              <span className="text-[#656877] italic">Unassigned</span>
                            )}
                          </span>
                          <span className="text-[11px] text-[#8d909f] truncate max-w-[130px]">
                            {trip.assignedDriverId || '—'}
                          </span>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="py-3.5 px-3 text-[#9ea0ad] font-mono text-[11px]">
                        <div>Dep: {formatDateTime(trip.actualDeparture || trip.scheduledDeparture)}</div>
                        <div className="text-[#6d707e]">Arr: {formatDateTime(trip.actualArrival || trip.scheduledArrival)}</div>
                      </td>

                      {/* Distance */}
                      <td className="py-3.5 px-3 font-mono text-[#d4d4dc]">
                        <div>
                          {Number(trip.actualDistanceKm) > 0 ? (
                            <span>{trip.actualDistanceKm} km</span>
                          ) : (
                            <span className="text-[#8d909f]">~{trip.estimatedDistanceKm} km</span>
                          )}
                        </div>
                      </td>

                      {/* Expenses */}
                      <td className="py-3.5 px-3 font-mono">
                        <div className="text-[#e0e0e7]">${totalExpense.toFixed(2)}</div>
                        {costPerKm > 0 && (
                          <div className="text-[10px] text-[#747683]">${costPerKm}/km</div>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-3">
                        <TripStatusBadge status={trip.status} size="sm" />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {isDelConfirm ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-[10px] text-[#f87171]">Delete?</span>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteTrip && onDeleteTrip(trip.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-2 py-0.5 rounded bg-[#ef4444] text-white text-[10px] font-semibold hover:bg-[#dc2626]"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-0.5 rounded bg-[#2b2d38] text-[#a0a3b1] text-[10px] hover:bg-[#383a48]"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            {/* Quick Start / Complete triggers */}
                            {(trip.status === 'Scheduled' || trip.status === 'Assigned') && (
                              <button
                                type="button"
                                onClick={() => onStatusTransition && onStatusTransition(trip.id, 'In Progress')}
                                className="p-1.5 rounded hover:bg-[#122822] text-[#6ee7b7] hover:border hover:border-[#1d4c3e] transition-colors"
                                title="Start Trip"
                              >
                                <Play className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {(trip.status === 'In Progress' || trip.status === 'Delayed') && (
                              <button
                                type="button"
                                onClick={() => onStatusTransition && onStatusTransition(trip.id, 'Completed')}
                                className="p-1.5 rounded hover:bg-[#142921] text-[#70cbb7] hover:border hover:border-[#20493b] transition-colors"
                                title="Complete Trip"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* View Details */}
                            <button
                              type="button"
                              onClick={() => onViewDetails && onViewDetails(trip)}
                              className="p-1.5 rounded hover:bg-[#252834] text-[#ad91ff] transition-colors"
                              title="View Trip Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Trip */}
                            {trip.status !== 'Completed' && trip.status !== 'Cancelled' && (
                              <button
                                type="button"
                                onClick={() => onEditTrip && onEditTrip(trip)}
                                className="p-1.5 rounded hover:bg-[#252834] text-[#8e919f] hover:text-[#f0f0f4] transition-colors"
                                title="Edit Trip"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete Trip */}
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(trip.id)}
                              className="p-1.5 rounded hover:bg-[#321719] text-[#7e818e] hover:text-[#f87171] transition-colors"
                              title="Delete Trip"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer info */}
        <div className="py-2.5 px-4 bg-[#14151b] border-t border-[#292c35] text-[11px] font-mono text-[#747683] flex items-center justify-between">
          <span>Showing {filteredTrips.length} of {trips.length} total trips</span>
          <span>AUTRAIL Dispatch Matrix</span>
        </div>
      </div>
    </div>
  );
}

