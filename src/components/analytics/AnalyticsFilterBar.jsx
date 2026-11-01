import React from 'react';
import { SlidersHorizontal, Calendar, RotateCcw, Filter } from 'lucide-react';
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
    <div className="bg-[#17191f] border border-[#292c35] p-3 rounded-[9px] flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Date Range Tabs */}
      <div className="flex items-center gap-1 bg-[#121319] border border-[#252730] p-1 rounded-lg overflow-x-auto">
        <Calendar className="w-3.5 h-3.5 text-[#858894] ml-1.5 mr-0.5 shrink-0" />
        {dateOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setDateFilter(opt.id)}
            className={`px-2.5 py-1 rounded-[5px] text-[10px] font-sans whitespace-nowrap transition-colors ${
              dateFilter === opt.id
                ? 'bg-[#40375b] text-[#c7b6ff] font-bold shadow-sm'
                : 'text-[#858894] hover:text-[#d1d1da]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Select Dropdowns */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Vehicle Filter */}
        <select
          value={selectedVehicleId}
          onChange={(e) => setSelectedVehicleId(e.target.value)}
          className="bg-[#20222a] text-[#bdbec8] border border-[#343641] rounded-[6px] px-2.5 py-1.5 text-[10px] outline-none hover:border-[#4b4360] focus:border-[#b49aff] transition-colors cursor-pointer"
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
          className="bg-[#20222a] text-[#bdbec8] border border-[#343641] rounded-[6px] px-2.5 py-1.5 text-[10px] outline-none hover:border-[#4b4360] focus:border-[#b49aff] transition-colors cursor-pointer"
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
          className="bg-[#20222a] text-[#bdbec8] border border-[#343641] rounded-[6px] px-2.5 py-1.5 text-[10px] outline-none hover:border-[#4b4360] focus:border-[#b49aff] transition-colors cursor-pointer"
        >
          <option value="ALL">All Expense Categories</option>
          {expenseCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Reset Filter Button */}
        <button
          type="button"
          onClick={onReset}
          className="p-1.5 text-[#858894] hover:text-[#f0f0f4] rounded-[6px] hover:bg-[#22242d] transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

