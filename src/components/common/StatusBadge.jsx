import React from 'react';

export default function StatusBadge({
  status = 'active',
  type = 'table', // 'table' or 'pill'
  className = ''
}) {
  const normalized = (status || '').toLowerCase();

  if (type === 'pill') {
    if (normalized === 'active' || normalized === 'in service' || normalized === 'inservice') {
      return (
        <span className={`inline-flex items-center gap-1.5 bg-[#E8F7F0] text-[#138656] border border-[#B7E4CF] px-2.5 py-1 rounded-full font-mono text-[9px] font-semibold tracking-wider uppercase shadow-sm ${className}`}>
          <i className="w-1.5 h-1.5 rounded-full bg-[#16A36A] not-italic"></i>
          IN SERVICE
        </span>
      );
    }
    if (normalized === 'service' || normalized === 'maintenance') {
      return (
        <span className={`inline-flex items-center gap-1.5 bg-[#FEF7EA] text-[#C07914] border border-[#F8DFB4] px-2.5 py-1 rounded-full font-mono text-[9px] font-semibold tracking-wider uppercase shadow-sm ${className}`}>
          <i className="w-1.5 h-1.5 rounded-full bg-[#E7A329] not-italic"></i>
          MAINTENANCE
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] px-2.5 py-1 rounded-full font-mono text-[9px] font-semibold tracking-wider uppercase shadow-sm ${className}`}>
        <i className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] not-italic"></i>
        IDLE
      </span>
    );
  }

  // Table status style
  if (normalized === 'active' || normalized === 'on duty' || normalized === 'available') {
    return (
      <span className={`font-mono text-[10px] text-[#138656] font-semibold inline-flex items-center gap-1.5 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A]"></span>
        Active
      </span>
    );
  }
  if (normalized === 'service' || normalized === 'in service' || normalized === 'maintenance') {
    return (
      <span className={`font-mono text-[10px] text-[#C07914] font-semibold inline-flex items-center gap-1.5 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#E7A329]"></span>
        In service
      </span>
    );
  }
  return (
    <span className={`font-mono text-[10px] text-[#64748B] font-semibold inline-flex items-center gap-1.5 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]"></span>
      Idle
    </span>
  );
}

