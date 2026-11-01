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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidth} bg-[#17191f] border border-[#2b2e38] rounded-xl shadow-2xl p-6 z-10 overflow-hidden text-[#f0f0f4] animate-in fade-in zoom-in-95 duration-200`}
      >
        <div className="flex items-start justify-between pb-4 border-b border-[#252730]">
          <div>
            {subtitle && (
              <p className="font-mono text-[9px] text-[#858894] tracking-widest uppercase mb-1">
                {subtitle}
              </p>
            )}
            <h3 className="text-base font-bold text-[#f0f0f4] tracking-tight">{title}</h3>
          </div>
          {showClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-[#858894] hover:text-[#f0f0f4] p-1 rounded-md hover:bg-[#20222a] transition-colors"
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

