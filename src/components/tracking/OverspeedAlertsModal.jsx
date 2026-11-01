import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { AlertTriangle, Crosshair, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function OverspeedAlertsModal({
  isOpen,
  onClose,
  alerts = [],
  speedLimit = 80,
  onFocusVehicle,
  onResolveAlert
}) {
  const overspeedList = alerts.filter((a) => a.alertType === 'overspeed');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Speed Violations & Safety Dispatch"
      subtitle={`Configured Fleet Threshold: ${speedLimit} km/h`}
      maxWidth="max-w-md"
    >
      <div className="space-y-3 text-xs font-sans">
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2.5 text-red-300">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <div className="text-[10px] leading-tight">
            <b>Automated Speed Safety Monitor</b>
            <p className="mt-0.5 text-red-300/80 mb-0">
              Immediate telemetry flags when transponder velocity exceeds safety limits.
            </p>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
          {overspeedList.length === 0 ? (
            <div className="py-6 text-center text-[#747783]">
              <CheckCircle2 className="w-6 h-6 text-[#8be0b3] mx-auto mb-1.5" />
              <p className="text-xs">No overspeed violations currently recorded.</p>
            </div>
          ) : (
            overspeedList.map((alert) => (
              <div
                key={alert.id}
                className="p-3 bg-[#121319] border border-[#2b2e38] rounded-lg flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <b className="font-mono text-xs text-[#f0f0f4]">{alert.vehicleId}</b>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                      {alert.speed || 86} km/h
                    </span>
                    <span className="font-mono text-[8px] text-[#717480]">{alert.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-[#999ca7] m-0">{alert.message}</p>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() => {
                      onClose();
                      if (onFocusVehicle) onFocusVehicle(alert.vehicleId);
                    }}
                  >
                    <Crosshair className="w-3 h-3 mr-1" /> Focus
                  </Button>
                  <button
                    type="button"
                    onClick={() => onResolveAlert && onResolveAlert(alert.id)}
                    className="text-[9px] text-[#858894] hover:text-[#8be0b3] font-mono transition-colors text-right"
                  >
                    Acknowledge
                  </button>
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

