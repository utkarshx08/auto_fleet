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
import { getMonthlyFuelTrends, getVehicleFuelBreakdown } from '../../services/fuelService';

export default function FuelAnalyticsCharts({ records = [], vehicles = [] }) {
  const monthlyTrends = getMonthlyFuelTrends(records);
  const vehicleBreakdown = getVehicleFuelBreakdown(records, vehicles);

  return (
    <div className="space-y-4">
      {/* 2-col Visual Analytics Grid */}
      <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
        {/* Monthly Trend Chart */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-mono text-[9px] text-[#64748B] uppercase tracking-wider block font-bold">
                Billing Cycle Overview
              </span>
              <h3 className="text-base font-bold text-[#0B132B] m-0">
                Monthly Fuel Expenditure ($)
              </h3>
            </div>
            <span className="font-mono text-[10px] text-[#2879E8] font-bold bg-[#EAF3FF] px-2 py-0.5 rounded-lg border border-[#C8E0FF]">
              Last 5 Months
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 5" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={10} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-[#E2E8F0] p-2.5 rounded-xl shadow-lg text-xs font-mono">
                          <p className="text-[#64748B] uppercase mb-1 font-bold">{label} Summary</p>
                          <p className="text-[#16A36A] font-bold">Spend: ${payload[0].value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="totalSpend" fill="#2879E8" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle-wise Fuel Consumption Chart */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-mono text-[9px] text-[#64748B] uppercase tracking-wider block font-bold">
                Fleet Unit Comparison
              </span>
              <h3 className="text-base font-bold text-[#0B132B] m-0">
                Vehicle-Wise Fuel Volume (Litres)
              </h3>
            </div>
            <span className="font-mono text-[10px] text-[#16A36A] font-bold bg-[#E8F7F0] px-2 py-0.5 rounded-lg border border-[#B7E4CF]">
              Active Fleet Units
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={vehicleBreakdown.slice(0, 6)}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 5" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="vehicleId" stroke="#64748B" fontSize={10} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={10} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-[#E2E8F0] p-2.5 rounded-xl shadow-lg text-xs font-mono">
                          <p className="text-[#64748B] uppercase mb-1 font-bold">{label}</p>
                          <p className="text-[#2879E8] font-bold">Total Volume: {payload[0].value} L</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="totalQuantity" fill="#60A5FA" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Vehicle-Wise Performance & Cost Matrix Table */}
      <div className="glass-card p-5">
        <h3 className="text-base font-bold text-[#0B132B] mb-3 font-sans">
          Vehicle Fuel Consumption & Operational Cost Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px] whitespace-nowrap font-sans">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#64748B] font-mono text-[9px] uppercase font-bold">
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3">Assigned Operator</th>
                <th className="py-2.5 px-3">Total Litres Consumed</th>
                <th className="py-2.5 px-3">Total Fuel Expenditure</th>
                <th className="py-2.5 px-3">Average Price / L</th>
                <th className="py-2.5 px-3">Efficiency Metric</th>
                <th className="py-2.5 px-3">Odometer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {vehicleBreakdown.map((row) => (
                <tr key={row.vehicleId} className="hover:bg-[#F8FAFD] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-xs text-[#0B132B]">
                    {row.vehicleId}
                  </td>
                  <td className="py-3 px-3 text-[#334155] font-medium">
                    {row.driverName}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#0B132B] font-semibold">
                    {row.totalQuantity.toLocaleString()} L
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#16A36A]">
                    ${row.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#475569]">
                    ${row.avgPricePerUnit.toFixed(2)} / L
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8F7F0] text-[#16A36A] border border-[#B7E4CF]">
                      {row.kmPerLiter} km/L
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[#64748B]">
                    {row.currentOdometer.toLocaleString()} km
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
