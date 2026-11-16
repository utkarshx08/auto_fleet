import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Settings,
  User,
  X,
  ShieldAlert,
  Fuel
} from 'lucide-react';

export default function NotificationsModal({
  isOpen,
  onClose,
  alerts = [],
  onMarkAllAsRead,
  onClearAlerts,
  onSelectAlert
}) {
  const [dismissedIds, setDismissedIds] = useState([]);
  const [readIds, setReadIds] = useState([]);

  const visibleAlerts = alerts.filter((a) => !dismissedIds.includes(a.id));

  const handleDismiss = (e, alertId) => {
    e.stopPropagation();
    setDismissedIds((prev) => [...prev, alertId]);
  };

  const handleToggleRead = (e, alertId) => {
    e.stopPropagation();
    setReadIds((prev) =>
      prev.includes(alertId) ? prev.filter((id) => id !== alertId) : [...prev, alertId]
    );
  };

  const isAlertRead = (alert) => alert.read || readIds.includes(alert.id);

  const getIcon = (type) => {
    switch (type) {
      case 'maintenance':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 shadow-2xs">
            <Settings className="w-4 h-4" />
          </div>
        );
      case 'fuel':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#2879E8] flex items-center justify-center shrink-0 shadow-2xs">
            <Fuel className="w-4 h-4" />
          </div>
        );
      case 'geofence':
      case 'breach':
      case 'critical':
        return (
          <div className="w-8 h-8 rounded-xl bg-[#FEF2F2] text-[#E05252] flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
        );
      case 'document':
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-[#F0F5FC] text-[#2879E8] flex items-center justify-center shrink-0 shadow-2xs">
            <User className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Notification Centre"
      subtitle="Fleet Events & Automated Telemetry Alerts"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 text-xs font-sans text-[#172033]">
        {/* Controls Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[#172033]">
              {visibleAlerts.filter((a) => !isAlertRead(a)).length} Unread
            </span>
            <span className="text-[#94A3B8]">•</span>
            <span className="font-mono text-[11px] text-[#68758A]">
              {visibleAlerts.length} Total Events
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-[#2879E8] hover:text-[#1765CC] text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <span className="text-[#D5E2F1]">|</span>
            <button
              type="button"
              onClick={onClearAlerts}
              className="text-[#68758A] hover:text-[#E05252] text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {visibleAlerts.length === 0 ? (
            <div className="py-12 text-center text-[#68758A]">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] text-[#2879E8] flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-[#172033]">All Systems Nominal</p>
              <p className="text-[11px] text-[#68758A] mt-0.5">No unread fleet telemetry alerts or incidents.</p>
            </div>
          ) : (
            visibleAlerts.map((alert) => {
              const read = isAlertRead(alert);
              return (
                <div
                  key={alert.id}
                  onClick={() => {
                    if (onSelectAlert) onSelectAlert(alert);
                    onClose();
                  }}
                  className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    read
                      ? 'bg-[#F8FAFD] border-[#E2E8F0] opacity-75'
                      : 'bg-white border-[#D5E2F1] shadow-sm hover:border-[#2879E8]/40 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(alert.type)}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          {!read && (
                            <span className="w-2 h-2 rounded-full bg-[#2879E8] shrink-0" />
                          )}
                          <b className="text-xs font-bold text-[#172033] truncate block">
                            {alert.title}
                          </b>
                        </div>
                        <span className="font-mono text-[10px] text-[#94A3B8] shrink-0">
                          {alert.timestamp}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#68758A] line-clamp-2 leading-relaxed">
                        {alert.desc}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        {alert.vehicle && (
                          <span className="font-mono text-[10px] font-semibold text-[#2879E8] bg-[#EAF3FF] px-2 py-0.5 rounded-md border border-[#2879E8]/15">
                            {alert.vehicle}
                          </span>
                        )}
                        <span className="text-[10px] text-[#94A3B8] capitalize font-mono">
                          {alert.type || 'System Event'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Dismiss Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDismiss(e, alert.id)}
                      title="Dismiss notification"
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#94A3B8] hover:text-[#E05252] rounded-lg hover:bg-[#FEF2F2] transition-all absolute top-3 right-3"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
          <span className="text-[11px] text-[#94A3B8] font-mono">AUTRAIL Dispatch Sentinel</span>
          <Button variant="default" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
