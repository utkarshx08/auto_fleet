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
        return 'bg-[#70cbb7]';
      case 'violet':
        return 'bg-[#9b9de4]';
      case 'orange':
      case 'warning':
        return 'bg-[#d28e5f]';
      case 'purple':
      default:
        return 'bg-[#ab90ed]';
    }
  };

  return (
    <article
      className={`bg-[#17191f] border border-[#292c35] hover:border-[#383c4a] rounded-[10px] p-[17px] pb-[14px] min-h-[132px] flex flex-col justify-between transition-all duration-200 group ${className}`}
    >
      {/* Metric Top */}
      <div className="flex items-center justify-between text-[#8b8e9a] font-mono text-[9px] tracking-[1px] uppercase">
        <span>{title}</span>
        {isSymbolWarning ? (
          <span className="text-[#e8aa73] border border-[#5a4333] rounded-full w-[18px] h-[18px] flex items-center justify-center font-bold text-xs leading-none">
            !
          </span>
        ) : (
          <span className="text-[15px] text-[#a99ad0] group-hover:text-[#c4b3ff] transition-colors leading-none">
            {symbol}
          </span>
        )}
      </div>

      {/* Metric Value */}
      <div className="text-[27px] font-bold tracking-[-1px] text-[#f0f0f4] my-2 leading-none flex items-baseline gap-1.5">
        <span>{value}</span>
        {unit && (
          <small className="text-[11px] tracking-normal text-[#888b97] font-medium font-sans">
            {unit}
          </small>
        )}
      </div>

      {/* Metric Foot with Sparkline */}
      <div className="flex items-center justify-between text-[#777b87] text-[9px] gap-1.5 mt-auto pt-1">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-mono text-[10px] ${
              changeType === 'warning' ? 'text-[#e5a46e]' : 'text-[#80d9a9]'
            }`}
          >
            {changeText}
          </span>
          <span className="text-[#777b87]">{comparisonText}</span>
        </div>

        {/* Mini Bars Sparkline */}
        {sparklineTheme === 'steps' ? (
          <div className="ml-auto flex items-end gap-[3px] h-[21px]">
            {sparkline.map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}px` }}
                className="w-[5px] rounded-[2px] bg-[#d28e5f]"
              />
            ))}
          </div>
        ) : (
          <div className="ml-auto flex items-end gap-[3px] h-[22px]">
            {sparkline.map((h, i) => (
              <i
                key={i}
                style={{ height: `${h}%` }}
                className={`w-[4px] rounded-t-[3px] opacity-80 ${getThemeBarColor(
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

