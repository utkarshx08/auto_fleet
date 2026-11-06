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
        className="fixed right-6 bottom-6 z-50 flex flex-col-reverse gap-2.5 max-w-sm pointer-events-none"
      >
        {toasts.map((t) => {
          const toastType = t.type || 'info';
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex items-center justify-between gap-3 bg-[#24212f]/95 border border-[#3f3b52] hover:border-primary/50 text-[#e8ddff] px-4 py-3 rounded-xl shadow-2xl shadow-black/60 backdrop-blur-md transition-all duration-200 text-xs animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {toastType === 'success' && <CheckCircle2 className="w-4 h-4 text-[#8be0b3] shrink-0" />}
                {toastType === 'warning' && <AlertCircle className="w-4 h-4 text-[#e5a46e] shrink-0" />}
                {(toastType === 'danger' || toastType === 'error') && (
                  <AlertOctagon className="w-4 h-4 text-[#ef4444] shrink-0" />
                )}
                {toastType === 'info' && <Info className="w-4 h-4 text-[#b49aff] shrink-0" />}
                <span className="font-medium text-text-primary truncate">{t.message}</span>
              </div>
              {onDismiss && (
                <button
                  onClick={() => onDismiss(t.id)}
                  className="text-text-muted hover:text-text-primary p-0.5 rounded transition-colors shrink-0"
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
      className="fixed right-6 bottom-6 z-50 flex items-center gap-2.5 bg-[#24212f]/95 border border-[#3f3b52] hover:border-primary/50 text-[#e8ddff] px-4 py-3 rounded-xl shadow-2xl shadow-black/60 backdrop-blur-md transition-all duration-200 text-xs animate-in fade-in slide-in-from-bottom-2"
    >
      {type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#8be0b3] shrink-0" />}
      {type === 'warning' && <AlertCircle className="w-4 h-4 text-[#e5a46e] shrink-0" />}
      {(type === 'danger' || type === 'error') && (
        <AlertOctagon className="w-4 h-4 text-[#ef4444] shrink-0" />
      )}
      {type === 'info' && <Info className="w-4 h-4 text-[#b49aff] shrink-0" />}
      <span className="font-medium text-text-primary">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-text-muted hover:text-text-primary p-0.5 rounded transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
