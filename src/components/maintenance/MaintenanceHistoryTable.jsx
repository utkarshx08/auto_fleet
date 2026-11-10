import React, { useState, useMemo } from 'react';
import SearchBar from '../common/SearchBar';
import Button from '../common/Button';
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  DollarSign,
  User,
  Building,
  ExternalLink
} from 'lucide-react';

export default function MaintenanceHistoryTable({ records = [], vehicles = [] }) {
  const [search, setSearch] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('ALL');

  const filteredRecords = useMemo(() => {
    const term = (search || '').toLowerCase();
    return records.filter((rec) => {
      const matchSearch =
        (rec.id || '').toLowerCase().includes(term) ||
        (rec.vehicleId || '').toLowerCase().includes(term) ||
        (rec.serviceType || '').toLowerCase().includes(term) ||
        (rec.technician || '').toLowerCase().includes(term) ||
        (rec.serviceProvider || '').toLowerCase().includes(term);

      const matchVehicle =
        selectedVehicle === 'ALL' || rec.vehicleId === selectedVehicle;

      return matchSearch && matchVehicle;
    });
  }, [records, search, selectedVehicle]);

  const totalCostFiltered = filteredRecords.reduce((sum, r) => sum + (Number(r.serviceCost) || 0), 0);

  const handleDownloadInvoice = (rec) => {
    const content = `AUTRAIL FLEET MANAGEMENT — MAINTENANCE SERVICE INVOICE
======================================================
Invoice ID: ${rec.id}
Vehicle: ${rec.vehicleId}
Service Type: ${rec.serviceType}
Service Date: ${rec.serviceDate}
Odometer Reading: ${rec.odometerReading != null ? Number(rec.odometerReading).toLocaleString() : 'N/A'} km
Service Provider: ${rec.serviceProvider || 'Fleet Bay'}
Technician: ${rec.technician || 'Certified Tech'}
Cost: $${Number(rec.serviceCost).toFixed(2)}
Description: ${rec.description || 'Routine maintenance'}
Status: Completed
Verification: Signed & Archived in Autrail Telemetry Cloud.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = rec.invoiceUrl || `${rec.id}-invoice.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 max-md:flex-col max-md:items-stretch">
        <div>
          <span className="font-mono text-[9px] text-[#858894] uppercase tracking-wider block">
            Archived Work Orders & Invoices
          </span>
          <h3 className="text-sm font-bold text-[#f0f0f4] m-0">
            Completed Maintenance History
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search invoice, technician, service..."
            width="w-[260px] max-md:w-full"
          />

          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-xs text-[#eee] outline-none font-mono cursor-pointer"
          >
            <option value="ALL">All Fleet Vehicles</option>
            {vehicles.map((v) => (
              <option key={v.id || v.plate} value={v.plate}>
                {v.plate} ({v.model})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Filter Pill */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#858894] border-b border-[#252730] pb-3">
        <span>Showing {filteredRecords.length} completed work order records</span>
        <span>
          Total Filtered Spend: <b className="text-[#8be0b3] font-bold">${totalCostFiltered.toFixed(2)}</b>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap font-sans">
          <thead>
            <tr className="border-b border-[#30323b] text-[#747783] font-mono text-[8px] uppercase">
              <th className="py-2.5 px-3">Order ID</th>
              <th className="py-2.5 px-3">Vehicle</th>
              <th className="py-2.5 px-3">Service Performed</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Odometer</th>
              <th className="py-2.5 px-3">Facility & Tech</th>
              <th className="py-2.5 px-3">Cost</th>
              <th className="py-2.5 px-3 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#747783]">
                  No maintenance records match your search criteria.
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec) => (
                <tr
                  key={rec.id}
                  className="border-b border-[#242633] hover:bg-[#1b1d26] transition-colors last:border-0"
                >
                  {/* Order ID */}
                  <td className="py-3 px-3 font-mono text-xs text-[#b49aff] font-bold">
                    {rec.id}
                  </td>

                  {/* Vehicle */}
                  <td className="py-3 px-3 font-mono text-xs text-[#f0f0f4]">
                    {rec.vehicleId}
                  </td>

                  {/* Service & Notes */}
                  <td className="py-3 px-3">
                    <b className="text-[#d1d1da] block text-xs">{rec.serviceType}</b>
                    <span className="text-[10px] text-[#747783] truncate block max-w-xs">
                      {rec.description}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-3 font-mono text-[10px] text-[#aeb0ba]">
                    {rec.serviceDate}
                  </td>

                  {/* Odometer */}
                  <td className="py-3 px-3 font-mono text-[10px] text-[#8be0b3]">
                    {rec.odometerReading ? rec.odometerReading.toLocaleString() : '—'} km
                  </td>

                  {/* Facility & Tech */}
                  <td className="py-3 px-3 text-[10px] text-[#aeb0ba]">
                    <span className="block text-[#d1d1da]">{rec.serviceProvider}</span>
                    <span className="text-[9px] text-[#747783]">Tech: {rec.technician || 'Certified'}</span>
                  </td>

                  {/* Cost */}
                  <td className="py-3 px-3 font-mono text-xs font-bold text-[#f0f0f4]">
                    ${Number(rec.serviceCost).toFixed(2)}
                  </td>

                  {/* Invoice Download */}
                  <td className="py-3 px-3 text-right">
                    <Button
                      variant="quiet"
                      size="sm"
                      onClick={() => handleDownloadInvoice(rec)}
                      icon={Download}
                    >
                      <span className="max-md:hidden">Invoice</span>
                    </Button>
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

