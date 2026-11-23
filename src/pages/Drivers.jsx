import React, { useState, useMemo } from 'react';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import TrueFocus from '../components/common/TrueFocus';
import EmptyState from '../components/common/EmptyState';
import AddDriverModal from '../components/drivers/AddDriverModal';
import {
  Users,
  Plus,
  ShieldCheck,
  Star,
  Truck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { initialDrivers, initialVehicles } from '../data/mockData';

export default function Drivers({
  onAddDriver,
  onAssignVehicle,
  onViewDriver
}) {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);

  const handleAddNewDriver = (newDriver) => {
    setDrivers((prev) => [newDriver, ...prev]);
  };

  const handleToggleDuty = (driverId) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          const nextStatus = d.status === 'On Duty' ? 'Available' : 'On Duty';
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
  };

  const filteredDrivers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return drivers.filter((d) => {
      const matchSearch =
        (d.name || '').toLowerCase().includes(term) ||
        (d.email || '').toLowerCase().includes(term) ||
        (d.license || '').toLowerCase().includes(term) ||
        (d.vehicleAssigned || '').toLowerCase().includes(term);
      const matchStatus =
        statusFilter === 'ALL' || (d.status || '').toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [drivers, searchTerm, statusFilter]);

  const onDutyCount = drivers.filter((d) => d.status === 'On Duty').length;
  const availableCount = drivers.filter((d) => d.status === 'Available').length;

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex items-end justify-between py-2 max-md:flex-col max-md:items-start max-md:gap-4 border-b border-slate-200/90 pb-4">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
            Personnel Directory & Safety Roster
          </span>
          <div className="py-0.5">
            <TrueFocus sentence="Fleet Operators" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitor operator credentials, duty status, safety compliance, and assignments.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddDriverOpen(true)}
          icon={Plus}
        >
          Add driver
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4">
        <div className="glass-card glass-card-hover p-4.5 rounded-xl flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500">Total Operators</span>
          <p className="text-2xl font-bold text-slate-900 mt-2 mb-0 tabular-nums">{drivers.length}</p>
        </div>
        <div className="glass-card glass-card-hover p-4.5 rounded-xl flex flex-col justify-between">
          <span className="text-xs font-medium text-emerald-700">On Duty</span>
          <p className="text-2xl font-bold text-emerald-600 mt-2 mb-0 tabular-nums">{onDutyCount}</p>
        </div>
        <div className="glass-card glass-card-hover p-4.5 rounded-xl flex flex-col justify-between">
          <span className="text-xs font-medium text-[#2879E8]">Available</span>
          <p className="text-2xl font-bold text-[#2879E8] mt-2 mb-0 tabular-nums">{availableCount}</p>
        </div>
        <div className="glass-card glass-card-hover p-4.5 rounded-xl flex flex-col justify-between">
          <span className="text-xs font-medium text-amber-700">Fleet Safety Score</span>
          <p className="text-2xl font-bold text-amber-600 mt-2 mb-0 tabular-nums">98.4%</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-3 rounded-xl flex items-center justify-between gap-3 max-md:flex-col max-md:items-stretch">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search by driver name, license or vehicle..."
          width="w-[340px] max-md:w-full"
        />

        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
          {['ALL', 'On Duty', 'Available'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Drivers Grid */}
      {filteredDrivers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No drivers found"
          description={`No operators match "${searchTerm || statusFilter}".`}
          actionLabel="Reset filters"
          onAction={() => {
            setSearchTerm('');
            setStatusFilter('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-4">
          {filteredDrivers.map((driver) => {
            const isExpiringSoon = new Date(driver.licenseExpiry) < new Date('2026-12-31');
            return (
              <div
                key={driver.id}
                className="glass-card glass-card-hover rounded-xl p-4.5 flex flex-col justify-between transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200/60 text-[#2879E8] font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        {driver.avatar}
                      </div>
                      <div className="min-w-0 truncate">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#2879E8] transition-colors leading-tight truncate">
                          {driver.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {driver.rating}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-500 tabular-nums">
                            {driver.tripsCompleted} trips
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleDuty(driver.id)}
                      title="Click to toggle duty status"
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                        driver.status === 'On Duty'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/80'
                          : driver.status === 'Available'
                          ? 'bg-blue-50 text-[#2879E8] border-blue-200/80 hover:bg-blue-100/80'
                          : 'bg-amber-50 text-amber-800 border-amber-200/80'
                      }`}
                    >
                      ● {driver.status}
                    </button>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-slate-400" /> Assigned Vehicle:
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#2879E8] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/50">
                        {driver.vehicleAssigned}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> License:
                      </span>
                      <span className="font-mono text-slate-800 font-medium">{driver.license}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Expires:
                      </span>
                      <span
                        className={`font-medium flex items-center gap-1 tabular-nums ${
                          isExpiringSoon ? 'text-amber-700' : 'text-slate-600'
                        }`}
                      >
                        {isExpiringSoon && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                        {driver.licenseExpiry}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">{driver.phone}</span>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleToggleDuty(driver.id)}
                  >
                    {driver.status === 'On Duty' ? 'Set Off Duty' : 'Set On Duty'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddDriverModal
        isOpen={isAddDriverOpen}
        onClose={() => setIsAddDriverOpen(false)}
        onAddDriver={handleAddNewDriver}
        availableVehicles={initialVehicles}
      />
    </div>
  );
}
