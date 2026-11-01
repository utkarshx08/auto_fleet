import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import {
  Truck,
  User,
  MapPin,
  Fuel,
  Gauge,
  Calendar,
  Wrench,
  ShieldCheck,
  Edit2,
  Trash2
} from 'lucide-react';

export default function VehicleDetailsModal({
  isOpen,
  onClose,
  vehicle,
  onEdit,
  onDelete
}) {
  if (!vehicle) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${vehicle.plate} — Telemetry Profile`}
      subtitle="Vehicle Specifications & Status"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs font-sans">
        {/* Top Header Card */}
        <div className="flex items-center justify-between p-3.5 bg-[#121319] border border-[#252730] rounded-lg">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-[#35323f] text-[#c0aaff] flex items-center justify-center font-bold text-base">
              ▰
            </span>
            <div>
              <h4 className="text-sm font-bold text-[#f0f0f4] leading-tight">
                {vehicle.make || 'Mercedes-Benz'} {vehicle.model}
              </h4>
              <p className="text-[10px] text-[#888b97] mt-0.5">
                Year: {vehicle.year || 2023} · Class: {vehicle.type || 'Commercial Cargo'}
              </p>
            </div>
          </div>
          <StatusBadge status={vehicle.status} type="pill" />
        </div>

        {/* 2x2 Grid Telemetry Info */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[#121319] border border-[#252730] p-3 rounded-lg">
            <span className="font-mono text-[8px] text-[#747783] uppercase flex items-center gap-1">
              <User className="w-3 h-3 text-[#b49aff]" /> Assigned Operator
            </span>
            <b className="text-xs text-[#d1d1da] block mt-1">{vehicle.driver}</b>
            <span className="text-[9px] text-[#858894] font-mono">{vehicle.driverPhone || '+1 (555) 234-5678'}</span>
          </div>

          <div className="bg-[#121319] border border-[#252730] p-3 rounded-lg">
            <span className="font-mono text-[8px] text-[#747783] uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#8be0b3]" /> Current Location
            </span>
            <b className="text-xs text-[#d1d1da] block mt-1">{vehicle.location}</b>
            <span className="text-[9px] text-[#747783] font-mono">
              GPS: {vehicle.coordinates?.lat || '40.7128'}, {vehicle.coordinates?.lng || '-74.0060'}
            </span>
          </div>

          <div className="bg-[#121319] border border-[#252730] p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[8px] text-[#747783] uppercase flex items-center gap-1">
                <Fuel className="w-3 h-3 text-[#e5a46e]" /> Fuel Tank Level
              </span>
              <span className="font-mono text-[10px] text-[#d1d1da] font-bold">{vehicle.fuel}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#2b2e38] rounded-full overflow-hidden mt-1.5">
              <div
                style={{ width: `${vehicle.fuel}%` }}
                className={`h-full rounded-full ${
                  vehicle.fuel > 50 ? 'bg-[#82d4a8]' : vehicle.fuel > 20 ? 'bg-[#e5a46e]' : 'bg-[#e56868]'
                }`}
              />
            </div>
            <span className="text-[8px] font-mono text-[#747783] block mt-1.5">
              Estimated range: ~{Math.round(vehicle.fuel * 7.5)} km
            </span>
          </div>

          <div className="bg-[#121319] border border-[#252730] p-3 rounded-lg">
            <span className="font-mono text-[8px] text-[#747783] uppercase flex items-center gap-1">
              <Gauge className="w-3 h-3 text-[#b49aff]" /> Cumulative Odometer
            </span>
            <b className="text-sm font-bold font-mono text-[#f0f0f4] block mt-1">
              {vehicle.odometer ? vehicle.odometer.toLocaleString() : '12,840'} km
            </b>
            <span className="text-[8px] font-mono text-[#80d9a9] block mt-0.5">
              Health: {vehicle.health || 'Optimal Condition'}
            </span>
          </div>
        </div>

        {/* Maintenance Banner */}
        <div className="bg-[#17191f] border border-[#2b2e38] p-3 rounded-lg flex items-center justify-between">
          <div>
            <span className="font-mono text-[8px] text-[#747783] uppercase block">
              Preventative Maintenance Schedule
            </span>
            <b className="text-[11px] text-[#d1d1da] mt-0.5 block">{vehicle.nextService}</b>
          </div>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[#24212f] text-[#c4b3ff] border border-[#40375b]">
            Inspect Interval
          </span>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-[#252730]">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onClose();
              if (onDelete) onDelete(vehicle);
            }}
            icon={Trash2}
          >
            Remove vehicle
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(vehicle);
              }}
              icon={Edit2}
            >
              Edit details
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

