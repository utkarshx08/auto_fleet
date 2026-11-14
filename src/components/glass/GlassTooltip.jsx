import React, { useState } from 'react';

/**
 * GlassTooltip - Apple-inspired minimal glass tooltip on hover.
 */
export default function GlassTooltip({
  content,
  children,
  position = 'top', // 'top', 'bottom', 'left', 'right'
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div
          role="tooltip"
          className={`absolute z-50 px-2.5 py-1 text-[11px] font-medium text-white bg-[#172033]/90 backdrop-blur-md rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-100 ${positionStyles[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
