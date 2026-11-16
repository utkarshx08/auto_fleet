import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertOctagon, Info, X } from 'lucide-react';

/**
 * Enhanced AutoFleet Toast Notification & Queue Stack
 * Supports single toast mode (backward compatible) and multi-toast stacked queue.
 */
export default function Toast({
  message,
  type = 'info',
  visible,
  onClose,
  toasts = null,
  onDismiss = null
}) {
  // If multi-toast queue is provided, render the stack
  if (Array.isArray(toasts)) {
    if (toasts.length === 0) return null;

    return (
      <div
        role="region"
        aria-live="polite"
        className="fixed right-6 bottom-6 z-[70] flex flex-col-reverse gap-2.5 max-w-sm pointer-events-none"
      >
        {toasts.map((t) => {
          const toastType = t.type || 'info';
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex items-center justify-between gap-3 bg-white/95 border border-[#E2E8F0] hover:border-[#2879E8]/40 text-[#172033] px-4 py-3 rounded-2xl shadow-liquid-dropdown backdrop-blur-xl transition-all duration-200 text-xs animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {toastType === 'success' && <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />}
                {toastType === 'warning' && <AlertCircle className="w-4 h-4 text-[#E7A329] shrink-0" />}
                {(toastType === 'danger' || toastType === 'error') && (
                  <AlertOctagon className="w-4 h-4 text-[#E05252] shrink-0" />
                )}
                {toastType === 'info' && <Info className="w-4 h-4 text-[#2879E8] shrink-0" />}
                <span className="font-medium text-[#172033] break-words">{t.message}</span>
              </div>
              {onDismiss && (
                <button
                  onClick={() => onDismiss(t.id)}
                  className="text-[#8A97AB] hover:text-[#172033] p-1 rounded-lg hover:bg-[#F0F5FC] transition-colors shrink-0"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback to legacy single-toast mode
  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed right-6 bottom-6 z-[70] flex items-center gap-2.5 bg-white/95 border border-[#E2E8F0] hover:border-[#2879E8]/40 text-[#172033] px-4 py-3 rounded-2xl shadow-liquid-dropdown backdrop-blur-xl transition-all duration-200 text-xs animate-in fade-in slide-in-from-bottom-2"
    >
      {type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />}
      {type === 'warning' && <AlertCircle className="w-4 h-4 text-[#E7A329] shrink-0" />}
      {(type === 'danger' || type === 'error') && (
        <AlertOctagon className="w-4 h-4 text-[#E05252] shrink-0" />
      )}
      {type === 'info' && <Info className="w-4 h-4 text-[#2879E8] shrink-0" />}
      <span className="font-medium text-[#172033] break-words">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-[#8A97AB] hover:text-[#172033] p-1 rounded-lg hover:bg-[#F0F5FC] transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
