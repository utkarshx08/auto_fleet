import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * GlassSelect - Custom-styled select field with subtle chevron indicator
 * and crisp Liquid Glass aesthetics.
 */
const GlassSelect = forwardRef(function GlassSelect(
  {
    label,
    options = [],
    error,
    className = '',
    selectClassName = '',
    id,
    children,
    ...props
  },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-[#172033] tracking-tight"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          className={`glass-input w-full text-xs px-3.5 py-2.5 pr-9 appearance-none cursor-pointer bg-white ${
            error ? 'border-[#E05252] focus:border-[#E05252]' : ''
          } ${selectClassName}`}
          {...props}
        >
          {children ? (
            children
          ) : (
            options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label || opt.value}
              </option>
            ))
          )}
        </select>

        <div className="absolute right-3 text-[#94A3B8] pointer-events-none flex items-center">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && (
        <p className="text-[11px] text-[#E05252] font-medium flex items-center gap-1 mt-0.5">
          <span>•</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});

export default GlassSelect;
