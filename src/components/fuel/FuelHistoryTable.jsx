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
    return records.filter((rec) => {
      const matchSearch =
        rec.id.toLowerCase().includes(search.toLowerCase()) ||
        rec.vehicleId.toLowerCase().includes(search.toLowerCase()) ||
        (rec.driverName && rec.driverName.toLowerCase().includes(search.toLowerCase())) ||
        (rec.fuelStation && rec.fuelStation.toLowerCase().includes(search.toLowerCase()));

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
Odometer at Pump: ${rec.odometerReading ? rec.odometerReading.toLocaleString() : 'N/A'} km
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
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5 space-y-4">
      {/* Header and Controls */}
      <div className="flex items-center justify-between gap-3 max-md:flex-col max-md:items-stretch">
        <div>
          <span className="font-mono text-[9px] text-[#858894] uppercase tracking-wider block">
            Digital Fuel Ledger
          </span>
          <h3 className="text-sm font-bold text-[#f0f0f4] m-0">
            Fuel Purchase Transactions
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search plate, driver, station..."
            width="w-[260px] max-md:w-full"
          />

          <Button variant="primary" size="sm" onClick={onAddRecord} icon={Plus}>
            Record Purchase
          </Button>
        </div>
      </div>

      {/* Multi-Dimensional Filters Bar */}
      <div className="flex items-center justify-between border-b border-[#252730] pb-3 flex-wrap gap-2 text-[10px] font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Vehicle Filter */}
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1 text-xs text-[#eee] outline-none font-mono cursor-pointer"
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
            className="bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1 text-xs text-[#eee] outline-none font-sans cursor-pointer"
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
            className="bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1 text-xs text-[#eee] outline-none font-sans cursor-pointer"
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
            className={`px-2.5 py-1 rounded-[6px] border transition-colors ${
              anomalyOnly
                ? 'bg-red-500/20 text-red-300 border-red-500/40 font-bold'
                : 'bg-[#20222a] text-[#858894] border-[#30333d] hover:text-white'
            }`}
          >
            ⚠ Flagged Only
          </button>
        </div>

        {/* Aggregated totals */}
        <div className="flex items-center gap-3 text-[#858894]">
          <span>Volume: <b className="text-[#eee]">{totalFilteredVolume.toFixed(1)} L</b></span>
          <span>Spend: <b className="text-[#8be0b3] font-bold">${totalFilteredCost.toFixed(2)}</b></span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap font-sans">
          <thead>
            <tr className="border-b border-[#30323b] text-[#747783] font-mono text-[8px] uppercase">
              <th className="py-2.5 px-3">Vehicle</th>
              <th className="py-2.5 px-3">Operator</th>
              <th className="py-2.5 px-3">Fuel Station</th>
              <th className="py-2.5 px-3">Quantity</th>
              <th className="py-2.5 px-3">Price / L</th>
              <th className="py-2.5 px-3">Total Amount</th>
              <th className="py-2.5 px-3">Odometer</th>
              <th className="py-2.5 px-3">Purchase Date</th>
              <th className="py-2.5 px-3">Audit</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-[#747783]">
                  No fuel transactions match your criteria.
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec) => (
                <tr
                  key={rec.id}
                  className={`border-b border-[#242633] hover:bg-[#1b1d26] transition-colors last:border-0 ${
                    rec.isAnomaly ? 'bg-amber-500/[0.04]' : ''
                  }`}
                >
                  {/* Vehicle */}
                  <td className="py-3 px-3">
                    <b className="font-mono text-xs text-[#f0f0f4] block">{rec.vehicleId}</b>
                    <span className="font-mono text-[8px] text-[#747783]">{rec.id}</span>
                  </td>

                  {/* Driver */}
                  <td className="py-3 px-3 text-[#d1d1da]">
                    {rec.driverName}
                  </td>

                  {/* Station */}
                  <td className="py-3 px-3 text-[10px] text-[#aeb0ba]">
                    <span className="truncate block max-w-xs">{rec.fuelStation}</span>
                    <span className="text-[8px] font-mono text-[#747783]">{rec.paymentMethod}</span>
                  </td>

                  {/* Quantity */}
                  <td className="py-3 px-3 font-mono text-[10px] text-[#eee] font-bold">
                    {Number(rec.quantity).toFixed(1)} L
                  </td>

                  {/* Price */}
                  <td className="py-3 px-3 font-mono text-[10px] text-[#aeb0ba]">
                    ${Number(rec.pricePerLitre).toFixed(2)}
                  </td>

                  {/* Total */}
                  <td className="py-3 px-3 font-mono text-xs font-bold text-[#8be0b3]">
                    ${Number(rec.totalAmount).toFixed(2)}
                  </td>

                  {/* Odometer */}
                  <td className="py-3 px-3 font-mono text-[10px] text-[#d1d1da]">
                    {rec.odometerReading ? rec.odometerReading.toLocaleString() : '—'} km
                  </td>

                  {/* Date */}
                  <td className="py-3 px-3 font-mono text-[9px] text-[#858894]">
                    {rec.purchaseDate ? rec.purchaseDate.slice(0, 10) : '—'}
                  </td>

                  {/* Anomaly Audit */}
                  <td className="py-3 px-3">
                    {rec.isAnomaly ? (
                      <span
                        className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-pointer"
                        title={rec.anomalyReason}
                        onClick={onReviewAnomalies}
                      >
                        ⚠ FLAGGED
                      </span>
                    ) : (
                      <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-[#1c302a] text-[#83d7a9] border border-[#2c493d]">
                        ✓ OK
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="quiet"
                        size="sm"
                        onClick={() => handleDownloadReceipt(rec)}
                        icon={Download}
                      >
                        <span className="max-md:hidden">Receipt</span>
                      </Button>
                      <button
                        type="button"
                        onClick={() => onEditRecord(rec)}
                        className="p-1.5 rounded text-[#858894] hover:text-[#b49aff] hover:bg-[#20222a] transition-colors"
                        title="Edit record"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteRecord(rec)}
                        className="p-1.5 rounded text-[#858894] hover:text-red-400 hover:bg-[#20222a] transition-colors"
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

