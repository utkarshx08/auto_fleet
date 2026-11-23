import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  showClose = true
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidth} glass-card p-6 sm:p-7 z-10 text-[#172033] animate-in fade-in zoom-in-95 duration-200 my-auto`}
      >
        <div className="flex items-start justify-between pb-3.5 border-b border-slate-100">
          <div>
            {subtitle && (
              <p className="text-xs font-semibold text-[#2879E8] mb-0.5">
                {subtitle}
              </p>
            )}
            <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
          </div>
          {showClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors -mr-1"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

