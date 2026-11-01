import React from 'react';
import {
  LineChart,
  Line,
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
import { DollarSign, PieChart as PieIcon, TrendingDown, ArrowUpRight } from 'lucide-react';

export default function OperationalExpensesSection({ expenseData }) {
  if (!expenseData) return null;

  const {
    totalExpenses,
    costPerKm,
    categoryBreakdown,
    expensePieData,
    historicalTrends
  } = expenseData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1c1e25] border border-[#3b354d] p-2 rounded-md shadow-xl text-xs font-mono">
          <p className="text-[#a7a9b5] text-[10px] uppercase mb-1">{label}</p>
          <p className="text-[#b49aff] font-bold">
            ${payload[0].value.toLocaleString()}
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
            Module 04
          </p>
          <h2 className="text-base font-bold text-[#f0f0f4] m-0 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#e5a46e]" /> Monthly Operational Expense Analytics
          </h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#858894]">
          <span>Total: <b className="text-[#f0f0f4]">${totalExpenses.toLocaleString()}</b></span>
          <span>Cost/km: <b className="text-[#8be0b3]">${costPerKm} / km</b></span>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
        {/* Monthly Expense Trend (Line) */}
        <div className="bg-[#121319] border border-[#242630] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[9px] text-[#858894] uppercase">
              5-Month Operational Expense Growth ($)
            </span>
            <span className="font-mono text-[9px] text-[#80d9a9]">+2.3% Controlled Variance</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 5" stroke="#252733" vertical={false} />
                <XAxis dataKey="month" stroke="#737682" fontSize={8} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#686c78" fontSize={8} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="totalExpenses"
                  stroke="#e5a46e"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#e5a46e', stroke: '#121319', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#f6c39a' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Distribution Pie Chart */}
        <div className="bg-[#121319] border border-[#242630] p-4 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[9px] text-[#858894] uppercase">
              Expense Allocation by Category
            </span>
            <span className="font-mono text-[9px] text-[#b49aff]">Current Billing Cycle</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  innerRadius={38}
                  paddingAngle={3}
                >
                  {expensePieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center justify-around gap-2 text-[9px] font-mono pt-2 border-t border-[#1e2029]">
            {expensePieData.slice(0, 4).map((item) => (
              <span key={item.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[#aeb0ba]">{item.name}: {item.percentage}%</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Expense Category Breakdown Table */}
      <div className="bg-[#121319] border border-[#242630] p-4 rounded-lg overflow-x-auto">
        <h4 className="font-mono text-[9px] text-[#858894] uppercase mb-2">
          Consolidated Cost Category Ledger
        </h4>
        <table className="w-full text-left border-collapse text-[10px] font-mono whitespace-nowrap">
          <thead>
            <tr className="border-b border-[#2b2d38] text-[#747783] text-[8px] uppercase">
              <th className="py-2 px-1">Expense Category</th>
              <th className="py-2 px-1">Total Allocated</th>
              <th className="py-2 px-1">Percentage Share</th>
              <th className="py-2 px-1 text-right">Cost Per Km</th>
            </tr>
          </thead>
          <tbody>
            {categoryBreakdown.map((row) => (
              <tr key={row.category} className="border-b border-[#1c1e27] hover:bg-[#1a1c24] transition-colors last:border-0">
                <td className="py-2 px-1 font-bold text-[#e0e0e7] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b49aff]" />
                  {row.category}
                </td>
                <td className="py-2 px-1 text-[#f0f0f4]">${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="py-2 px-1 text-[#8dc8ed]">{row.percentage}%</td>
                <td className="py-2 px-1 text-right text-[#80d9a9]">
                  ${((row.amount / 18420) || 0).toFixed(3)} / km
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

