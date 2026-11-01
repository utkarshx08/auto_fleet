import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search vehicle or driver...',
  className = '',
  width = 'w-[245px]'
}) {
  return (
    <div className={`flex items-center gap-2 bg-[#20222a] border border-[#30333d] focus-within:border-[#4c4265] rounded-[6px] px-2.5 transition-colors ${width} text-[#858894] ${className}`}>
      <Search className="w-3.5 h-3.5 shrink-0 text-[#858894]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-0 outline-none text-[#eee] placeholder-[#717480] text-[10px] py-2 w-full font-sans"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-[#717480] hover:text-[#d1d1da] p-0.5 rounded"
          aria-label="Clear search"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

