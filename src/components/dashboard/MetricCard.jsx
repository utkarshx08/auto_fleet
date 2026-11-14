import React from 'react';

export default function MetricCard({
  title,
  symbol,
  isSymbolWarning = false,
  value,
  unit,
  changeText,
  changeType = 'positive', // 'positive' or 'warning'
  comparisonText,
  sparkline = [],
  sparklineTheme = 'purple', // 'purple', 'teal', 'violet', 'steps'
  className = ''
}) {
  const getThemeBarColor = (theme) => {
    switch (theme) {
      case 'teal':
        return 'bg-gradient-to-t from-[#0D9488] to-[#2DD4BF]';
      case 'violet':
        return 'bg-gradient-to-t from-[#6366F1] to-[#818CF8]';
      case 'orange':
      case 'warning':
      case 'steps':
        return 'bg-gradient-to-t from-[#D97706] to-[#F59E0B]';
      case 'purple':
      default:
        return 'bg-gradient-to-t from-[#2879E8] to-[#60A5FA]';
    }
  };

  return (
    <article
      className={`glass-card glass-card-hover p-5 pb-4 min-h-[142px] flex flex-col justify-between rounded-2xl transition-all duration-300 group ${className}`}
    >
      {/* Metric Top */}
      <div className="flex items-center justify-between text-[#68758A] font-mono text-[10px] tracking-[1.2px] uppercase font-semibold">
        <span>{title}</span>
        {isSymbolWarning ? (
          <span className="bg-[#FEF7EA] text-[#E7A329] border border-[#F8DCB0] rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs leading-none shadow-2xs">
            !
          </span>
        ) : (
          <span className="w-6 h-6 rounded-full bg-[#EAF3FF] text-[#2879E8] border border-[#D5E6FB] flex items-center justify-center font-bold text-xs leading-none shadow-2xs group-hover:scale-105 transition-transform">
            {symbol}
          </span>
        )}
      </div>

      {/* Metric Value */}
      <div className="text-[30px] font-black tracking-[-1px] text-[#172033] my-2.5 leading-none flex items-baseline gap-2">
        <span>{value}</span>
        {unit && (
          <small className="text-[12px] tracking-normal text-[#68758A] font-medium font-sans">
            {unit}
          </small>
        )}
      </div>

      {/* Metric Foot with Sparkline */}
      <div className="flex items-center justify-between text-[11px] gap-2 mt-auto pt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              changeType === 'warning'
                ? 'bg-[#FEF7EA] text-[#E7A329] border-[#F8DCB0]'
                : 'bg-[#E8F7F0] text-[#16A36A] border-[#C2E8D7]'
            }`}
          >
            {changeText}
          </span>
          <span className="text-[#68758A] text-[10px]">{comparisonText}</span>
        </div>

        {/* Mini Bars Sparkline */}
        {sparklineTheme === 'steps' ? (
          <div className="ml-auto flex items-end gap-[3px] h-[24px]">
            {sparkline.map((h, i) => (
              <span
                key={i}
                style={{ height: `${Math.max(h, 6)}px` }}
                className="w-[5px] rounded-t-[3px] bg-gradient-to-t from-[#D97706] to-[#F59E0B] shadow-2xs"
              />
            ))}
          </div>
        ) : (
          <div className="ml-auto flex items-end gap-[3px] h-[24px]">
            {sparkline.map((h, i) => (
              <i
                key={i}
                style={{ height: `${Math.max(h, 15)}%` }}
                className={`w-[5px] rounded-t-[3px] shadow-2xs ${getThemeBarColor(
                  sparklineTheme
                )}`}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
