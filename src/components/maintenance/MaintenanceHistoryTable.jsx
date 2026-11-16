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
    <div className="glass-card rounded-2xl p-6 space-y-4 shadow-liquid-subtle">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 max-md:flex-col max-md:items-stretch">
        <div>
          <span className="font-mono text-[10px] text-[#2879E8] font-semibold uppercase tracking-wider block">
            Archived Work Orders & Invoices
          </span>
          <h3 className="text-base font-bold text-[#172033] tracking-tight mt-0.5">
            Completed Maintenance History
          </h3>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
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
            className="bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-1.5 text-xs text-[#172033] outline-none font-mono cursor-pointer shadow-2xs"
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
      <div className="flex items-center justify-between text-[11px] font-mono text-[#68758A] border-b border-[#E2E8F0] pb-3">
        <span>Showing {filteredRecords.length} completed work order records</span>
        <span>
          Total Filtered Spend: <b className="text-[#16A36A] font-bold">${totalCostFiltered.toFixed(2)}</b>
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap font-sans">
          <thead>
            <tr className="border-b border-[#E2E8F0] text-[#68758A] font-mono text-[10px] uppercase tracking-wider">
              <th className="py-3 px-3.5">Order ID</th>
              <th className="py-3 px-3.5">Vehicle</th>
              <th className="py-3 px-3.5">Service Performed</th>
              <th className="py-3 px-3.5">Date</th>
              <th className="py-3 px-3.5">Odometer</th>
              <th className="py-3 px-3.5">Facility & Tech</th>
              <th className="py-3 px-3.5">Cost</th>
              <th className="py-3 px-3.5 text-right">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#8A97AB]">
                  <FileText className="w-8 h-8 mx-auto text-[#CBD5E1] mb-2" />
                  <p className="font-semibold text-sm text-[#172033]">No maintenance records found</p>
                  <p className="text-xs text-[#68758A]">Try adjusting your search query or vehicle filter.</p>
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec) => (
                <tr
                  key={rec.id}
                  className="border-b border-[#F1F5F9] hover:bg-[#F0F5FC]/60 transition-colors last:border-0"
                >
                  {/* Order ID */}
                  <td className="py-3.5 px-3.5 font-mono text-xs text-[#2879E8] font-bold">
                    {rec.id}
                  </td>

                  {/* Vehicle */}
                  <td className="py-3.5 px-3.5 font-mono text-xs font-semibold text-[#172033]">
                    {rec.vehicleId}
                  </td>

                  {/* Service & Notes */}
                  <td className="py-3.5 px-3.5">
                    <b className="text-[#172033] block text-xs">{rec.serviceType}</b>
                    <span className="text-[11px] text-[#68758A] truncate block max-w-xs">
                      {rec.description}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-3.5 font-mono text-[11px] text-[#68758A]">
                    {rec.serviceDate}
                  </td>

                  {/* Odometer */}
                  <td className="py-3.5 px-3.5 font-mono text-[11px] text-[#16A36A] font-medium">
                    {rec.odometerReading ? rec.odometerReading.toLocaleString() : '—'} km
                  </td>

                  {/* Facility & Tech */}
                  <td className="py-3.5 px-3.5 text-[11px] text-[#68758A]">
                    <span className="block font-medium text-[#172033]">{rec.serviceProvider}</span>
                    <span className="text-[10px] text-[#8A97AB]">Tech: {rec.technician || 'Certified'}</span>
                  </td>

                  {/* Cost */}
                  <td className="py-3.5 px-3.5 font-mono text-xs font-bold text-[#172033]">
                    ${Number(rec.serviceCost).toFixed(2)}
                  </td>

                  {/* Invoice Download */}
                  <td className="py-3.5 px-3.5 text-right">
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

