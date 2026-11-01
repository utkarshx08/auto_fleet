import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Fuel, DollarSign, TrendingDown, Gauge } from 'lucide-react';

export default function FuelAnalyticsSection({ fuelData }) {
  if (!fuelData) return null;

  const {
    totalConsumed,
    totalCost,
    avgCostPerLitre,
    vehicleConsumptionData,
    fuelTypeDistribution,
    monthlyFuelTrends
  } = fuelData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1c1e25] border border-[#3b354d] p-2 rounded-md shadow-xl text-xs font-mono">
          <p className="text-[#a7a9b5] text-[10px] uppercase mb-1">{label}</p>
          <p className="text-[#b49aff] font-bold">
            {payload[0].name}: {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5 space-y-5">
      {/* Section Title */}
      <div className="flex items-center justify-between pb-3 border-b border-[#252730]">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-0.5">
            Module 01
          </p>
          <h2 className="text-base font-bold text-[#f0f0f4] m-0 flex items-center gap-2">
            <Fuel className="w-4 h-4 text-[#8dc8ed]" /> Fuel Consumption & Efficiency Intelligence
          </h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#858894]">
          <span>Total: <b className="text-[#f0f0f4]">{totalConsumed} L</b></span>
          <span>Spend: <b className="text-[#e5a46e]">${totalCost.toLocaleString()}</b></span>
          <span>Avg: <b className="text-[#8be0b3]">${avgCostPerLitre} / L</b></span>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
        {/* Chart 1: Monthly Fuel Consumption Trends (Line) */}
        <div className="bg-[#121319] border border-[#242630] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[9px] text-[#858894] uppercase">
              5-Month Consumption Trend (Liters)
            </span>
            <span className="font-mono text-[9px] text-[#80d9a9]">↓ 3.1% Monthly Avg</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyFuelTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 5" stroke="#252733" vertical={false} />
                <XAxis dataKey="month" stroke="#737682" fontSize={8} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#686c78" fontSize={8} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  name="Fuel (Liters)"
                  dataKey="fuelQuantity"
                  stroke="#b49aff"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#b49aff', stroke: '#121319', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#c4b3ff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Vehicle-Wise Fuel Consumption (Bar) */}
        <div className="bg-[#121319] border border-[#242630] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[9px] text-[#858894] uppercase">
              Vehicle-Wise Consumption (Liters)
            </span>
            <span className="font-mono text-[9px] text-[#b49aff]">By Active Transponder</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleConsumptionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 5" stroke="#252733" vertical={false} />
                <XAxis dataKey="vehicleId" stroke="#737682" fontSize={8} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#686c78" fontSize={8} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar name="Liters" dataKey="quantity" fill="#8dc8ed" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Breakdown Table & Fuel Type Distribution */}
      <div className="grid grid-cols-[1.5fr_1fr] max-lg:grid-cols-1 gap-4 pt-1">
        {/* Table */}
        <div className="bg-[#121319] border border-[#242630] p-4 rounded-lg overflow-x-auto">
          <h4 className="font-mono text-[9px] text-[#858894] uppercase mb-2">
            Vehicle Fuel Efficiency & Cost Matrix
          </h4>
          <table className="w-full text-left border-collapse text-[10px] font-mono whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#2b2d38] text-[#747783] text-[8px] uppercase">
                <th className="py-2 px-1">Vehicle</th>
                <th className="py-2 px-1">Fuel Type</th>
                <th className="py-2 px-1">Quantity</th>
                <th className="py-2 px-1">Expenditure</th>
                <th className="py-2 px-1 text-right">Avg Rate</th>
              </tr>
            </thead>
            <tbody>
              {vehicleConsumptionData.map((row) => (
                <tr key={row.vehicleId} className="border-b border-[#1c1e27] hover:bg-[#1a1c24] transition-colors last:border-0">
                  <td className="py-2 px-1 font-bold text-[#e0e0e7]">{row.vehicleId}</td>
                  <td className="py-2 px-1 text-[#aeb0ba]">{row.fuelType}</td>
                  <td className="py-2 px-1 text-[#b49aff]">{row.quantity} L</td>
                  <td className="py-2 px-1 text-[#e5a46e]">${row.cost.toFixed(2)}</td>
                  <td className="py-2 px-1 text-right text-[#80d9a9]">{row.avgEfficiency} L/100km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fuel Type Expenditure Distribution Pie */}
        <div className="bg-[#121319] border border-[#242630] p-4 rounded-lg flex flex-col justify-between">
          <h4 className="font-mono text-[9px] text-[#858894] uppercase mb-1">
            Expenditure Distribution by Fuel Type
          </h4>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fuelTypeDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={55}
                  innerRadius={30}
                  paddingAngle={4}
                >
                  {fuelTypeDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-around text-[9px] font-mono pt-2 border-t border-[#1e2029]">
            {fuelTypeDistribution.map((t) => (
              <span key={t.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-[#aeb0ba]">{t.name}: ${t.value}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

