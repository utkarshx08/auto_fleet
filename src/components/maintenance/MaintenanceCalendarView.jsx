import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Wrench
} from 'lucide-react';
import { MAINTENANCE_CATEGORIES } from '../../data/maintenanceMockData';

export default function MaintenanceCalendarView({
  schedules = [],
  records = [],
  vehicles = [],
  onSelectSchedule
}) {
  const [currentDate, setCurrentDate] = useState(new Date('2025-10-01'));
  const [selectedVehicle, setSelectedVehicle] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [inspectedEvent, setInspectedEvent] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Build calendar matrix (days in month)
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Consolidate events (both schedules due dates & completed records)
  const allEvents = useMemo(() => {
    const list = [];

    // 1. Schedules nextServiceDate
    schedules.forEach((sch) => {
      const matchVehicle = selectedVehicle === 'ALL' || sch.vehicleId === selectedVehicle;
      const matchCategory = selectedCategory === 'ALL' || sch.maintenanceType === selectedCategory;

      if (matchVehicle && matchCategory && sch.nextServiceDate) {
        list.push({
          id: `sch-${sch.id}`,
          dateStr: sch.nextServiceDate,
          type: sch.status === 'Overdue' ? 'overdue' : sch.status === 'Due' ? 'due' : 'scheduled',
          title: `${sch.vehicleId}: ${sch.maintenanceType}`,
          category: sch.maintenanceType,
          vehicleId: sch.vehicleId,
          meta: `Target: ${sch.nextServiceOdometer.toLocaleString()} km · Bay: ${sch.serviceCenter || 'Depot'}`,
          original: sch
        });
      }
    });

    // 2. Completed maintenance records
    records.forEach((rec) => {
      const matchVehicle = selectedVehicle === 'ALL' || rec.vehicleId === selectedVehicle;
      const matchCategory = selectedCategory === 'ALL' || rec.serviceType === selectedCategory;

      if (matchVehicle && matchCategory && rec.serviceDate) {
        list.push({
          id: `rec-${rec.id}`,
          dateStr: rec.serviceDate,
          type: 'completed',
          title: `COMPLETED: ${rec.vehicleId} · ${rec.serviceType}`,
          category: rec.serviceType,
          vehicleId: rec.vehicleId,
          meta: `Cost: $${Number(rec.serviceCost).toFixed(2)} · Tech: ${rec.technician}`,
          original: rec
        });
      }
    });

    return list;
  }, [schedules, records, selectedVehicle, selectedCategory]);

  // Group events by day of month for the current view
  const eventsByDay = useMemo(() => {
    const map = {};
    allEvents.forEach((ev) => {
      const parts = ev.dateStr.split('-');
      if (Number(parts[0]) === year && Number(parts[1]) === month + 1) {
        const day = Number(parts[2]);
        if (!map[day]) map[day] = [];
        map[day].push(ev);
      }
    });
    return map;
  }, [allEvents, year, month]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5 space-y-4">
      {/* Calendar Header with Navigation & Filters */}
      <div className="flex items-center justify-between gap-3 max-md:flex-col max-md:items-stretch">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#24212f] text-[#b49aff] flex items-center justify-center">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#f0f0f4] m-0">
              {monthNames[month]} {year}
            </h3>
            <span className="font-mono text-[9px] text-[#858894]">
              Fleet Preventative Maintenance & Service Bookings
            </span>
          </div>

          <div className="flex items-center gap-1 ml-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded text-[#858894] hover:text-white hover:bg-[#20222a] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded text-[#858894] hover:text-white hover:bg-[#20222a] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Vehicle Filter */}
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-xs text-[#eee] outline-none font-mono cursor-pointer"
          >
            <option value="ALL">All Vehicles</option>
            {vehicles.map((v) => (
              <option key={v.id || v.plate} value={v.plate}>
                {v.plate}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-xs text-[#eee] outline-none text-xs cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {MAINTENANCE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] font-mono text-[#858894] border-b border-[#252730] pb-2.5 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400" /> Overdue Service
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#e5a46e]" /> Due Service
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#8dc8ed]" /> Scheduled Appointment
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#8be0b3]" /> Completed Work Order
        </span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-px bg-[#252730] rounded-lg overflow-hidden border border-[#252730]">
        {/* Days of week header */}
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="bg-[#121319] py-2 text-center font-mono text-[9px] uppercase text-[#747783]"
          >
            {day}
          </div>
        ))}

        {/* Empty cells before month start */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-[#101116]/60 min-h-[90px] p-1.5" />
        ))}

        {/* Days of month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const events = eventsByDay[dayNum] || [];

          return (
            <div
              key={`day-${dayNum}`}
              className="bg-[#17191f] min-h-[95px] p-1.5 flex flex-col justify-between hover:bg-[#1c1e26] transition-colors"
            >
              <div className="flex justify-between items-start font-mono text-[10px]">
                <span className="text-[#858894] font-bold">{dayNum}</span>
                {events.length > 0 && (
                  <span className="text-[8px] bg-[#24212f] text-[#c4b3ff] px-1 rounded">
                    {events.length}
                  </span>
                )}
              </div>

              {/* Event Pills */}
              <div className="space-y-1 my-1 overflow-y-auto max-h-[60px]">
                {events.map((ev) => {
                  let pillClass = 'bg-[#1c302a] text-[#83d7a9] border-[#2c493d]';
                  if (ev.type === 'overdue') {
                    pillClass = 'bg-red-500/20 text-red-300 border-red-500/30';
                  } else if (ev.type === 'due') {
                    pillClass = 'bg-[#382c25] text-[#e5a46e] border-[#523d30]';
                  } else if (ev.type === 'scheduled') {
                    pillClass = 'bg-[#182736] text-[#8dc8ed] border-[#223b52]';
                  }

                  return (
                    <div
                      key={ev.id}
                      onClick={() => setInspectedEvent(ev)}
                      className={`px-1.5 py-0.5 rounded text-[8px] font-mono truncate border cursor-pointer hover:opacity-90 transition-opacity ${pillClass}`}
                      title={`${ev.title}\n${ev.meta}`}
                    >
                      {ev.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Popover / Detail modal for inspected event */}
      {inspectedEvent && (
        <div className="p-3.5 bg-[#121319] border border-[#3b354d] rounded-lg text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase text-[#b49aff] font-bold">
              Appointment Details
            </span>
            <button
              type="button"
              onClick={() => setInspectedEvent(null)}
              className="text-[#858894] hover:text-white font-mono text-[10px]"
            >
              ✕ Close
            </button>
          </div>
          <b className="text-[#f0f0f4] text-xs block">{inspectedEvent.title}</b>
          <p className="text-[10px] text-[#aeb0ba] font-mono m-0">{inspectedEvent.meta}</p>
          <span className="text-[9px] text-[#717480] font-mono block">
            Scheduled Milestone: {inspectedEvent.dateStr}
          </span>
        </div>
      )}
    </div>
  );
}

