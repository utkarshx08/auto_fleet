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
    // Priority: In Progress > Delayed > Assigned > Scheduled
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

  // Completed trips by this driver
  const completedTrips = useMemo(() => {
    return driverTrips.filter((t) => t.status === 'Completed');
  }, [driverTrips]);

  // Actions
  const handleStartTrip = (tripId) => {
    try {
      updateTripStatus(tripId, 'In Progress', 'Driver initiated departure via mobile portal', currentDriver.name);
      setRefreshKey((p) => p + 1);
      if (onShowToast) onShowToast(`Trip started! Live dispatch broadcast active.`, 'success');
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    }
  };

  const handleReportDelay = () => {
    if (!activeTrip || !delayReason.trim()) return;
    try {
      updateTripStatus(activeTrip.id, 'Delayed', `Driver delay report: ${delayReason.trim()}`, currentDriver.name);
      setRefreshKey((p) => p + 1);
      setIsDelayModalOpen(false);
      setDelayReason('');
      if (onShowToast) onShowToast('Delay report logged and dispatch notified.', 'warning');
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    }
  };

  const handleCompleteTrip = (tripId) => {
    if (window.confirm('Confirm final delivery and voyage sign-off?')) {
      try {
        updateTripStatus(tripId, 'Completed', 'Driver confirmed final cargo delivery and signed manifest', currentDriver.name);
        setRefreshKey((p) => p + 1);
        if (onShowToast) onShowToast('Trip marked as Completed! Great work.', 'success');
      } catch (err) {
        if (onShowToast) onShowToast(err.message, 'error');
      }
    }
  };

  const handleToggleStop = (tripId, stopId, currentStopStatus) => {
    const nextStatus = currentStopStatus === 'Pending' ? 'Reached' : currentStopStatus === 'Reached' ? 'Departed' : 'Pending';
    try {
      updateTripStopStatus(tripId, stopId, nextStatus, `Waypoint status updated to ${nextStatus} by driver`);
      setRefreshKey((p) => p + 1);
      if (onShowToast) onShowToast(`Stop updated: ${nextStatus}.`, 'info');
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12 text-[#d4d4dc]">
      {/* Driver Mobile Top Banner */}
      <div className="bg-[#17191f] border border-[#292c35] p-4 rounded-xl flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-[#24212f] border border-[#3b3252] text-[#c4b3ff] flex items-center justify-center font-bold font-mono text-sm shrink-0 shadow-[0_0_10px_rgba(180,154,255,0.3)]">
            {currentDriver.avatar || 'DR'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <select
                value={selectedDriverId}
                onChange={(e) => handleDriverChange(e.target.value)}
                className="bg-[#121319] border border-[#2b2e38] text-xs font-bold text-[#f0f0f4] px-2 py-1 rounded-[6px] focus:outline-none focus:border-[#ad91ff] cursor-pointer"
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
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1.5 border transition-colors ${
                  dutyStatus === 'On Duty'
                    ? 'bg-[#122822] text-[#6ee7b7] border-[#1d4c3e]'
                    : 'bg-[#2d2218] text-[#fcd34d] border-[#4d3822]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dutyStatus === 'On Duty' ? 'bg-[#10b981] animate-pulse' : 'bg-[#f59e0b]'}`} />
                <span>{dutyStatus}</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#858894] mt-1 font-mono">
              <span>Lic: {currentDriver.license}</span>
              <span>•</span>
              <span className="text-[#c4b3ff]">★ {currentDriver.rating}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((p) => p + 1)}
          className="p-2 text-[#747683] hover:text-[#d4d4dc] rounded-lg hover:bg-[#20222d] transition-colors"
          title="Refresh assignments"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Assigned Vehicle Quick Ribbon */}
      <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-[#ad91ff] shrink-0" />
          <div>
            <span className="text-[#f0f0f4] font-bold block">{assignedVehicle.plate}</span>
            <span className="text-[11px] text-[#858894]">{assignedVehicle.model}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div>
            <span className="text-[10px] text-[#747683] block">FUEL</span>
            <span className="text-[#8be0b3] font-bold flex items-center gap-1">
              <Fuel className="w-3 h-3" />
              {assignedVehicle.fuel}%
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#747683] block">ODO</span>
            <span className="text-[#d4d4dc] font-bold">{assignedVehicle.odometer?.toLocaleString()} km</span>
          </div>
        </div>
      </div>

      {/* Hero Active Trip Manifest Card */}
      {activeTrip ? (
        <div className="bg-[#17191f] border-2 border-[#3b3252] rounded-xl overflow-hidden shadow-2xl space-y-4">
          {/* Card Header */}
          <div className="bg-[#1c1a27] p-4 border-b border-[#2e2a3f] flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-[#b49aff] bg-[#24212f] px-2 py-0.5 rounded border border-[#3b3252]">
                  {activeTrip.id}
                </span>
                <TripStatusBadge status={activeTrip.status} size="sm" />
                <span className="font-mono text-[10px] uppercase px-1.5 py-0.2 rounded bg-[#20232e] text-[#a0a3b1]">
                  {activeTrip.priority} Priority
                </span>
              </div>
              <h2 className="text-base font-bold text-[#f0f0f4] m-0 leading-snug">
                {activeTrip.tripName}
              </h2>
              <p className="text-xs text-[#858894] mt-0.5 m-0">
                Client: <b className="text-[#e0e0e7]">{activeTrip.customerName}</b>
              </p>
            </div>

            <a
              href="tel:+15552345678"
              className="p-2.5 rounded-full bg-[#24212f] hover:bg-[#322c42] text-[#c4b3ff] border border-[#3f3558] transition-colors"
              title="Call Dispatch Coordinator"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Cargo Details */}
          {activeTrip.cargoDetails && (
            <div className="px-4 py-2 mx-4 bg-[#121319] rounded-lg border border-[#242631] text-xs">
              <span className="text-[10px] font-mono uppercase text-[#747683] block">Consignment Load</span>
              <p className="text-[#e0e0e7] m-0">{activeTrip.cargoDetails}</p>
            </div>
          )}

          {/* Interactive Route Waypoint Checklist */}
          <div className="px-4 space-y-3">
            <span className="font-mono text-[10px] uppercase text-[#858894] tracking-wider block">
              Route & Waypoint Checklist
            </span>

            <div className="space-y-2.5">
              {/* Pickup Point */}
              <div className="bg-[#14151b] border border-[#272935] p-3 rounded-lg flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-5 h-5 rounded-full bg-[#182a22] border border-[#234b3c] text-[#6ee7b7] flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                    A
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-[#747683] uppercase block">Origin Pickup</span>
                    <p className="text-xs font-semibold text-[#f0f0f4] truncate m-0">{activeTrip.pickupLocation}</p>
                    <span className="text-[10px] text-[#858894] font-mono">
                      Dep: {formatTimeSafe(activeTrip.scheduledDeparture)}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeTrip.pickupLocation)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 rounded bg-[#1e212c] hover:bg-[#282c3b] text-[#ad91ff] text-[11px] font-medium flex items-center gap-1 shrink-0"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Map</span>
                </a>
              </div>

              {/* Intermediate Waypoints */}
              {Array.isArray(activeTrip.stops) && activeTrip.stops.map((stop, idx) => {
                const isReached = stop.status === 'Reached' || stop.status === 'Departed';
                return (
                  <div
                    key={stop.id || idx}
                    className={`border p-3 rounded-lg flex items-start justify-between gap-3 transition-colors ${
                      isReached ? 'bg-[#151c19] border-[#203a2e]' : 'bg-[#14151b] border-[#272935]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleToggleStop(activeTrip.id, stop.id, stop.status)}
                        className={`w-5 h-5 rounded flex items-center justify-center font-mono text-xs border transition-colors shrink-0 mt-0.5 ${
                          isReached
                            ? 'bg-[#10b981] border-[#10b981] text-[#121319]'
                            : 'bg-[#1e2029] border-[#373a4a] text-[#858894] hover:border-[#b49aff]'
                        }`}
                        title="Click to check off waypoint"
                      >
                        {isReached ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-[#b49aff] uppercase">Stop #{stop.order || idx + 1}</span>
                          <span className="font-mono text-[9px] text-[#70cbb7]">{stop.status || 'Pending'}</span>
                        </div>
                        <p className="text-xs font-medium text-[#f0f0f4] truncate m-0">{stop.locationName}</p>
                        {stop.notes && <p className="text-[11px] text-[#858894] m-0 mt-0.5">{stop.notes}</p>}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleStop(activeTrip.id, stop.id, stop.status)}
                      className={`px-2 py-1 rounded text-[11px] font-medium shrink-0 transition-colors ${
                        isReached
                          ? 'bg-[#1e2a24] text-[#8be0b3] border border-[#2b4d3c]'
                          : 'bg-[#24212f] text-[#c4b3ff] border border-[#3b3252]'
                      }`}
                    >
                      {stop.status === 'Reached' ? 'Mark Departed' : stop.status === 'Departed' ? 'Done' : 'Mark Reached'}
                    </button>
                  </div>
                );
              })}

              {/* Destination Point */}
              <div className="bg-[#14151b] border border-[#272935] p-3 rounded-lg flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-5 h-5 rounded-full bg-[#321719] border border-[#522930] text-[#fca5a5] flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">
                    B
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-[#747683] uppercase block">Final Destination</span>
                    <p className="text-xs font-semibold text-[#f0f0f4] truncate m-0">{activeTrip.destinationLocation}</p>
                    <span className="text-[10px] text-[#858894] font-mono">
                      Arr: {formatTimeSafe(activeTrip.scheduledArrival)}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeTrip.destinationLocation)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 rounded bg-[#1e212c] hover:bg-[#282c3b] text-[#ad91ff] text-[11px] font-medium flex items-center gap-1 shrink-0"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Map</span>
                </a>
              </div>
            </div>
          </div>

          {/* Primary Mobile Action Buttons Bar */}
          <div className="p-4 bg-[#14151c] border-t border-[#292c3a] space-y-2.5">
            {/* If Scheduled or Assigned: Start Trip Button */}
            {(activeTrip.status === 'Scheduled' || activeTrip.status === 'Assigned') && (
              <button
                type="button"
                onClick={() => handleStartTrip(activeTrip.id)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-[#121319] font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START TRIP / DEPART NOW</span>
              </button>
            )}

            {/* If In Progress or Delayed: Complete & Delay Triggers */}
            {(activeTrip.status === 'In Progress' || activeTrip.status === 'Delayed') && (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsDelayModalOpen(true)}
                  className="py-3 rounded-lg bg-[#2d2218] hover:bg-[#3d2e20] text-[#fcd34d] border border-[#4d3822] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Report Delay</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCompleteTrip(activeTrip.id)}
                  className="py-3 rounded-lg bg-[#142921] hover:bg-[#1e3d31] text-[#70cbb7] border border-[#234b3c] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
              className="w-full py-2.5 rounded-lg bg-[#1e212c] hover:bg-[#282c3a] text-[#c4b3ff] border border-[#38334a] font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5 text-[#6ee7b7]" />
              <span>+ Log Fuel / Toll / Meal Expense</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#17191f] border border-[#292c35] rounded-xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#1b1d26] text-[#858894] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
          </div>
          <h3 className="text-base font-bold text-[#f0f0f4] m-0">All Dispatches Clear</h3>
          <p className="text-xs text-[#858894] max-w-sm mx-auto">
            You currently have no active or pending dispatches assigned. You are listed as <b>{dutyStatus}</b> on vehicle <b>{assignedVehicle.plate}</b>.
          </p>
        </div>
      )}

      {/* Completed Dispatches History */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#858894] m-0 px-1">
          Recent Completed Voyages ({completedTrips.length})
        </h3>

        {completedTrips.length === 0 ? (
          <div className="bg-[#17191f] border border-[#292c35] p-5 rounded-lg text-center text-xs text-[#747683]">
            No completed manifests on record yet.
          </div>
        ) : (
          <div className="space-y-2">
            {completedTrips.slice(0, 4).map((t) => {
              const { totalExpense } = calculateTripExpenses(t);
              return (
                <div
                  key={t.id}
                  className="bg-[#17191f] border border-[#292c35] p-3 rounded-lg flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#ad91ff]">{t.id}</span>
                      <TripStatusBadge status={t.status} size="sm" />
                    </div>
                    <b className="text-[#f0f0f4] block truncate mt-0.5">{t.tripName}</b>
                    <span className="text-[11px] text-[#747683] font-mono">
                      {t.actualDistanceKm || t.estimatedDistanceKm} km · ${totalExpense.toFixed(2)} expenses
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReportTrip(t);
                      setIsReportModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded bg-[#24212f] hover:bg-[#322c42] text-[#c4b3ff] border border-[#3b3252] text-[11px] font-medium shrink-0 flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#17191f] border border-[#2b2e38] rounded-xl p-5 space-y-4 text-xs text-[#d4d4dc]">
            <h3 className="text-sm font-bold text-[#f0f0f4] m-0 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#fcd34d]" />
              <span>Report Voyage Delay</span>
            </h3>

            {/* Quick Reason Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-[#747683]">Quick Reason Presets</span>
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
                    className="px-2 py-1 rounded bg-[#121319] hover:bg-[#20222d] text-[#c4c6d2] border border-[#282a35] text-[10px]"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#858894] uppercase mb-1">
                Delay Details
              </label>
              <textarea
                rows="2"
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                placeholder="Describe reason for delay..."
                className="w-full bg-[#121319] border border-[#2b2e38] text-xs text-[#f0f0f4] p-2 rounded focus:outline-none focus:border-[#ad91ff] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#252834]">
              <Button variant="quiet" onClick={() => setIsDelayModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleReportDelay}>
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

