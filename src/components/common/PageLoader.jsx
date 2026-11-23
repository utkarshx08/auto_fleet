import React from 'react';
import { Loader2 } from 'lucide-react';

export default function PageLoader({ text = 'Loading fleet data...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[45vh] w-full p-8 space-y-3">
      <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-[#2879E8] animate-spin" />
      <div className="text-center">
        <p className="text-xs font-medium text-slate-700">{text}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">AUTRAIL Fleet Management</p>
      </div>
    </div>
  );
}
