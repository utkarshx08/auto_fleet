import React, { useState, useMemo } from 'react';
import Button from '../components/common/Button';
import TrueFocus from '../components/common/TrueFocus';
import FuelKPIGrid from '../components/fuel/FuelKPIGrid';
import FuelHistoryTable from '../components/fuel/FuelHistoryTable';
import FuelAnalyticsCharts from '../components/fuel/FuelAnalyticsCharts';
import FuelPurchaseModal from '../components/fuel/FuelPurchaseModal';
import DeleteFuelModal from '../components/fuel/DeleteFuelModal';
import FuelAnomalyReviewModal from '../components/fuel/FuelAnomalyReviewModal';
import {
  Fuel as FuelIcon,
  Plus,
  Download,
  AlertTriangle,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  TrendingDown,
  Gauge
} from 'lucide-react';
import { initialVehicles, initialDrivers } from '../data/mockData';
import { getFuelRecords, persistFuelRecords } from '../services/fuelStorageService';
import { calculateFuelKPIs } from '../services/fuelService';

export default function Fuel({
  vehicles = initialVehicles,
  drivers = initialDrivers,
  onAddFuelExpense
}) {
  // Navigation Sub-tabs: 'dashboard' | 'history' | 'analytics'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Operational State — loaded from persistent storage
  const [fuelRecords, setFuelRecords] = useState(() => getFuelRecords());

  // Modals state
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [deletingRecord, setDeletingRecord] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false);

  // Filter selection from KPI click
  const [kpiFilter, setKpiFilter] = useState('ALL');

  // Calculate Live KPIs
  const kpis = useMemo(() => {
    return calculateFuelKPIs(fuelRecords, vehicles);
  }, [fuelRecords, vehicles]);

  const flaggedRecords = useMemo(() => {
    return fuelRecords.filter((r) => r.isAnomaly);
  }, [fuelRecords]);

  // Handlers
  const handleSavePurchase = (recordData) => {
    setFuelRecords((prev) => {
      const updated = editingRecord
        ? prev.map((r) => (r.id === recordData.id ? recordData : r))
        : [recordData, ...prev];
      persistFuelRecords(updated);
      return updated;
    });
    setIsPurchaseModalOpen(false);
    setEditingRecord(null);
  };

  const handleOpenEdit = (rec) => {
    setEditingRecord(rec);
    setIsPurchaseModalOpen(true);
  };

  const handleOpenDelete = (rec) => {
    setDeletingRecord(rec);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (id) => {
    setFuelRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      persistFuelRecords(updated);
      return updated;
    });
    setIsDeleteModalOpen(false);
    setDeletingRecord(null);
  };

  const handleClearAnomaly = (recordId) => {
    setFuelRecords((prev) => {
      const updated = prev.map((r) =>
        r.id === recordId
          ? { ...r, isAnomaly: false, anomalyReason: 'Verified by fleet manager.' }
          : r
      );
      persistFuelRecords(updated);
      return updated;
    });
  };

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Vehicle ID', 'Driver', 'Fuel Type', 'Quantity (L)', 'Price/L ($)', 'Total Amount ($)', 'Odometer (km)', 'Station', 'Payment Method', 'Purchase Date', 'Anomaly Status'];
    const rows = fuelRecords.map((r) => [
      r.id,
      r.vehicleId,
      `"${r.driverName}"`,
      r.fuelType,
      r.quantity,
      r.pricePerLitre,
      r.totalAmount,
      r.odometerReading || 0,
      `"${r.fuelStation}"`,
      `"${r.paymentMethod}"`,
      r.purchaseDate,
      r.isAnomaly ? `FLAGGED: ${r.anomalyReason}` : 'VERIFIED'
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `autrail-fuel-purchases-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex items-end justify-between py-4 max-md:flex-col max-md:items-start max-md:gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-[1.2px] text-[#475569] uppercase font-bold">
              Energy & Financial Operations
            </span>
            <span className="bg-[#DCFCE7] text-[#16A36A] text-[10px] font-mono px-2 py-0.5 rounded-md border border-[#BBF7D0] font-bold">
              ANOMALY AUDIT ACTIVE
            </span>
          </div>

          <div className="-ml-3 py-0.5">
            <TrueFocus
              sentence="Fuel & Energy Management"
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
          <p className="text-xs text-[#334155] mt-1 mb-0 font-semibold">
            Monitor refueling transactions, fuel cards, station expenses, true consumption rates, and suspicious purchase flags.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3 max-md:w-full">
          <Button variant="quiet" size="sm" onClick={handleExportCSV} icon={Download} className="rounded-xl py-2 px-4">
            Export ledger
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingRecord(null);
              setIsPurchaseModalOpen(true);
            }}
            icon={Plus}
            className="rounded-xl py-2 px-4 font-bold shadow-md shadow-[#2879E8]/25 active:scale-[0.98]"
          >
            Add fuel purchase
          </Button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-1 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Fuel Dashboard' },
          { id: 'history', label: `Purchase History (${fuelRecords.length})` },
          { id: 'analytics', label: 'Fuel Analytics & Trends' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-mono rounded-xl transition-all whitespace-nowrap cursor-pointer font-medium ${
              activeTab === tab.id
                ? 'bg-[#EAF3FF] text-[#2879E8] border border-[#2879E8]/30 font-bold shadow-xs'
                : 'text-[#68758A] hover:text-[#172033] hover:bg-[#F8FAFD]'
            }`}
          >
            {tab.label}
          </button>
        ))}

        <button
          type="button"
          onClick={() => {
            setEditingRecord(null);
            setIsPurchaseModalOpen(true);
          }}
          className="ml-auto px-3.5 py-1.5 text-xs font-mono text-[#2879E8] bg-[#EAF3FF] hover:bg-[#2879E8] hover:text-white rounded-xl border border-[#2879E8]/20 flex items-center gap-1.5 transition-all cursor-pointer font-bold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Entry Form</span>
        </button>
      </div>

      {/* TAB 1: FUEL DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* 6 Core Fuel KPIs */}
          <FuelKPIGrid
            kpis={kpis}
            activeFilter={kpiFilter}
            onCardClick={(cardId) => {
              setKpiFilter(cardId);
              if (cardId === 'anomalies') {
                setIsAnomalyModalOpen(true);
              } else if (cardId === 'purchased' || cardId === 'expenditure') {
                setActiveTab('history');
              } else {
                setActiveTab('analytics');
              }
            }}
          />

          {/* Anomaly Warning Banner if any flagged */}
          {flaggedRecords.length > 0 && (
            <div className="p-4 bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl flex items-center justify-between gap-3 text-[#92400E] shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#D97706] flex items-center justify-center shrink-0 shadow-2xs">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <b className="text-xs font-bold text-[#78350F]">
                    {flaggedRecords.length} Refuelling Transactions Flagged for Review
                  </b>
                  <p className="text-[11px] text-[#92400E] m-0 mt-0.5">
                    Rule-based engine detected volume spikes, potential duplicate receipts, or odometer reading discrepancies.
                  </p>
                </div>
              </div>
              <Button
                variant="quiet"
                size="sm"
                onClick={() => setIsAnomalyModalOpen(true)}
                className="shrink-0 bg-white border border-[#FDE68A] rounded-xl text-xs font-bold text-[#78350F]"
              >
                Review Anomaly Queue ↗
              </Button>
            </div>
          )}

          {/* Live Fuel Level Monitor Table */}
          <div className="glass-card border border-white/95 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="font-mono text-[10px] text-[#8A97AB] uppercase tracking-wider block font-semibold">
                  On-Board Tank Telemetry
                </span>
                <h3 className="text-base font-bold text-[#172033] m-0">
                  Live Fuel Level & Range Monitor
                </h3>
              </div>
              <span className="font-mono text-[11px] text-[#68758A] bg-[#F0F5FC] px-2.5 py-1 rounded-lg border border-[#D5E2F1]">
                Real-time float sensor readings
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
              <table className="w-full border-collapse text-left whitespace-nowrap font-sans text-xs">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFD]">
                    <th className="text-[#68758A] font-mono text-[10px] py-3 px-4 uppercase font-semibold">Vehicle</th>
                    <th className="text-[#68758A] font-mono text-[10px] py-3 px-4 uppercase font-semibold">Operator</th>
                    <th className="text-[#68758A] font-mono text-[10px] py-3 px-4 uppercase font-semibold">Tank Level</th>
                    <th className="text-[#68758A] font-mono text-[10px] py-3 px-4 uppercase font-semibold">Gauge</th>
                    <th className="text-[#68758A] font-mono text-[10px] py-3 px-4 uppercase font-semibold">Range Left</th>
                    <th className="text-[#68758A] font-mono text-[10px] py-3 px-4 uppercase font-semibold text-right">Quick Refill</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((veh) => {
                    const range = Math.round(veh.fuel * 7.5);
                    const isLow = veh.fuel < 25;

                    return (
                      <tr key={veh.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFD] transition-colors last:border-0">
                        <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#172033]">{veh.plate}</td>
                        <td className="py-3.5 px-4 text-xs text-[#172033] font-medium">{veh.driver}</td>
                        <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#172033]">{veh.fuel}%</td>
                        <td className="py-3.5 px-4">
                          <div className="w-36 h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                            <div
                              style={{ width: `${veh.fuel}%` }}
                              className={`h-full rounded-full ${
                                veh.fuel > 50 ? 'bg-[#16A36A]' : veh.fuel > 20 ? 'bg-[#D97706]' : 'bg-[#E05252]'
                              }`}
                            />
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-[#2879E8] font-bold">~{range} km</td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant={isLow ? 'primary' : 'quiet'}
                            size="sm"
                            onClick={() => {
                              setEditingRecord(null);
                              setIsPurchaseModalOpen(true);
                            }}
                            className="rounded-xl py-1.5 px-3 text-xs"
                          >
                            {isLow ? 'Refuel Bay' : 'Log Refill'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Snapshot Matrix of Recent Purchases */}
          <FuelHistoryTable
            records={fuelRecords.slice(0, 5)}
            vehicles={vehicles}
            drivers={drivers}
            onAddRecord={() => {
              setEditingRecord(null);
              setIsPurchaseModalOpen(true);
            }}
            onEditRecord={handleOpenEdit}
            onDeleteRecord={handleOpenDelete}
            onReviewAnomalies={() => setIsAnomalyModalOpen(true)}
          />
        </div>
      )}

      {/* TAB 2: PURCHASE HISTORY */}
      {activeTab === 'history' && (
        <div className="animate-in fade-in duration-200">
          <FuelHistoryTable
            records={fuelRecords}
            vehicles={vehicles}
            drivers={drivers}
            onAddRecord={() => {
              setEditingRecord(null);
              setIsPurchaseModalOpen(true);
            }}
            onEditRecord={handleOpenEdit}
            onDeleteRecord={handleOpenDelete}
            onReviewAnomalies={() => setIsAnomalyModalOpen(true)}
          />
        </div>
      )}

      {/* TAB 3: FUEL ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="animate-in fade-in duration-200">
          <FuelAnalyticsCharts records={fuelRecords} vehicles={vehicles} />
        </div>
      )}

      {/* Record Fuel Purchase Modal */}
      <FuelPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          setIsPurchaseModalOpen(false);
          setEditingRecord(null);
        }}
        onSaveRecord={handleSavePurchase}
        recordToEdit={editingRecord}
        vehicles={vehicles}
        drivers={drivers}
        existingRecords={fuelRecords}
      />

      {/* Delete Record Confirmation Modal */}
      <DeleteFuelModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingRecord(null);
        }}
        record={deletingRecord}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* Fuel Anomaly Review Modal */}
      <FuelAnomalyReviewModal
        isOpen={isAnomalyModalOpen}
        onClose={() => setIsAnomalyModalOpen(false)}
        records={fuelRecords}
        onClearAnomaly={handleClearAnomaly}
        onEditRecord={handleOpenEdit}
        onDeleteRecord={handleOpenDelete}
      />
    </div>
  );
}
