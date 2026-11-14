import React from 'react';

/**
 * GlassBadge - Crisp pill badge with soft glossy background and status indicator.
 */
export default function GlassBadge({
  children,
  variant = 'blue', // 'blue', 'green', 'amber', 'red', 'neutral'
  dot = true,
  pulse = false,
  className = '',
  size = 'md', // 'sm', 'md'
  icon: Icon
}) {
  const variantStyles = {
    blue: 'bg-[#EAF3FF] text-[#1D68D3] border-[#C8E0FF] dot-bg-[#2879E8]',
    green: 'bg-[#E8F7F0] text-[#138656] border-[#B7E4CF] dot-bg-[#16A36A]',
    amber: 'bg-[#FEF7EA] text-[#C07914] border-[#F8DFB4] dot-bg-[#E7A329]',
    red: 'bg-[#FDF2F2] text-[#D32F2F] border-[#FAD2D2] dot-bg-[#E05252]',
    neutral: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0] dot-bg-[#64748B]'
  };

  const dotColors = {
    blue: 'bg-[#2879E8]',
    green: 'bg-[#16A36A]',
    amber: 'bg-[#E7A329]',
    red: 'bg-[#E05252]',
    neutral: 'bg-[#64748B]'
  };

  const currentVariant = variantStyles[variant] || variantStyles.neutral;
  const currentDot = dotColors[variant] || dotColors.neutral;

  const sizes = {
    sm: 'text-[9px] px-2 py-0.5',
    md: 'text-[10px] px-2.5 py-1'
  };

  return (
    <span
      className={`glass-pill border ${currentVariant} ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${currentDot} ${
            pulse ? 'animate-pulse' : ''
          }`}
        />
      )}
      {Icon && <Icon className="w-3 h-3" />}
      <span>{children}</span>
    </span>
  );
}
