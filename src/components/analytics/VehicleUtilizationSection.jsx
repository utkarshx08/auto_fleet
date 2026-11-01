import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Gauge, Clock, Info, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function VehicleUtilizationSection({ utilizationData }) {
  if (!utilizationData) return null;

  const {
    fleetUtilizationRate,
    totalActiveHours,
    totalIdleHours,
    totalMaintenanceHours,
    vehicleRankings,
    activeVsIdleHours,
    mostUtilized,
    underutilized
  } = utilizationData;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Optimal':
        return 'text-[#83d7a9] bg-[#1c302a] border-[#2c493d]';
      case 'Moderate':
        return 'text-[#8dc8ed] bg-[#263543] border-[#37495b]';
      case 'Underutilized':
      default:
        return 'text-[#e5a46e] bg-[#382c25] border-[#523d30]';
    }
  };

  return (
    <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#252730]">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-0.5">
            Module 03
          </p>
          <h2 className="text-base font-bold text-[#f0f0f4] m-0 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#8be0b3]" /> Vehicle Utilization & Operating Efficiency
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-[#858894]">
          <span>Fleet Avg: <b className="text-[#8be0b3]">{fleetUtilizationRate}%</b></span>
          <span>Active: <b className="text-[#f0f0f4]">{totalActiveHours} hrs</b></span>
          <span>Idle: <b className="text-[#e5a46e]">{totalIdleHours} hrs</b></span>
        </div>
      </div>

      {/* Utilization Formula & Assumptions Alert */}
      <div className="p-3 bg-[#121319] border border-[#262935] rounded-lg flex items-center gap-3">
        <Info className="w-4 h-4 text-[#b49aff] shrink-0" />
        <div className="text-[10px] text-[#999ca7] leading-relaxed flex-1">
          <b className="text-[#e0e0e7] font-mono mr-1">Formula:</b>
          Utilization Rate = <span className="text-[#b49aff] font-mono">(Active Hours / Available Operating Time) × 100</span>.
          Standard baseline assumes 240 operating hours available per calendar month (8 hours/day across active shifts).
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
        {/* Utilization Ranking Bar Chart */}
        <div className="bg-[#121319] border border-[#242630] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[9px] text-[#858894] uppercase">
              Vehicle Utilization Ranking (%)
            </span>
            <span className="font-mono text-[9px] text-[#b49aff]">Target: &gt; 80%</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleRankings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 5" stroke="#252733" vertical={false} />
                <XAxis dataKey="vehicleId" stroke="#737682" fontSize={8} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#686c78" fontSize={8} fontFamily="DM Mono" tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip />
                <Bar
                  dataKey="utilizationRate"
                  name="Utilization %"
                  fill="#8be0b3"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operating Hours Distribution Donut */}
        <div className="bg-[#121319] border border-[#242630] p-4 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[9px] text-[#858894] uppercase">
              Active Operation vs. Idle Hours
            </span>
            <span className="font-mono text-[9px] text-[#8be0b3]">Fleet Aggregate</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activeVsIdleHours}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  innerRadius={42}
                  paddingAngle={4}
                >
                  {activeVsIdleHours.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-around text-[9px] font-mono pt-2 border-t border-[#1e2029]">
            {activeVsIdleHours.map((h) => (
              <span key={h.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: h.color }} />
                <span className="text-[#aeb0ba]">{h.name}: {h.value}h</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle Performance Table */}
      <div className="bg-[#121319] border border-[#242630] p-4 rounded-lg overflow-x-auto">
        <h4 className="font-mono text-[9px] text-[#858894] uppercase mb-2">
          Vehicle Performance & Duty Hour Registry
        </h4>
        <table className="w-full text-left border-collapse text-[10px] font-mono whitespace-nowrap">
          <thead>
            <tr className="border-b border-[#2b2d38] text-[#747783] text-[8px] uppercase">
              <th className="py-2 px-1">Vehicle</th>
              <th className="py-2 px-1">Active Hours</th>
              <th className="py-2 px-1">Idle Hours</th>
              <th className="py-2 px-1">Maintenance</th>
              <th className="py-2 px-1">Utilization Rate</th>
              <th className="py-2 px-1 text-right">Operational Rating</th>
            </tr>
          </thead>
          <tbody>
            {vehicleRankings.map((veh) => (
              <tr key={veh.vehicleId} className="border-b border-[#1c1e27] hover:bg-[#1a1c24] transition-colors last:border-0">
                <td className="py-2 px-1 font-bold text-[#e0e0e7]">{veh.vehicleId}</td>
                <td className="py-2 px-1 text-[#83d7a9]">{veh.activeHours} hrs</td>
                <td className="py-2 px-1 text-[#858894]">{veh.idleHours} hrs</td>
                <td className="py-2 px-1 text-[#e5a46e]">{veh.maintenanceHours} hrs</td>
                <td className="py-2 px-1 text-[#b49aff] font-bold">{veh.utilizationRate}%</td>
                <td className="py-2 px-1 text-right">
                  <span className={`px-2 py-0.5 rounded-full border text-[8px] uppercase ${getStatusBadge(veh.status)}`}>
                    {veh.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

