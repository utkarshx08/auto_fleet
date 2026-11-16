import React from 'react';
import { Loader2 } from 'lucide-react';

export default function PageLoader({ text = 'Initializing Telemetry...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full p-8 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-2 border-[#2879E8]/20 border-t-[#2879E8] animate-spin" />
        <div className="absolute w-8 h-8 rounded-full border-2 border-[#16A36A]/20 border-b-[#16A36A] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
        <Loader2 className="absolute w-5 h-5 text-[#2879E8] animate-pulse" />
      </div>
      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-[#172033] font-semibold">{text}</p>
        <p className="text-[10px] text-[#8A97AB] mt-1 font-mono">AUTRAIL TELEMETRICS ENGINE</p>
      </div>
    </div>
  );
}

