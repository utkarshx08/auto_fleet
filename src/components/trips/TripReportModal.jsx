import React, { useRef } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import {
  Printer,
  Download,
  FileText,
  Truck,
  User,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { calculateTripExpenses } from '../../services/tripService';

export default function TripReportModal({
  isOpen,
  onClose,
  trip,
  vehicle = null,
  driver = null,
  geofenceEvents = []
}) {
  const reportRef = useRef(null);

  if (!trip) return null;

  const { totalExpense, costPerKm, breakdown } = calculateTripExpenses(trip);

  // Compute Trip Duration
  const getDuration = () => {
    const dep = trip.actualDeparture || trip.scheduledDeparture;
    const arr = trip.actualArrival || trip.scheduledArrival;
    if (!dep || !arr) return '—';

    const start = new Date(dep).getTime();
    const end = new Date(arr).getTime();
    if (isNaN(start) || isNaN(end) || end <= start) return '—';

    const diffMinutes = Math.round((end - start) / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return `${hours}h ${mins}m (${diffMinutes} mins)`;
  };

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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const lines = [
      '========================================================================',
      '                     AUTRAIL FLEET DISPATCH MANIFEST                    ',
      '                      TRIP COMPLETION AUDIT REPORT                      ',
      '========================================================================',
      `Trip ID:           ${trip.id}`,
      `Trip Name:         ${trip.tripName}`,
      `Status:            ${trip.status}`,
      `Customer / Client: ${trip.customerName}`,
      `Priority:          ${trip.priority}`,
      `Generated At:      ${new Date().toISOString()}`,
      '------------------------------------------------------------------------',
      'ROUTE & TIMING',
      '------------------------------------------------------------------------',
      `Pickup Location:   ${trip.pickupLocation}`,
      `Destination:       ${trip.destinationLocation}`,
      `Intermediate Stops:${trip.stops?.length || 0} waypoints`,
      `Scheduled Dep:     ${trip.scheduledDeparture}`,
      `Actual Dep:        ${trip.actualDeparture || 'N/A'}`,
      `Scheduled Arr:     ${trip.scheduledArrival}`,
      `Actual Arr:        ${trip.actualArrival || 'N/A'}`,
      `Trip Duration:     ${getDuration()}`,
      `Planned Distance:  ${trip.estimatedDistanceKm} km`,
      `Actual Distance:   ${trip.actualDistanceKm || trip.estimatedDistanceKm} km`,
      '------------------------------------------------------------------------',
      'ASSIGNED OPERATOR & FLEET ASSET',
      '------------------------------------------------------------------------',
      `Vehicle ID:        ${trip.assignedVehicleId || 'Unassigned'}`,
      `Driver:            ${driver?.name || trip.assignedDriverId || 'Unassigned'}`,
      `Driver License:    ${driver?.license || 'DL-RECORDED'}`,
      '------------------------------------------------------------------------',
      'EXPENSES & UNIT COST ACCOUNTING',
      '------------------------------------------------------------------------',
      `Total Expenses:    $${totalExpense.toFixed(2)}`,
      `Cost Per KM:       $${costPerKm}/km`,
      ...Object.entries(breakdown).map(([k, v]) => `  - ${k.padEnd(20)}: $${v.toFixed(2)}`),
      '========================================================================',
      'DISPATCH AUDITOR SIGN-OFF: APPROVED & ARCHIVED'
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AUTRAIL_TripReport_${trip.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Trip Completion Manifest: ${trip.id}`}
      subtitle="OFFICIAL DISPATCH RECORD & COST PERFORMANCE AUDIT"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 text-xs font-sans text-[#172033]">
        {/* Printable Paper Canvas */}
        <div
          ref={reportRef}
          className="bg-gradient-to-br from-white to-[#F8FAFD] border border-[#D5E2F1] rounded-2xl p-6 sm:p-7 space-y-6 text-[#172033] shadow-liquid-subtle print:bg-white print:text-black print:border-none print:p-0"
        >
          {/* Manifest Document Header */}
          <div className="flex justify-between items-start border-b border-[#E2E8F0] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-lg bg-[#2879E8] text-white font-extrabold flex items-center justify-center text-xs font-mono shadow-2xs">
                  A
                </span>
                <span className="text-base font-extrabold text-[#172033] tracking-wider font-mono">
                  AUTRAIL DISPATCH MANIFEST
                </span>
              </div>
              <p className="text-[11px] text-[#68758A] m-0 font-medium">
                Automated Fleet Operations & Dispatch Registry
              </p>
            </div>

            <div className="text-right font-mono text-[11px] space-y-0.5">
              <div className="text-[#2879E8] font-bold text-sm">{trip.id}</div>
              <div className="text-[#68758A]">Date: {new Date().toLocaleDateString()}</div>
              <div className="text-[#16A36A] font-semibold uppercase">Status: {trip.status}</div>
            </div>
          </div>

          {/* Section: Client & Cargo */}
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 bg-[#F8FAFD] p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#68758A] block font-semibold">Client / Customer</span>
              <b className="text-sm text-[#172033]">{trip.customerName}</b>
              <p className="text-[11px] text-[#68758A] mt-0.5 m-0">Order: {trip.tripName}</p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-[#68758A] block font-semibold">Cargo Manifest</span>
              <p className="text-xs text-[#172033] m-0 font-medium">
                {trip.cargoDetails || 'Standard general freight consignment.'}
              </p>
            </div>
          </div>

          {/* Section: Route Waypoints & Timing */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#2879E8] m-0 flex items-center gap-1.5 font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Route Specifications & Timing Log</span>
            </h4>

            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 font-mono text-xs">
              <div className="bg-[#F8FAFD] p-3.5 rounded-xl border border-[#E2E8F0] space-y-2 shadow-2xs">
                <div className="flex justify-between">
                  <span className="text-[#68758A]">Origin:</span>
                  <span className="text-[#172033] font-medium text-right truncate max-w-[200px]">{trip.pickupLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68758A]">Destination:</span>
                  <span className="text-[#172033] font-medium text-right truncate max-w-[200px]">{trip.destinationLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68758A]">Intermediate Stops:</span>
                  <span className="text-[#2879E8] font-bold">{trip.stops?.length || 0} stops recorded</span>
                </div>
              </div>

              <div className="bg-[#F8FAFD] p-3.5 rounded-xl border border-[#E2E8F0] space-y-2 shadow-2xs">
                <div className="flex justify-between">
                  <span className="text-[#68758A]">Scheduled Dep:</span>
                  <span className="text-[#172033] font-medium">{formatDateTime(trip.scheduledDeparture)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68758A]">Actual Dep:</span>
                  <span className="text-[#16A36A] font-semibold">{formatDateTime(trip.actualDeparture)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68758A]">Actual Arrival:</span>
                  <span className="text-[#16A36A] font-semibold">{formatDateTime(trip.actualArrival)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68758A]">Total Duration:</span>
                  <span className="text-[#2879E8] font-bold">{getDuration()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Distance & Expense Performance */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#16A36A] m-0 flex items-center gap-1.5 font-bold">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Distance & Expense Accounting</span>
            </h4>

            <div className="grid grid-cols-4 gap-3.5 max-md:grid-cols-2 font-mono">
              <div className="bg-[#F8FAFD] p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                <span className="text-[10px] text-[#68758A] uppercase block font-semibold">Planned Dist</span>
                <b className="text-base text-[#172033]">{trip.estimatedDistanceKm} km</b>
              </div>
              <div className="bg-[#F8FAFD] p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                <span className="text-[10px] text-[#68758A] uppercase block font-semibold">Actual Dist</span>
                <b className="text-base text-[#2879E8]">{trip.actualDistanceKm || trip.estimatedDistanceKm} km</b>
              </div>
              <div className="bg-[#F8FAFD] p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                <span className="text-[10px] text-[#68758A] uppercase block font-semibold">Total Expenses</span>
                <b className="text-base text-[#16A36A]">${totalExpense.toFixed(2)}</b>
              </div>
              <div className="bg-[#F8FAFD] p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                <span className="text-[10px] text-[#68758A] uppercase block font-semibold">Cost / KM</span>
                <b className="text-base text-[#16A36A]">${costPerKm}/km</b>
              </div>
            </div>

            {/* Expense Breakdown List */}
            {Array.isArray(trip.expenses) && trip.expenses.length > 0 && (
              <div className="bg-[#F8FAFD] p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
                <span className="font-mono text-[10px] uppercase text-[#68758A] block mb-2 font-semibold">Itemized Disbursements</span>
                <div className="divide-y divide-[#E2E8F0] text-xs">
                  {trip.expenses.map((exp, idx) => (
                    <div key={exp.id || idx} className="py-2 flex justify-between font-mono text-[11px]">
                      <span className="text-[#172033] font-medium">{exp.type} — {exp.description}</span>
                      <span className="text-[#16A36A] font-bold">${Number(exp.amount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section: Safety & Geofence Compliance */}
          <div className="bg-[#F8FAFD] p-4 rounded-xl border border-[#E2E8F0] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#16A36A]" />
              <div>
                <b className="text-xs text-[#172033] block">Safety & Geofence Compliance</b>
                <span className="text-[11px] text-[#68758A] font-medium">
                  {geofenceEvents.length > 0
                    ? `${geofenceEvents.length} perimeter events noted during voyage.`
                    : 'Zero perimeter violations or route deviations logged during this voyage.'}
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-[#E8F7F0] text-[#16A36A] border border-[#C2E8D7] font-bold">
              AUDITED
            </span>
          </div>

          {/* Signatures & Auditor Sign-off */}
          <div className="pt-6 border-t border-[#E2E8F0] grid grid-cols-2 gap-8 text-[11px] font-mono text-[#68758A]">
            <div className="border-t border-dashed border-[#CBD5E1] pt-2">
              <p className="m-0 text-[#68758A]">Driver Signature / Sign-off:</p>
              <p className="text-xs text-[#172033] mt-1 font-bold">{driver?.name || trip.assignedDriverId || 'Certified Operator'}</p>
            </div>
            <div className="border-t border-dashed border-[#CBD5E1] pt-2 text-right">
              <p className="m-0 text-[#68758A]">Dispatch Supervisor Verification:</p>
              <p className="text-xs text-[#172033] mt-1 font-bold">Suryansh Tyagi (Administrator)</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
          <span className="text-[11px] font-mono text-[#68758A]">
            Formatted for standard A4 / US Letter export
          </span>
          <div className="flex items-center gap-2.5">
            <Button
              variant="default"
              size="sm"
              onClick={handleDownloadText}
              icon={Download}
            >
              Download Manifest (.txt)
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              icon={Printer}
            >
              Print / Save as PDF
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
