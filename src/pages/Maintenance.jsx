import React, { useState, useMemo } from 'react';
import Button from '../components/common/Button';
import MaintenanceKPIGrid from '../components/maintenance/MaintenanceKPIGrid';
import MaintenanceScheduleTable from '../components/maintenance/MaintenanceScheduleTable';
import MaintenanceHistoryTable from '../components/maintenance/MaintenanceHistoryTable';
import MaintenanceCalendarView from '../components/maintenance/MaintenanceCalendarView';
import MaintenanceScheduleModal from '../components/maintenance/MaintenanceScheduleModal';
import CompleteServiceModal from '../components/maintenance/CompleteServiceModal';
import DeleteScheduleModal from '../components/maintenance/DeleteScheduleModal';
import {
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  ShieldAlert,
  Download,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { initialVehicles } from '../data/mockData';
import {
  getSchedules,
  persistSchedules,
  getRecords,
  persistRecords
} from '../services/maintenanceStorageService';
import {
  calculateMaintenanceKPIs,
  generateMaintenanceAlerts,
  calculateNextOdometer,
  calculateNextDate
} from '../services/maintenanceService';

export default function Maintenance({
  vehicles = initialVehicles,
  alerts: parentAlerts = [],
  onScheduleService,
  onResolveAlert
}) {
  // Navigation Sub-tabs: 'dashboard' | 'schedules' | 'history' | 'calendar'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Operational State — loaded from persistent storage
  const [schedules, setSchedules] = useState(() => getSchedules());
  const [records, setRecords] = useState(() => getRecords());

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const [completingSchedule, setCompletingSchedule] = useState(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const [deletingSchedule, setDeletingSchedule] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filter selection from KPI click
  const [kpiFilter, setKpiFilter] = useState('ALL');

  // Operational KPIs
  const kpis = useMemo(() => {
    return calculateMaintenanceKPIs(vehicles, schedules, records);
  }, [vehicles, schedules, records]);

  // Automated System Alerts from Schedules
  const automatedAlerts = useMemo(() => {
    return generateMaintenanceAlerts(schedules, vehicles);
  }, [schedules, vehicles]);

  // Combined alerts (urgent queue)
  const displayAlerts = automatedAlerts.length > 0 ? automatedAlerts : parentAlerts;

  // Handlers
  const handleSaveSchedule = (scheduleData) => {
    setSchedules((prev) => {
      const updated = editingSchedule
        ? prev.map((s) => (s.id === scheduleData.id ? scheduleData : s))
        : [scheduleData, ...prev];
      persistSchedules(updated);
      return updated;
    });
    setEditingSchedule(null);
  };

  const handleOpenEdit = (schedule) => {
    setEditingSchedule(schedule);
    setIsScheduleModalOpen(true);
  };

  const handleOpenDelete = (schedule) => {
    setDeletingSchedule(schedule);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (scheduleId) => {
    setSchedules((prev) => {
      const updated = prev.filter((s) => s.id !== scheduleId);
      persistSchedules(updated);
      return updated;
    });
    setDeletingSchedule(null);
  };

  const handleOpenComplete = (schedule) => {
    setCompletingSchedule(schedule);
    setIsCompleteModalOpen(true);
  };

  const handleConfirmCompletion = (completedRecord, originalSchedule) => {
    // 1. Add record to maintenance history
    setRecords((prev) => {
      const updated = [completedRecord, ...prev];
      persistRecords(updated);
      return updated;
    });

    // 2. Automatically advance the schedule to next interval
    setSchedules((prev) => {
      const updated = prev.map((sch) => {
        if (sch.id === originalSchedule.id) {
          const nextOdo = calculateNextOdometer(
            completedRecord.odometerReading,
            sch.intervalKm
          );
          const nextDate = calculateNextDate(
            completedRecord.serviceDate,
            sch.intervalDays
          );
          return {
            ...sch,
            lastServiceDate: completedRecord.serviceDate,
            lastServiceOdometer: completedRecord.odometerReading,
            nextServiceOdometer: nextOdo,
            nextServiceDate: nextDate,
            status: 'Active'
          };
        }
        return sch;
      });
      persistSchedules(updated);
      return updated;
    });

    if (onScheduleService) onScheduleService(completedRecord);
    setCompletingSchedule(null);
  };

  const handleExportCSV = () => {
    const headers = ['Record ID', 'Vehicle ID', 'Service Type', 'Date', 'Odometer (km)', 'Cost ($)', 'Facility', 'Technician'];
    const rows = records.map((r) => [
      r.id,
      r.vehicleId,
      `"${r.serviceType}"`,
      r.serviceDate,
      r.odometerReading || 0,
      r.serviceCost || 0,
      `"${r.serviceProvider || ''}"`,
      `"${r.technician || ''}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `autrail-maintenance-records-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-end justify-between py-2 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] tracking-[1.2px] text-[#858894] uppercase">
              Operational Fleet Care
            </span>
            <span className="bg-[#24212f] text-[#c4b3ff] text-[9px] font-mono px-2 py-0.5 rounded border border-[#40375b]">
              AUTOMATED SCHEDULING ENGINE
            </span>
          </div>

          <h1 className="text-[28px] tracking-[-1px] font-bold text-[#f0f0f4] m-0">
            Maintenance management<span className="text-[#ad91ff]">.</span>
          </h1>
          <p className="text-[12px] text-[#898c98] mt-1 mb-0">
            Automated service triggers, preventative milestones, work order invoices, and fleet workshop scheduling.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 max-md:w-full">
          <Button variant="quiet" size="sm" onClick={handleExportCSV} icon={Download}>
            Export log
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingSchedule(null);
              setIsScheduleModalOpen(true);
            }}
            icon={Plus}
          >
            New schedule
          </Button>
        </div>
      </div>

      {/* Sub-navigation Tabs: Dashboard, Service Schedule, Maintenance History, Maintenance Calendar */}
      <div className="flex items-center gap-2 border-b border-[#252730] pb-1 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Maintenance Dashboard' },
          { id: 'schedules', label: `Service Schedule (${schedules.length})` },
          { id: 'history', label: `Maintenance History (${records.length})` },
          { id: 'calendar', label: 'Maintenance Calendar' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-mono rounded-t-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#17191f] text-[#f0f0f4] border-t-2 border-t-[#b49aff] border-x border-[#292c35] font-bold'
                : 'text-[#858894] hover:text-[#d1d1da] hover:bg-[#15161c]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: MAINTENANCE DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5 animate-in fade-in">
          {/* 6 Core Operational KPIs */}
          <MaintenanceKPIGrid
            kpis={kpis}
            activeFilter={kpiFilter}
            onCardClick={(cardId) => {
              setKpiFilter(cardId);
              if (cardId === 'due' || cardId === 'overdue' || cardId === 'upcoming') {
                setActiveTab('schedules');
              } else if (cardId === 'completed' || cardId === 'expenses') {
                setActiveTab('history');
              }
            }}
          />

          {/* Urgent Triage & Attention Queue */}
          <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#e5a46e]" />
                <h2 className="text-sm font-bold text-[#f0f0f4] m-0">
                  Automated Maintenance Reminders & Urgent Queue
                </h2>
              </div>
              <span className="font-mono text-[10px] text-[#858894]">
                Triggered by odometer & date milestones
              </span>
            </div>

            {displayAlerts.length === 0 ? (
              <div className="p-8 text-center bg-[#121319] border border-[#252730] rounded-lg text-[#858894]">
                <CheckCircle2 className="w-6 h-6 text-[#8be0b3] mx-auto mb-2" />
                <p className="text-xs">No active maintenance alerts. All vehicles are within operational safety thresholds.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-3 mt-3">
                {displayAlerts.map((alert) => {
                  const matchingSchedule = schedules.find((s) => s.id === alert.scheduleId);
                  const isCritical = alert.severity === 'critical' || alert.status === 'Overdue';

                  return (
                    <div
                      key={alert.id}
                      className="bg-[#121319] border border-[#2b2e38] hover:border-[#423d54] p-3.5 rounded-[9px] flex flex-col justify-between transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`font-mono text-[9px] px-2 py-0.5 rounded border ${
                              isCritical
                                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                : 'bg-[#382c25] text-[#e3ac77] border-[#523d30]'
                            }`}
                          >
                            {alert.status || 'SCHEDULE DUE'}
                          </span>
                          <span className="font-mono text-[8px] text-[#70737f]">
                            {alert.timestamp || 'Real-time Telemetry'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#f0f0f4]">{alert.title}</h4>
                        <p className="text-[10px] text-[#999ca7] mt-1 mb-0">{alert.desc}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-2.5 border-t border-[#1e2029]">
                        <span className="font-mono text-[9px] text-[#b49aff]">{alert.vehicleId || alert.vehicle}</span>
                        <div className="flex items-center gap-1.5">
                          {matchingSchedule && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleOpenComplete(matchingSchedule)}
                              icon={CheckCircle2}
                            >
                              Complete Bay
                            </Button>
                          )}
                          <Button
                            variant="text"
                            size="sm"
                            onClick={() => onResolveAlert && onResolveAlert(alert)}
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Snapshot Matrix of Active Schedules */}
          <MaintenanceScheduleTable
            schedules={schedules.slice(0, 4)}
            vehicles={vehicles}
            onCreateSchedule={() => {
              setEditingSchedule(null);
              setIsScheduleModalOpen(true);
            }}
            onEditSchedule={handleOpenEdit}
            onDeleteSchedule={handleOpenDelete}
            onCompleteSchedule={handleOpenComplete}
          />
        </div>
      )}

      {/* TAB 2: SERVICE SCHEDULE */}
      {activeTab === 'schedules' && (
        <div className="animate-in fade-in">
          <MaintenanceScheduleTable
            schedules={schedules}
            vehicles={vehicles}
            onCreateSchedule={() => {
              setEditingSchedule(null);
              setIsScheduleModalOpen(true);
            }}
            onEditSchedule={handleOpenEdit}
            onDeleteSchedule={handleOpenDelete}
            onCompleteSchedule={handleOpenComplete}
          />
        </div>
      )}

      {/* TAB 3: MAINTENANCE HISTORY */}
      {activeTab === 'history' && (
        <div className="animate-in fade-in">
          <MaintenanceHistoryTable records={records} vehicles={vehicles} />
        </div>
      )}

      {/* TAB 4: MAINTENANCE CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="animate-in fade-in">
          <MaintenanceCalendarView
            schedules={schedules}
            records={records}
            vehicles={vehicles}
            onSelectSchedule={handleOpenComplete}
          />
        </div>
      )}

      {/* Create / Edit Schedule Modal */}
      <MaintenanceScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setEditingSchedule(null);
        }}
        onSaveSchedule={handleSaveSchedule}
        scheduleToEdit={editingSchedule}
        vehicles={vehicles}
      />

      {/* Complete Maintenance & Invoice Upload Modal */}
      <CompleteServiceModal
        isOpen={isCompleteModalOpen}
        onClose={() => {
          setIsCompleteModalOpen(false);
          setCompletingSchedule(null);
        }}
        schedule={completingSchedule}
        vehicle={vehicles.find(
          (v) =>
            v.plate === completingSchedule?.vehicleId ||
            v.id === completingSchedule?.vehicleId
        )}
        onCompleteService={handleConfirmCompletion}
      />

      {/* Delete Schedule Confirmation Modal */}
      <DeleteScheduleModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingSchedule(null);
        }}
        schedule={deletingSchedule}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
