import React, { useState } from 'react';
import Button from '../components/common/Button';
import TrueFocus from '../components/common/TrueFocus';
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  Fuel,
  Truck,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export default function Reports({
  vehicles = [],
  onExportCSV
}) {
  const [selectedReportType, setSelectedReportType] = useState('fleet_summary');
  const [dateRange, setDateRange] = useState('November 2026');

  const reportMetrics = [
    { label: 'Total Distance', value: '18,420 km', change: '+12.4%', positive: true },
    { label: 'Fuel Consumed', value: '1,547 L', change: '-3.1%', positive: true },
    { label: 'Avg Fleet Speed', value: '47.8 km/h', change: '+1.5%', positive: true },
    { label: 'Operating Cost', value: '$8,420.00', change: '-4.2%', positive: true },
  ];

  const monthlyFuelTrends = [
    { month: 'Jun', fuel: 1420, distance: 16800 },
    { month: 'Jul', fuel: 1530, distance: 17400 },
    { month: 'Aug', fuel: 1610, distance: 18100 },
    { month: 'Sep', fuel: 1490, distance: 17600 },
    { month: 'Oct', fuel: 1547, distance: 18420 },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-end justify-between py-2 max-md:flex-col max-md:items-start max-md:gap-4 border-b border-slate-200/90 pb-4">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
            Telemetry & Compliance Auditing
          </span>
          <div className="py-0.5">
            <TrueFocus sentence="Reports & Compliance" />
          </div>
          <p className="text-xs text-slate-500 mt-1 mb-0">
            Generate and export consolidated operational metrics, fuel efficiency, and compliance audits.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={onExportCSV}
          icon={Download}
        >
          Export full report (CSV)
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4">
        {reportMetrics.map((m, idx) => (
          <div
            key={idx}
            className="glass-card glass-card-hover p-4.5 rounded-xl flex flex-col justify-between"
          >
            <span className="text-xs font-medium text-slate-500">{m.label}</span>
            <p className="text-2xl font-bold text-slate-900 mt-2 mb-0 tabular-nums">{m.value}</p>
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1 mt-1.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {m.change} vs prior period
            </span>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="glass-card border border-white/95 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-[#E2E8F0] pb-3">
          <div>
            <p className="font-mono text-[10px] tracking-[1.2px] text-[#475569] uppercase mb-0.5 font-bold">
              Historical Consumption Trend
            </p>
            <h2 className="text-base font-black text-[#0B132B] m-0">Monthly Fleet Fuel Consumption (Liters)</h2>
          </div>
          <span className="font-mono text-[11px] text-[#2879E8] font-bold bg-[#EAF3FF] px-2.5 py-1 rounded-lg border border-[#2879E8]/20">
            Last 5 billing cycles
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyFuelTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 5" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" stroke="#68758A" fontSize={11} fontFamily="DM Mono" tickLine={false} axisLine={false} />
              <YAxis stroke="#68758A" fontSize={11} fontFamily="DM Mono" tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-card border border-white p-3 rounded-xl shadow-lg text-xs font-mono">
                        <p className="text-[#68758A] uppercase font-semibold mb-1">{label} Billing Cycle</p>
                        <p className="text-[#2879E8] font-bold text-sm">{payload[0].value} Liters</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="fuel" fill="#2879E8" radius={[8, 8, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Export Cards */}
      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4">
        <div className="glass-card border border-white/95 p-6 rounded-2xl shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#2879E8] flex items-center justify-center mb-3 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-[#0B132B]">Vehicle Status & Telemetry</h3>
            <p className="text-xs text-[#334155] mt-1.5 leading-relaxed font-medium">
              Complete snapshot of active mileage, fuel levels, drivers, and GPS coordinates.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
            <Button variant="quiet" size="sm" onClick={onExportCSV} icon={Download} className="w-full rounded-xl py-2 font-medium">
              Export CSV
            </Button>
          </div>
        </div>

        <div className="glass-card border border-white/95 p-6 rounded-2xl shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-3 shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-[#0B132B]">Maintenance & Compliance Audit</h3>
            <p className="text-xs text-[#334155] mt-1.5 leading-relaxed font-medium">
              Detailed history of all completed service orders, part costs, and upcoming alerts.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
            <Button variant="quiet" size="sm" onClick={onExportCSV} icon={Download} className="w-full rounded-xl py-2 font-medium">
              Export CSV
            </Button>
          </div>
        </div>

        <div className="glass-card border border-white/95 p-6 rounded-2xl shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A36A] flex items-center justify-center mb-3 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-[#0B132B]">Driver Performance & Safety</h3>
            <p className="text-xs text-[#334155] mt-1.5 leading-relaxed font-medium">
              Completed trips, safety ratings, license expiration status, and assigned vehicles.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-[#E2E8F0]">
            <Button variant="quiet" size="sm" onClick={onExportCSV} icon={Download} className="w-full rounded-xl py-2 font-medium">
              Export CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
