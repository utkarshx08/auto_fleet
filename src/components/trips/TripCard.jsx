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
          <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-md bg-[#FEF2F2] text-[#E05252] border border-[#FECACA] font-bold">
            High Priority
          </span>
        );
      case 'Medium':
        return (
          <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#D97706] border-[#FDE68A] font-bold">
            Med Priority
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-md bg-[#EAF3FF] text-[#2879E8] border border-[#2879E8]/20 font-bold">
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
      className={`glass-card border border-white/95 rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl group relative text-[#172033] ${className}`}
    >
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-[#2879E8] bg-[#EAF3FF] px-2.5 py-0.5 rounded-md border border-[#2879E8]/20">
              {trip.id}
            </span>
            {getPriorityBadge(trip.priority)}
          </div>
          <TripStatusBadge status={trip.status} size="sm" />
        </div>

        <h3 className="text-base font-bold text-[#172033] group-hover:text-[#2879E8] transition-colors leading-snug line-clamp-1 mb-1">
          {trip.tripName}
        </h3>
        <p className="text-xs text-[#68758A] mb-4 truncate font-sans">
          Client: <span className="text-[#172033] font-semibold">{trip.customerName}</span>
        </p>

        {/* Route Overview */}
        <div className="bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl p-3.5 mb-4 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase font-mono text-[#8A97AB] leading-none mb-0.5 font-semibold">Pickup</p>
              <p className="text-xs text-[#172033] font-medium truncate">{trip.pickupLocation}</p>
            </div>
          </div>

          {Array.isArray(trip.stops) && trip.stops.length > 0 && (
            <div className="pl-6 border-l-2 border-dashed border-[#D5E2F1] ml-2 my-1">
              <span className="text-[10px] font-mono font-bold text-[#2879E8] bg-white px-2 py-0.5 rounded-md border border-[#D5E2F1]">
                +{trip.stops.length} intermediate waypoint{trip.stops.length > 1 ? 's' : ''}
              </span>
            </div>
          )}

          <div className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-[#E05252]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase font-mono text-[#8A97AB] leading-none mb-0.5 font-semibold">Destination</p>
              <p className="text-xs text-[#172033] font-medium truncate">{trip.destinationLocation}</p>
            </div>
          </div>
        </div>

        {/* Journey Progress for Active / Delayed Trips */}
        {(trip.status === 'In Progress' || trip.status === 'Delayed') && (
          <div className="mb-4 bg-[#F0F5FC] p-3 rounded-xl border border-[#D5E2F1]">
            <div className="flex justify-between text-xs font-mono text-[#68758A] mb-1.5 font-medium">
              <span>Progress ({progressPercent}%)</span>
              <span>{actualDist} / {estDist} km</span>
            </div>
            <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  trip.status === 'Delayed' ? 'bg-[#D97706]' : 'bg-[#16A36A]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs mb-4">
          <div className="flex items-center gap-2 text-[#68758A]">
            <Truck className="w-3.5 h-3.5 text-[#2879E8] shrink-0" />
            <span className="font-mono text-[#172033] font-bold truncate">
              {trip.assignedVehicleId || 'Unassigned'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#68758A]">
            <User className="w-3.5 h-3.5 text-[#16A36A] shrink-0" />
            <span className="truncate text-[#172033] font-medium">
              {trip.assignedDriverId || 'Unassigned'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#68758A]">
            <Clock className="w-3.5 h-3.5 text-[#8A97AB] shrink-0" />
            <span className="truncate text-[11px] font-mono">
              Dep: {formatDateTime(trip.actualDeparture || trip.scheduledDeparture)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#68758A]">
            <DollarSign className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
            <span className="font-mono text-[#172033] font-bold">
              ${totalExpense.toFixed(2)}
              {costPerKm > 0 && (
                <span className="text-[10px] text-[#8A97AB] ml-1 font-normal">(${costPerKm}/km)</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3.5 border-t border-[#E2E8F0] flex items-center justify-between gap-2 mt-auto">
        <button
          type="button"
          onClick={() => onViewDetails && onViewDetails(trip)}
          className="flex items-center gap-1.5 text-xs text-[#2879E8] hover:text-[#1765CC] font-bold transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>Details</span>
        </button>

        <div className="flex items-center gap-2">
          {trip.status === 'Scheduled' || trip.status === 'Assigned' ? (
            <button
              type="button"
              onClick={() => onStatusTransition && onStatusTransition(trip.id, 'In Progress')}
              className="flex items-center gap-1.5 bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#16A36A] border border-[#BBF7D0] px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              title="Start Trip"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start</span>
            </button>
          ) : null}

          {trip.status === 'In Progress' || trip.status === 'Delayed' ? (
            <button
              type="button"
              onClick={() => onStatusTransition && onStatusTransition(trip.id, 'Completed')}
              className="flex items-center gap-1.5 bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#16A36A] border border-[#BBF7D0] px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              title="Complete Trip"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Complete</span>
            </button>
          ) : null}

          {onEdit && trip.status !== 'Completed' && trip.status !== 'Cancelled' && (
            <button
              type="button"
              onClick={() => onEdit(trip)}
              className="text-[#68758A] hover:text-[#172033] px-2.5 py-1 text-xs rounded-lg hover:bg-[#F8FAFD] transition-colors cursor-pointer font-medium border border-[#E2E8F0]"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
