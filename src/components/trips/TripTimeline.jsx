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
      <div className={`p-4 bg-[#14151b] rounded-[8px] text-center text-[#747683] text-xs ${className}`}>
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

  // Sort history chronologically descending or ascending (ascending for chronological timeline)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.changedAt || 0) - new Date(b.changedAt || 0)
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#252834]">
        {sortedHistory.map((item, idx) => {
          const Icon = getStatusIcon(item.toStatus);
          const isLatest = idx === sortedHistory.length - 1;

          return (
            <div key={item.id || idx} className="relative group">
              {/* Timeline Bullet Node */}
              <div
                className={`absolute -left-[23px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  isLatest
                    ? 'bg-[#24212f] border-[#b49aff] text-[#b49aff] shadow-[0_0_8px_rgba(180,154,255,0.4)]'
                    : 'bg-[#17191f] border-[#363946] text-[#858894]'
                }`}
              >
                <Icon className="w-2.5 h-2.5" />
              </div>

              {/* Event Content Box */}
              <div className="bg-[#14151b] border border-[#272935] hover:border-[#383c4a] rounded-[8px] p-3 transition-colors">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                  <div className="flex items-center gap-2">
                    {item.fromStatus && (
                      <span className="text-[11px] text-[#747683] line-through">
                        {item.fromStatus}
                      </span>
                    )}
                    <TripStatusBadge status={item.toStatus} size="sm" />
                  </div>
                  <span className="font-mono text-[10px] text-[#747683]">
                    {formatTimestamp(item.changedAt)}
                  </span>
                </div>

                <div className="text-xs text-[#d4d4dc] mt-1">
                  {item.notes || `Trip status updated to ${item.toStatus}.`}
                </div>

                <div className="mt-2 pt-2 border-t border-[#20222d] flex items-center justify-between text-[10px] text-[#6e717e] font-mono">
                  <span>Logged by: <b className="text-[#a0a3b1] font-normal">{item.changedBy || 'System'}</b></span>
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
