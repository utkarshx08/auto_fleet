import React from 'react';
import { Calendar, RotateCcw, Filter } from 'lucide-react';
import { fuelTypes, expenseCategories } from '../../data/analyticsMockData';

export default function AnalyticsFilterBar({
  dateFilter,
  setDateFilter,
  selectedVehicleId,
  setSelectedVehicleId,
  selectedFuelType,
  setSelectedFuelType,
  selectedExpenseCategory,
  setSelectedExpenseCategory,
  vehicles = [],
  onReset
}) {
  const dateOptions = [
    { id: 'today', label: 'Today' },
    { id: '7_days', label: 'Last 7 days' },
    { id: '30_days', label: 'Last 30 days' },
    { id: 'this_month', label: 'This month' },
    { id: 'prev_month', label: 'Previous month' },
    { id: '3_months', label: 'Last 3 months' }
  ];

  return (
    <div className="glass-card p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-liquid-subtle">
      {/* Date Range Tabs */}
      <div className="flex items-center gap-1 bg-[#F8FAFD] border border-[#E2E8F0] p-1 rounded-xl overflow-x-auto">
        <Calendar className="w-3.5 h-3.5 text-[#8A97AB] ml-1.5 mr-0.5 shrink-0" />
        {dateOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setDateFilter(opt.id)}
            className={`px-3 py-1 rounded-lg text-[11px] font-sans font-semibold whitespace-nowrap transition-all cursor-pointer ${
              dateFilter === opt.id
                ? 'bg-[#2879E8] text-white shadow-2xs font-bold'
                : 'text-[#68758A] hover:text-[#172033]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Select Dropdowns */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Vehicle Filter */}
        <select
          value={selectedVehicleId}
          onChange={(e) => setSelectedVehicleId(e.target.value)}
          className="bg-[#F8FAFD] text-[#172033] border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-[11px] font-semibold outline-none hover:border-[#2879E8]/30 focus:border-[#2879E8] transition-all cursor-pointer shadow-2xs"
        >
          <option value="ALL">All Vehicles ({vehicles.length})</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.plate} — {v.model}
            </option>
          ))}
        </select>

        {/* Fuel Type Filter */}
        <select
          value={selectedFuelType}
          onChange={(e) => setSelectedFuelType(e.target.value)}
          className="bg-[#F8FAFD] text-[#172033] border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-[11px] font-semibold outline-none hover:border-[#2879E8]/30 focus:border-[#2879E8] transition-all cursor-pointer shadow-2xs"
        >
          <option value="ALL">All Fuel Types</option>
          {fuelTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Expense Category Filter */}
        <select
          value={selectedExpenseCategory}
          onChange={(e) => setSelectedExpenseCategory(e.target.value)}
          className="bg-[#F8FAFD] text-[#172033] border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-[11px] font-semibold outline-none hover:border-[#2879E8]/30 focus:border-[#2879E8] transition-all cursor-pointer shadow-2xs"
        >
          <option value="ALL">All Expense Categories</option>
          {expenseCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Reset Filters Button */}
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 bg-[#F8FAFD] hover:bg-[#F0F5FC] text-[#68758A] hover:text-[#172033] border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#2879E8]" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
