import React from 'react';
import { CheckCircle2, AlertCircle, AlertOctagon, Info, X } from 'lucide-react';

/**
 * Solid Liquid Glass Toast Notification & Stack
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
        className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-[70] flex flex-col-reverse gap-2 max-w-sm w-full pointer-events-none px-2 sm:px-0"
      >
        {toasts.map((t) => {
          const toastType = t.type || 'info';
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex items-center justify-between gap-3 bg-white border border-slate-200/90 text-slate-800 px-3.5 py-2.5 rounded-xl shadow-lg transition-all duration-200 text-xs animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {toastType === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                {toastType === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
                {(toastType === 'danger' || toastType === 'error') && (
                  <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                {toastType === 'info' && <Info className="w-4 h-4 text-[#2879E8] shrink-0" />}
                <span className="font-medium text-slate-800 break-words">{t.message}</span>
              </div>
              {onDismiss && (
                <button
                  onClick={() => onDismiss(t.id)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors shrink-0"
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

  // Single-toast fallback
  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-[70] flex items-center justify-between gap-3 bg-white border border-slate-200/90 text-slate-800 px-3.5 py-2.5 rounded-xl shadow-lg transition-all duration-200 text-xs animate-in fade-in slide-in-from-bottom-2 max-w-sm"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
        {type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
        {(type === 'danger' || type === 'error') && (
          <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
        )}
        {type === 'info' && <Info className="w-4 h-4 text-[#2879E8] shrink-0" />}
        <span className="font-medium text-slate-800 break-words">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors shrink-0 ml-2"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
