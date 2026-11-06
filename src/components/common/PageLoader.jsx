import React from 'react';
import { Loader2 } from 'lucide-react';

export default function PageLoader({ text = 'Initializing Telemetry...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full p-8 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <div className="absolute w-8 h-8 rounded-full border-2 border-emerald-500/20 border-b-emerald-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }} />
        <Loader2 className="absolute w-5 h-5 text-primary animate-pulse" />
      </div>
      <div className="text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-text-secondary">{text}</p>
        <p className="text-[10px] text-text-muted mt-1 font-mono">AUTORAIL TELEMETRICS ENGINE</p>
      </div>
    </div>
  );
}
