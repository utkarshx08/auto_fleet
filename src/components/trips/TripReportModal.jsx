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
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 text-xs text-[#d4d4dc]">
        {/* Printable Paper Canvas */}
        <div
          ref={reportRef}
          className="bg-[#121319] border border-[#272935] rounded-xl p-6 space-y-6 text-[#d4d4dc] print:bg-white print:text-black print:border-none print:p-0"
        >
          {/* Manifest Document Header */}
          <div className="flex justify-between items-start border-b border-[#242632] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded bg-[#b49aff] text-[#121319] font-extrabold flex items-center justify-center text-xs font-mono">
                  A
                </span>
                <span className="text-base font-extrabold text-[#f0f0f4] tracking-widest font-mono">
                  AUTRAIL DISPATCH MANIFEST
                </span>
              </div>
              <p className="text-[11px] text-[#858894] m-0">
                Automated Fleet Operations & Dispatch Registry
              </p>
            </div>

            <div className="text-right font-mono text-[11px] space-y-0.5">
              <div className="text-[#b49aff] font-bold text-sm">{trip.id}</div>
              <div className="text-[#858894]">Date: {new Date().toLocaleDateString()}</div>
              <div className="text-[#70cbb7] font-semibold uppercase">Status: {trip.status}</div>
            </div>
          </div>

          {/* Section: Client & Cargo */}
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 bg-[#17191f] p-3.5 rounded-[8px] border border-[#232530]">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#747683] block">Client / Customer</span>
              <b className="text-sm text-[#f0f0f4]">{trip.customerName}</b>
              <p className="text-[11px] text-[#858894] mt-0.5 m-0">Order: {trip.tripName}</p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-[#747683] block">Cargo Manifest</span>
              <p className="text-xs text-[#e0e0e7] m-0">
                {trip.cargoDetails || 'Standard general freight consignment.'}
              </p>
            </div>
          </div>

          {/* Section: Route Waypoints & Timing */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-[1px] text-[#b49aff] m-0 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Route Specifications & Timing Log</span>
            </h4>

            <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 font-mono text-xs">
              <div className="bg-[#17191f] p-3 rounded-[8px] border border-[#232530] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#747683]">Origin:</span>
                  <span className="text-[#e0e0e7] text-right truncate max-w-[200px]">{trip.pickupLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747683]">Destination:</span>
                  <span className="text-[#e0e0e7] text-right truncate max-w-[200px]">{trip.destinationLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747683]">Intermediate Stops:</span>
                  <span className="text-[#c4b3ff]">{trip.stops?.length || 0} stops recorded</span>
                </div>
              </div>

              <div className="bg-[#17191f] p-3 rounded-[8px] border border-[#232530] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#747683]">Scheduled Dep:</span>
                  <span className="text-[#e0e0e7]">{formatDateTime(trip.scheduledDeparture)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747683]">Actual Dep:</span>
                  <span className="text-[#8be0b3]">{formatDateTime(trip.actualDeparture)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747683]">Actual Arrival:</span>
                  <span className="text-[#8be0b3]">{formatDateTime(trip.actualArrival)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#747683]">Total Duration:</span>
                  <span className="text-[#b49aff] font-bold">{getDuration()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Distance & Expense Performance */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-[1px] text-[#6ee7b7] m-0 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Distance & Expense Accounting</span>
            </h4>

            <div className="grid grid-cols-4 gap-3 max-md:grid-cols-2 font-mono">
              <div className="bg-[#17191f] p-3 rounded-[8px] border border-[#232530]">
                <span className="text-[10px] text-[#747683] uppercase block">Planned Dist</span>
                <b className="text-base text-[#e0e0e7]">{trip.estimatedDistanceKm} km</b>
              </div>
              <div className="bg-[#17191f] p-3 rounded-[8px] border border-[#232530]">
                <span className="text-[10px] text-[#747683] uppercase block">Actual Dist</span>
                <b className="text-base text-[#b49aff]">{trip.actualDistanceKm || trip.estimatedDistanceKm} km</b>
              </div>
              <div className="bg-[#17191f] p-3 rounded-[8px] border border-[#232530]">
                <span className="text-[10px] text-[#747683] uppercase block">Total Expenses</span>
                <b className="text-base text-[#6ee7b7]">${totalExpense.toFixed(2)}</b>
              </div>
              <div className="bg-[#17191f] p-3 rounded-[8px] border border-[#232530]">
                <span className="text-[10px] text-[#747683] uppercase block">Cost / KM</span>
                <b className="text-base text-[#70cbb7]">${costPerKm}/km</b>
              </div>
            </div>

            {/* Expense Breakdown List */}
            {Array.isArray(trip.expenses) && trip.expenses.length > 0 && (
              <div className="bg-[#17191f] p-3 rounded-[8px] border border-[#232530]">
                <span className="font-mono text-[10px] uppercase text-[#747683] block mb-2">Itemized Disbursements</span>
                <div className="divide-y divide-[#242631] text-xs">
                  {trip.expenses.map((exp, idx) => (
                    <div key={exp.id || idx} className="py-1.5 flex justify-between font-mono text-[11px]">
                      <span className="text-[#e0e0e7]">{exp.type} — {exp.description}</span>
                      <span className="text-[#8be0b3]">${Number(exp.amount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section: Safety & Geofence Compliance */}
          <div className="bg-[#17191f] p-3.5 rounded-[8px] border border-[#232530] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#8be0b3]" />
              <div>
                <b className="text-xs text-[#f0f0f4] block">Safety & Geofence Compliance</b>
                <span className="text-[11px] text-[#858894]">
                  {geofenceEvents.length > 0
                    ? `${geofenceEvents.length} perimeter events noted during voyage.`
                    : 'Zero perimeter violations or route deviations logged during this voyage.'}
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#122822] text-[#6ee7b7] border border-[#1d4c3e]">
              AUDITED
            </span>
          </div>

          {/* Signatures & Auditor Sign-off */}
          <div className="pt-6 border-t border-[#242632] grid grid-cols-2 gap-8 text-[11px] font-mono text-[#747683]">
            <div className="border-t border-dashed border-[#363948] pt-2">
              <p className="m-0 text-[#a0a3b1]">Driver Signature / Sign-off:</p>
              <p className="text-xs text-[#e0e0e7] mt-1 font-semibold">{driver?.name || trip.assignedDriverId || 'Certified Operator'}</p>
            </div>
            <div className="border-t border-dashed border-[#363948] pt-2 text-right">
              <p className="m-0 text-[#a0a3b1]">Dispatch Supervisor Verification:</p>
              <p className="text-xs text-[#e0e0e7] mt-1 font-semibold">AUTRAIL Fleet Operations Lead</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-[#252834]">
          <span className="text-[11px] font-mono text-[#747683]">
            Print format formatted for standard A4 / US Letter
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="quiet"
              onClick={handleDownloadText}
              icon={Download}
            >
              Download Manifest (.txt)
            </Button>
            <Button
              variant="primary"
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

