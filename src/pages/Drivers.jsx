import React, { useState, useMemo } from 'react';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
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
    return drivers.filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.license.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.vehicleAssigned.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === 'ALL' || d.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [drivers, searchTerm, statusFilter]);

  const onDutyCount = drivers.filter((d) => d.status === 'On Duty').length;
  const availableCount = drivers.filter((d) => d.status === 'Available').length;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-end justify-between py-4 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-1">
            Personnel Management
          </p>
          <h1 className="text-[28px] tracking-[-1px] font-bold text-[#f0f0f4] m-0">
            Drivers<span className="text-[#ad91ff]">.</span>
          </h1>
          <p className="text-[12px] text-[#898c98] mt-1">
            Monitor operator credentials, duty status, safety compliance, and assignments.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsAddDriverOpen(true)} icon={Plus}>
          Add driver
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-3">
        <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#858894] uppercase">Total Operators</span>
          <p className="text-xl font-bold text-[#f0f0f4] mt-1 mb-0">{drivers.length}</p>
        </div>
        <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#83d7a9] uppercase">On Duty</span>
          <p className="text-xl font-bold text-[#83d7a9] mt-1 mb-0">{onDutyCount}</p>
        </div>
        <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#b49aff] uppercase">Available</span>
          <p className="text-xl font-bold text-[#b49aff] mt-1 mb-0">{availableCount}</p>
        </div>
        <div className="bg-[#17191f] border border-[#292c35] p-3.5 rounded-[9px]">
          <span className="font-mono text-[9px] text-[#e3ac77] uppercase">Fleet Safety Score</span>
          <p className="text-xl font-bold text-[#e3ac77] mt-1 mb-0">98.4%</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-[#17191f] border border-[#292c35] p-3 rounded-[9px] max-md:flex-col max-md:items-stretch">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search by driver name, license or vehicle..."
          width="w-[320px] max-md:w-full"
        />

        <div className="flex items-center bg-[#20222a] border border-[#30333d] rounded-[6px] p-0.5 text-[10px]">
          {['ALL', 'On Duty', 'Available', 'In Service'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-[5px] font-sans transition-colors ${
                statusFilter === st
                  ? 'bg-[#40375b] text-[#c7b6ff] font-semibold'
                  : 'text-[#858894] hover:text-[#d1d1da]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-4">
        {filteredDrivers.map((driver) => {
          const isExpiringSoon = new Date(driver.licenseExpiry) < new Date('2025-12-31');
          return (
            <div
              key={driver.id}
              className="bg-[#17191f] border border-[#292c35] hover:border-[#383c4a] rounded-[10px] p-4 flex flex-col justify-between transition-all duration-200 group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#514365] text-[#e9dfff] font-bold text-xs flex items-center justify-center shrink-0">
                      {driver.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#f0f0f4] group-hover:text-[#b49aff] transition-colors leading-tight">
                        {driver.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="flex items-center gap-1 text-[10px] text-[#e8aa73] font-mono">
                          <Star className="w-3 h-3 fill-[#e8aa73] text-[#e8aa73]" />
                          {driver.rating}
                        </span>
                        <span className="text-[#555]">•</span>
                        <span className="text-[10px] text-[#858894] font-mono">
                          {driver.tripsCompleted} trips
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleDuty(driver.id)}
                    title="Click to toggle duty status"
                    className={`font-mono text-[9px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                      driver.status === 'On Duty'
                        ? 'bg-[#1c302a] text-[#83d7a9] border-[#2c493d] hover:bg-[#254238]'
                        : driver.status === 'Available'
                        ? 'bg-[#24212f] text-[#c4b3ff] border-[#40375b] hover:bg-[#322d42]'
                        : 'bg-[#382c25] text-[#e3ac77] border-[#523d30]'
                    }`}
                  >
                    ● {driver.status}
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-[#252730] space-y-2 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#858894] flex items-center gap-1.5">
                      <Truck className="w-3 h-3 text-[#747783]" /> Assigned Vehicle:
                    </span>
                    <b className="font-mono text-[#b49aff] bg-[#24212f] px-1.5 py-0.5 rounded">
                      {driver.vehicleAssigned}
                    </b>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#858894] flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-[#747783]" /> License No:
                    </span>
                    <span className="font-mono text-[#d1d1da]">{driver.license}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#858894] flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[#747783]" /> Expires:
                    </span>
                    <span
                      className={`font-mono flex items-center gap-1 ${
                        isExpiringSoon ? 'text-[#e5a46e]' : 'text-[#858894]'
                      }`}
                    >
                      {isExpiringSoon && <AlertCircle className="w-3 h-3" />}
                      {driver.licenseExpiry}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#252730] flex items-center justify-between">
                <span className="text-[9px] text-[#747783] font-mono">{driver.phone}</span>
                <Button
                  variant="quiet"
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

      <AddDriverModal
        isOpen={isAddDriverOpen}
        onClose={() => setIsAddDriverOpen(false)}
        onAddDriver={handleAddNewDriver}
        availableVehicles={initialVehicles}
      />
    </div>
  );
}
