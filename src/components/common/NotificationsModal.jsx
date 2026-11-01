import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { Bell, CheckCheck, Trash2, ArrowUpRight, AlertTriangle, Settings, User } from 'lucide-react';

export default function NotificationsModal({
  isOpen,
  onClose,
  alerts = [],
  onMarkAllAsRead,
  onClearAlerts,
  onSelectAlert
}) {
  const getIcon = (type) => {
    switch (type) {
      case 'maintenance':
        return <Settings className="w-3.5 h-3.5 text-[#e5a46e]" />;
      case 'fuel':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#b49aff]" />;
      case 'document':
      default:
        return <User className="w-3.5 h-3.5 text-[#86c9ed]" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fleet Notifications & System Events"
      subtitle="Automated Telemetry Dispatch"
      maxWidth="max-w-md"
    >
      <div className="space-y-3 text-xs font-sans">
        <div className="flex items-center justify-between pb-2 border-b border-[#252730]">
          <span className="font-mono text-[10px] text-[#858894]">
            {alerts.length} Active System Alerts
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-[#b49aff] hover:text-[#c4b3ff] text-[10px] flex items-center gap-1 font-mono transition-colors"
            >
              <CheckCheck className="w-3 h-3" /> Mark all read
            </button>
            <span className="text-[#333]">|</span>
            <button
              type="button"
              onClick={onClearAlerts}
              className="text-[#747783] hover:text-red-400 text-[10px] flex items-center gap-1 font-mono transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          {alerts.length === 0 ? (
            <div className="py-8 text-center text-[#747783]">
              <Bell className="w-7 h-7 mx-auto mb-2 opacity-40 text-[#b49aff]" />
              <p className="text-xs">All systems operational. No unread alerts.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => {
                  if (onSelectAlert) onSelectAlert(alert);
                  onClose();
                }}
                className={`p-3 rounded-lg border flex items-start gap-3 transition-colors cursor-pointer ${
                  alert.read
                    ? 'bg-[#121319] border-[#22242d] opacity-60'
                    : 'bg-[#17191f] border-[#2e313d] hover:border-[#40375b]'
                }`}
              >
                <div className="w-7 h-7 rounded-md bg-[#20222a] flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <b className="text-[11px] text-[#f0f0f4] truncate block">{alert.title}</b>
                    <span className="font-mono text-[8px] text-[#70737f] shrink-0 ml-1">
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#999ca7] mt-0.5 mb-1 truncate">{alert.desc}</p>
                  <span className="font-mono text-[9px] text-[#b49aff] bg-[#24212f] px-1.5 py-0.5 rounded">
                    {alert.vehicle}
                  </span>
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

