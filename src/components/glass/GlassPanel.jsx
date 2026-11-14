import React from 'react';

/**
 * GlassPanel - Elevated or floating Liquid Glass panel for sidebars,
 * headers, floating controls, or overlays with high-fidelity backdrop blur.
 */
export default function GlassPanel({
  children,
  className = '',
  elevated = false,
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      className={`${elevated ? 'glass-panel-elevated' : 'glass-panel'} rounded-2xl ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
