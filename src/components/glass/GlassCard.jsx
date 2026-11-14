import React from 'react';

/**
 * GlassCard - Core solid, glossy white Liquid Glass card container.
 * Features 92-98% solid white surface, layered ambient shadows,
 * subtle blue reflection, and upper-edge highlight.
 */
export default function GlassCard({
  children,
  className = '',
  hover = false,
  onClick,
  as: Component = 'div',
  padding = 'p-5',
  ...props
}) {
  return (
    <Component
      onClick={onClick}
      className={`glass-card ${hover ? 'glass-card-hover cursor-pointer' : ''} ${padding} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
