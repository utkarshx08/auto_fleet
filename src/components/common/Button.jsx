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
  const baseStyles = 'inline-flex items-center justify-center font-sans select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#2879E8] focus-visible:outline-offset-1';

  const variants = {
    primary: 'bg-gradient-to-b from-[#2879E8] to-[#1A6CDA] hover:from-[#3485F4] hover:to-[#1765CC] text-white font-semibold border border-[#1A6CDA] shadow-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]',
    default: 'bg-white hover:bg-slate-50 text-slate-800 font-medium border border-slate-200 shadow-2xs hover:border-slate-300 hover:text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,1)]',
    quiet: 'bg-slate-100/80 hover:bg-slate-100 text-slate-700 font-medium border border-transparent hover:text-slate-900',
    text: 'bg-transparent text-[#2879E8] hover:text-[#1765CC] p-0 border-0 text-xs font-medium inline-flex items-center gap-1.5 hover:underline',
    danger: 'bg-rose-50 hover:bg-rose-100/80 text-rose-700 font-medium border border-rose-200/80 shadow-2xs',
    ghost: 'bg-transparent hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 border-0 font-medium'
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
    md: 'h-9 px-3.5 text-xs rounded-lg gap-2',
    lg: 'h-11 px-5 text-sm rounded-xl gap-2.5',
    icon: 'h-9 w-9 p-0 rounded-lg justify-center',
    'icon-sm': 'h-8 w-8 p-0 rounded-lg justify-center'
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
