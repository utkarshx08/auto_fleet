import React, { useState, useMemo } from 'react';
import Button from '../components/common/Button';
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
import { initialFuelRecords } from '../data/fuelMockData';
import { calculateFuelKPIs } from '../services/fuelService';

export default function Fuel({
  vehicles = initialVehicles,
  drivers = initialDrivers,
  onAddFuelExpense
}) {
  // Navigation Sub-tabs: 'dashboard' | 'history' | 'analytics'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Operational State
  const [fuelRecords, setFuelRecords] = useState(initialFuelRecords);

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
    if (editingRecord) {
      setFuelRecords((prev) =>
        prev.map((r) => (r.id === recordData.id ? recordData : r))
      );
    } else {
      setFuelRecords((prev) => [recordData, ...prev]);
    }
    setEditingRecord(null);

    // Cross-module hook: update operational expenses if provided
    if (onAddFuelExpense) onAddFuelExpense(recordData);
  };

  const handleOpenEdit = (record) => {
    setEditingRecord(record);
    setIsPurchaseModalOpen(true);
  };

  const handleOpenDelete = (record) => {
    setDeletingRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (recordId) => {
    setFuelRecords((prev) => prev.filter((r) => r.id !== recordId));
    setDeletingRecord(null);
  };

  const handleClearAnomaly = (recordId) => {
    setFuelRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? { ...r, isAnomaly: false, anomalyReason: 'Verified by fleet manager.' }
          : r
      )
    );
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
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-end justify-between py-2 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] tracking-[1.2px] text-[#858894] uppercase">
              Energy & Financial Operations
            </span>
            <span className="bg-[#24212f] text-[#c4b3ff] text-[9px] font-mono px-2 py-0.5 rounded border border-[#40375b]">
              ANOMALY AUDIT ENGINE ACTIVE
            </span>
          </div>

          <h1 className="text-[28px] tracking-[-1px] font-bold text-[#f0f0f4] m-0">
            Fuel management<span className="text-[#ad91ff]">.</span>
          </h1>
          <p className="text-[12px] text-[#898c98] mt-1 mb-0">
            Monitor refueling transactions, fuel cards, station expenses, true consumption rates, and suspicious purchase flags.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 max-md:w-full">
          <Button variant="quiet" size="sm" onClick={handleExportCSV} icon={Download}>
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
          >
            Add fuel purchase
          </Button>
        </div>
      </div>

      {/* Sub-navigation Tabs: Fuel Dashboard, Purchase History, Fuel Analytics */}
      <div className="flex items-center gap-2 border-b border-[#252730] pb-1 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Fuel Dashboard' },
          { id: 'history', label: `Purchase History (${fuelRecords.length})` },
          { id: 'analytics', label: 'Fuel Analytics & Trends' }
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

        {/* Quick modal trigger tab */}
        <button
          type="button"
          onClick={() => {
            setEditingRecord(null);
            setIsPurchaseModalOpen(true);
          }}
          className="ml-auto px-3 py-1.5 text-[11px] font-mono text-[#b49aff] hover:text-[#eee] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Entry Form</span>
        </button>
      </div>

      {/* TAB 1: FUEL DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5 animate-in fade-in">
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
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-lg flex items-center justify-between gap-3 text-amber-200">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <b className="text-xs">
                    {flaggedRecords.length} Refuelling Transactions Flagged for Review
                  </b>
                  <p className="text-[10px] text-amber-300/80 m-0">
                    Rule-based engine detected volume spikes, potential duplicate receipts, or odometer reading discrepancies.
                  </p>
                </div>
              </div>
              <Button
                variant="quiet"
                size="sm"
                onClick={() => setIsAnomalyModalOpen(true)}
                className="shrink-0"
              >
                Review Anomaly Queue ↗
              </Button>
            </div>
          )}

          {/* Live Fuel Level Monitor Table */}
          <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-mono text-[9px] text-[#858894] uppercase tracking-wider block">
                  On-Board Tank Telemetry
                </span>
                <h3 className="text-sm font-bold text-[#f0f0f4] m-0">
                  Live Fuel Level & Range Monitor
                </h3>
              </div>
              <span className="font-mono text-[10px] text-[#858894]">Real-time float sensor readings</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left whitespace-nowrap font-sans">
                <thead>
                  <tr className="border-b border-[#30323b]">
                    <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-3 uppercase">Vehicle</th>
                    <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-3 uppercase">Operator</th>
                    <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-3 uppercase">Tank Level</th>
                    <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-3 uppercase">Gauge</th>
                    <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-3 uppercase">Range Left</th>
                    <th className="text-[#747783] font-mono text-[8px] tracking-[0.8px] py-2.5 px-3 uppercase text-right">Quick Refill</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((veh) => {
                    const range = Math.round(veh.fuel * 7.5);
                    const isLow = veh.fuel < 25;

                    return (
                      <tr key={veh.id} className="border-b border-[#282a33] hover:bg-[#1f212a] transition-colors last:border-0">
                        <td className="py-3 px-3 font-mono text-xs font-bold text-[#e0e0e7]">{veh.plate}</td>
                        <td className="py-3 px-3 text-[11px] text-[#aeb0ba]">{veh.driver}</td>
                        <td className="py-3 px-3 font-mono text-xs text-[#d1d1da]">{veh.fuel}%</td>
                        <td className="py-3 px-3">
                          <div className="w-36 h-2 rounded-full bg-[#343640] overflow-hidden">
                            <div
                              style={{ width: `${veh.fuel}%` }}
                              className={`h-full rounded-full ${
                                veh.fuel > 50 ? 'bg-[#82d4a8]' : veh.fuel > 20 ? 'bg-[#e5a46e]' : 'bg-[#e56868]'
                              }`}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-xs text-[#b49aff]">~{range} km</td>
                        <td className="py-3 px-3 text-right">
                          <Button
                            variant={isLow ? 'primary' : 'quiet'}
                            size="sm"
                            onClick={() => {
                              setEditingRecord(null);
                              setIsPurchaseModalOpen(true);
                            }}
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
        <div className="animate-in fade-in">
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
        <div className="animate-in fade-in">
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
