import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { ShieldAlert, CheckCircle2, Edit2, Trash2, AlertTriangle } from 'lucide-react';

export default function FuelAnomalyReviewModal({
  isOpen,
  onClose,
  records = [],
  onClearAnomaly,
  onEditRecord,
  onDeleteRecord
}) {
  const anomalyRecords = records.filter((r) => r.isAnomaly);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fuel Anomaly Review & Auditing"
      subtitle="Rule-Based Fleet Discrepancy Screening"
      maxWidth="max-w-lg"
    >
      <div className="space-y-3.5 text-xs font-sans">
        <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-lg flex items-center gap-2.5 text-amber-300">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-[11px] leading-tight">
            <b>Suspicious Refuelling Events Flagged for Review</b>
            <p className="mt-0.5 text-amber-300/80 mb-0 text-[10px]">
              Entries flagged due to abnormal volume, potential duplicate receipts, odometer discrepancies, or spikes in consumption.
            </p>
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
          {anomalyRecords.length === 0 ? (
            <div className="py-8 text-center text-[#747783]">
              <CheckCircle2 className="w-6 h-6 text-[#8be0b3] mx-auto mb-1.5" />
              <p className="text-xs">No pending fuel anomalies. All records within operational parameters.</p>
            </div>
          ) : (
            anomalyRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-3 bg-[#121319] border border-[#2e2a36] rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <b className="font-mono text-xs text-[#f0f0f4]">{rec.vehicleId}</b>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                      FLAGGED
                    </span>
                    <span className="font-mono text-[8px] text-[#717480]">{rec.id}</span>
                  </div>
                  <span className="font-mono text-xs text-[#8be0b3] font-bold">
                    ${Number(rec.totalAmount).toFixed(2)}
                  </span>
                </div>

                <p className="text-[10px] text-amber-200/90 font-mono bg-amber-500/10 p-2 rounded border border-amber-500/20 m-0">
                  {rec.anomalyReason || 'Rule-based consumption anomaly detected.'}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#858894] pt-1">
                  <span>Driver: {rec.driverName}</span>
                  <span>Qty: {rec.quantity}L @ {rec.odometerReading?.toLocaleString()} km</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#22242e]">
                  <Button
                    variant="quiet"
                    size="sm"
                    onClick={() => {
                      onClose();
                      onEditRecord(rec);
                    }}
                    icon={Edit2}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onClearAnomaly(rec.id)}
                    icon={CheckCircle2}
                  >
                    Verify & Clear Flag
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-[#252730] flex justify-end">
          <Button variant="default" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

