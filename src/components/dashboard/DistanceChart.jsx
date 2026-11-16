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
        <div className="bg-white/95 backdrop-blur-xl border border-white/90 p-2.5 rounded-xl shadow-liquid-dropdown text-xs font-mono">
          <p className="text-[#8A97AB] text-[10px] uppercase mb-1 font-semibold">{label}</p>
          <p className="text-[#2879E8] font-bold text-sm">
            {payload[0].value.toLocaleString()} <span className="text-[#68758A] font-normal text-xs">km</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <article className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between transition-all duration-300">
      {/* Panel Heading with Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#475569] uppercase mb-1 font-bold">
            Fleet performance
          </p>
          <h2 className="text-[16px] font-black tracking-tight text-[#0B132B] m-0">
            Distance Travelled
          </h2>
        </div>
        <select
          value={period}
          onChange={handlePeriodChange}
          aria-label="Chart period"
          className="bg-[#F8FAFD] text-[#0B132B] border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-[11px] font-bold outline-none hover:border-[#2879E8]/40 hover:bg-[#F0F5FC] focus:border-[#2879E8] transition-all cursor-pointer shadow-2xs"
        >
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="year">This year</option>
        </select>
      </div>

      {/* Chart Summary */}
      <div className="flex items-center gap-3 my-4">
        <strong className="text-[26px] font-black tracking-tight text-[#172033]">
          {currentData.total} <small className="text-[11px] text-[#68758A] font-medium font-sans">km</small>
        </strong>
        <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E8F7F0] text-[#16A36A] border border-[#C2E8D7]">
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
                <stop offset="0%" stopColor="#2879E8" stopOpacity={0.25} />
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
              stroke="#8A97AB"
              fontSize={9}
              fontFamily="DM Mono"
              tickLine={false}
              axisLine={false}
              dy={6}
            />
            <YAxis
              stroke="#8A97AB"
              fontSize={9}
              fontFamily="DM Mono"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2879E8"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#blueDistanceGradient)"
              activeDot={{
                r: 5,
                fill: '#2879E8',
                stroke: '#EAF3FF',
                strokeWidth: 4
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-between text-[#8A97AB] text-[10px] pt-3 border-t border-[#E2E8F0]/80 mt-3 font-mono">
        <span className="flex items-center gap-1.5 font-sans font-medium text-[#68758A]">
          <i className="w-2 h-2 rounded-full bg-[#2879E8] inline-block not-italic shadow-[0_0_6px_#2879E8]" />
          Fleet Trajectory (km)
        </span>
        <span>Updated 10 min ago</span>
      </div>
    </article>
  );
}
