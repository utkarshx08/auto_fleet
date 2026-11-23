import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { distanceDataByPeriod } from '../../data/mockData';

export default function DistanceChart({ onPeriodChange }) {
  const [period, setPeriod] = useState('week');
  const currentData = distanceDataByPeriod[period] || distanceDataByPeriod.week;

  const handlePeriodChange = (e) => {
    const newPeriod = e.target.value;
    setPeriod(newPeriod);
    if (onPeriodChange) onPeriodChange(newPeriod);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/98 backdrop-blur-xl border border-slate-200 p-2.5 rounded-xl shadow-lg text-xs">
          <p className="text-slate-400 text-[10px] uppercase font-medium mb-0.5">{label}</p>
          <p className="text-[#2879E8] font-bold text-sm tabular-nums">
            {payload[0].value.toLocaleString()} <span className="text-slate-500 font-normal text-xs">km</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <article className="glass-card glass-card-hover p-5 sm:p-6 rounded-2xl flex flex-col justify-between transition-all duration-200">
      {/* Panel Heading with Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
            Fleet Performance
          </span>
          <h2 className="text-base font-bold tracking-tight text-slate-900 m-0">
            Distance Travelled
          </h2>
        </div>
        <select
          value={period}
          onChange={handlePeriodChange}
          aria-label="Chart period"
          className="bg-white text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium outline-none hover:border-slate-300 focus:border-[#2879E8] transition-all cursor-pointer shadow-2xs"
        >
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="year">This year</option>
        </select>
      </div>

      {/* Chart Summary */}
      <div className="flex items-center gap-2.5 my-3">
        <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
          {currentData.total} <span className="text-xs text-slate-500 font-normal">km</span>
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80">
          {currentData.change}
        </span>
      </div>

      {/* Chart Visualization */}
      <div className="h-[160px] w-full mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={currentData.data}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="blueDistanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2879E8" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#2879E8" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 5"
              stroke="#E2E8F0"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              stroke="#94A3B8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={6}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2879E8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#blueDistanceGradient)"
              activeDot={{
                r: 4.5,
                fill: '#2879E8',
                stroke: '#FFFFFF',
                strokeWidth: 2.5
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-between text-slate-400 text-xs pt-3 border-t border-slate-100 mt-2">
        <span className="flex items-center gap-1.5 font-medium text-slate-600">
          <span className="w-2 h-2 rounded-full bg-[#2879E8] shrink-0" />
          Fleet Trajectory (km)
        </span>
        <span className="text-[11px] text-slate-400">Updated 10 min ago</span>
      </div>
    </article>
  );
}
