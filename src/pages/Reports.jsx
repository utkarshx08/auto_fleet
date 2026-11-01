import React, { useState } from 'react';
import Button from '../components/common/Button';
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  Fuel,
  Truck,
  ArrowUpRight
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
  const [dateRange, setDateRange] = useState('October 2025');

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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between py-4 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-1">
            Telemetry & Auditing
          </p>
          <h1 className="text-[28px] tracking-[-1px] font-bold text-[#f0f0f4] m-0">
            Reports & Analytics<span className="text-[#ad91ff]">.</span>
          </h1>
          <p className="text-[12px] text-[#898c98] mt-1">
            Generate and export consolidated operational metrics, fuel efficiency, and compliance audits.
          </p>
        </div>
        <Button variant="primary" onClick={onExportCSV} icon={Download}>
          Export full report (CSV)
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-3">
        {reportMetrics.map((m, idx) => (
          <div key={idx} className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
            <span className="font-mono text-[9px] text-[#858894] uppercase">{m.label}</span>
            <p className="text-xl font-bold text-[#f0f0f4] mt-1 mb-0 font-mono">{m.value}</p>
            <span className="font-mono text-[10px] text-[#80d9a9] block mt-1">{m.change} vs prior period</span>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-0.5">
              Historical Trend
            </p>
            <h2 className="text-sm font-bold text-[#f0f0f4] m-0">Monthly Fleet Fuel Consumption (Liters)</h2>
          </div>
          <span className="font-mono text-[10px] text-[#b49aff]">Last 5 billing cycles</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyFuelTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 5" stroke="#2b2d36" vertical={false} />
              <XAxis dataKey="month" stroke="#737682" fontSize={9} fontFamily="DM Mono" tickLine={false} axisLine={false} />
              <YAxis stroke="#686c78" fontSize={9} fontFamily="DM Mono" tickLine={false} axisLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#1c1e25] border border-[#3b354d] p-2 rounded text-xs font-mono">
                        <p className="text-[#a7a9b5] uppercase mb-1">{label}</p>
                        <p className="text-[#b49aff] font-bold">{payload[0].value} Liters</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="fuel" fill="#b49aff" radius={[4, 4, 0, 0]} maxBarSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Export Cards */}
      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4">
        <div className="bg-[#17191f] border border-[#292c35] p-4 rounded-[10px] flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#24212f] text-[#b49aff] flex items-center justify-center mb-3">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#f0f0f4]">Vehicle Status & Telemetry</h3>
            <p className="text-xs text-[#898c98] mt-1">Complete snapshot of active mileage, fuel levels, drivers, and GPS coordinates.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#252730]">
            <Button variant="quiet" size="sm" onClick={onExportCSV} icon={Download} className="w-full">
              Export CSV
            </Button>
          </div>
        </div>

        <div className="bg-[#17191f] border border-[#292c35] p-4 rounded-[10px] flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#382c25] text-[#e3ac77] flex items-center justify-center mb-3">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#f0f0f4]">Maintenance & Compliance Audit</h3>
            <p className="text-xs text-[#898c98] mt-1">Detailed history of all completed service orders, part costs, and upcoming alerts.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#252730]">
            <Button variant="quiet" size="sm" onClick={onExportCSV} icon={Download} className="w-full">
              Export CSV
            </Button>
          </div>
        </div>

        <div className="bg-[#17191f] border border-[#292c35] p-4 rounded-[10px] flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#1c302a] text-[#83d7a9] flex items-center justify-center mb-3">
              <Truck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#f0f0f4]">Driver Performance & Safety</h3>
            <p className="text-xs text-[#898c98] mt-1">Completed trips, safety ratings, license expiration status, and assigned vehicles.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#252730]">
            <Button variant="quiet" size="sm" onClick={onExportCSV} icon={Download} className="w-full">
              Export CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

