import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Edit2,
  Trash2,
  Play,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import TripStatusBadge from './TripStatusBadge';
import { calculateTripExpenses } from '../../services/tripService';

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
  const [sortDirection, setSortDirection] = useState('desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Sorting Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter & Sort
  const filteredTrips = useMemo(() => {
    return trips
      .filter((trip) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          trip.id.toLowerCase().includes(query) ||
          trip.tripName.toLowerCase().includes(query) ||
          trip.customerName.toLowerCase().includes(query) ||
          (trip.assignedVehicleId && trip.assignedVehicleId.toLowerCase().includes(query)) ||
          (trip.assignedDriverId && trip.assignedDriverId.toLowerCase().includes(query)) ||
          trip.pickupLocation.toLowerCase().includes(query) ||
          trip.destinationLocation.toLowerCase().includes(query);

        const matchesStatus = statusFilter === 'ALL' || trip.status === statusFilter;
        const matchesPriority = priorityFilter === 'ALL' || trip.priority === priorityFilter;

        return matchesQuery && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === 'expenses') {
          valA = calculateTripExpenses(a).totalExpense;
          valB = calculateTripExpenses(b).totalExpense;
        }

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === 'string') {
          return sortDirection === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        return sortDirection === 'asc' ? valA - valB : valB - valA;
      });
  }, [trips, searchQuery, statusFilter, priorityFilter, sortField, sortDirection]);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString([], {
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
      <div className="flex flex-wrap items-center justify-between gap-3 glass-card p-3.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, trip, client, vehicle, or route..."
            className="w-full bg-white border border-[#E2E8F0] text-sm text-[#0B132B] pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2879E8] placeholder-[#94A3B8] transition-colors font-medium"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#334155] font-semibold">
            <Filter className="w-3.5 h-3.5 text-[#2879E8]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[#E2E8F0] text-xs text-[#0B132B] font-semibold px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-[#2879E8] cursor-pointer shadow-xs"
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
            className="bg-white border border-[#E2E8F0] text-xs text-[#0B132B] font-semibold px-2.5 py-1.5 rounded-xl focus:outline-none focus:border-[#2879E8] cursor-pointer shadow-xs"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFD] text-[#475569] font-mono text-[10px] uppercase tracking-[1px] select-none font-bold">
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-4 cursor-pointer hover:text-[#0B132B] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Trip Details</span>
                    <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('customerName')}
                  className="py-3 px-3 cursor-pointer hover:text-[#0B132B] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Customer</span>
                    <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
                  </div>
                </th>
                <th className="py-3 px-3">Route / Waypoints</th>
                <th className="py-3 px-3">Vehicle & Driver</th>
                <th
                  onClick={() => handleSort('scheduledDeparture')}
                  className="py-3 px-3 cursor-pointer hover:text-[#0B132B] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Schedule</span>
                    <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('estimatedDistanceKm')}
                  className="py-3 px-3 cursor-pointer hover:text-[#0B132B] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Distance</span>
                    <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('expenses')}
                  className="py-3 px-3 cursor-pointer hover:text-[#0B132B] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Expenses</span>
                    <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-3 cursor-pointer hover:text-[#0B132B] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-[#64748B]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-sm font-bold text-[#0F172A]">No trips match your filters</p>
                      <p className="text-xs text-[#475569] font-medium">Try adjusting search keywords or clearing status filter.</p>
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
                      className="hover:bg-[#F8FAFD] transition-colors group"
                    >
                      {/* Trip Details */}
                      <td className="py-3.5 px-4 font-normal">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-mono text-xs font-bold text-[#2879E8] bg-[#EAF3FF] px-2 py-0.5 rounded-lg border border-[#C8E0FF]">
                              {trip.id}
                            </span>
                            {trip.priority === 'High' && (
                              <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FEF2F2] text-[#E05252] border border-[#FCA5A5]">
                                High
                              </span>
                            )}
                          </div>
                          <span
                            onClick={() => onViewDetails && onViewDetails(trip)}
                            className="font-bold text-[#0B132B] group-hover:text-[#2879E8] transition-colors truncate max-w-[200px] cursor-pointer"
                            title={trip.tripName}
                          >
                            {trip.tripName}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-3">
                        <span className="text-[#334155] font-semibold truncate block max-w-[150px]" title={trip.customerName}>
                          {trip.customerName}
                        </span>
                      </td>

                      {/* Route */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-0.5 max-w-[220px]">
                          <span className="text-[#334155] truncate text-[11px] font-medium" title={trip.pickupLocation}>
                            <span className="text-[#16A36A] font-bold mr-1">●</span>
                            {trip.pickupLocation}
                          </span>
                          <span className="text-[#334155] truncate text-[11px] font-medium" title={trip.destinationLocation}>
                            <span className="text-[#E05252] font-bold mr-1">■</span>
                            {trip.destinationLocation}
                          </span>
                          {Array.isArray(trip.stops) && trip.stops.length > 0 && (
                            <span className="text-[10px] font-mono text-[#2879E8] font-bold">
                              +{trip.stops.length} stop{trip.stops.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Vehicle & Driver */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-[#0B132B] font-bold">
                            {trip.assignedVehicleId || (
                              <span className="text-[#94A3B8] italic font-normal">Unassigned</span>
                            )}
                          </span>
                          <span className="text-[11px] text-[#475569] font-medium truncate max-w-[130px]">
                            {trip.assignedDriverId || '—'}
                          </span>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="py-3.5 px-3 text-[#334155] font-mono text-[11px] font-medium">
                        <div>Dep: {formatDateTime(trip.actualDeparture || trip.scheduledDeparture)}</div>
                        <div className="text-[#64748B]">Arr: {formatDateTime(trip.actualArrival || trip.scheduledArrival)}</div>
                      </td>

                      {/* Distance */}
                      <td className="py-3.5 px-3 font-mono text-[#0B132B] font-bold">
                        <div>
                          {Number(trip.actualDistanceKm) > 0 ? (
                            <span>{trip.actualDistanceKm} km</span>
                          ) : (
                            <span className="text-[#64748B] font-normal">~{trip.estimatedDistanceKm} km</span>
                          )}
                        </div>
                      </td>

                      {/* Expenses */}
                      <td className="py-3.5 px-3 font-mono">
                        <div className="text-[#0B132B] font-bold">${totalExpense.toFixed(2)}</div>
                        {costPerKm > 0 && (
                          <div className="text-[10px] text-[#16A36A] font-semibold">${costPerKm}/km</div>
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
                            <span className="text-[10px] text-[#E05252] font-bold">Delete?</span>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteTrip && onDeleteTrip(trip.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-2 py-0.5 rounded-lg bg-[#EF4444] text-white text-[10px] font-bold hover:bg-[#DC2626]"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-0.5 rounded-lg bg-[#F1F5F9] text-[#475569] text-[10px] font-bold hover:bg-[#E2E8F0]"
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
                                className="p-1.5 rounded-lg hover:bg-[#E8F7F0] text-[#16A36A] transition-colors"
                                title="Start Trip"
                              >
                                <Play className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {(trip.status === 'In Progress' || trip.status === 'Delayed') && (
                              <button
                                type="button"
                                onClick={() => onStatusTransition && onStatusTransition(trip.id, 'Completed')}
                                className="p-1.5 rounded-lg hover:bg-[#E8F7F0] text-[#16A36A] transition-colors"
                                title="Complete Trip"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* View Details */}
                            <button
                              type="button"
                              onClick={() => onViewDetails && onViewDetails(trip)}
                              className="p-1.5 rounded-lg hover:bg-[#EAF3FF] text-[#2879E8] transition-colors"
                              title="View Trip Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Trip */}
                            {trip.status !== 'Completed' && trip.status !== 'Cancelled' && (
                              <button
                                type="button"
                                onClick={() => onEditTrip && onEditTrip(trip)}
                                className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0B132B] transition-colors"
                                title="Edit Trip"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete Trip */}
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(trip.id)}
                              className="p-1.5 rounded-lg hover:bg-[#FEF2F2] text-[#64748B] hover:text-[#E05252] transition-colors"
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
        <div className="py-2.5 px-4 bg-[#F8FAFD] border-t border-[#E2E8F0] text-[11px] font-mono text-[#64748B] flex items-center justify-between font-bold">
          <span>Showing {filteredTrips.length} of {trips.length} total trips</span>
          <span>AUTRAIL Dispatch Matrix</span>
        </div>
      </div>
    </div>
  );
}
