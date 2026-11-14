import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * GlassModal - Premium dimensional dialog featuring soft blue backdrop blur,
 * solid white glass card chassis, refined header, and smooth transitions.
 */
export default function GlassModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  showClose = true,
  footer
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
      {/* Soft Ambient Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Chassis */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidth} glass-card shadow-2xl p-6 sm:p-7 z-10 text-[#172033] animate-in fade-in zoom-in-95 duration-200 my-auto`}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-start justify-between pb-4 border-b border-[#E2E8F0]/80">
            <div>
              {subtitle && (
                <p className="font-mono text-[10px] text-[#2879E8] tracking-widest uppercase font-semibold mb-1">
                  {subtitle}
                </p>
              )}
              {title && (
                <h3 className="text-lg font-bold text-[#172033] tracking-tight">{title}</h3>
              )}
            </div>
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-[#94A3B8] hover:text-[#172033] p-1.5 rounded-xl hover:bg-[#F0F5FC] transition-colors -mr-1"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="py-4 max-h-[78vh] overflow-y-auto pr-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="pt-4 border-t border-[#E2E8F0]/80 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
