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
        <div className="bg-[#1c1e25] border border-[#3b354d] p-2 rounded-md shadow-xl text-xs font-mono">
          <p className="text-[#a7a9b5] text-[10px] uppercase mb-1">{label}</p>
          <p className="text-[#b49aff] font-bold">
            {payload[0].value.toLocaleString()} <span className="text-[#888b97] font-normal">km</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <article className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-[18px] flex flex-col justify-between transition-all duration-200 hover:border-[#383c4a]">
      {/* Panel Heading with Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-1">
            Fleet performance
          </p>
          <h2 className="text-[14px] font-bold tracking-[-0.2px] text-[#f0f0f4] m-0">
            Distance travelled
          </h2>
        </div>
        <select
          value={period}
          onChange={handlePeriodChange}
          aria-label="Chart period"
          className="bg-[#22242d] text-[#bdbec8] border border-[#343641] rounded-[5px] px-2.5 py-1.5 text-[10px] outline-none hover:border-[#4b4360] focus:border-[#b49aff] transition-colors cursor-pointer"
        >
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="year">This year</option>
        </select>
      </div>

      {/* Chart Summary */}
      <div className="flex items-center gap-2.5 my-4">
        <strong className="text-[22px] font-bold tracking-[-0.6px] text-[#f0f0f4]">
          {currentData.total} <small className="text-[10px] text-[#8c8e99] font-medium font-sans">km</small>
        </strong>
        <span className="font-mono text-[10px] text-[#80d9a9]">{currentData.change}</span>
      </div>

      {/* Chart Visualization */}
      <div className="h-[154px] w-full mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={currentData.data}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="purpleDistanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b8a0ff" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#b8a0ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 5"
              stroke="#2b2d36"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              stroke="#737682"
              fontSize={8}
              fontFamily="DM Mono"
              tickLine={false}
              axisLine={false}
              dy={6}
            />
            <YAxis
              stroke="#686c78"
              fontSize={8}
              fontFamily="DM Mono"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#b49aff"
              strokeWidth={2.2}
              fillOpacity={1}
              fill="url(#purpleDistanceGradient)"
              activeDot={{
                r: 5,
                fill: '#c9b8ff',
                stroke: '#4e426b',
                strokeWidth: 4
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-between text-[#70737f] text-[9px] pt-2 border-t border-[#252730] mt-3">
        <span className="flex items-center gap-1.5 font-sans">
          <i className="w-1.5 h-1.5 rounded-full bg-[#b49aff] inline-block not-italic shadow-[0_0_6px_#b49aff]" />
          Distance (km)
        </span>
        <span className="font-mono text-[9px] text-[#70737f]">Updated 10 min ago</span>
      </div>
    </article>
  );
}

