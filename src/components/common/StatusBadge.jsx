import React from 'react';

/**
 * Standard Fleet Status Badge
 * Replaces AI slop all-caps monospaced badges with calm, legible sentence-case status indicators.
 * Supports: 'pill' (contained chip) and 'table' (minimal inline indicator).
 */
export default function StatusBadge({
  status = 'active',
  type = 'table', // 'table' | 'pill'
  className = ''
}) {
  const raw = String(status || '').trim();
  const normalized = raw.toLowerCase().replace(/[-_]/g, ' ');

  // Normalize label to clean sentence-case
  const getLabel = () => {
    if (!raw) return 'Unknown';
    if (normalized === 'inservice' || normalized === 'in service') return 'In service';
    if (normalized === 'on duty' || normalized === 'onduty') return 'On duty';
    if (normalized === 'off duty' || normalized === 'offduty') return 'Off duty';
    if (normalized === 'on trip' || normalized === 'ontrip') return 'On trip';
    if (normalized === 'in progress' || normalized === 'inprogress') return 'In progress';
    if (normalized === 'out of service') return 'Out of service';
    // Default capitalize first letter
    return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  };

  const label = getLabel();

  // Category determination
  const isPositive = [
    'active', 'in service', 'inservice', 'on duty', 'available', 'completed', 'verified', 'inside', 'good'
  ].includes(normalized);

  const isWarning = [
    'service', 'maintenance', 'in progress', 'inprogress', 'scheduled', 'pending', 'resting', 'warning', 'en route'
  ].includes(normalized);

  const isInfo = [
    'dispatched', 'on trip', 'ontrip', 'assigned'
  ].includes(normalized);

  const isDanger = [
    'overdue', 'critical', 'suspended', 'cancelled', 'canceled', 'breach', 'flagged', 'out of service', 'alert'
  ].includes(normalized);

  // Pill style variant
  if (type === 'pill') {
    if (isPositive) {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          {label}
        </span>
      );
    }
    if (isWarning) {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          {label}
        </span>
      );
    }
    if (isInfo) {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          {label}
        </span>
      );
    }
    if (isDanger) {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
          {label}
        </span>
      );
    }
    // Default neutral (Idle, Draft, Off duty, etc.)
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
        {label}
      </span>
    );
  }

  // Table style variant (minimal inline dot + label)
  let dotColor = 'bg-slate-400';
  let textColor = 'text-slate-700';

  if (isPositive) {
    dotColor = 'bg-emerald-600';
    textColor = 'text-emerald-700';
  } else if (isWarning) {
    dotColor = 'bg-amber-500';
    textColor = 'text-amber-800';
  } else if (isInfo) {
    dotColor = 'bg-blue-600';
    textColor = 'text-blue-700';
  } else if (isDanger) {
    dotColor = 'bg-rose-600';
    textColor = 'text-rose-700';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${textColor} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
      {label}
    </span>
  );
}
