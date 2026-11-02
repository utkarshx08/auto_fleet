import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
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
        <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-mono text-[9px] text-[#858894] uppercase tracking-wider block">
                Billing Cycle Overview
              </span>
              <h3 className="text-sm font-bold text-[#f0f0f4] m-0">
                Monthly Fuel Expenditure ($)
              </h3>
            </div>
            <span className="font-mono text-[10px] text-[#b49aff]">Last 5 Months</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 5" stroke="#2b2d36" vertical={false} />
                <XAxis dataKey="month" stroke="#737682" fontSize={10} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#686c78" fontSize={10} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#1c1e25] border border-[#3b354d] p-2.5 rounded text-xs font-mono">
                          <p className="text-[#a7a9b5] uppercase mb-1">{label} Summary</p>
                          <p className="text-[#8be0b3] font-bold">Spend: ${payload[0].value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="totalSpend" fill="#b49aff" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle-wise Fuel Consumption Chart */}
        <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-mono text-[9px] text-[#858894] uppercase tracking-wider block">
                Fleet Unit Comparison
              </span>
              <h3 className="text-sm font-bold text-[#f0f0f4] m-0">
                Vehicle-Wise Fuel Volume (Litres)
              </h3>
            </div>
            <span className="font-mono text-[10px] text-[#8be0b3]">Active Fleet Units</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={vehicleBreakdown.slice(0, 6)}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 5" stroke="#2b2d36" vertical={false} />
                <XAxis dataKey="vehicleId" stroke="#737682" fontSize={10} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#686c78" fontSize={10} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#1c1e25] border border-[#3b354d] p-2.5 rounded text-xs font-mono">
                          <p className="text-[#a7a9b5] uppercase mb-1">{label}</p>
                          <p className="text-[#8dc8ed] font-bold">Total Volume: {payload[0].value} L</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="totalQuantity" fill="#8dc8ed" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Vehicle-Wise Performance & Cost Matrix Table */}
      <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5">
        <h3 className="text-sm font-bold text-[#f0f0f4] mb-3 font-sans">
          Vehicle Fuel Consumption & Operational Cost Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap font-sans">
            <thead>
              <tr className="border-b border-[#30323b] text-[#747783] font-mono text-[8px] uppercase">
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3">Assigned Operator</th>
                <th className="py-2.5 px-3">Total Litres Consumed</th>
                <th className="py-2.5 px-3">Total Fuel Expenditure</th>
                <th className="py-2.5 px-3">Average Price / L</th>
                <th className="py-2.5 px-3">Efficiency Metric</th>
                <th className="py-2.5 px-3">Odometer</th>
              </tr>
            </thead>
            <tbody>
              {vehicleBreakdown.map((item) => (
                <tr
                  key={item.vehicleId}
                  className="border-b border-[#242633] hover:bg-[#1b1d26] transition-colors last:border-0"
                >
                  <td className="py-3 px-3 font-mono font-bold text-xs text-[#f0f0f4]">
                    {item.vehicleId}
                  </td>
                  <td className="py-3 px-3 text-[#d1d1da]">{item.driver}</td>
                  <td className="py-3 px-3 font-mono text-xs text-[#8dc8ed]">
                    {item.totalQuantity} L
                  </td>
                  <td className="py-3 px-3 font-mono text-xs font-bold text-[#8be0b3]">
                    ${item.totalSpend.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-[#aeb0ba]">
                    ${item.avgPrice}
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-[#c4b3ff]">
                    {item.efficiencyL100} L/100km
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-[#747783]">
                    {item.latestOdo?.toLocaleString()} km
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

