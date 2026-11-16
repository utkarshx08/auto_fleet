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
    setIsDeleteModalOpen(false);
    setDeletingSchedule(null);
  };

  const handleOpenComplete = (schedule) => {
    setCompletingSchedule(schedule);
    setIsCompleteModalOpen(true);
  };

  const handleConfirmComplete = (completionData) => {
    const { schedule, ...recordData } = completionData;

    // 1. Create a historical record
    const newRecord = {
      ...recordData,
      id: `REC-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString()
    };

    setRecords((prev) => {
      const updated = [newRecord, ...prev];
      persistRecords(updated);
      return updated;
    });

    // 2. Advance schedule next due thresholds
    setSchedules((prev) => {
      const updated = prev.map((s) => {
        if (s.id === schedule.id) {
          const nextOdo = calculateNextOdometer(
            completionData.currentOdometer,
            s.intervalKm
          );
          const nextDt = calculateNextDate(
            completionData.completedDate,
            s.intervalMonths
          );

          return {
            ...s,
            lastServiceDate: completionData.completedDate,
            lastServiceOdometer: completionData.currentOdometer,
            nextDueOdometer: nextOdo || s.nextDueOdometer,
            nextDueDate: nextDt || s.nextDueDate,
            status: 'Scheduled',
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      });
      persistSchedules(updated);
      return updated;
    });

    setIsCompleteModalOpen(false);
    setCompletingSchedule(null);
  };

  const handleExportCSV = () => {
    const headers = [
      'Record ID',
      'Vehicle ID',
      'Service Type',
      'Completed Date',
      'Odometer (km)',
      'Service Provider',
      'Cost ($)',
      'Notes'
    ];
    const rows = records.map((r) => [
      r.id,
      r.vehicleId,
      r.serviceType,
      r.completedDate,
      r.odometerAtService,
      `"${r.serviceProvider || ''}"`,
      r.serviceCost,
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `autrail_maintenance_ledger_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-end justify-between py-2 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#475569] uppercase mb-1 font-bold">
            Preventative Fleet Maintenance & Service Operations
          </p>
          <h1 className="text-[28px] tracking-tight font-black text-[#0B132B] m-0">
            Maintenance Management<span className="text-[#2879E8]">.</span>
          </h1>
          <p className="text-[13px] text-[#334155] mt-1 font-semibold">
            Automated sensor tracking, routine servicing schedules, repair logs, and full shop lifecycle auditing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="quiet"
            size="sm"
            onClick={handleExportCSV}
            icon={Download}
          >
            Export Ledger
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

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-1 overflow-x-auto">
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
            className={`px-4 py-2.5 text-xs font-mono rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-[#2879E8] border-t-2 border-t-[#2879E8] border-x border-[#E2E8F0] font-bold shadow-2xs'
                : 'text-[#68758A] hover:text-[#172033] hover:bg-[#F0F5FC]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: MAINTENANCE DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in">
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
          <div className="glass-card rounded-2xl p-5 shadow-liquid-subtle">
            <div className="flex items-center justify-between mb-3.5 border-b border-[#E2E8F0]/80 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#E7A329]" />
                <h2 className="text-sm font-bold text-[#172033] m-0">
                  Automated Maintenance Reminders & Urgent Queue
                </h2>
              </div>
              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#FEF7EA] text-[#E7A329] border border-[#F8DCB0] font-bold">
                {displayAlerts.length} Attention Required
              </span>
            </div>

            {displayAlerts.length === 0 ? (
              <div className="p-8 text-center text-[#68758A] font-mono text-xs">
                All vehicles operating in optimal condition. No critical service overruns.
              </div>
            ) : (
              <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-3.5">
                {displayAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-[#F8FAFD] border border-[#E2E8F0] hover:border-[#2879E8]/30 rounded-xl p-3.5 flex items-start gap-3 transition-all shadow-2xs"
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${
                        alert.type === 'danger' || alert.severity === 'critical'
                          ? 'bg-[#FDF2F2] text-[#E05252] border-[#F8D7DA]'
                          : 'bg-[#FEF7EA] text-[#E7A329] border-[#F8DCB0]'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <b className="text-xs text-[#172033] font-bold">
                          {alert.title}
                        </b>
                        <span className="font-mono text-[9px] text-[#8A97AB]">
                          {alert.timestamp || 'Immediate'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#68758A] my-1 font-medium">
                        {alert.desc || alert.description}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            const sched = schedules.find(
                              (s) => s.vehicleId === alert.vehicleId
                            );
                            if (sched) {
                              handleOpenComplete(sched);
                            } else {
                              handleOpenEdit({
                                vehicleId: alert.vehicleId,
                                serviceType: alert.title
                              });
                            }
                          }}
                        >
                          Resolve in shop
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Schedule Directory Overview */}
          <MaintenanceScheduleTable
            schedules={schedules.slice(0, 5)}
            onEditSchedule={handleOpenEdit}
            onCompleteSchedule={handleOpenComplete}
            onDeleteSchedule={handleOpenDelete}
            onViewAll={() => setActiveTab('schedules')}
            isCompact={true}
          />
        </div>
      )}

      {/* TAB 2: SERVICE SCHEDULES TABLE */}
      {activeTab === 'schedules' && (
        <div className="animate-in fade-in">
          <MaintenanceScheduleTable
            schedules={schedules}
            onEditSchedule={handleOpenEdit}
            onCompleteSchedule={handleOpenComplete}
            onDeleteSchedule={handleOpenDelete}
            onAddNew={() => {
              setEditingSchedule(null);
              setIsScheduleModalOpen(true);
            }}
          />
        </div>
      )}

      {/* TAB 3: MAINTENANCE HISTORY LEDGER */}
      {activeTab === 'history' && (
        <div className="animate-in fade-in">
          <MaintenanceHistoryTable
            records={records}
            onExportCSV={handleExportCSV}
          />
        </div>
      )}

      {/* TAB 4: CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <div className="animate-in fade-in">
          <MaintenanceCalendarView
            schedules={schedules}
            records={records}
            onSelectSchedule={handleOpenEdit}
          />
        </div>
      )}

      {/* Modal: Create / Edit Maintenance Schedule */}
      <MaintenanceScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setEditingSchedule(null);
        }}
        schedule={editingSchedule}
        vehicles={vehicles}
        onSaveSchedule={handleSaveSchedule}
      />

      {/* Modal: Complete Service Workflow */}
      <CompleteServiceModal
        isOpen={isCompleteModalOpen}
        onClose={() => {
          setIsCompleteModalOpen(false);
          setCompletingSchedule(null);
        }}
        schedule={completingSchedule}
        vehicles={vehicles}
        onCompleteService={handleConfirmComplete}
      />

      {/* Modal: Confirm Schedule Decommission */}
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
