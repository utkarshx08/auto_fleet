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
  const baseStyles = 'inline-flex items-center justify-center gap-1.5 transition-all duration-150 font-sans cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-[#b49aff] hover:bg-[#c4b3ff] active:bg-[#a385f8] text-[#17131f] font-extrabold border border-[#b49aff] shadow-sm',
    default: 'bg-transparent hover:bg-[#20222a] text-[#d1d1da] hover:text-white border border-[#353743]',
    quiet: 'bg-transparent hover:bg-[#20222a] text-[#d1d1da] hover:text-white border border-[#353743]',
    text: 'bg-transparent text-[#b8a2ff] hover:text-[#d0c2ff] p-0 border-0 text-[10px] font-medium inline-flex items-center gap-1',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40',
    ghost: 'bg-transparent hover:bg-[#20222a] text-[#aeb0ba] border-0'
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-1.5 rounded-[6px]',
    md: 'text-[11px] px-3.5 py-2 rounded-[7px]',
    lg: 'text-xs px-4 py-2.5 rounded-[8px]',
    icon: 'p-1.5 rounded-[6px]'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.default} ${variant !== 'text' ? sizes[size] : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </button>
  );
}

