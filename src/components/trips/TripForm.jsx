import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Truck,
  User,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle,
  FileText,
  Package
} from 'lucide-react';
import Button from '../common/Button';
import { validateTripAssignment, saveTrip, getTrips } from '../../services/tripService';

export default function TripForm({
  initialTrip = null,
  vehicles = [],
  drivers = [],
  onSave,
  onCancel
}) {
  const isEditing = Boolean(initialTrip && initialTrip.id);

  // Auto-generate next ID if creating new
  const defaultNextId = () => {
    if (initialTrip?.id) return initialTrip.id;
    const existing = getTrips();
    return `TRP-${1001 + existing.length}`;
  };

  // Default dates: departure = today + 2h, arrival = today + 5h
  const getDefaultDates = () => {
    const now = new Date();
    const dep = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const arr = new Date(now.getTime() + 5 * 60 * 60 * 1000);

    const toLocalISO = (d) => {
      const offset = d.getTimezoneOffset() * 60000;
      return new Date(d.getTime() - offset).toISOString().slice(0, 16);
    };

    return {
      dep: toLocalISO(dep),
      arr: toLocalISO(arr)
    };
  };

  const defaultDates = getDefaultDates();

  const [formData, setFormData] = useState({
    id: initialTrip?.id || defaultNextId(),
    tripName: initialTrip?.tripName || '',
    customerName: initialTrip?.customerName || '',
    priority: initialTrip?.priority || 'Medium',
    status: initialTrip?.status || 'Scheduled',
    pickupLocation: initialTrip?.pickupLocation || '',
    pickupLat: initialTrip?.pickupCoords?.lat || 40.7128,
    pickupLng: initialTrip?.pickupCoords?.lng || -74.006,
    destinationLocation: initialTrip?.destinationLocation || '',
    destinationLat: initialTrip?.destinationCoords?.lat || 40.7589,
    destinationLng: initialTrip?.destinationCoords?.lng || -73.9851,
    scheduledDeparture: initialTrip?.scheduledDeparture
      ? new Date(new Date(initialTrip.scheduledDeparture).getTime() - new Date(initialTrip.scheduledDeparture).getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      : defaultDates.dep,
    scheduledArrival: initialTrip?.scheduledArrival
      ? new Date(new Date(initialTrip.scheduledArrival).getTime() - new Date(initialTrip.scheduledArrival).getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      : defaultDates.arr,
    assignedVehicleId: initialTrip?.assignedVehicleId || '',
    assignedDriverId: initialTrip?.assignedDriverId || '',
    estimatedDistanceKm: initialTrip?.estimatedDistanceKm || 35,
    cargoDetails: initialTrip?.cargoDetails || '',
    notes: initialTrip?.notes || '',
    stops: initialTrip?.stops ? [...initialTrip.stops] : []
  });

  const [formErrors, setFormErrors] = useState({});
  const [conflictWarnings, setConflictWarnings] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live validation on assignment & timeframe change
  useEffect(() => {
    if (formData.scheduledDeparture && formData.scheduledArrival) {
      const check = validateTripAssignment({
        vehicleId: formData.assignedVehicleId || null,
        driverId: formData.assignedDriverId || null,
        departureTime: new Date(formData.scheduledDeparture).toISOString(),
        arrivalTime: new Date(formData.scheduledArrival).toISOString(),
        excludeTripId: isEditing ? formData.id : null,
        vehiclesList: vehicles
      });

      if (!check.isValid) {
        setConflictWarnings(check.errors);
      } else {
        setConflictWarnings([]);
      }
    }
  }, [
    formData.assignedVehicleId,
    formData.assignedDriverId,
    formData.scheduledDeparture,
    formData.scheduledArrival,
    isEditing,
    formData.id,
    vehicles
  ]);

  // Intermediate Waypoints handlers
  const handleAddStop = () => {
    const nextOrder = formData.stops.length + 1;
    const newStop = {
      id: `stp-new-${Date.now()}`,
      order: nextOrder,
      locationName: '',
      notes: '',
      status: 'Pending'
    };
    setFormData((prev) => ({
      ...prev,
      stops: [...prev.stops, newStop]
    }));
  };

  const handleRemoveStop = (idx) => {
    setFormData((prev) => {
      const updated = prev.stops.filter((_, i) => i !== idx).map((s, i) => ({
        ...s,
        order: i + 1
      }));
      return { ...prev, stops: updated };
    });
  };

  const handleStopChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.stops];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, stops: updated };
    });
  };

  // Form Field Validation
  const validateForm = () => {
    const errs = {};

    if (!formData.tripName.trim() || formData.tripName.trim().length < 3) {
      errs.tripName = 'Trip name is required (min 3 characters).';
    }

    if (!formData.customerName.trim()) {
      errs.customerName = 'Customer/client name is required.';
    }

    if (!formData.pickupLocation.trim()) {
      errs.pickupLocation = 'Starting pickup location is required.';
    }

    if (!formData.destinationLocation.trim()) {
      errs.destinationLocation = 'Final destination location is required.';
    }

    if (!formData.scheduledDeparture) {
      errs.scheduledDeparture = 'Scheduled departure is required.';
    }

    if (!formData.scheduledArrival) {
      errs.scheduledArrival = 'Scheduled arrival is required.';
    } else if (new Date(formData.scheduledArrival) <= new Date(formData.scheduledDeparture)) {
      errs.scheduledArrival = 'Arrival must be after scheduled departure.';
    }

    if (Number(formData.estimatedDistanceKm) <= 0) {
      errs.estimatedDistanceKm = 'Estimated distance must be greater than 0 km.';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (conflictWarnings.length > 0) {
      const confirmProceed = window.confirm(
        `Assignment conflict detected:\n\n${conflictWarnings.join('\n')}\n\nDo you want to proceed and override?`
      );
      if (!confirmProceed) return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        id: formData.id,
        tripName: formData.tripName,
        customerName: formData.customerName,
        priority: formData.priority,
        status: formData.status,
        pickupLocation: formData.pickupLocation,
        pickupCoords: { lat: Number(formData.pickupLat), lng: Number(formData.pickupLng) },
        destinationLocation: formData.destinationLocation,
        destinationCoords: { lat: Number(formData.destinationLat), lng: Number(formData.destinationLng) },
        stops: formData.stops.filter((s) => s.locationName.trim().length > 0),
        scheduledDeparture: new Date(formData.scheduledDeparture).toISOString(),
        scheduledArrival: new Date(formData.scheduledArrival).toISOString(),
        assignedVehicleId: formData.assignedVehicleId || null,
        assignedDriverId: formData.assignedDriverId || null,
        estimatedDistanceKm: Number(formData.estimatedDistanceKm) || 25,
        cargoDetails: formData.cargoDetails,
        notes: formData.notes
      };

      const saved = saveTrip(payload);
      if (onSave) onSave(saved);
    } catch (err) {
      alert(`Failed to save trip: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs text-[#d4d4dc]">
      {/* Top Banner: Auto-generated Trip ID & Priority */}
      <div className="bg-[#121319] border border-[#272935] p-3.5 rounded-[9px] flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase text-[#858894]">Trip Identifier:</span>
          <span className="font-mono text-sm font-bold text-[#b49aff] bg-[#24212f] px-2.5 py-1 rounded border border-[#3b3252]">
            {formData.id}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#858894]">Priority Level:</span>
          <div className="flex items-center gap-1.5">
            {['Low', 'Medium', 'High'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, priority: p }))}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  formData.priority === p
                    ? p === 'High'
                      ? 'bg-[#3b1f24] text-[#fca5a5] border border-[#5e272a]'
                      : p === 'Medium'
                      ? 'bg-[#332a19] text-[#fcd34d] border border-[#52411e]'
                      : 'bg-[#182338] text-[#93c5fd] border border-[#273859]'
                    : 'bg-[#1a1c24] text-[#858894] hover:text-[#d4d4dc]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conflict / Maintenance Warning Box */}
      {conflictWarnings.length > 0 && (
        <div className="bg-[#2c1d1a] border border-[#592c24] p-3.5 rounded-[9px] flex items-start gap-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-[#f87171] shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <b className="text-[#fca5a5] block">Assignment Conflict Alert</b>
            {conflictWarnings.map((warn, i) => (
              <p key={i} className="text-[#e2b5b5] text-[11px] m-0">
                • {warn}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Section 1: Trip Profile & Customer */}
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <div>
          <label className="block text-[11px] font-mono text-[#858894] uppercase tracking-[1px] mb-1.5">
            Trip Name <span className="text-[#f87171]">*</span>
          </label>
          <input
            type="text"
            value={formData.tripName}
            onChange={(e) => setFormData({ ...formData, tripName: e.target.value })}
            placeholder="e.g. Midtown Medical Priority Express"
            className={`w-full bg-[#121319] border ${
              formErrors.tripName ? 'border-[#ef4444]' : 'border-[#2b2e38]'
            } text-sm text-[#f0f0f4] px-3 py-2 rounded-[7px] focus:outline-none focus:border-[#ad91ff]`}
          />
          {formErrors.tripName && (
            <p className="text-[11px] text-[#f87171] mt-1">{formErrors.tripName}</p>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-mono text-[#858894] uppercase tracking-[1px] mb-1.5">
            Customer / Client Name <span className="text-[#f87171]">*</span>
          </label>
          <input
            type="text"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            placeholder="e.g. BioHealth Diagnostics & Pharma"
            className={`w-full bg-[#121319] border ${
              formErrors.customerName ? 'border-[#ef4444]' : 'border-[#2b2e38]'
            } text-sm text-[#f0f0f4] px-3 py-2 rounded-[7px] focus:outline-none focus:border-[#ad91ff]`}
          />
          {formErrors.customerName && (
            <p className="text-[11px] text-[#f87171] mt-1">{formErrors.customerName}</p>
          )}
        </div>
      </div>

      {/* Section 2: Locations & Route */}
      <div className="bg-[#121319] border border-[#272935] p-4 rounded-[10px] space-y-4">
        <h4 className="text-xs font-mono uppercase text-[#b49aff] tracking-[1px] m-0 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>Origin, Waypoints & Destination</span>
        </h4>

        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          {/* Pickup */}
          <div>
            <label className="block text-[11px] text-[#8e919f] mb-1">
              Starting Pickup Location <span className="text-[#f87171]">*</span>
            </label>
            <input
              type="text"
              value={formData.pickupLocation}
              onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
              placeholder="e.g. JFK Air Cargo Hub, Queens, NY"
              className={`w-full bg-[#17191f] border ${
                formErrors.pickupLocation ? 'border-[#ef4444]' : 'border-[#2b2e38]'
              } text-xs text-[#f0f0f4] px-3 py-2 rounded-[6px] focus:outline-none focus:border-[#ad91ff]`}
            />
            {formErrors.pickupLocation && (
              <p className="text-[11px] text-[#f87171] mt-1">{formErrors.pickupLocation}</p>
            )}
          </div>

          {/* Destination */}
          <div>
            <label className="block text-[11px] text-[#8e919f] mb-1">
              Final Destination Location <span className="text-[#f87171]">*</span>
            </label>
            <input
              type="text"
              value={formData.destinationLocation}
              onChange={(e) => setFormData({ ...formData, destinationLocation: e.target.value })}
              placeholder="e.g. Upper East Side Health Network, New York, NY"
              className={`w-full bg-[#17191f] border ${
                formErrors.destinationLocation ? 'border-[#ef4444]' : 'border-[#2b2e38]'
              } text-xs text-[#f0f0f4] px-3 py-2 rounded-[6px] focus:outline-none focus:border-[#ad91ff]`}
            />
            {formErrors.destinationLocation && (
              <p className="text-[11px] text-[#f87171] mt-1">{formErrors.destinationLocation}</p>
            )}
          </div>
        </div>

        {/* Dynamic Intermediate Waypoints */}
        <div className="space-y-2 pt-2 border-t border-[#222430]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#858894] font-mono uppercase">
              Intermediate Waypoints ({formData.stops.length})
            </span>
            <button
              type="button"
              onClick={handleAddStop}
              className="flex items-center gap-1 text-[11px] text-[#ad91ff] hover:text-[#c4b3ff] transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add Waypoint</span>
            </button>
          </div>

          {formData.stops.map((stop, idx) => (
            <div
              key={stop.id || idx}
              className="flex items-center gap-2 bg-[#17191f] p-2.5 rounded-[7px] border border-[#292c37]"
            >
              <span className="w-5 h-5 rounded-full bg-[#24212f] text-[#c4b3ff] font-mono text-[10px] flex items-center justify-center shrink-0">
                {stop.order || idx + 1}
              </span>
              <input
                type="text"
                value={stop.locationName}
                onChange={(e) => handleStopChange(idx, 'locationName', e.target.value)}
                placeholder="Waypoint address / facility..."
                className="flex-1 bg-[#121319] border border-[#2b2e38] text-xs text-[#f0f0f4] px-2.5 py-1.5 rounded focus:outline-none focus:border-[#ad91ff]"
              />
              <input
                type="text"
                value={stop.notes || ''}
                onChange={(e) => handleStopChange(idx, 'notes', e.target.value)}
                placeholder="Stop instructions (optional)"
                className="w-1/3 bg-[#121319] border border-[#2b2e38] text-xs text-[#f0f0f4] px-2.5 py-1.5 rounded focus:outline-none focus:border-[#ad91ff]"
              />
              <button
                type="button"
                onClick={() => handleRemoveStop(idx)}
                className="text-[#747683] hover:text-[#f87171] p-1"
                title="Remove Stop"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Schedule & Distance */}
      <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
        <div>
          <label className="block text-[11px] font-mono text-[#858894] uppercase tracking-[1px] mb-1.5">
            Scheduled Departure <span className="text-[#f87171]">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.scheduledDeparture}
            onChange={(e) => setFormData({ ...formData, scheduledDeparture: e.target.value })}
            className={`w-full bg-[#121319] border ${
              formErrors.scheduledDeparture ? 'border-[#ef4444]' : 'border-[#2b2e38]'
            } text-xs text-[#f0f0f4] px-3 py-2 rounded-[7px] focus:outline-none focus:border-[#ad91ff] font-mono`}
          />
          {formErrors.scheduledDeparture && (
            <p className="text-[11px] text-[#f87171] mt-1">{formErrors.scheduledDeparture}</p>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-mono text-[#858894] uppercase tracking-[1px] mb-1.5">
            Expected Arrival <span className="text-[#f87171]">*</span>
          </label>
          <input
            type="datetime-local"
            value={formData.scheduledArrival}
            onChange={(e) => setFormData({ ...formData, scheduledArrival: e.target.value })}
            className={`w-full bg-[#121319] border ${
              formErrors.scheduledArrival ? 'border-[#ef4444]' : 'border-[#2b2e38]'
            } text-xs text-[#f0f0f4] px-3 py-2 rounded-[7px] focus:outline-none focus:border-[#ad91ff] font-mono`}
          />
          {formErrors.scheduledArrival && (
            <p className="text-[11px] text-[#f87171] mt-1">{formErrors.scheduledArrival}</p>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-mono text-[#858894] uppercase tracking-[1px] mb-1.5">
            Estimated Distance (KM) <span className="text-[#f87171]">*</span>
          </label>
          <input
            type="number"
            min="1"
            step="0.1"
            value={formData.estimatedDistanceKm}
            onChange={(e) => setFormData({ ...formData, estimatedDistanceKm: e.target.value })}
            placeholder="e.g. 48.5"
            className={`w-full bg-[#121319] border ${
              formErrors.estimatedDistanceKm ? 'border-[#ef4444]' : 'border-[#2b2e38]'
            } text-xs text-[#f0f0f4] px-3 py-2 rounded-[7px] focus:outline-none focus:border-[#ad91ff] font-mono`}
          />
          {formErrors.estimatedDistanceKm && (
            <p className="text-[11px] text-[#f87171] mt-1">{formErrors.estimatedDistanceKm}</p>
          )}
        </div>
      </div>

      {/* Section 4: Vehicle & Driver Assignment */}
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        {/* Vehicle Select */}
        <div>
          <label className="block text-[11px] font-mono text-[#858894] uppercase tracking-[1px] mb-1.5">
            Assign Vehicle
          </label>
          <div className="relative">
            <select
              value={formData.assignedVehicleId}
              onChange={(e) => setFormData({ ...formData, assignedVehicleId: e.target.value })}
              className="w-full bg-[#121319] border border-[#2b2e38] text-xs text-[#f0f0f4] px-3 py-2 rounded-[7px] focus:outline-none focus:border-[#ad91ff] cursor-pointer"
            >
              <option value="">— Select Available Vehicle —</option>
              {vehicles.map((v) => {
                const isUnderService = v.status === 'service';
                return (
                  <option
                    key={v.id}
                    value={v.id}
                    disabled={isUnderService}
                    className={isUnderService ? 'text-[#f87171] bg-[#1a1315]' : ''}
                  >
                    {v.plate} · {v.model} {isUnderService ? '⚠️ [MAINTENANCE HOLD]' : `(${v.status})`}
                  </option>
                );
              })}
            </select>
          </div>
          <span className="text-[10px] text-[#747683] mt-1 block">
            Vehicles under maintenance are locked from assignment.
          </span>
        </div>

        {/* Driver Select */}
        <div>
          <label className="block text-[11px] font-mono text-[#858894] uppercase tracking-[1px] mb-1.5">
            Assign Driver
          </label>
          <div className="relative">
            <select
              value={formData.assignedDriverId}
              onChange={(e) => setFormData({ ...formData, assignedDriverId: e.target.value })}
              className="w-full bg-[#121319] border border-[#2b2e38] text-xs text-[#f0f0f4] px-3 py-2 rounded-[7px] focus:outline-none focus:border-[#ad91ff] cursor-pointer"
            >
              <option value="">— Select Available Driver —</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} · {d.status || 'Active'} ({d.license || 'Licensed'})
                </option>
              ))}
            </select>
          </div>
          <span className="text-[10px] text-[#747683] mt-1 block">
            Overlapping assignments will be flagged immediately.
          </span>
        </div>
      </div>

      {/* Section 5: Cargo Details & Operational Notes */}
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <div>
          <label className="block text-[11px] font-mono text-[#858894] uppercase tracking-[1px] mb-1.5">
            Cargo & Load Description
          </label>
          <textarea
            rows="2"
            value={formData.cargoDetails}
            onChange={(e) => setFormData({ ...formData, cargoDetails: e.target.value })}
            placeholder="e.g. 3 pallets cold-chain vaccine vials (280 kg, 2-8°C)"
            className="w-full bg-[#121319] border border-[#2b2e38] text-xs text-[#f0f0f4] px-3 py-2 rounded-[7px] focus:outline-none focus:border-[#ad91ff] resize-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-[#858894] uppercase tracking-[1px] mb-1.5">
            Operational Dispatch Notes
          </label>
          <textarea
            rows="2"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Special loading bay instructions, security clearance or client notes..."
            className="w-full bg-[#121319] border border-[#2b2e38] text-xs text-[#f0f0f4] px-3 py-2 rounded-[7px] focus:outline-none focus:border-[#ad91ff] resize-none"
          />
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="pt-4 border-t border-[#272935] flex items-center justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="quiet"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving Trip...' : isEditing ? 'Update Trip Manifest' : 'Confirm & Schedule Trip'}
        </Button>
      </div>
    </form>
  );
}

