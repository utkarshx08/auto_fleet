import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { CheckCircle2, Upload, DollarSign, Gauge, Building, User, FileText } from 'lucide-react';
import { SERVICE_CENTERS } from '../../data/maintenanceMockData';

export default function CompleteServiceModal({
  isOpen,
  onClose,
  schedule,
  vehicle,
  onCompleteService
}) {
  if (!schedule) return null;

  const [formData, setFormData] = useState({
    serviceDate: new Date().toISOString().split('T')[0],
    odometerReading: vehicle ? vehicle.odometer : schedule.nextServiceOdometer || 15000,
    serviceCost: 240.00,
    serviceProvider: schedule.serviceCenter || SERVICE_CENTERS[0],
    technician: 'Vikram Singh',
    description: `Completed scheduled ${schedule.maintenanceType}. Inspected all related components and verified operations.`,
    invoiceFileName: `INV-${schedule.vehicleId}-${new Date().toISOString().slice(0, 10)}.pdf`
  });

  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (schedule && isOpen) {
      setFormData({
        serviceDate: new Date().toISOString().split('T')[0],
        odometerReading: vehicle ? vehicle.odometer : schedule.nextServiceOdometer || 15000,
        serviceCost: 240.00,
        serviceProvider: schedule.serviceCenter || SERVICE_CENTERS[0],
        technician: 'Vikram Singh',
        description: `Completed scheduled ${schedule.maintenanceType}. Inspected all related components and verified operations.`,
        invoiceFileName: `INV-${schedule.vehicleId}-${new Date().toISOString().slice(0, 10)}.pdf`
      });
      setUploadedFile(null);
    }
  }, [schedule, vehicle, isOpen]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      setFormData((prev) => ({ ...prev, invoiceFileName: file.name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const completedRecord = {
      id: `REC-${Date.now().toString().slice(-4)}`,
      vehicleId: schedule.vehicleId,
      scheduleId: schedule.id,
      serviceType: schedule.maintenanceType,
      serviceDate: formData.serviceDate,
      odometerReading: Number(formData.odometerReading),
      serviceCost: Number(formData.serviceCost),
      serviceProvider: formData.serviceProvider,
      technician: formData.technician,
      description: formData.description,
      invoiceUrl: formData.invoiceFileName,
      status: 'Completed',
      createdAt: new Date().toISOString(),
      schedule: schedule
    };

    onCompleteService(completedRecord, schedule);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Maintenance Order"
      subtitle={`${schedule.vehicleId} — ${schedule.maintenanceType}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        {/* Notice Card */}
        <div className="p-3 bg-[#E8F7F0] border border-[#C2E8D7] rounded-xl flex items-center gap-2.5 text-[#16A36A]">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-[#16A36A]" />
          <div className="text-[11px] leading-tight">
            <b className="font-semibold text-[#16A36A]">Closing Service Order & Updating Odometer Baseline</b>
            <p className="mt-0.5 text-[#16A36A]/90 mb-0 text-[10px]">
              This will record maintenance expenses, attach invoice documentation, and roll over the schedule for the next interval.
            </p>
          </div>
        </div>

        {/* Date & Odometer */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
              Service Completion Date
            </label>
            <input
              type="date"
              required
              value={formData.serviceDate}
              onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none font-mono text-xs cursor-pointer shadow-2xs"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
              Current Odometer at Service
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                required
                value={formData.odometerReading}
                onChange={(e) => setFormData({ ...formData, odometerReading: e.target.value })}
                className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none font-mono text-xs shadow-2xs"
              />
              <span className="absolute right-3 top-2.5 text-[10px] text-[#8A97AB] font-mono">km</span>
            </div>
          </div>
        </div>

        {/* Service Cost & Provider */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
              Final Work Order Cost
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min={0}
                required
                value={formData.serviceCost}
                onChange={(e) => setFormData({ ...formData, serviceCost: e.target.value })}
                className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl pl-6 pr-3 py-2 text-[#172033] outline-none font-mono text-xs shadow-2xs"
              />
              <span className="absolute left-2.5 top-2.5 text-[11px] text-[#8A97AB] font-mono">$</span>
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
              Service Facility / Bay
            </label>
            <select
              value={formData.serviceProvider}
              onChange={(e) => setFormData({ ...formData, serviceProvider: e.target.value })}
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none text-xs cursor-pointer shadow-2xs"
            >
              {SERVICE_CENTERS.map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Technician */}
        <div>
          <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
            Certified Technician
          </label>
          <input
            type="text"
            required
            value={formData.technician}
            onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
            className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none font-sans text-xs shadow-2xs"
            placeholder="e.g. Vikram Singh"
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
            Service Notes & Replaced Parts
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none font-sans text-xs resize-none shadow-2xs"
          />
        </div>

        {/* Invoice Upload */}
        <div>
          <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
            Upload Service Invoice / Receipt
          </label>
          <div className="border border-dashed border-[#D5E2F1] hover:border-[#2879E8] rounded-xl p-3.5 text-center transition-colors cursor-pointer relative bg-gradient-to-br from-[#F8FAFD] to-[#FFFFFF] shadow-2xs group">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center gap-1.5 text-[11px] text-[#68758A]">
              <Upload className="w-5 h-5 text-[#2879E8] group-hover:scale-110 transition-transform" />
              <span>
                {uploadedFile ? (
                  <b className="text-[#16A36A] font-mono">{uploadedFile} (Attached)</b>
                ) : (
                  <>
                    <span className="text-[#2879E8] font-semibold underline">Click to upload</span> or drag invoice PDF
                  </>
                )}
              </span>
              <span className="text-[10px] text-[#8A97AB]">PDF, JPEG or PNG up to 10MB</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2.5">
          <Button variant="default" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" icon={CheckCircle2}>
            Confirm Completion
          </Button>
        </div>
      </form>
    </Modal>
  );
}

