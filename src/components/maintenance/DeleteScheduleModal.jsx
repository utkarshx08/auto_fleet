import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function DeleteScheduleModal({
  isOpen,
  onClose,
  schedule,
  onConfirmDelete
}) {
  if (!schedule) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Maintenance Schedule"
      subtitle="Permanent Operational Removal"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs font-sans">
        <div className="p-3.5 bg-[#FDF2F2] border border-[#FAD2D2] rounded-xl flex items-start gap-3 text-[#E05252]">
          <AlertTriangle className="w-5 h-5 text-[#E05252] shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight">
            <b className="font-semibold text-[#E05252]">Confirm Schedule Deletion</b>
            <p className="mt-1 text-[#E05252]/90 mb-0 leading-relaxed">
              Are you sure you want to remove the automated <b>{schedule.maintenanceType}</b> schedule for vehicle <b>{schedule.vehicleId}</b>? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-gradient-to-br from-[#F8FAFD] to-[#FFFFFF] border border-[#D5E2F1] rounded-xl font-mono text-[11px] space-y-1.5 text-[#68758A] shadow-2xs">
          <div className="flex justify-between">
            <span>Schedule ID:</span> <b className="text-[#172033]">{schedule.id}</b>
          </div>
          <div className="flex justify-between">
            <span>Interval:</span> <span className="text-[#172033]">{Number(schedule.intervalKm || 0).toLocaleString()} km / {schedule.intervalDays || 180} days</span>
          </div>
          <div className="flex justify-between">
            <span>Next Target:</span> <span className="text-[#16A36A] font-semibold">{Number(schedule.nextServiceOdometer || 0).toLocaleString()} km ({schedule.nextServiceDate || 'Scheduled'})</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2.5">
          <Button variant="default" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirmDelete(schedule.id);
              onClose();
            }}
            icon={Trash2}
          >
            Delete Schedule
          </Button>
        </div>
      </div>
    </Modal>
  );
}

