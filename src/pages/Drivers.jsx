import React, { useState, useMemo } from 'react';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import TrueFocus from '../components/common/TrueFocus';
import AddDriverModal from '../components/drivers/AddDriverModal';
import {
  Users,
  Plus,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  Truck,
  Calendar,
  AlertCircle,
  MoreHorizontal
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
      <div className="flex items-end justify-between py-4 max-md:flex-col max-md:items-start max-md:gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#8A97AB] uppercase mb-1 font-semibold">
            Personnel Directory & Safety Roster
          </p>
          <div className="-ml-3 py-0.5">
            <TrueFocus
              sentence="Fleet Operators"
              manualMode={false}
              focusStyle="brackets"
              easing="smooth"
              borderColor="#2879E8"
              glowColor="rgba(40, 121, 232, 0.35)"
              blurAmount={2}
              focusScale={1.03}
              cornerSize={14}
              borderWidth={2.5}
              frameGap={8}
              fontSize="1.6rem"
              wordClassName="text-[#0B132B] font-black tracking-tight"
            />
          </div>
          <p className="text-xs text-[#334155] mt-1 font-semibold">
            Monitor operator credentials, duty status, safety compliance, and assignments.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddDriverOpen(true)}
          icon={Plus}
          className="rounded-xl py-2.5 px-5 font-bold shadow-md shadow-[#2879E8]/25 active:scale-[0.98]"
        >
          Add driver
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4">
        <div className="glass-card border border-white/95 p-5 rounded-2xl shadow-xl transition-all duration-200 hover:-translate-y-0.5">
          <span className="font-mono text-[10px] text-[#475569] uppercase font-bold">Total Operators</span>
          <p className="text-2xl font-black text-[#0B132B] mt-2 mb-0 font-mono tracking-tight">{drivers.length}</p>
        </div>
        <div className="glass-card border border-white/95 p-5 rounded-2xl shadow-xl transition-all duration-200 hover:-translate-y-0.5">
          <span className="font-mono text-[10px] text-[#16A36A] uppercase font-bold">On Duty</span>
          <p className="text-2xl font-black text-[#16A36A] mt-2 mb-0 font-mono tracking-tight">{onDutyCount}</p>
        </div>
        <div className="glass-card border border-white/95 p-5 rounded-2xl shadow-xl transition-all duration-200 hover:-translate-y-0.5">
          <span className="font-mono text-[10px] text-[#2879E8] uppercase font-bold">Available</span>
          <p className="text-2xl font-black text-[#2879E8] mt-2 mb-0 font-mono tracking-tight">{availableCount}</p>
        </div>
        <div className="glass-card border border-white/95 p-5 rounded-2xl shadow-xl transition-all duration-200 hover:-translate-y-0.5">
          <span className="font-mono text-[10px] text-[#D97706] uppercase font-bold">Fleet Safety Score</span>
          <p className="text-2xl font-black text-[#D97706] mt-2 mb-0 font-mono tracking-tight">98.4%</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card border border-white/95 p-4 rounded-2xl shadow-md flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search by driver name, license or vehicle..."
          width="w-[360px] max-md:w-full"
        />

        <div className="flex items-center bg-[#F0F5FC] border border-[#D5E2F1] rounded-xl p-1 text-xs">
          {['ALL', 'On Duty', 'Available', 'In Service'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg font-sans transition-all duration-150 font-medium ${
                statusFilter === st
                  ? 'bg-white text-[#2879E8] font-bold shadow-xs'
                  : 'text-[#68758A] hover:text-[#172033]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-5">
        {filteredDrivers.map((driver) => {
          const isExpiringSoon = new Date(driver.licenseExpiry) < new Date('2026-12-31');
          return (
            <div
              key={driver.id}
              className="glass-card border border-white/95 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#EAF3FF] border border-[#2879E8]/30 text-[#2879E8] font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {driver.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#0B132B] group-hover:text-[#2879E8] transition-colors leading-tight m-0">
                        {driver.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="flex items-center gap-1 text-[11px] text-[#D97706] font-mono font-bold">
                          <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                          {driver.rating}
                        </span>
                        <span className="text-[#D5E2F1]">•</span>
                        <span className="text-[11px] text-[#68758A] font-mono">
                          {driver.tripsCompleted} trips
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleDuty(driver.id)}
                    title="Click to toggle duty status"
                    className={`font-mono text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      driver.status === 'On Duty'
                        ? 'bg-[#DCFCE7] text-[#16A36A] border-[#BBF7D0] hover:bg-[#BBF7D0]'
                        : driver.status === 'Available'
                        ? 'bg-[#EAF3FF] text-[#2879E8] border-[#2879E8]/30 hover:bg-[#D5E2F1]'
                        : 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                    }`}
                  >
                    ● {driver.status}
                  </button>
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#E2E8F0] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#68758A] flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#8A97AB]" /> Assigned Vehicle:
                    </span>
                    <b className="font-mono text-[#2879E8] bg-[#EAF3FF] px-2 py-0.5 rounded-md border border-[#2879E8]/20 font-bold">
                      {driver.vehicleAssigned}
                    </b>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#68758A] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#8A97AB]" /> License No:
                    </span>
                    <span className="font-mono text-[#172033] font-medium">{driver.license}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#68758A] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#8A97AB]" /> Expires:
                    </span>
                    <span
                      className={`font-mono flex items-center gap-1 font-medium ${
                        isExpiringSoon ? 'text-[#D97706]' : 'text-[#68758A]'
                      }`}
                    >
                      {isExpiringSoon && <AlertCircle className="w-3.5 h-3.5" />}
                      {driver.licenseExpiry}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-[11px] text-[#68758A] font-mono">{driver.phone}</span>
                <Button
                  variant="quiet"
                  size="sm"
                  onClick={() => handleToggleDuty(driver.id)}
                  className="rounded-xl py-1 px-3 text-xs"
                >
                  {driver.status === 'On Duty' ? 'Set Off Duty' : 'Set On Duty'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <AddDriverModal
        isOpen={isAddDriverOpen}
        onClose={() => setIsAddDriverOpen(false)}
        onAddDriver={handleAddNewDriver}
        availableVehicles={initialVehicles}
      />
    </div>
  );
}
