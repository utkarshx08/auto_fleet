import React, { useState, useRef, useEffect } from 'react';

/**
 * GlassDropdown - High-fidelity floating menu with Apple Liquid Glass styling,
 * smooth animations, and click-outside dismissal.
 */
export default function GlassDropdown({
  trigger,
  children,
  align = 'right', // 'left', 'right', 'center'
  className = '',
  menuClassName = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const alignmentClasses = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
    center: 'left-1/2 -translate-x-1/2 origin-top'
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen((prev) => !prev)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute mt-2 z-50 min-w-[200px] bg-white/95 backdrop-blur-xl border border-white/90 rounded-2xl p-1.5 shadow-liquid-dropdown text-[#172033] animate-in fade-in zoom-in-95 duration-150 ${alignmentClasses[align]} ${menuClassName}`}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}
