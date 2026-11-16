import React, { useState, useMemo } from 'react';
import SearchBar from '../common/SearchBar';
import Button from '../common/Button';
import {
  Fuel,
  Download,
  Edit2,
  Trash2,
  AlertTriangle,
  Plus,
  ShieldAlert,
  Calendar,
  CreditCard
} from 'lucide-react';
import { FUEL_TYPES } from '../../data/fuelMockData';

export default function FuelHistoryTable({
  records = [],
  vehicles = [],
  drivers = [],
  onAddRecord,
  onEditRecord,
  onDeleteRecord,
  onReviewAnomalies
}) {
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('ALL');
  const [driverFilter, setDriverFilter] = useState('ALL');
  const [fuelTypeFilter, setFuelTypeFilter] = useState('ALL');
  const [anomalyOnly, setAnomalyOnly] = useState(false);

  const filteredRecords = useMemo(() => {
    const term = (search || '').toLowerCase();
    return records.filter((rec) => {
      const matchSearch =
        (rec.id || '').toLowerCase().includes(term) ||
        (rec.vehicleId || '').toLowerCase().includes(term) ||
        (rec.driverName || '').toLowerCase().includes(term) ||
        (rec.fuelStation || '').toLowerCase().includes(term);

      const matchVehicle = vehicleFilter === 'ALL' || rec.vehicleId === vehicleFilter;
      const matchDriver = driverFilter === 'ALL' || rec.driverName === driverFilter;
      const matchFuelType = fuelTypeFilter === 'ALL' || rec.fuelType === fuelTypeFilter;
      const matchAnomaly = !anomalyOnly || rec.isAnomaly;

      return matchSearch && matchVehicle && matchDriver && matchFuelType && matchAnomaly;
    });
  }, [records, search, vehicleFilter, driverFilter, fuelTypeFilter, anomalyOnly]);

  const totalFilteredVolume = filteredRecords.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
  const totalFilteredCost = filteredRecords.reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);

  const handleDownloadReceipt = (rec) => {
    const content = `AUTRAIL FLEET MANAGEMENT — FUEL PURCHASE RECEIPT
===================================================
Transaction ID: ${rec.id}
Vehicle: ${rec.vehicleId}
Driver / Operator: ${rec.driverName}
Fuel Type: ${rec.fuelType}
Volume: ${rec.quantity} Litres
Price per Litre: $${Number(rec.pricePerLitre).toFixed(2)}
Total Amount: $${Number(rec.totalAmount).toFixed(2)}
Odometer at Pump: ${rec.odometerReading != null ? Number(rec.odometerReading).toLocaleString() : 'N/A'} km
Station: ${rec.fuelStation}
Payment Method: ${rec.paymentMethod}
Timestamp: ${rec.purchaseDate}
Anomaly Flag: ${rec.isAnomaly ? `FLAGGED (${rec.anomalyReason})` : 'VERIFIED'}
Verification: Verified by Autrail Digital Fuel Ledger.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = rec.receiptUrl || `${rec.id}-receipt.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card border border-white/95 rounded-2xl p-6 shadow-xl space-y-5 text-[#172033]">
      {/* Header and Controls */}
      <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch border-b border-[#E2E8F0] pb-4">
        <div>
          <span className="font-mono text-[10px] text-[#8A97AB] uppercase tracking-wider block font-semibold">
            Digital Fuel Ledger
          </span>
          <h3 className="text-base font-bold text-[#172033] m-0">
            Fuel Purchase Transactions
          </h3>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search plate, driver, station..."
            width="w-[280px] max-md:w-full"
          />

          <Button
            variant="primary"
            size="sm"
            onClick={onAddRecord}
            icon={Plus}
            className="rounded-xl py-2 px-4 font-bold shadow-md shadow-[#2879E8]/25 active:scale-[0.98]"
          >
            Record Purchase
          </Button>
        </div>
      </div>

      {/* Multi-Dimensional Filters Bar */}
      <div className="flex items-center justify-between pb-3 flex-wrap gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Vehicle Filter */}
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-1.5 text-xs text-[#172033] outline-none font-mono cursor-pointer font-medium"
          >
            <option value="ALL">All Vehicles</option>
            {vehicles.map((v) => (
              <option key={v.id || v.plate} value={v.plate}>
                {v.plate}
              </option>
            ))}
          </select>

          {/* Driver Filter */}
          <select
            value={driverFilter}
            onChange={(e) => setDriverFilter(e.target.value)}
            className="bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-1.5 text-xs text-[#172033] outline-none font-sans cursor-pointer font-medium"
          >
            <option value="ALL">All Drivers</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Fuel Type */}
          <select
            value={fuelTypeFilter}
            onChange={(e) => setFuelTypeFilter(e.target.value)}
            className="bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-1.5 text-xs text-[#172033] outline-none font-sans cursor-pointer font-medium"
          >
            <option value="ALL">All Fuel Types</option>
            {FUEL_TYPES.map((ft) => (
              <option key={ft} value={ft}>
                {ft}
              </option>
            ))}
          </select>

          {/* Anomaly Toggle */}
          <button
            type="button"
            onClick={() => setAnomalyOnly(!anomalyOnly)}
            className={`px-3 py-1.5 rounded-xl border transition-all text-xs font-medium cursor-pointer ${
              anomalyOnly
                ? 'bg-[#FEF2F2] text-[#E05252] border-[#FECACA] font-bold shadow-2xs'
                : 'bg-white text-[#68758A] border-[#D5E2F1] hover:text-[#172033]'
            }`}
          >
            ⚠ Flagged Only
          </button>
        </div>

        {/* Aggregated totals */}
        <div className="flex items-center gap-4 text-[#68758A] bg-[#F0F5FC] px-3 py-1.5 rounded-xl border border-[#D5E2F1]">
          <span>Volume: <b className="text-[#172033]">{totalFilteredVolume.toFixed(1)} L</b></span>
          <span>Spend: <b className="text-[#16A36A] font-bold">${totalFilteredCost.toFixed(2)}</b></span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap font-sans">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFD] text-[#68758A] font-mono text-[10px] uppercase font-semibold">
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4">Operator</th>
              <th className="py-3 px-4">Fuel Station</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Price / L</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Odometer</th>
              <th className="py-3 px-4">Purchase Date</th>
              <th className="py-3 px-4">Audit</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-[#68758A] font-mono">
                  No fuel transactions match your criteria.
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec) => (
                <tr
                  key={rec.id}
                  className={`border-b border-[#E2E8F0] hover:bg-[#F8FAFD] transition-colors last:border-0 ${
                    rec.isAnomaly ? 'bg-[#FEF2F2]/40' : ''
                  }`}
                >
                  {/* Vehicle */}
                  <td className="py-3.5 px-4">
                    <b className="font-mono text-xs text-[#172033] block font-bold">{rec.vehicleId}</b>
                    <span className="font-mono text-[9px] text-[#8A97AB]">{rec.id}</span>
                  </td>

                  {/* Driver */}
                  <td className="py-3.5 px-4 text-[#172033] font-medium">
                    {rec.driverName}
                  </td>

                  {/* Station */}
                  <td className="py-3.5 px-4 text-[#68758A]">
                    <span className="truncate block max-w-xs font-medium text-[#172033]">{rec.fuelStation}</span>
                    <span className="text-[10px] font-mono text-[#8A97AB]">{rec.paymentMethod}</span>
                  </td>

                  {/* Quantity */}
                  <td className="py-3.5 px-4 font-mono text-xs text-[#172033] font-bold">
                    {Number(rec.quantity).toFixed(1)} L
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-mono text-xs text-[#68758A]">
                    ${Number(rec.pricePerLitre).toFixed(2)}
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#16A36A]">
                    ${Number(rec.totalAmount).toFixed(2)}
                  </td>

                  {/* Odometer */}
                  <td className="py-3.5 px-4 font-mono text-xs text-[#172033]">
                    {rec.odometerReading ? rec.odometerReading.toLocaleString() : '—'} km
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 font-mono text-[10px] text-[#68758A]">
                    {rec.purchaseDate ? rec.purchaseDate.slice(0, 10) : '—'}
                  </td>

                  {/* Anomaly Audit */}
                  <td className="py-3.5 px-4">
                    {rec.isAnomaly ? (
                      <span
                        className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#FEF2F2] text-[#E05252] border border-[#FECACA] cursor-pointer shadow-2xs"
                        title={rec.anomalyReason}
                        onClick={onReviewAnomalies}
                      >
                        ⚠ FLAGGED
                      </span>
                    ) : (
                      <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#16A36A] border border-[#BBF7D0]">
                        ✓ OK
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="quiet"
                        size="sm"
                        onClick={() => handleDownloadReceipt(rec)}
                        icon={Download}
                        className="rounded-lg py-1 px-2.5 text-xs"
                      >
                        <span className="max-md:hidden">Receipt</span>
                      </Button>
                      <button
                        type="button"
                        onClick={() => onEditRecord(rec)}
                        className="p-1.5 rounded-lg text-[#68758A] hover:text-[#2879E8] hover:bg-[#EAF3FF] transition-colors"
                        title="Edit record"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteRecord(rec)}
                        className="p-1.5 rounded-lg text-[#68758A] hover:text-[#E05252] hover:bg-[#FEF2F2] transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
