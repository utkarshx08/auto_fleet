import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Milestone, Trophy, ArrowDownRight, Compass } from 'lucide-react';

export default function DistanceMileageSection({ mileageData }) {
  if (!mileageData) return null;

  const {
    totalDistance,
    avgDailyDistance,
    longestVehicle,
    lowestVehicle,
    vehicleMileageList,
    dailyTrends
  } = mileageData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl border border-white/90 p-3 rounded-xl shadow-liquid-dropdown text-xs font-mono">
          <p className="text-[#8A97AB] text-[10px] uppercase mb-1 font-semibold">{label}</p>
          <p className="text-[#2879E8] font-bold text-sm">
            Distance: {payload[0].value.toLocaleString()} km
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-5 shadow-liquid-subtle">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#475569] uppercase mb-0.5 font-bold">
            Module 02
          </p>
          <h2 className="text-base font-black text-[#0B132B] m-0 flex items-center gap-2">
            <Milestone className="w-4 h-4 text-[#2879E8]" /> Distance Traveled & Mileage Intelligence
          </h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#475569] font-bold">
          <span>Fleet Total: <b className="text-[#0B132B]">{totalDistance.toLocaleString()} km</b></span>
          <span>Daily Avg: <b className="text-[#16A36A] font-bold">{avgDailyDistance} km/day</b></span>
        </div>
      </div>

      {/* Longest & Lowest Stat Badges */}
      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3.5">
        <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3.5 rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#2879E8] flex items-center justify-center border border-[#D5E6FB] shadow-2xs">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[9px] text-[#8A97AB] uppercase block font-semibold">
                Top Mileage Performer
              </span>
              <b className="text-xs text-[#172033] block mt-0.5 font-mono font-bold">
                {longestVehicle?.plate || 'RST-291'} ({longestVehicle?.distance || 3200} km)
              </b>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#16A36A] font-bold">Optimal Corridor</span>
        </div>

        <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3.5 rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FEF7EA] text-[#E7A329] flex items-center justify-center border border-[#F8DCB0] shadow-2xs">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[9px] text-[#8A97AB] uppercase block font-semibold">
                Lowest Active Mileage
              </span>
              <b className="text-xs text-[#172033] block mt-0.5 font-mono font-bold">
                {lowestVehicle?.plate || 'RST-263'} ({lowestVehicle?.distance || 950} km)
              </b>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#68758A] font-medium">Urban Shorthaul</span>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4 pt-2">
        {/* Daily Mileage Trend (Area Chart) */}
        <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-4 rounded-xl shadow-2xs">
          <span className="font-mono text-[10px] text-[#8A97AB] uppercase block mb-3 font-semibold">
            Daily Fleet Distance Trajectory
          </span>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mileageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2879E8" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2879E8" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 5" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="date" stroke="#8A97AB" fontSize={9} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#8A97AB" fontSize={9} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="distance" stroke="#2879E8" strokeWidth={2.5} fill="url(#mileageGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Mileage Comparison (Bar Chart) */}
        <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-4 rounded-xl shadow-2xs">
          <span className="font-mono text-[10px] text-[#8A97AB] uppercase block mb-3 font-semibold">
            Mileage Breakdown by Deployed Asset
          </span>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleMileageList} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 5" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="plate" stroke="#8A97AB" fontSize={9} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#8A97AB" fontSize={9} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="distance" fill="#2879E8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
