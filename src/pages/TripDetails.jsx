import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Truck,
  User,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw,
  Edit2,
  Trash2,
  FileText,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import Button from '../components/common/Button';
import TripStatusBadge from '../components/trips/TripStatusBadge';
import TripTimeline from '../components/trips/TripTimeline';
import TripMap from '../components/trips/TripMap';
import CreateTripModal from '../components/trips/CreateTripModal';
import {
  getTripById,
  updateTripStatus,
  deleteTrip,
  calculateTripExpenses,
  canTransitionTripStatus,
  TRIP_STATUSES
} from '../services/tripService';
import { initialGeofenceAlerts } from '../data/geofenceMockData';

export default function TripDetails({
  vehicles = [],
  drivers = [],
  onShowToast
}) {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [targetStatus, setTargetStatus] = useState('');
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);

  // Load Trip
  useEffect(() => {
    if (tripId) {
      const found = getTripById(tripId);
      setTrip(found);
    }
  }, [tripId, refreshKey]);

  // Correlate Vehicle & Driver Objects
  const assignedVehicle = useMemo(() => {
    if (!trip?.assignedVehicleId) return null;
    return vehicles.find(
      (v) => v.id === trip.assignedVehicleId || v.plate === trip.assignedVehicleId
    );
  }, [trip?.assignedVehicleId, vehicles]);

  const assignedDriver = useMemo(() => {
    if (!trip?.assignedDriverId) return null;
    return drivers.find(
      (d) => d.id === trip.assignedDriverId || d.name === trip.assignedDriverId
    );
  }, [trip?.assignedDriverId, drivers]);

  // Correlate Geofence Alerts for this vehicle
  const correlatedGeofenceEvents = useMemo(() => {
    if (!trip?.assignedVehicleId) return [];
    return initialGeofenceAlerts.filter(
      (a) => a.vehicleId === trip.assignedVehicleId || a.plate === trip.assignedVehicleId
    );
  }, [trip?.assignedVehicleId]);

  if (!trip) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#f0f0f4]">Trip Not Found</h2>
        <p className="text-sm text-[#858894]">No trip record exists matching identifier "{tripId}".</p>
        <Button variant="primary" onClick={() => navigate('/trips')} icon={ArrowLeft}>
          Return to Trips
        </Button>
      </div>
    );
  }

  const { totalExpense, costPerKm, breakdown } = calculateTripExpenses(trip);

  const formatDateTime = (iso) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return '—';
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '—';
    }
  };

  const handleOpenTransition = (status) => {
    setTargetStatus(status);
    setStatusNote('');
    setIsTransitionModalOpen(true);
  };

  const handleConfirmTransition = () => {
    if (!targetStatus) return;
    try {
      const updated = updateTripStatus(
        trip.id,
        targetStatus,
        statusNote || `Transitioned to ${targetStatus}`,
        'Fleet Coordinator'
      );
      setTrip(updated);
      setRefreshKey((p) => p + 1);
      setIsTransitionModalOpen(false);
      if (onShowToast) {
        onShowToast(`Trip status transitioned to "${targetStatus}".`, 'success');
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast(err.message, 'error');
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete trip ${trip.id}? This action cannot be undone.`)) {
      try {
        deleteTrip(trip.id);
        if (onShowToast) onShowToast(`Trip ${trip.id} deleted.`, 'warning');
        navigate('/trips');
      } catch (err) {
        if (onShowToast) onShowToast(err.message, 'error');
      }
    }
  };

  // Determine allowed transitions
  const availableTransitions = TRIP_STATUSES.filter(
    (st) => st !== trip.status && canTransitionTripStatus(trip.status, st).allowed
  );

  return (
    <div className="space-y-6 text-xs text-[#d4d4dc]">
      {/* Top Navigation & Actions Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
        <button
          type="button"
          onClick={() => navigate('/trips')}
          className="flex items-center gap-2 text-xs text-[#ad91ff] hover:text-[#c4b3ff] transition-colors font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Trips</span>
        </button>

        <div className="flex items-center gap-2">
          {trip.status !== 'Completed' && trip.status !== 'Cancelled' && (
            <Button
              variant="quiet"
              onClick={() => setIsEditModalOpen(true)}
              icon={Edit2}
            >
              Edit Manifest
            </Button>
          )}

          <Button
            variant="quiet"
            onClick={handleDelete}
            icon={Trash2}
            className="text-[#f87171] hover:text-[#fca5a5]"
          >
            Delete Trip
          </Button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-6 space-y-4">
        <div className="flex items-start justify-between gap-4 max-md:flex-col max-md:items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-[#b49aff] bg-[#24212f] px-2.5 py-1 rounded border border-[#3b3252]">
                {trip.id}
              </span>
              <TripStatusBadge status={trip.status} size="md" />
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#20232e] text-[#a0a3b1] border border-[#313544]">
                {trip.priority} Priority
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#f0f0f4] m-0 leading-snug">
              {trip.tripName}
            </h1>
            <p className="text-xs text-[#858894] m-0">
              Customer: <b className="text-[#e0e0e7] font-semibold">{trip.customerName}</b>
            </p>
          </div>

          {/* Quick Transition Controls */}
          {availableTransitions.length > 0 && (
            <div className="bg-[#121319] border border-[#2b2e38] p-3 rounded-[8px] space-y-2">
              <span className="text-[10px] font-mono text-[#858894] uppercase tracking-[1px] block">
                Update Trip Status:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {availableTransitions.map((target) => (
                  <button
                    key={target}
                    type="button"
                    onClick={() => handleOpenTransition(target)}
                    className="px-2.5 py-1 rounded bg-[#24212f] hover:bg-[#322c42] text-[#c4b3ff] border border-[#3f3558] text-xs font-medium transition-colors cursor-pointer"
                  >
                    → Mark {target}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick KPI Metric Bar */}
        <div className="grid grid-cols-4 gap-3 pt-4 border-t border-[#252834] max-lg:grid-cols-2 max-sm:grid-cols-1 font-mono">
          <div className="bg-[#121319] p-3 rounded-[7px] border border-[#232530]">
            <span className="text-[10px] text-[#747683] uppercase block">Departure</span>
            <div className="text-sm font-bold text-[#f0f0f4] my-0.5">
              {formatDateTime(trip.actualDeparture || trip.scheduledDeparture)}
            </div>
            <span className="text-[10px] text-[#858894]">
              {trip.actualDeparture ? 'Actual Departure' : 'Scheduled Departure'}
            </span>
          </div>

          <div className="bg-[#121319] p-3 rounded-[7px] border border-[#232530]">
            <span className="text-[10px] text-[#747683] uppercase block">Arrival</span>
            <div className="text-sm font-bold text-[#f0f0f4] my-0.5">
              {formatDateTime(trip.actualArrival || trip.scheduledArrival)}
            </div>
            <span className="text-[10px] text-[#858894]">
              {trip.actualArrival ? 'Actual Arrival' : 'Expected Arrival'}
            </span>
          </div>

          <div className="bg-[#121319] p-3 rounded-[7px] border border-[#232530]">
            <span className="text-[10px] text-[#747683] uppercase block">Distance</span>
            <div className="text-sm font-bold text-[#b49aff] my-0.5">
              {Number(trip.actualDistanceKm) > 0 ? `${trip.actualDistanceKm} km` : `${trip.estimatedDistanceKm} km (Est.)`}
            </div>
            <span className="text-[10px] text-[#858894]">
              Planned: {trip.estimatedDistanceKm} km
            </span>
          </div>

          <div className="bg-[#121319] p-3 rounded-[7px] border border-[#232530]">
            <span className="text-[10px] text-[#747683] uppercase block">Expenses & Unit Cost</span>
            <div className="text-sm font-bold text-[#6ee7b7] my-0.5">
              ${totalExpense.toFixed(2)}
            </div>
            <span className="text-[10px] text-[#858894]">
              {costPerKm > 0 ? `$${costPerKm} / km` : 'Cost/km pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-3 gap-6 max-xl:grid-cols-1">
        {/* Left Column (2 Cols wide): Route Waypoints, Map & Fleet Profiles */}
        <div className="col-span-2 space-y-6">
          {/* Live Route & Tracking Map */}
          <div className="bg-[#17191f] border border-[#292c35] p-5 rounded-[10px] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-[1px] text-[#b49aff] m-0 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Live Route & GPS Telemetry Tracking</span>
              </h3>
              <span className="font-mono text-[10px] text-[#858894]">MapLibre Vector Engine</span>
            </div>
            <TripMap trip={trip} vehicle={assignedVehicle} height="360px" />
          </div>

          {/* Route & Waypoint Navigation */}
          <div className="bg-[#17191f] border border-[#292c35] p-5 rounded-[10px] space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-[1px] text-[#b49aff] m-0 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Route & Waypoint Progress</span>
            </h3>

            <div className="space-y-3 bg-[#121319] border border-[#252834] p-4 rounded-[8px]">
              {/* Origin */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#182a22] border border-[#234b3c] text-[#6ee7b7] flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] text-[#747683] uppercase">Starting Pickup</span>
                  <p className="text-sm font-medium text-[#f0f0f4] m-0">{trip.pickupLocation}</p>
                  <span className="text-[10px] text-[#858894] font-mono">
                    Coords: {trip.pickupCoords?.lat || 40.7128}, {trip.pickupCoords?.lng || -74.006}
                  </span>
                </div>
              </div>

              {/* Intermediate Stops */}
              {Array.isArray(trip.stops) && trip.stops.length > 0 && (
                <div className="pl-9 space-y-3 border-l-2 border-dashed border-[#2f3240] ml-3 my-2">
                  {trip.stops.map((stop, idx) => (
                    <div key={stop.id || idx} className="bg-[#17191f] border border-[#272935] p-2.5 rounded-[6px]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#ad91ff]">Stop #{stop.order || idx + 1}</span>
                        <span className="font-mono text-[10px] text-[#70cbb7]">{stop.status || 'Pending'}</span>
                      </div>
                      <p className="text-xs font-medium text-[#e0e0e7] my-0.5">{stop.locationName}</p>
                      {stop.notes && <p className="text-[11px] text-[#858894] m-0">{stop.notes}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Destination */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#321d22] border border-[#542931] text-[#f87171] flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                  B
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] text-[#747683] uppercase">Final Destination</span>
                  <p className="text-sm font-medium text-[#f0f0f4] m-0">{trip.destinationLocation}</p>
                  <span className="text-[10px] text-[#858894] font-mono">
                    Coords: {trip.destinationCoords?.lat || 40.7589}, {trip.destinationCoords?.lng || -73.9851}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle & Driver Details Grid */}
          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            {/* Vehicle Profile */}
            <div className="bg-[#17191f] border border-[#292c35] p-4 rounded-[10px] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-[1px] text-[#858894] m-0 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#ad91ff]" />
                  <span>Assigned Vehicle</span>
                </h4>
                {assignedVehicle && (
                  <span className="font-mono text-[10px] text-[#6ee7b7] bg-[#122822] px-1.5 py-0.5 rounded border border-[#1d4c3e]">
                    {assignedVehicle.status}
                  </span>
                )}
              </div>

              {assignedVehicle ? (
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between border-b border-[#242631] pb-1.5">
                    <span className="text-[#858894]">Plate:</span>
                    <b className="text-[#f0f0f4]">{assignedVehicle.plate}</b>
                  </div>
                  <div className="flex justify-between border-b border-[#242631] pb-1.5">
                    <span className="text-[#858894]">Model:</span>
                    <span className="text-[#e0e0e7]">{assignedVehicle.model} ({assignedVehicle.year})</span>
                  </div>
                  <div className="flex justify-between border-b border-[#242631] pb-1.5">
                    <span className="text-[#858894]">Fuel Level:</span>
                    <span className="text-[#8be0b3]">{assignedVehicle.fuel}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#858894]">Odometer:</span>
                    <span className="text-[#e0e0e7]">{assignedVehicle.odometer?.toLocaleString()} km</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#747683] italic">No vehicle assigned to this trip.</p>
              )}
            </div>

            {/* Driver Profile */}
            <div className="bg-[#17191f] border border-[#292c35] p-4 rounded-[10px] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-[1px] text-[#858894] m-0 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8be0b3]" />
                  <span>Assigned Driver</span>
                </h4>
                {assignedDriver && (
                  <span className="font-mono text-[10px] text-[#ad91ff] bg-[#24212f] px-1.5 py-0.5 rounded border border-[#38314e]">
                    ★ {assignedDriver.rating || 4.9}
                  </span>
                )}
              </div>

              {assignedDriver ? (
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between border-b border-[#242631] pb-1.5">
                    <span className="text-[#858894]">Name:</span>
                    <b className="text-[#f0f0f4]">{assignedDriver.name}</b>
                  </div>
                  <div className="flex justify-between border-b border-[#242631] pb-1.5">
                    <span className="text-[#858894]">Phone:</span>
                    <span className="text-[#e0e0e7]">{assignedDriver.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#242631] pb-1.5">
                    <span className="text-[#858894]">License:</span>
                    <span className="text-[#e0e0e7]">{assignedDriver.license}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#858894]">Completed Trips:</span>
                    <span className="text-[#6ee7b7]">{assignedDriver.tripsCompleted || 0}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#747683] italic">No driver assigned to this trip.</p>
              )}
            </div>
          </div>

          {/* Cargo Details & Notes */}
          <div className="bg-[#17191f] border border-[#292c35] p-4 rounded-[10px] space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-[1px] text-[#858894] m-0 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-[#fcd34d]" />
              <span>Cargo Specifications & Dispatch Notes</span>
            </h4>
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <div className="bg-[#121319] p-3 rounded-[7px] border border-[#242631]">
                <span className="text-[10px] font-mono uppercase text-[#747683] block mb-1">Cargo Description</span>
                <p className="text-xs text-[#e0e0e7] m-0">
                  {trip.cargoDetails || 'Standard commercial package cargo.'}
                </p>
              </div>
              <div className="bg-[#121319] p-3 rounded-[7px] border border-[#242631]">
                <span className="text-[10px] font-mono uppercase text-[#747683] block mb-1">Operational Instructions</span>
                <p className="text-xs text-[#e0e0e7] m-0">
                  {trip.notes || 'No special handling instructions provided.'}
                </p>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-[#17191f] border border-[#292c35] p-5 rounded-[10px] space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-[1px] text-[#b49aff] m-0 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Lifecycle Status History & Activity Timeline</span>
            </h3>
            <TripTimeline history={trip.statusHistory} currentStatus={trip.status} />
          </div>
        </div>

        {/* Right Column (1 Col wide): Expenses, Correlated Geofences, Report Trigger */}
        <div className="space-y-6">
          {/* Trip Expense Summary */}
          <div className="bg-[#17191f] border border-[#292c35] p-4 rounded-[10px] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-[1px] text-[#858894] m-0 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#6ee7b7]" />
                <span>Recorded Expenses</span>
              </h3>
              <span className="font-mono text-sm font-bold text-[#6ee7b7]">
                ${totalExpense.toFixed(2)}
              </span>
            </div>

            {Array.isArray(trip.expenses) && trip.expenses.length > 0 ? (
              <div className="divide-y divide-[#242631] text-xs">
                {trip.expenses.map((exp, idx) => (
                  <div key={exp.id || idx} className="py-2 flex items-center justify-between gap-2">
                    <div>
                      <b className="text-[#f0f0f4] block text-[11px]">{exp.type}</b>
                      <span className="text-[10px] text-[#858894] truncate block max-w-[160px]">
                        {exp.description || 'Receipt logged'}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[#e0e0e7] shrink-0">
                      ${Number(exp.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#747683] italic">No expenses recorded for this trip.</p>
            )}

            <div className="pt-2 border-t border-[#252834] font-mono text-[11px] flex justify-between text-[#858894]">
              <span>Cost Per Kilometer:</span>
              <span className="text-[#6ee7b7] font-bold">
                {costPerKm > 0 ? `$${costPerKm}/km` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Correlated Geofence Alerts for Vehicle */}
          <div className="bg-[#17191f] border border-[#292c35] p-4 rounded-[10px] space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-[1px] text-[#858894] m-0 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#f87171]" />
              <span>Geofence & Safety Events</span>
            </h3>

            {correlatedGeofenceEvents.length > 0 ? (
              <div className="space-y-2">
                {correlatedGeofenceEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-[7px] bg-[#1a1417] border border-[#44232a] space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#f87171]">
                      <span>{evt.geofenceName}</span>
                      <span>{evt.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#e0e0e7] m-0 leading-tight">{evt.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#747683] italic">No geofence breaches or safety violations recorded.</p>
            )}
          </div>
        </div>
      </div>

      {/* Status Transition Modal */}
      {isTransitionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#17191f] border border-[#2b2e38] rounded-xl shadow-2xl p-6 text-[#f0f0f4] space-y-4">
            <h3 className="text-base font-bold text-[#f0f0f4] m-0">
              Confirm Status Transition: <span className="text-[#b49aff]">{targetStatus}</span>
            </h3>
            <p className="text-xs text-[#858894]">
              You are about to change trip <span className="font-mono text-[#e0e0e7]">{trip.id}</span> from{' '}
              <b className="text-[#f0f0f4]">{trip.status}</b> to <b className="text-[#b49aff]">{targetStatus}</b>.
            </p>

            <div>
              <label className="block text-[11px] font-mono text-[#858894] uppercase tracking-[1px] mb-1.5">
                Transition Notes / Reason
              </label>
              <textarea
                rows="3"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Provide mandatory dispatch audit notes for this status change..."
                className="w-full bg-[#121319] border border-[#2b2e38] text-xs text-[#f0f0f4] p-2.5 rounded-[7px] focus:outline-none focus:border-[#ad91ff] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#252834]">
              <Button
                variant="quiet"
                onClick={() => setIsTransitionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmTransition}
              >
                Confirm Transition
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <CreateTripModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialTrip={trip}
        vehicles={vehicles}
        drivers={drivers}
        onTripSaved={(updated) => {
          setTrip(updated);
          setRefreshKey((p) => p + 1);
        }}
      />
    </div>
  );
}
