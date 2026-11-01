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
        <div className="bg-[#1c1e25] border border-[#3b354d] p-2 rounded-md shadow-xl text-xs font-mono">
          <p className="text-[#a7a9b5] text-[10px] uppercase mb-1">{label}</p>
          <p className="text-[#b49aff] font-bold">
            Distance: {payload[0].value.toLocaleString()} km
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#252730]">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-0.5">
            Module 02
          </p>
          <h2 className="text-base font-bold text-[#f0f0f4] m-0 flex items-center gap-2">
            <Milestone className="w-4 h-4 text-[#b49aff]" /> Distance Traveled & Mileage Intelligence
          </h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#858894]">
          <span>Fleet Total: <b className="text-[#f0f0f4]">{totalDistance.toLocaleString()} km</b></span>
          <span>Daily Avg: <b className="text-[#8be0b3]">{avgDailyDistance} km/day</b></span>
        </div>
      </div>

      {/* Longest & Lowest Stat Badges */}
      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3">
        <div className="bg-[#121319] border border-[#242630] p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#24212f] text-[#b49aff] flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[8px] text-[#858894] uppercase block">
                Top Mileage Performer
              </span>
              <b className="text-xs text-[#f0f0f4] block mt-0.5 font-mono">
                {longestVehicle.vehicleId} — {longestVehicle.distance.toLocaleString()} km
              </b>
            </div>
          </div>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[#1c302a] text-[#83d7a9] border border-[#2c493d]">
            Max Traveled
          </span>
        </div>

        <div className="bg-[#121319] border border-[#242630] p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#382c25] text-[#e3ac77] flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[8px] text-[#858894] uppercase block">
                Lowest Mileage / Reserve
              </span>
              <b className="text-xs text-[#f0f0f4] block mt-0.5 font-mono">
                {lowestVehicle.vehicleId} — {lowestVehicle.distance.toLocaleString()} km
              </b>
            </div>
          </div>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[#382c25] text-[#e3ac77] border border-[#523d30]">
            Depot Standby
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
        {/* Daily Mileage Trend (Area Chart) */}
        <div className="bg-[#121319] border border-[#242630] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[9px] text-[#858894] uppercase">
              Daily Fleet Distance Trend (km)
            </span>
            <span className="font-mono text-[9px] text-[#80d9a9]">Past 7-Day Cycle</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mileageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b49aff" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#b49aff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 5" stroke="#252733" vertical={false} />
                <XAxis dataKey="day" stroke="#737682" fontSize={8} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#686c78" fontSize={8} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  name="Distance"
                  dataKey="total"
                  stroke="#b49aff"
                  strokeWidth={2.5}
                  fill="url(#mileageGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle-Wise Mileage Comparison (Bar Chart) */}
        <div className="bg-[#121319] border border-[#242630] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[9px] text-[#858894] uppercase">
              Mileage Accumulation by Vehicle (km)
            </span>
            <span className="font-mono text-[9px] text-[#8dc8ed]">Odometer Delta</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleMileageList} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 5" stroke="#252733" vertical={false} />
                <XAxis dataKey="vehicleId" stroke="#737682" fontSize={8} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#686c78" fontSize={8} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar name="Distance" dataKey="distance" fill="#b49aff" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

