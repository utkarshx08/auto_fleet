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
    <div className="glass-card rounded-2xl p-6 space-y-4 shadow-liquid-subtle">
      {/* Calendar Header with Navigation & Filters */}
      <div className="flex items-center justify-between gap-3 max-md:flex-col max-md:items-stretch">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EAF3FF] text-[#2879E8] border border-[#D5E6FB] flex items-center justify-center shadow-2xs">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#172033] tracking-tight m-0">
              {monthNames[month]} {year}
            </h3>
            <span className="font-mono text-[10px] text-[#68758A]">
              Fleet Preventative Maintenance & Service Bookings
            </span>
          </div>

          <div className="flex items-center gap-1 ml-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-[#68758A] hover:text-[#172033] hover:bg-[#F0F5FC] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-[#68758A] hover:text-[#172033] hover:bg-[#F0F5FC] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 flex-wrap text-xs">
          {/* Vehicle Filter */}
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-1.5 text-xs text-[#172033] outline-none font-mono cursor-pointer shadow-2xs"
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
            className="bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-1.5 text-xs text-[#172033] outline-none text-xs cursor-pointer shadow-2xs"
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
      <div className="flex items-center gap-4 text-[10px] font-mono text-[#68758A] border-b border-[#E2E8F0] pb-2.5 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E05252]" /> Overdue Service
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E7A329]" /> Due Service
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2879E8]" /> Scheduled Appointment
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#16A36A]" /> Completed Work Order
        </span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-px bg-[#E2E8F0] rounded-xl overflow-hidden border border-[#E2E8F0] shadow-2xs">
        {/* Days of week header */}
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="bg-[#F8FAFD] py-2.5 text-center font-mono text-[10px] uppercase font-semibold text-[#68758A]"
          >
            {day}
          </div>
        ))}

        {/* Empty cells before month start */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-[#F4F7FB]/70 min-h-[90px] p-2" />
        ))}

        {/* Days of month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const events = eventsByDay[dayNum] || [];

          return (
            <div
              key={`day-${dayNum}`}
              className="bg-white min-h-[95px] p-2 flex flex-col justify-between hover:bg-[#F0F5FC]/60 transition-colors"
            >
              <div className="flex justify-between items-start font-mono text-[10px]">
                <span className="text-[#172033] font-bold">{dayNum}</span>
                {events.length > 0 && (
                  <span className="text-[9px] bg-[#EAF3FF] text-[#2879E8] font-bold px-1.5 py-0.2 rounded-full border border-[#D5E6FB]">
                    {events.length}
                  </span>
                )}
              </div>

              {/* Event Pills */}
              <div className="space-y-1 my-1 overflow-y-auto max-h-[60px]">
                {events.map((ev) => {
                  let pillClass = 'bg-[#E8F7F0] text-[#16A36A] border-[#C2E8D7]';
                  if (ev.type === 'overdue') {
                    pillClass = 'bg-[#FDF2F2] text-[#E05252] border-[#FAD2D2]';
                  } else if (ev.type === 'due') {
                    pillClass = 'bg-[#FEF7EA] text-[#E7A329] border-[#F8DFB4]';
                  } else if (ev.type === 'scheduled') {
                    pillClass = 'bg-[#EAF3FF] text-[#2879E8] border-[#D5E6FB]';
                  }

                  return (
                    <div
                      key={ev.id}
                      onClick={() => setInspectedEvent(ev)}
                      className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono truncate border cursor-pointer hover:opacity-90 transition-opacity font-medium ${pillClass}`}
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
        <div className="p-4 bg-gradient-to-br from-white to-[#F8FAFD] border border-[#D5E2F1] rounded-xl text-xs space-y-2 shadow-liquid-subtle animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase text-[#2879E8] font-bold tracking-wider">
              Appointment Details
            </span>
            <button
              type="button"
              onClick={() => setInspectedEvent(null)}
              className="text-[#8A97AB] hover:text-[#172033] font-mono text-[11px] p-1 rounded hover:bg-[#F0F5FC] transition-colors cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
          <b className="text-[#172033] text-xs font-bold block">{inspectedEvent.title}</b>
          <p className="text-[11px] text-[#68758A] font-mono m-0">{inspectedEvent.meta}</p>
          <span className="text-[10px] text-[#8A97AB] font-mono block">
            Scheduled Milestone: {inspectedEvent.dateStr}
          </span>
        </div>
      )}
    </div>
  );
}

