import React from 'react';

/**
 * GlassButton - Premium Liquid Glass button with crisp typography,
 * subtle blue gradients, solid borders, and tactile micro-interactions.
 */
export default function GlassButton({
  children,
  variant = 'primary', // 'primary', 'secondary', 'ghost', 'danger', 'soft-blue'
  size = 'md', // 'sm', 'md', 'lg', 'icon'
  icon: Icon,
  iconRight: IconRight,
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-sans font-medium transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const variants = {
    primary: 'glass-btn-primary',
    secondary: 'glass-btn-secondary',
    'soft-blue': 'bg-[#EAF3FF] hover:bg-[#D8EAFF] text-[#1D68D3] font-semibold border border-[#C8E0FF] shadow-sm',
    ghost: 'bg-transparent hover:bg-[#F0F5FC] text-[#68758A] hover:text-[#172033] border-transparent',
    danger: 'bg-[#FDF2F2] hover:bg-[#FBE8E8] text-[#E05252] font-semibold border border-[#F8D7D7] shadow-sm hover:shadow'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-lg',
    md: 'text-xs px-4 py-2.5 rounded-xl',
    lg: 'text-sm px-5 py-3 rounded-2xl',
    icon: 'p-2 rounded-xl'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.secondary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight className="w-4 h-4 shrink-0" />}
    </button>
  );
}
