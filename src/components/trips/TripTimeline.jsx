import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  XCircle,
  FileText,
  UserCheck,
  Calendar
} from 'lucide-react';
import TripStatusBadge from './TripStatusBadge';

export default function TripTimeline({ history = [], currentStatus, className = '' }) {
  if (!Array.isArray(history) || history.length === 0) {
    return (
      <div className={`p-4 bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl text-center text-[#68758A] text-xs ${className}`}>
        No status history records logged yet.
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Draft':
        return FileText;
      case 'Scheduled':
        return Calendar;
      case 'Assigned':
        return UserCheck;
      case 'In Progress':
        return Play;
      case 'Completed':
        return CheckCircle2;
      case 'Delayed':
        return AlertTriangle;
      case 'Cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  const formatTimestamp = (iso) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return '—';
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return '—';
    }
  };

  // Sort history chronologically ascending
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.changedAt || 0) - new Date(b.changedAt || 0)
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
        {sortedHistory.map((item, idx) => {
          const Icon = getStatusIcon(item.toStatus);
          const isLatest = idx === sortedHistory.length - 1;

          return (
            <div key={item.id || idx} className="relative group">
              {/* Timeline Bullet Node */}
              <div
                className={`absolute -left-[23px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  isLatest
                    ? 'bg-[#EAF3FF] border-[#2879E8] text-[#2879E8] shadow-[0_0_8px_rgba(40,121,232,0.35)]'
                    : 'bg-white border-[#CBD5E1] text-[#8A97AB]'
                }`}
              >
                <Icon className="w-2.5 h-2.5" />
              </div>

              {/* Event Content Box */}
              <div className="bg-[#F8FAFD] border border-[#D5E2F1] hover:border-[#2879E8]/30 rounded-xl p-3.5 transition-all shadow-2xs">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                  <div className="flex items-center gap-2">
                    {item.fromStatus && (
                      <span className="text-[11px] text-[#8A97AB] line-through font-mono">
                        {item.fromStatus}
                      </span>
                    )}
                    <TripStatusBadge status={item.toStatus} size="sm" />
                  </div>
                  <span className="font-mono text-[10px] text-[#8A97AB]">
                    {formatTimestamp(item.changedAt)}
                  </span>
                </div>

                <div className="text-xs text-[#172033] mt-1 font-medium">
                  {item.notes || `Trip status updated to ${item.toStatus}.`}
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] text-[#68758A] font-mono">
                  <span>Logged by: <b className="text-[#172033] font-semibold">{item.changedBy || 'System'}</b></span>
                  <span>Record #{idx + 1}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
