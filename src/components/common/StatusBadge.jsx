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
        <span className={`inline-flex items-center gap-1.5 bg-[#1c302a] text-[#8ad8ad] border border-[#2c493d] px-2 py-1 rounded-full font-mono text-[9px] tracking-wider uppercase ${className}`}>
          <i className="w-[5px] h-[5px] rounded-full bg-[#81d8a8] not-italic"></i>
          IN SERVICE
        </span>
      );
    }
    if (normalized === 'service' || normalized === 'maintenance') {
      return (
        <span className={`inline-flex items-center gap-1.5 bg-[#382c25] text-[#e3ac77] border border-[#523d30] px-2 py-1 rounded-full font-mono text-[9px] tracking-wider uppercase ${className}`}>
          <i className="w-[5px] h-[5px] rounded-full bg-[#e3ac77] not-italic"></i>
          MAINTENANCE
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 bg-[#20222a] text-[#a5a7b0] border border-[#30333d] px-2 py-1 rounded-full font-mono text-[9px] tracking-wider uppercase ${className}`}>
        <i className="w-[5px] h-[5px] rounded-full bg-[#858997] not-italic"></i>
        IDLE
      </span>
    );
  }

  // Table status style
  if (normalized === 'active' || normalized === 'on duty' || normalized === 'available') {
    return (
      <span className={`font-mono text-[9px] text-[#83d7a9] inline-flex items-center gap-1.5 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#83d7a9]"></span>
        Active
      </span>
    );
  }
  if (normalized === 'service' || normalized === 'in service' || normalized === 'maintenance') {
    return (
      <span className={`font-mono text-[9px] text-[#e1a46f] inline-flex items-center gap-1.5 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#e1a46f]"></span>
        In service
      </span>
    );
  }
  return (
    <span className={`font-mono text-[9px] text-[#a5a7b0] inline-flex items-center gap-1.5 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#717480]"></span>
      Idle
    </span>
  );
}

