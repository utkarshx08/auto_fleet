import React from 'react';

export default function Button({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 transition-all duration-200 font-sans cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] font-medium';

  const variants = {
    primary: 'glass-btn-primary font-semibold',
    default: 'glass-btn-secondary',
    quiet: 'glass-btn-secondary',
    text: 'bg-transparent text-[#2879E8] hover:text-[#1765CC] p-0 border-0 text-[11px] font-semibold inline-flex items-center gap-1.5',
    danger: 'bg-[#FDF2F2] hover:bg-[#FBE8E8] text-[#E05252] font-semibold border border-[#FAD2D2] shadow-sm',
    ghost: 'bg-transparent hover:bg-[#F0F5FC] text-[#68758A] hover:text-[#172033] border-0'
  };

  const sizes = {
    sm: 'text-[11px] px-3 py-1.5 rounded-lg',
    md: 'text-xs px-3.5 py-2 rounded-xl',
    lg: 'text-sm px-4.5 py-2.5 rounded-xl',
    icon: 'p-2 rounded-xl'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.default} ${variant !== 'text' ? (sizes[size] || sizes.md) : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </button>
  );
}

