import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search fleet, vehicles, drivers...',
  className = '',
  width = 'w-[260px]'
}) {
  return (
    <div
      className={`h-9 flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 transition-all duration-150 focus-within:border-[#2879E8] focus-within:ring-2 focus-within:ring-[#2879E8]/15 shadow-2xs ${width} ${className}`}
    >
      <Search className="w-3.5 h-3.5 shrink-0 text-slate-400" />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400 text-xs w-full font-sans leading-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            if (onClear) onClear();
            else onChange('');
          }}
          className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
