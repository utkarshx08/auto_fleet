import React from 'react';

/**
 * MetricCard - Commercial Fleet KPI Card
 * Clean, high-density, authoritative presentation with tabular numerals and calm telemetry trend bars.
 */
export default function MetricCard({
  title,
  symbol,
  isSymbolWarning = false,
  value,
  unit,
  changeText,
  changeType = 'positive', // 'positive', 'warning', 'neutral'
  comparisonText,
  sparkline = [],
  sparklineTheme = 'purple',
  className = ''
}) {
  const isPositive = changeType === 'positive';
  const isWarning = changeType === 'warning' || isSymbolWarning;

  return (
    <article
      className={`glass-card glass-card-hover p-4 sm:p-5 flex flex-col justify-between min-h-[136px] transition-all duration-200 ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-600 truncate">{title}</span>
        {isSymbolWarning ? (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold">
            !
          </span>
        ) : symbol && symbol !== '↗' ? (
          <span className="text-xs font-medium text-slate-400">
            {symbol}
          </span>
        ) : null}
      </div>

      {/* Primary KPI Value */}
      <div className="my-2.5 flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 tabular-nums leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-slate-500">
            {unit}
          </span>
        )}
      </div>

      {/* Trend & Telemetry Footer */}
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100/80 mt-auto">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          {changeText && (
            <span
              className={`inline-flex items-center text-[11px] font-medium px-1.5 py-0.5 rounded ${
                isWarning
                  ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                  : isPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {changeText}
            </span>
          )}
          {comparisonText && (
            <span className="text-[11px] text-slate-500 truncate">
              {comparisonText}
            </span>
          )}
        </div>

        {/* Clean Neutral Telemetry Bars (Current Point Accented) */}
        {Array.isArray(sparkline) && sparkline.length > 0 && (
          <div className="flex items-end gap-[3px] h-5 shrink-0 pl-1" aria-hidden="true">
            {sparkline.map((h, i) => {
              const isLast = i === sparkline.length - 1;
              const heightPct = Math.max(Math.min(h, 100), 12);
              return (
                <span
                  key={i}
                  style={{ height: `${heightPct}%` }}
                  className={`w-1 rounded-xs transition-colors duration-150 ${
                    isLast
                      ? isWarning
                        ? 'bg-amber-500'
                        : 'bg-[#2879E8]'
                      : 'bg-slate-200'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}
