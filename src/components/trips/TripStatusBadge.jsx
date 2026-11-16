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
          bg: 'bg-[#F1F5F9] text-[#68758A] border-[#E2E8F0]',
          dot: 'bg-[#94A3B8]',
          icon: FileEdit,
          label: 'Draft'
        };
      case 'Scheduled':
        return {
          bg: 'bg-[#EAF3FF] text-[#2879E8] border-[#D5E6FB]',
          dot: 'bg-[#2879E8]',
          icon: Calendar,
          label: 'Scheduled'
        };
      case 'Assigned':
        return {
          bg: 'bg-[#F0F5FC] text-[#1765CC] border-[#D5E2F1]',
          dot: 'bg-[#1765CC]',
          icon: UserCheck,
          label: 'Assigned'
        };
      case 'In Progress':
        return {
          bg: 'bg-[#EAF3FF] text-[#2879E8] border-[#D5E6FB]',
          dot: 'bg-[#2879E8] animate-pulse',
          icon: Navigation,
          label: 'In Progress'
        };
      case 'Completed':
        return {
          bg: 'bg-[#E8F7F0] text-[#16A36A] border-[#C2E8D7]',
          dot: 'bg-[#16A36A]',
          icon: CheckCircle2,
          label: 'Completed'
        };
      case 'Delayed':
        return {
          bg: 'bg-[#FEF7EA] text-[#E7A329] border-[#F8DFB4]',
          dot: 'bg-[#E7A329] animate-ping',
          icon: AlertTriangle,
          label: 'Delayed'
        };
      case 'Cancelled':
        return {
          bg: 'bg-[#FDF2F2] text-[#E05252] border-[#FAD2D2]',
          dot: 'bg-[#E05252]',
          icon: XCircle,
          label: 'Cancelled'
        };
      default:
        return {
          bg: 'bg-[#F1F5F9] text-[#68758A] border-[#E2E8F0]',
          dot: 'bg-[#94A3B8]',
          icon: Clock,
          label: status || 'Unknown'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 rounded-md font-mono',
    md: 'text-[11px] px-2.5 py-1 gap-1.5 rounded-lg font-mono font-medium',
    lg: 'text-[12px] px-3 py-1.5 gap-2 rounded-xl font-mono font-medium'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <span
      className={`inline-flex items-center font-medium border transition-colors select-none shadow-2xs ${
        config.bg
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <Icon className={`shrink-0 ${iconSizes[size] || iconSizes.md}`} />
      <span className="truncate">{config.label}</span>
    </span>
  );
}
