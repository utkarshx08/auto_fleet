import React from 'react';

/**
 * GlassSkeleton - Polished loading shimmer skeleton for Liquid Glass cards and tables.
 */
export default function GlassSkeleton({
  className = '',
  variant = 'rect', // 'text', 'rect', 'circle'
  width,
  height
}) {
  const variantStyles = {
    text: 'h-3.5 w-full rounded-md',
    rect: 'h-24 w-full rounded-2xl',
    circle: 'w-10 h-10 rounded-full'
  };

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      style={style}
      className={`glass-shimmer bg-[#EBF2FA]/80 ${variantStyles[variant] || variantStyles.rect} ${className}`}
    />
  );
}
