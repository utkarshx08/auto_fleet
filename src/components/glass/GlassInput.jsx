import React, { forwardRef } from 'react';

/**
 * GlassInput - Solid white glossy input field with subtle inner shadow,
 * crisp border, and radiant blue focus state.
 */
const GlassInput = forwardRef(function GlassInput(
  {
    label,
    error,
    helperText,
    icon: Icon,
    iconRight: IconRight,
    onRightIconClick,
    className = '',
    inputClassName = '',
    id,
    type = 'text',
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[#172033] tracking-tight flex items-center justify-between"
        >
          <span>{label}</span>
          {helperText && !error && (
            <span className="text-[11px] font-normal text-[#68758A]">{helperText}</span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-[#94A3B8] pointer-events-none flex items-center">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`glass-input w-full text-xs px-3.5 py-2.5 ${
            Icon ? 'pl-10' : ''
          } ${IconRight ? 'pr-10' : ''} ${
            error ? 'border-[#E05252] focus:border-[#E05252] focus:ring-1 focus:ring-[#E05252]' : ''
          } ${inputClassName}`}
          {...props}
        />

        {IconRight && (
          <button
            type="button"
            onClick={onRightIconClick}
            tabIndex={onRightIconClick ? 0 : -1}
            className={`absolute right-3 text-[#94A3B8] ${
              onRightIconClick ? 'hover:text-[#172033] cursor-pointer' : 'pointer-events-none'
            } flex items-center p-1 rounded-md`}
          >
            <IconRight className="w-4 h-4" />
          </button>
        )}
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

export default GlassInput;
