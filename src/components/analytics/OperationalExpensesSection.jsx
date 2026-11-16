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
        <div className="bg-white/95 backdrop-blur-xl border border-white/90 p-3 rounded-xl shadow-liquid-dropdown text-xs font-mono">
          <p className="text-[#8A97AB] text-[10px] uppercase mb-1 font-semibold">{label}</p>
          <p className="text-[#2879E8] font-bold text-sm">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const PIE_COLORS = ['#2879E8', '#16A36A', '#E7A329', '#0284C7', '#8B5CF6'];

  return (
    <div className="glass-card rounded-2xl p-6 space-y-5 shadow-liquid-subtle">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#475569] uppercase mb-0.5 font-bold">
            Module 04
          </p>
          <h2 className="text-base font-black text-[#0B132B] m-0 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#2879E8]" /> Operational Expenditures & Financial Ledger
          </h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#475569] font-bold">
          <span>Total Expenses: <b className="text-[#0B132B]">${totalExpenses.toLocaleString()}</b></span>
          <span>Cost/km: <b className="text-[#16A36A] font-bold">${costPerKm}</b></span>
        </div>
      </div>

      {/* Categories Summary Chips */}
      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-3.5">
        {categoryBreakdown.map((cat, idx) => (
          <div key={cat.category} className="bg-[#F8FAFD] border border-[#E2E8F0] p-3.5 rounded-xl shadow-2xs">
            <span className="font-mono text-[9px] text-[#8A97AB] uppercase block font-semibold">{cat.category}</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-[#172033] font-mono">${cat.amount.toLocaleString()}</span>
              <span className="text-[10px] font-mono text-[#68758A]">{cat.share}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-4 pt-2">
        {/* Historical Expenditure Curve */}
        <div className="col-span-2 max-lg:col-span-1 bg-[#F8FAFD] border border-[#E2E8F0] p-4 rounded-xl shadow-2xs">
          <span className="font-mono text-[10px] text-[#8A97AB] uppercase block mb-3 font-semibold">
            Monthly Cost Curve vs Cumulative Telemetry
          </span>
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalTrends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 5" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" stroke="#8A97AB" fontSize={9} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <YAxis stroke="#8A97AB" fontSize={9} fontFamily="DM Mono" tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="amount" stroke="#2879E8" strokeWidth={2.5} dot={{ r: 3, fill: '#2879E8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses Breakdown Pie */}
        <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-4 rounded-xl shadow-2xs flex flex-col justify-between">
          <span className="font-mono text-[10px] text-[#8A97AB] uppercase block mb-2 font-semibold">
            Expenditure Distribution
          </span>
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={58}
                  paddingAngle={4}
                >
                  {expensePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center justify-around gap-2 text-[10px] font-mono text-[#68758A] pt-2 border-t border-[#E2E8F0]">
            {expensePieData.map((entry, idx) => (
              <span key={entry.name} className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                {entry.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
