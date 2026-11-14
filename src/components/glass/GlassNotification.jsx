import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

/**
 * GlassNotification - Sleek notification alert or toast item.
 */
export default function GlassNotification({
  type = 'info', // 'info', 'success', 'warning', 'error'
  title,
  message,
  timestamp,
  onDismiss,
  className = ''
}) {
  const typeConfig = {
    info: {
      icon: Info,
      bg: 'bg-[#EAF3FF]',
      border: 'border-[#C8E0FF]',
      iconColor: 'text-[#2879E8]',
      titleColor: 'text-[#172033]'
    },
    success: {
      icon: CheckCircle2,
      bg: 'bg-[#E8F7F0]',
      border: 'border-[#B7E4CF]',
      iconColor: 'text-[#16A36A]',
      titleColor: 'text-[#172033]'
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-[#FEF7EA]',
      border: 'border-[#F8DFB4]',
      iconColor: 'text-[#E7A329]',
      titleColor: 'text-[#172033]'
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-[#FDF2F2]',
      border: 'border-[#FAD2D2]',
      iconColor: 'text-[#E05252]',
      titleColor: 'text-[#172033]'
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={`relative flex items-start gap-3 p-3.5 rounded-2xl border ${config.bg} ${config.border} shadow-liquid-subtle text-[#172033] ${className}`}
    >
      <div className={`p-1.5 rounded-xl bg-white/80 shadow-sm shrink-0 ${config.iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 pr-4">
        {title && (
          <h4 className={`text-xs font-semibold ${config.titleColor} tracking-tight`}>
            {title}
          </h4>
        )}
        {message && (
          <p className="text-[11px] text-[#68758A] mt-0.5 leading-relaxed">
            {message}
          </p>
        )}
        {timestamp && (
          <span className="font-mono text-[9px] text-[#94A3B8] mt-1 block">
            {timestamp}
          </span>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-[#94A3B8] hover:text-[#172033] p-1 rounded-lg hover:bg-black/5 transition-colors absolute top-2.5 right-2.5"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
