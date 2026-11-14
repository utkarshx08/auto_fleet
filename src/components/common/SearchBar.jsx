import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search vehicle or driver...',
  className = '',
  width = 'w-[260px]'
}) {
  return (
    <div className={`flex items-center gap-2 bg-white/90 border border-[#E2E8F0] focus-within:border-[#2879E8] focus-within:ring-2 focus-within:ring-[#2879E8]/10 rounded-xl px-3 transition-all ${width} text-[#68758A] shadow-sm ${className}`}>
      <Search className="w-3.5 h-3.5 shrink-0 text-[#94A3B8]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-0 outline-none text-[#172033] placeholder-[#94A3B8] text-xs py-2 w-full font-sans"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-[#94A3B8] hover:text-[#172033] p-0.5 rounded-md hover:bg-[#F1F5F9]"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

