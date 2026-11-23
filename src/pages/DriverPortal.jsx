import React, { useState, useEffect, useMemo } from 'react';
import {
  Smartphone,
  User,
  Truck,
  MapPin,
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Phone,
  FileText,
  Navigation,
  Check,
  ChevronDown,
  Layers,
  Fuel,
  RefreshCw
} from 'lucide-react';
import Button from '../components/common/Button';
import TrueFocus from '../components/common/TrueFocus';
import TripStatusBadge from '../components/trips/TripStatusBadge';
import TripExpenseModal from '../components/trips/TripExpenseModal';
import TripReportModal from '../components/trips/TripReportModal';
import {
  getTrips,
  updateTripStatus,
  updateTripStopStatus,
  calculateTripExpenses
} from '../services/tripService';
import { initialDrivers, initialVehicles } from '../data/mockData';
import storageService from '../services/storageService';

const formatTimeSafe = (dateVal) => {
  if (!dateVal) return '--:--';
  const d = new Date(dateVal);
  return isNaN(d.getTime()) ? '--:--' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function DriverPortal({ onShowToast }) {
  // Driver selection (defaults to drv-1 Aarav Sharma)
  const [selectedDriverId, setSelectedDriverId] = useState(() => {
    return storageService.getItem('autrail_active_driver_id', 'drv-1');
  });

  const [dutyStatus, setDutyStatus] = useState('On Duty');
  const [trips, setTrips] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);
  const [delayReason, setDelayReason] = useState('');
  const [selectedReportTrip, setSelectedReportTrip] = useState(null);

  // Load Trips
  useEffect(() => {
    const all = getTrips();
    setTrips(all);
  }, [refreshKey]);

  // Persist selected driver
  const handleDriverChange = (id) => {
    setSelectedDriverId(id);
    storageService.setItem('autrail_active_driver_id', id);
  };

  // Find Driver & Assigned Vehicle
  const currentDriver = useMemo(() => {
    return initialDrivers.find((d) => d.id === selectedDriverId) || initialDrivers[0];
  }, [selectedDriverId]);

  const assignedVehicle = useMemo(() => {
    if (!currentDriver?.vehicleAssigned) return initialVehicles[0];
    return (
      initialVehicles.find(
        (v) => v.id === currentDriver.vehicleAssigned || v.plate === currentDriver.vehicleAssigned
      ) || initialVehicles[0]
    );
  }, [currentDriver]);

  // Filter trips for this driver
  const driverTrips = useMemo(() => {
    return trips.filter(
      (t) => t.assignedDriverId === currentDriver.id || t.assignedDriverId === currentDriver.name
    );
  }, [trips, currentDriver]);

  // Active or upcoming trip for this driver
  const activeTrip = useMemo(() => {
    const inProg = driverTrips.find((t) => t.status === 'In Progress');
    if (inProg) return inProg;
    const delayed = driverTrips.find((t) => t.status === 'Delayed');
    if (delayed) return delayed;
    const assigned = driverTrips.find((t) => t.status === 'Assigned');
    if (assigned) return assigned;
    const scheduled = driverTrips.find((t) => t.status === 'Scheduled');
    if (scheduled) return scheduled;
    return null;
  }, [driverTrips]);

  const completedTrips = useMemo(() => {
    return driverTrips.filter((t) => t.status === 'Completed');
  }, [driverTrips]);

  // Handlers
  const handleStartTrip = (tripId) => {
    try {
      updateTripStatus(tripId, 'In Progress', 'Driver commenced dispatch voyage.');
      setRefreshKey((p) => p + 1);
      if (onShowToast) onShowToast('Journey started. GPS broadcaster active.', 'success');
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    }
  };

  const handleCompleteTrip = (tripId) => {
    try {
      updateTripStatus(tripId, 'Completed', 'Driver marked trip delivered.');
      setRefreshKey((p) => p + 1);
      if (onShowToast) onShowToast('Voyage marked completed. Manifest finalized.', 'success');
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    }
  };

  const handleReportDelay = () => {
    if (!activeTrip || !delayReason.trim()) return;
    try {
      updateTripStatus(activeTrip.id, 'Delayed', `Driver reported bottleneck: ${delayReason}`);
      setRefreshKey((p) => p + 1);
      setIsDelayModalOpen(false);
      setDelayReason('');
      if (onShowToast) onShowToast('Delay recorded and broadcast to dispatchers.', 'warning');
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    }
  };

  const handleToggleStop = (tripId, stopId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'Reached' ? 'Departed' : 'Reached';
      updateTripStopStatus(tripId, stopId, nextStatus);
      setRefreshKey((p) => p + 1);
      if (onShowToast) onShowToast(`Stop updated: ${nextStatus}.`, 'info');
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 text-[#172033]">
      {/* Header */}
      <div className="text-center py-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
          Mobile Dispatch Console
        </span>
        <div className="flex justify-center py-0.5">
          <TrueFocus sentence="Driver Portal" />
        </div>
      </div>

      {/* Driver Mobile Top Banner */}
      <div className="glass-card border border-white/95 p-5 rounded-2xl flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] border border-[#2879E8]/30 text-[#2879E8] flex items-center justify-center font-black font-mono text-base shrink-0 shadow-sm">
            {currentDriver.avatar || 'DR'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedDriverId}
                onChange={(e) => handleDriverChange(e.target.value)}
                className="bg-[#F8FAFD] border border-[#D5E2F1] text-xs font-bold text-[#172033] px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#2879E8] cursor-pointer"
              >
                {initialDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.id})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setDutyStatus(dutyStatus === 'On Duty' ? 'On Break' : 'On Duty')}
                className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border transition-all cursor-pointer ${
                  dutyStatus === 'On Duty'
                    ? 'bg-[#DCFCE7] text-[#16A36A] border-[#BBF7D0]'
                    : 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dutyStatus === 'On Duty' ? 'bg-[#16A36A] animate-pulse' : 'bg-[#D97706]'}`} />
                <span>{dutyStatus}</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#68758A] mt-1 font-mono">
              <span>Lic: {currentDriver.license}</span>
              <span>•</span>
              <span className="text-[#D97706] font-bold">★ {currentDriver.rating}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((p) => p + 1)}
          className="p-2.5 text-[#68758A] hover:text-[#2879E8] rounded-xl hover:bg-[#EAF3FF] transition-colors"
          title="Refresh assignments"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Assigned Vehicle Quick Ribbon */}
      <div className="glass-card border border-white/95 p-4 rounded-2xl flex items-center justify-between gap-4 text-xs font-mono shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#2879E8] flex items-center justify-center shadow-xs">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[#172033] font-bold block text-sm">{assignedVehicle.plate}</span>
            <span className="text-[11px] text-[#68758A]">{assignedVehicle.model}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div>
            <span className="text-[10px] text-[#8A97AB] block font-semibold">TANK</span>
            <span className="text-[#16A36A] font-bold flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5" />
              {assignedVehicle.fuel}%
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#8A97AB] block font-semibold">ODOMETER</span>
            <span className="text-[#172033] font-bold">{assignedVehicle.odometer?.toLocaleString()} km</span>
          </div>
        </div>
      </div>

      {/* Hero Active Trip Manifest Card */}
      {activeTrip ? (
        <div className="glass-card border-2 border-[#2879E8]/30 rounded-2xl overflow-hidden shadow-2xl space-y-4">
          {/* Card Header */}
          <div className="bg-[#EAF3FF]/60 p-5 border-b border-[#E2E8F0] flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-mono text-xs font-bold text-[#2879E8] bg-white px-2.5 py-0.5 rounded-md border border-[#2879E8]/20 shadow-2xs">
                  {activeTrip.id}
                </span>
                <TripStatusBadge status={activeTrip.status} size="sm" />
                <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-white text-[#68758A] border border-[#E2E8F0]">
                  {activeTrip.priority} Priority
                </span>
              </div>
              <h2 className="text-base font-bold text-[#172033] m-0 leading-snug">
                {activeTrip.tripName}
              </h2>
              <p className="text-xs text-[#68758A] mt-1 m-0">
                Client: <b className="text-[#172033]">{activeTrip.customerName}</b>
              </p>
            </div>

            <a
              href="tel:+15552345678"
              className="p-3 rounded-xl bg-white hover:bg-[#F8FAFD] text-[#2879E8] border border-[#D5E2F1] shadow-xs transition-colors"
              title="Call Dispatch Coordinator"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Cargo Details */}
          {activeTrip.cargoDetails && (
            <div className="px-4 py-2.5 mx-5 bg-[#F8FAFD] rounded-xl border border-[#E2E8F0] text-xs">
              <span className="text-[10px] font-mono uppercase text-[#8A97AB] block font-semibold">Consignment Load</span>
              <p className="text-[#172033] font-medium m-0 mt-0.5">{activeTrip.cargoDetails}</p>
            </div>
          )}

          {/* Interactive Route Waypoint Checklist */}
          <div className="px-5 space-y-3">
            <span className="font-mono text-[10px] uppercase text-[#68758A] tracking-wider block font-bold">
              Route & Waypoint Checklist
            </span>

            <div className="space-y-2.5">
              {/* Pickup Point */}
              <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3.5 rounded-xl flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A36A] flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                    A
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-[#8A97AB] uppercase block font-semibold">Origin Pickup</span>
                    <p className="text-xs font-bold text-[#172033] truncate m-0">{activeTrip.pickupLocation}</p>
                    <span className="text-[11px] text-[#68758A] font-mono">
                      Dep: {formatTimeSafe(activeTrip.scheduledDeparture)}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeTrip.pickupLocation)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D5E2F1] text-[#2879E8] text-xs font-bold flex items-center gap-1 shrink-0 shadow-2xs hover:bg-[#F8FAFD]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Map</span>
                </a>
              </div>

              {/* Intermediate Waypoints */}
              {Array.isArray(activeTrip.stops) && activeTrip.stops.map((stop, idx) => {
                const isReached = stop.status === 'Reached' || stop.status === 'Departed';
                return (
                  <div
                    key={stop.id || idx}
                    className={`border p-3.5 rounded-xl flex items-start justify-between gap-3 transition-colors ${
                      isReached ? 'bg-[#DCFCE7]/30 border-[#BBF7D0]' : 'bg-[#F8FAFD] border-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleToggleStop(activeTrip.id, stop.id, stop.status)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs border transition-all shrink-0 mt-0.5 ${
                          isReached
                            ? 'bg-[#16A36A] border-[#16A36A] text-white shadow-2xs'
                            : 'bg-white border-[#D5E2F1] text-[#68758A] hover:border-[#2879E8]'
                        }`}
                        title="Click to check off waypoint"
                      >
                        {isReached ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-[#2879E8] uppercase font-bold">Stop #{stop.order || idx + 1}</span>
                          <span className="font-mono text-[10px] text-[#16A36A] font-semibold">{stop.status || 'Pending'}</span>
                        </div>
                        <p className="text-xs font-bold text-[#172033] truncate m-0">{stop.locationName}</p>
                        {stop.notes && <p className="text-[11px] text-[#68758A] m-0 mt-0.5">{stop.notes}</p>}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleStop(activeTrip.id, stop.id, stop.status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                        isReached
                          ? 'bg-[#DCFCE7] text-[#16A36A] border border-[#BBF7D0]'
                          : 'bg-[#EAF3FF] text-[#2879E8] border border-[#2879E8]/30'
                      }`}
                    >
                      {stop.status === 'Reached' ? 'Mark Departed' : stop.status === 'Departed' ? 'Done' : 'Mark Reached'}
                    </button>
                  </div>
                );
              })}

              {/* Destination Point */}
              <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3.5 rounded-xl flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#E05252] flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                    B
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-[#8A97AB] uppercase block font-semibold">Final Destination</span>
                    <p className="text-xs font-bold text-[#172033] truncate m-0">{activeTrip.destinationLocation}</p>
                    <span className="text-[11px] text-[#68758A] font-mono">
                      Arr: {formatTimeSafe(activeTrip.scheduledArrival)}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeTrip.destinationLocation)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D5E2F1] text-[#2879E8] text-xs font-bold flex items-center gap-1 shrink-0 shadow-2xs hover:bg-[#F8FAFD]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Map</span>
                </a>
              </div>
            </div>
          </div>

          {/* Primary Mobile Action Buttons Bar */}
          <div className="p-5 bg-white border-t border-[#E2E8F0] space-y-3">
            {/* If Scheduled or Assigned: Start Trip Button */}
            {(activeTrip.status === 'Scheduled' || activeTrip.status === 'Assigned') && (
              <button
                type="button"
                onClick={() => handleStartTrip(activeTrip.id)}
                className="w-full py-3.5 rounded-xl bg-[#16A36A] hover:bg-[#15803D] text-white font-bold text-sm tracking-wide shadow-md shadow-[#16A36A]/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START TRIP / DEPART NOW</span>
              </button>
            )}

            {/* If In Progress or Delayed: Complete & Delay Triggers */}
            {(activeTrip.status === 'In Progress' || activeTrip.status === 'Delayed') && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsDelayModalOpen(true)}
                  className="py-3 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#D97706] border border-[#FDE68A] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report Delay</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCompleteTrip(activeTrip.id)}
                  className="py-3 rounded-xl bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#16A36A] border border-[#BBF7D0] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Complete Journey</span>
                </button>
              </div>
            )}

            {/* Quick Expense Logger Button */}
            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(true)}
              className="w-full py-3 rounded-xl bg-[#EAF3FF] hover:bg-[#D5E2F1] text-[#2879E8] border border-[#2879E8]/30 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5 text-[#16A36A]" />
              <span>+ Log Fuel / Toll / Meal Expense</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card border border-white/95 rounded-2xl p-10 text-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#16A36A] flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#172033] m-0">All Dispatches Clear</h3>
          <p className="text-xs text-[#68758A] max-w-sm mx-auto leading-relaxed">
            You currently have no active or pending dispatches assigned. You are listed as <b>{dutyStatus}</b> on vehicle <b>{assignedVehicle.plate}</b>.
          </p>
        </div>
      )}

      {/* Completed Dispatches History */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#68758A] m-0 px-1 font-bold">
          Recent Completed Manifests ({completedTrips.length})
        </h3>

        {completedTrips.length === 0 ? (
          <div className="glass-card border border-white/95 p-6 rounded-2xl text-center text-xs text-[#68758A] font-mono">
            No completed manifests on record yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {completedTrips.slice(0, 4).map((t) => {
              const { totalExpense } = calculateTripExpenses(t);
              return (
                <div
                  key={t.id}
                  className="glass-card border border-white/95 p-4 rounded-xl flex items-center justify-between gap-3 text-xs shadow-sm hover:shadow-md transition-all"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#2879E8]">{t.id}</span>
                      <TripStatusBadge status={t.status} size="sm" />
                    </div>
                    <b className="text-[#172033] block truncate mt-1 text-xs">{t.tripName}</b>
                    <span className="text-[11px] text-[#68758A] font-mono">
                      {t.actualDistanceKm || t.estimatedDistanceKm} km · ${totalExpense.toFixed(2)} expenses
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReportTrip(t);
                      setIsReportModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#EAF3FF] hover:bg-[#2879E8] hover:text-white text-[#2879E8] border border-[#2879E8]/20 text-xs font-bold shrink-0 flex items-center gap-1 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Manifest</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delay Report Modal */}
      {isDelayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-md">
          <div className="w-full max-w-sm glass-card border border-white/95 rounded-2xl p-6 space-y-4 text-xs text-[#172033] shadow-2xl">
            <h3 className="text-sm font-bold text-[#172033] m-0 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <span>Report Voyage Delay</span>
            </h3>

            {/* Quick Reason Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#68758A] font-semibold">Quick Reason Presets</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Heavy Highway Traffic',
                  'Loading Bay Congestion',
                  'Weather / Rain Bottleneck',
                  'Road Closure Detour',
                  'Vehicle Mechanical Check'
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDelayReason(preset)}
                    className="px-2.5 py-1 rounded-lg bg-[#F8FAFD] hover:bg-[#EAF3FF] text-[#172033] border border-[#D5E2F1] text-[10px] font-medium transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#68758A] uppercase mb-1 font-semibold">
                Delay Details
              </label>
              <textarea
                rows="2"
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                placeholder="Describe reason for delay..."
                className="w-full bg-[#F8FAFD] border border-[#D5E2F1] text-xs text-[#172033] p-2.5 rounded-xl focus:outline-none focus:border-[#2879E8] resize-none font-medium"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-[#E2E8F0]">
              <Button variant="quiet" onClick={() => setIsDelayModalOpen(false)} className="rounded-xl px-3 py-1.5 text-xs">
                Cancel
              </Button>
              <Button variant="primary" onClick={handleReportDelay} className="rounded-xl px-4 py-1.5 text-xs font-bold">
                Submit Delay
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Expense Logging Modal */}
      {activeTrip && (
        <TripExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          tripId={activeTrip.id}
          onExpenseAdded={() => {
            setRefreshKey((p) => p + 1);
            if (onShowToast) onShowToast('Expense recorded successfully.', 'success');
          }}
        />
      )}

      {/* Completion Manifest Report Modal */}
      {selectedReportTrip && (
        <TripReportModal
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false);
            setSelectedReportTrip(null);
          }}
          trip={selectedReportTrip}
          vehicle={assignedVehicle}
          driver={currentDriver}
        />
      )}
    </div>
  );
}
