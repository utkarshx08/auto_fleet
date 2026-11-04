import React from 'react';
import {
  MapPin,
  Truck,
  User,
  Clock,
  ArrowRight,
  DollarSign,
  AlertCircle,
  Eye,
  CheckCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import TripStatusBadge from './TripStatusBadge';
import { calculateTripExpenses } from '../../services/tripService';

export default function TripCard({
  trip,
  onViewDetails,
  onEdit,
  onStatusTransition,
  className = ''
}) {
  if (!trip) return null;

  const { totalExpense, costPerKm, effectiveDistance } = calculateTripExpenses(trip);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return (
          <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#381e24] text-[#f87171] border border-[#5c2d36] font-semibold">
            High Priority
          </span>
        );
      case 'Medium':
        return (
          <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#2c281a] text-[#fcd34d] border border-[#4d4022]">
            Med Priority
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#1c222b] text-[#93c5fd] border border-[#26374a]">
            Low Priority
          </span>
        );
    }
  };

  const formatDateTime = (isoStr) => {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
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

  const actualDist = Number(trip.actualDistanceKm) || 0;
  const estDist = Number(trip.estimatedDistanceKm) || 0;
  const progressPercent = estDist > 0 && actualDist > 0
    ? Math.min(100, Math.round((actualDist / estDist) * 100))
    : trip.status === 'Completed' ? 100 : 0;

  return (
    <article
      className={`bg-[#17191f] border border-[#292c35] hover:border-[#383c4a] rounded-[10px] p-5 flex flex-col justify-between transition-all duration-200 group relative ${className}`}
    >
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-[#ad91ff] bg-[#24212f] px-2 py-0.5 rounded border border-[#3b3252]">
              {trip.id}
            </span>
            {getPriorityBadge(trip.priority)}
          </div>
          <TripStatusBadge status={trip.status} size="sm" />
        </div>

        <h3 className="text-base font-semibold text-[#f0f0f4] group-hover:text-[#c4b3ff] transition-colors leading-snug line-clamp-1 mb-1">
          {trip.tripName}
        </h3>
        <p className="text-xs text-[#8b8e9a] mb-4 truncate">
          Client: <span className="text-[#d4d4dc] font-medium">{trip.customerName}</span>
        </p>

        {/* Route Overview */}
        <div className="bg-[#121319] border border-[#252732] rounded-[8px] p-3 mb-4 space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-[#1e293b] border border-[#334155] text-[#94a3b8] flex items-center justify-center shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8be0b3]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase font-mono text-[#747683] leading-none mb-0.5">Pickup</p>
              <p className="text-xs text-[#e0e0e7] truncate">{trip.pickupLocation}</p>
            </div>
          </div>

          {Array.isArray(trip.stops) && trip.stops.length > 0 && (
            <div className="pl-6 border-l-2 border-dashed border-[#2f3240] ml-2 my-1">
              <span className="text-[10px] font-mono text-[#c4b3ff] bg-[#24212f] px-2 py-0.5 rounded border border-[#38314e]">
                +{trip.stops.length} intermediate waypoint{trip.stops.length > 1 ? 's' : ''}
              </span>
            </div>
          )}

          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-[#1e293b] border border-[#334155] text-[#94a3b8] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-[#f87171]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase font-mono text-[#747683] leading-none mb-0.5">Destination</p>
              <p className="text-xs text-[#e0e0e7] truncate">{trip.destinationLocation}</p>
            </div>
          </div>
        </div>

        {/* Journey Progress for Active / Delayed Trips */}
        {(trip.status === 'In Progress' || trip.status === 'Delayed') && (
          <div className="mb-4 bg-[#14161d] p-2.5 rounded-[7px] border border-[#262834]">
            <div className="flex justify-between text-[11px] font-mono text-[#a0a3b1] mb-1.5">
              <span>Progress ({progressPercent}%)</span>
              <span>{actualDist} / {estDist} km</span>
            </div>
            <div className="w-full h-1.5 bg-[#252834] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  trip.status === 'Delayed' ? 'bg-[#f59e0b]' : 'bg-[#10b981]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="flex items-center gap-2 text-[#9a9ca8]">
            <Truck className="w-3.5 h-3.5 text-[#ad91ff] shrink-0" />
            <span className="font-mono text-[#e0e0e7] truncate">
              {trip.assignedVehicleId || 'Unassigned'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#9a9ca8]">
            <User className="w-3.5 h-3.5 text-[#8be0b3] shrink-0" />
            <span className="truncate text-[#e0e0e7]">
              {trip.assignedDriverId || 'Unassigned'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#9a9ca8]">
            <Clock className="w-3.5 h-3.5 text-[#70cbb7] shrink-0" />
            <span className="truncate text-[11px]">
              Dep: {formatDateTime(trip.actualDeparture || trip.scheduledDeparture)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#9a9ca8]">
            <DollarSign className="w-3.5 h-3.5 text-[#fcd34d] shrink-0" />
            <span className="font-mono text-[#e0e0e7]">
              ${totalExpense.toFixed(2)}
              {costPerKm > 0 && (
                <span className="text-[10px] text-[#747683] ml-1">(${costPerKm}/km)</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-[#252732] flex items-center justify-between gap-2 mt-auto">
        <button
          type="button"
          onClick={() => onViewDetails && onViewDetails(trip)}
          className="flex items-center gap-1.5 text-xs text-[#ad91ff] hover:text-[#c4b3ff] font-medium transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>

        <div className="flex items-center gap-1.5">
          {trip.status === 'Scheduled' || trip.status === 'Assigned' ? (
            <button
              type="button"
              onClick={() => onStatusTransition && onStatusTransition(trip.id, 'In Progress')}
              className="flex items-center gap-1 bg-[#122822] hover:bg-[#1a3830] text-[#6ee7b7] border border-[#1d4c3e] px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
              title="Start Trip"
            >
              <Play className="w-3 h-3" />
              <span>Start</span>
            </button>
          ) : null}

          {trip.status === 'In Progress' || trip.status === 'Delayed' ? (
            <button
              type="button"
              onClick={() => onStatusTransition && onStatusTransition(trip.id, 'Completed')}
              className="flex items-center gap-1 bg-[#142921] hover:bg-[#1f3f33] text-[#70cbb7] border border-[#20493b] px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer"
              title="Complete Trip"
            >
              <CheckCircle className="w-3 h-3" />
              <span>Complete</span>
            </button>
          ) : null}

          {onEdit && trip.status !== 'Completed' && trip.status !== 'Cancelled' && (
            <button
              type="button"
              onClick={() => onEdit(trip)}
              className="text-[#858894] hover:text-[#f0f0f4] px-2 py-1 text-[11px] rounded hover:bg-[#252732] transition-colors cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
