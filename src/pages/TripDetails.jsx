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
import TripExpenseModal from '../components/trips/TripExpenseModal';
import TripReportModal from '../components/trips/TripReportModal';
import {
  getTripById,
  updateTripStatus,
  deleteTrip,
  deleteTripExpense,
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
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [targetStatus, setTargetStatus] = useState('');
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);

  const handleDeleteExpense = (expenseId) => {
    try {
      const updated = deleteTripExpense(trip.id, expenseId);
      setTrip(updated);
      setRefreshKey((p) => p + 1);
      if (onShowToast) onShowToast('Expense item removed.', 'info');
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    }
  };

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
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#172033]">Trip Not Found</h2>
        <p className="text-sm text-[#68758A]">No trip record exists matching identifier "{tripId}".</p>
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
    <div className="space-y-6 text-xs text-[#172033]">
      {/* Top Navigation & Actions Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap pt-1">
        <button
          type="button"
          onClick={() => navigate('/trips')}
          className="flex items-center gap-2 text-xs text-[#2879E8] hover:text-[#1765CC] transition-colors font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Trips</span>
        </button>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            onClick={() => setIsReportModalOpen(true)}
            icon={FileText}
          >
            Completion Manifest
          </Button>

          {trip.status !== 'Completed' && trip.status !== 'Cancelled' && (
            <Button
              variant="default"
              onClick={() => setIsEditModalOpen(true)}
              icon={Edit2}
            >
              Edit Manifest
            </Button>
          )}

          <Button
            variant="danger"
            onClick={handleDelete}
            icon={Trash2}
          >
            Delete Trip
          </Button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="glass-card rounded-2xl p-6 space-y-5 shadow-liquid-subtle">
        <div className="flex items-start justify-between gap-4 max-md:flex-col max-md:items-start">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#2879E8] bg-[#EAF3FF] px-2.5 py-1 rounded-lg border border-[#D5E6FB]">
                {trip.id}
              </span>
              <TripStatusBadge status={trip.status} size="md" />
              <span className="font-mono text-[10px] uppercase px-2.5 py-1 rounded-lg bg-[#F8FAFD] text-[#68758A] border border-[#E2E8F0] font-semibold">
                {trip.priority} Priority
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#0B132B] m-0 tracking-tight leading-snug">
              {trip.tripName}
            </h1>
            <p className="text-xs text-[#475569] m-0 font-medium">
              Customer: <b className="text-[#0B132B] font-bold">{trip.customerName}</b>
            </p>
          </div>

          {/* Quick Transition Controls */}
          {availableTransitions.length > 0 && (
            <div className="bg-[#F8FAFD] border border-[#D5E2F1] p-3 rounded-xl space-y-2 shadow-2xs">
              <span className="text-[10px] font-mono text-[#68758A] uppercase tracking-wider block font-semibold">
                Update Trip Status:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {availableTransitions.map((target) => (
                  <button
                    key={target}
                    type="button"
                    onClick={() => handleOpenTransition(target)}
                    className="px-3 py-1 rounded-lg bg-white hover:bg-[#EAF3FF] text-[#2879E8] border border-[#D5E6FB] text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                  >
                    → Mark {target}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick KPI Metric Bar */}
        <div className="grid grid-cols-4 gap-3.5 pt-4 border-t border-[#E2E8F0] max-lg:grid-cols-2 max-sm:grid-cols-1 font-mono">
          <div className="bg-[#F8FAFD] p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
            <span className="text-[10px] text-[#68758A] uppercase block font-semibold">Departure</span>
            <div className="text-sm font-bold text-[#172033] my-1">
              {formatDateTime(trip.actualDeparture || trip.scheduledDeparture)}
            </div>
            <span className="text-[10px] text-[#8A97AB]">
              {trip.actualDeparture ? 'Actual Departure' : 'Scheduled Departure'}
            </span>
          </div>

          <div className="bg-[#F8FAFD] p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
            <span className="text-[10px] text-[#68758A] uppercase block font-semibold">Arrival</span>
            <div className="text-sm font-bold text-[#172033] my-1">
              {formatDateTime(trip.actualArrival || trip.scheduledArrival)}
            </div>
            <span className="text-[10px] text-[#8A97AB]">
              {trip.actualArrival ? 'Actual Arrival' : 'Expected Arrival'}
            </span>
          </div>

          <div className="bg-[#F8FAFD] p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
            <span className="text-[10px] text-[#68758A] uppercase block font-semibold">Distance</span>
            <div className="text-sm font-bold text-[#2879E8] my-1">
              {Number(trip.actualDistanceKm) > 0 ? `${trip.actualDistanceKm} km` : `${trip.estimatedDistanceKm} km (Est.)`}
            </div>
            <span className="text-[10px] text-[#8A97AB]">
              Planned: {trip.estimatedDistanceKm} km
            </span>
          </div>

          <div className="bg-[#F8FAFD] p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
            <span className="text-[10px] text-[#68758A] uppercase block font-semibold">Expenses & Unit Cost</span>
            <div className="text-sm font-bold text-[#16A36A] my-1">
              ${totalExpense.toFixed(2)}
            </div>
            <span className="text-[10px] text-[#8A97AB]">
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
          <div className="glass-card rounded-2xl p-5 space-y-3.5 shadow-liquid-subtle">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#2879E8] m-0 flex items-center gap-2 font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Live Route & GPS Telemetry Tracking</span>
              </h3>
              <span className="font-mono text-[10px] text-[#8A97AB]">MapLibre Vector Engine</span>
            </div>
            <TripMap trip={trip} vehicle={assignedVehicle} height="360px" />
          </div>

          {/* Route & Waypoint Navigation */}
          <div className="glass-card rounded-2xl p-5 space-y-4 shadow-liquid-subtle">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#2879E8] m-0 flex items-center gap-2 font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Route & Waypoint Progress</span>
            </h3>

            <div className="space-y-3 bg-[#F8FAFD] border border-[#D5E2F1] p-4 rounded-xl shadow-2xs">
              {/* Origin */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E8F7F0] border border-[#C2E8D7] text-[#16A36A] flex items-center justify-center shrink-0 font-mono text-[10px] font-bold shadow-2xs">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] text-[#68758A] uppercase font-semibold">Starting Pickup</span>
                  <p className="text-sm font-semibold text-[#172033] m-0">{trip.pickupLocation}</p>
                  <span className="text-[10px] text-[#8A97AB] font-mono">
                    Coords: {trip.pickupCoords?.lat || 40.7128}, {trip.pickupCoords?.lng || -74.006}
                  </span>
                </div>
              </div>

              {/* Intermediate Stops */}
              {Array.isArray(trip.stops) && trip.stops.length > 0 && (
                <div className="pl-9 space-y-3 border-l-2 border-dashed border-[#CBD5E1] ml-3 my-2">
                  {trip.stops.map((stop, idx) => (
                    <div key={stop.id || idx} className="bg-white border border-[#E2E8F0] p-3 rounded-xl shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#2879E8] font-bold">Stop #{stop.order || idx + 1}</span>
                        <span className="font-mono text-[10px] text-[#16A36A] font-semibold">{stop.status || 'Pending'}</span>
                      </div>
                      <p className="text-xs font-semibold text-[#172033] my-0.5">{stop.locationName}</p>
                      {stop.notes && <p className="text-[11px] text-[#68758A] m-0">{stop.notes}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Destination */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FDF2F2] border border-[#FAD2D2] text-[#E05252] flex items-center justify-center shrink-0 font-mono text-[10px] font-bold shadow-2xs">
                  B
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] text-[#68758A] uppercase font-semibold">Final Destination</span>
                  <p className="text-sm font-semibold text-[#172033] m-0">{trip.destinationLocation}</p>
                  <span className="text-[10px] text-[#8A97AB] font-mono">
                    Coords: {trip.destinationCoords?.lat || 40.7589}, {trip.destinationCoords?.lng || -73.9851}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle & Driver Details Grid */}
          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            {/* Vehicle Profile */}
            <div className="glass-card rounded-2xl p-5 space-y-3 shadow-liquid-subtle">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#68758A] m-0 flex items-center gap-1.5 font-semibold">
                  <Truck className="w-3.5 h-3.5 text-[#2879E8]" />
                  <span>Assigned Vehicle</span>
                </h4>
                {assignedVehicle && (
                  <span className="font-mono text-[10px] text-[#16A36A] bg-[#E8F7F0] px-2 py-0.5 rounded-full border border-[#C2E8D7] font-semibold">
                    {assignedVehicle.status}
                  </span>
                )}
              </div>

              {assignedVehicle ? (
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between border-b border-[#F1F5F9] pb-1.5">
                    <span className="text-[#68758A]">Plate:</span>
                    <b className="text-[#172033]">{assignedVehicle.plate}</b>
                  </div>
                  <div className="flex justify-between border-b border-[#F1F5F9] pb-1.5">
                    <span className="text-[#68758A]">Model:</span>
                    <span className="text-[#172033] font-medium">{assignedVehicle.model} ({assignedVehicle.year})</span>
                  </div>
                  <div className="flex justify-between border-b border-[#F1F5F9] pb-1.5">
                    <span className="text-[#68758A]">Fuel Level:</span>
                    <span className="text-[#16A36A] font-bold">{assignedVehicle.fuel}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#68758A]">Odometer:</span>
                    <span className="text-[#172033] font-medium">{assignedVehicle.odometer?.toLocaleString()} km</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#8A97AB] italic">No vehicle assigned to this trip.</p>
              )}
            </div>

            {/* Driver Profile */}
            <div className="glass-card rounded-2xl p-5 space-y-3 shadow-liquid-subtle">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#68758A] m-0 flex items-center gap-1.5 font-semibold">
                  <User className="w-3.5 h-3.5 text-[#16A36A]" />
                  <span>Assigned Driver</span>
                </h4>
                {assignedDriver && (
                  <span className="font-mono text-[10px] text-[#2879E8] bg-[#EAF3FF] px-2 py-0.5 rounded-full border border-[#D5E6FB] font-semibold">
                    ★ {assignedDriver.rating || 4.9}
                  </span>
                )}
              </div>

              {assignedDriver ? (
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between border-b border-[#F1F5F9] pb-1.5">
                    <span className="text-[#68758A]">Name:</span>
                    <b className="text-[#172033]">{assignedDriver.name}</b>
                  </div>
                  <div className="flex justify-between border-b border-[#F1F5F9] pb-1.5">
                    <span className="text-[#68758A]">Phone:</span>
                    <span className="text-[#172033] font-medium">{assignedDriver.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#F1F5F9] pb-1.5">
                    <span className="text-[#68758A]">License:</span>
                    <span className="text-[#172033] font-medium">{assignedDriver.license}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#68758A]">Completed Trips:</span>
                    <span className="text-[#16A36A] font-bold">{assignedDriver.tripsCompleted || 0}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#8A97AB] italic">No driver assigned to this trip.</p>
              )}
            </div>
          </div>

          {/* Cargo Details & Notes */}
          <div className="glass-card rounded-2xl p-5 space-y-3 shadow-liquid-subtle">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#68758A] m-0 flex items-center gap-1.5 font-semibold">
              <Package className="w-3.5 h-3.5 text-[#E7A329]" />
              <span>Cargo Specifications & Dispatch Notes</span>
            </h4>
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              <div className="bg-[#F8FAFD] p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                <span className="text-[10px] font-mono uppercase text-[#68758A] block mb-1 font-semibold">Cargo Description</span>
                <p className="text-xs text-[#172033] font-medium m-0">
                  {trip.cargoDetails || 'Standard commercial package cargo.'}
                </p>
              </div>
              <div className="bg-[#F8FAFD] p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                <span className="text-[10px] font-mono uppercase text-[#68758A] block mb-1 font-semibold">Operational Instructions</span>
                <p className="text-xs text-[#172033] font-medium m-0">
                  {trip.notes || 'No special handling instructions provided.'}
                </p>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="glass-card rounded-2xl p-5 space-y-4 shadow-liquid-subtle">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#2879E8] m-0 flex items-center gap-2 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Lifecycle Status History & Activity Timeline</span>
            </h3>
            <TripTimeline history={trip.statusHistory} currentStatus={trip.status} />
          </div>
        </div>

        {/* Right Column (1 Col wide): Expenses, Correlated Geofences, Report Trigger */}
        <div className="space-y-6">
          {/* Trip Expense Summary */}
          <div className="glass-card rounded-2xl p-5 space-y-3.5 shadow-liquid-subtle">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#68758A] m-0 flex items-center gap-1.5 font-semibold">
                <DollarSign className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>Recorded Expenses</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#16A36A]">
                  ${totalExpense.toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="p-1 rounded-lg bg-[#EAF3FF] hover:bg-[#D5E6FB] text-[#2879E8] border border-[#D5E6FB] transition-colors cursor-pointer"
                  title="Add Expense"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {Array.isArray(trip.expenses) && trip.expenses.length > 0 ? (
              <div className="divide-y divide-[#F1F5F9] text-xs">
                {trip.expenses.map((exp, idx) => (
                  <div key={exp.id || idx} className="py-2.5 flex items-center justify-between gap-2 group">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded-md bg-[#F8FAFD] text-[#68758A] border border-[#E2E8F0] font-semibold">
                          {exp.type}
                        </span>
                        <b className="text-[#172033] text-[11px] truncate">{exp.description || 'Receipt logged'}</b>
                      </div>
                      <span className="text-[10px] text-[#8A97AB] font-mono">
                        {new Date(exp.recordedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-xs font-bold text-[#172033]">
                        ${Number(exp.amount).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="text-[#8A97AB] hover:text-[#E05252] p-1 rounded hover:bg-[#FDF2F2] transition-colors cursor-pointer"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-xs text-[#8A97AB] italic mb-2">No expenses recorded for this trip.</p>
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="text-xs text-[#2879E8] hover:underline font-semibold cursor-pointer"
                >
                  + Add First Expense
                </button>
              </div>
            )}

            <div className="pt-2.5 border-t border-[#E2E8F0] font-mono text-[11px] flex justify-between text-[#68758A]">
              <span>Cost Per Kilometer:</span>
              <span className="text-[#16A36A] font-bold">
                {costPerKm > 0 ? `$${costPerKm} / km` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Correlated Geofence Alerts for Vehicle */}
          <div className="glass-card rounded-2xl p-5 space-y-3.5 shadow-liquid-subtle">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#68758A] m-0 flex items-center gap-1.5 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-[#E05252]" />
              <span>Geofence & Safety Events</span>
            </h3>

            {correlatedGeofenceEvents.length > 0 ? (
              <div className="space-y-2.5">
                {correlatedGeofenceEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl bg-[#FDF2F2] border border-[#FAD2D2] space-y-1 text-xs shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#E05252] font-semibold">
                      <span>{evt.geofenceName}</span>
                      <span>{evt.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#172033] m-0 leading-tight font-medium">{evt.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8A97AB] italic">No geofence breaches or safety violations recorded.</p>
            )}
          </div>
        </div>
      </div>

      {/* Status Transition Modal */}
      {isTransitionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-md">
          <div className="w-full max-w-md glass-card rounded-2xl shadow-liquid-dropdown p-6 text-[#172033] space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#172033] m-0 tracking-tight">
              Confirm Status Transition: <span className="text-[#2879E8]">{targetStatus}</span>
            </h3>
            <p className="text-xs text-[#68758A]">
              You are about to change trip <span className="font-mono font-bold text-[#172033]">{trip.id}</span> from{' '}
              <b className="text-[#172033]">{trip.status}</b> to <b className="text-[#2879E8]">{targetStatus}</b>.
            </p>

            <div>
              <label className="block text-[10px] font-mono text-[#68758A] uppercase tracking-wider mb-1.5 font-semibold">
                Transition Notes / Reason
              </label>
              <textarea
                rows="3"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Provide mandatory dispatch audit notes for this status change..."
                className="w-full bg-[#F8FAFD] border border-[#D5E2F1] text-xs text-[#172033] p-3 rounded-xl focus:outline-none focus:border-[#2879E8] resize-none shadow-2xs"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsTransitionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
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

      {/* Record Expense Modal */}
      <TripExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        tripId={trip.id}
        onExpenseAdded={(updatedTrip) => {
          setTrip(updatedTrip);
          setRefreshKey((p) => p + 1);
          if (onShowToast) onShowToast('Expense item recorded successfully.', 'success');
        }}
      />

      {/* Completion Manifest Report Modal */}
      <TripReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        trip={trip}
        vehicle={assignedVehicle}
        driver={assignedDriver}
        geofenceEvents={correlatedGeofenceEvents}
      />
    </div>
  );
}
