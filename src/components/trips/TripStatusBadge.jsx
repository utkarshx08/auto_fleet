import React from 'react';
import {
  Clock,
  Calendar,
  UserCheck,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileEdit
} from 'lucide-react';

export default function TripStatusBadge({ status, size = 'md', className = '' }) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Draft':
        return {
          bg: 'bg-[#21232c] text-[#a0a3b1] border-[#343847]',
          dot: 'bg-[#7e8294]',
          icon: FileEdit,
          label: 'Draft'
        };
      case 'Scheduled':
        return {
          bg: 'bg-[#182338] text-[#8cb4ff] border-[#293d66]',
          dot: 'bg-[#5b96ff]',
          icon: Calendar,
          label: 'Scheduled'
        };
      case 'Assigned':
        return {
          bg: 'bg-[#271e3d] text-[#c4b3ff] border-[#44336b]',
          dot: 'bg-[#ad91ff]',
          icon: UserCheck,
          label: 'Assigned'
        };
      case 'In Progress':
        return {
          bg: 'bg-[#122822] text-[#6ee7b7] border-[#1d4c3e]',
          dot: 'bg-[#10b981] animate-pulse',
          icon: Navigation,
          label: 'In Progress'
        };
      case 'Completed':
        return {
          bg: 'bg-[#142921] text-[#70cbb7] border-[#20493b]',
          dot: 'bg-[#34d399]',
          icon: CheckCircle2,
          label: 'Completed'
        };
      case 'Delayed':
        return {
          bg: 'bg-[#332214] text-[#fcd34d] border-[#5c3e21]',
          dot: 'bg-[#f59e0b] animate-ping',
          icon: AlertTriangle,
          label: 'Delayed'
        };
      case 'Cancelled':
        return {
          bg: 'bg-[#321719] text-[#fca5a5] border-[#5e272a]',
          dot: 'bg-[#ef4444]',
          icon: XCircle,
          label: 'Cancelled'
        };
      default:
        return {
          bg: 'bg-[#21232c] text-[#a0a3b1] border-[#343847]',
          dot: 'bg-[#7e8294]',
          icon: Clock,
          label: status || 'Unknown'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-1 gap-1.5',
    lg: 'text-[12px] px-3 py-1.5 gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-[6px] transition-colors select-none ${
        config.bg
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <Icon className={`shrink-0 ${iconSizes[size] || iconSizes.md}`} />
      <span className="truncate">{config.label}</span>
    </span>
  );
}

