import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', visible, onClose }) {
  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed right-6 bottom-6 z-50 flex items-center gap-2.5 bg-[#292532] border border-[#55476e] text-[#e8ddff] px-4 py-3 rounded-[8px] shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all duration-200 text-[11px] animate-in fade-in slide-in-from-bottom-2"
    >
      {type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#8be0b3] shrink-0" />}
      {type === 'warning' && <AlertCircle className="w-4 h-4 text-[#edaa69] shrink-0" />}
      {type === 'info' && <Info className="w-4 h-4 text-[#b8a2ff] shrink-0" />}
      <span className="font-sans">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-[#9a95ad] hover:text-[#e8ddff] transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

