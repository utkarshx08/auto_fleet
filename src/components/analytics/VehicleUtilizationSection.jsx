import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Gauge, Clock, Trophy, ArrowDownRight, ShieldCheck } from 'lucide-react';

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
        return 'text-[#16A36A] bg-[#E8F7F0] border-[#C2E8D7]';
      case 'Moderate':
        return 'text-[#2879E8] bg-[#EAF3FF] border-[#D5E6FB]';
      case 'Underutilized':
      default:
        return 'text-[#E7A329] bg-[#FEF7EA] border-[#F8DCB0]';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-5 shadow-liquid-subtle">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#475569] uppercase mb-0.5 font-bold">
            Module 03
          </p>
          <h2 className="text-base font-black text-[#0B132B] m-0 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#2879E8]" /> Asset Availability & Utilization Ratios
          </h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#475569] font-bold">
          <span>Fleet Utilization: <b className="text-[#16A36A] font-bold">{fleetUtilizationRate}%</b></span>
          <span>Active Operating: <b className="text-[#0B132B]">{totalActiveHours} hrs</b></span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-3.5">
        <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3.5 rounded-xl shadow-2xs">
          <span className="font-mono text-[9px] text-[#8A97AB] uppercase font-semibold">Utilization Target</span>
          <p className="text-2xl font-black text-[#16A36A] mt-1 font-mono">{fleetUtilizationRate}%</p>
        </div>
        <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3.5 rounded-xl shadow-2xs">
          <span className="font-mono text-[9px] text-[#8A97AB] uppercase font-semibold">Active Service Hours</span>
          <p className="text-2xl font-black text-[#172033] mt-1 font-mono">{totalActiveHours} <small className="text-xs font-sans text-[#68758A]">hrs</small></p>
        </div>
        <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3.5 rounded-xl shadow-2xs">
          <span className="font-mono text-[9px] text-[#8A97AB] uppercase font-semibold">Idle / Staged Time</span>
          <p className="text-2xl font-black text-[#E7A329] mt-1 font-mono">{totalIdleHours} <small className="text-xs font-sans text-[#68758A]">hrs</small></p>
        </div>
        <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-3.5 rounded-xl shadow-2xs">
          <span className="font-mono text-[9px] text-[#8A97AB] uppercase font-semibold">Shop Bay Maintenance</span>
          <p className="text-2xl font-black text-[#68758A] mt-1 font-mono">{totalMaintenanceHours} <small className="text-xs font-sans text-[#68758A]">hrs</small></p>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-4 rounded-xl shadow-2xs overflow-x-auto">
        <span className="font-mono text-[10px] text-[#8A97AB] uppercase block mb-3 font-semibold">
          Asset Operational Efficiency Rankings
        </span>
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[#8A97AB] font-mono text-[9px] font-semibold uppercase">
              <th className="py-2.5 px-3">Vehicle</th>
              <th className="py-2.5 px-3">Model</th>
              <th className="py-2.5 px-3 text-right">Active Hours</th>
              <th className="py-2.5 px-3 text-right">Idle Hours</th>
              <th className="py-2.5 px-3 text-right">Utilization Rate</th>
              <th className="py-2.5 px-3 text-center">Efficiency Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]/70 font-sans">
            {vehicleRankings.map((veh) => (
              <tr key={veh.plate} className="hover:bg-white transition-colors">
                <td className="py-2.5 px-3 font-bold font-mono text-[#172033]">{veh.plate}</td>
                <td className="py-2.5 px-3 text-[#68758A]">{veh.model}</td>
                <td className="py-2.5 px-3 text-right font-mono text-[#172033] font-semibold">{veh.activeHours}h</td>
                <td className="py-2.5 px-3 text-right font-mono text-[#68758A]">{veh.idleHours}h</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-[#16A36A]">{veh.rate}%</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`inline-block font-mono text-[9px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(veh.status)}`}>
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
