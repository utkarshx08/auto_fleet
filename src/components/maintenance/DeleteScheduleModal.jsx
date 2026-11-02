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
      <div className="space-y-3.5 text-xs font-sans">
        <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-lg flex items-start gap-2.5 text-red-300">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight">
            <b>Confirm Schedule Deletion</b>
            <p className="mt-1 text-red-300/80 mb-0">
              Are you sure you want to remove the automated <b>{schedule.maintenanceType}</b> schedule for vehicle <b>{schedule.vehicleId}</b>? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="p-3 bg-[#121319] border border-[#252730] rounded-lg font-mono text-[10px] space-y-1 text-[#aeb0bb]">
          <div className="flex justify-between">
            <span>Schedule ID:</span> <b className="text-[#eee]">{schedule.id}</b>
          </div>
          <div className="flex justify-between">
            <span>Interval:</span> <span className="text-[#eee]">{schedule.intervalKm.toLocaleString()} km / {schedule.intervalDays} days</span>
          </div>
          <div className="flex justify-between">
            <span>Next Target:</span> <span className="text-[#8be0b3]">{schedule.nextServiceOdometer.toLocaleString()} km ({schedule.nextServiceDate})</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#252730] flex justify-end gap-2">
          <Button variant="quiet" size="sm" type="button" onClick={onClose}>
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

