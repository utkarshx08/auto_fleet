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
    technician: 'Marcus Vance',
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
        technician: 'Marcus Vance',
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
      createdAt: new Date().toISOString()
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
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-sans">
        {/* Notice Card */}
        <div className="p-3 bg-[#1c302a] border border-[#2c493d] rounded-lg flex items-center gap-2.5 text-[#83d7a9]">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-[11px] leading-tight">
            <b>Closing Service Order & Updating Odometer Baseline</b>
            <p className="mt-0.5 text-[#83d7a9]/80 mb-0 text-[10px]">
              This will record maintenance expenses, attach invoice documentation, and roll over the schedule for the next interval.
            </p>
          </div>
        </div>

        {/* Date & Odometer */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Service Completion Date
            </label>
            <input
              type="date"
              required
              value={formData.serviceDate}
              onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs cursor-pointer"
            />
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Current Odometer at Service
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                required
                value={formData.odometerReading}
                onChange={(e) => setFormData({ ...formData, odometerReading: e.target.value })}
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
              />
              <span className="absolute right-2.5 top-2 text-[10px] text-[#717480] font-mono">km</span>
            </div>
          </div>
        </div>

        {/* Service Cost & Provider */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
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
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] pl-6 pr-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
              />
              <span className="absolute left-2.5 top-2 text-[10px] text-[#717480] font-mono">$</span>
            </div>
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Service Facility / Bay
            </label>
            <select
              value={formData.serviceProvider}
              onChange={(e) => setFormData({ ...formData, serviceProvider: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs cursor-pointer"
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
          <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
            Certified Technician
          </label>
          <input
            type="text"
            required
            value={formData.technician}
            onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
            className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-sans text-xs"
            placeholder="e.g. Marcus Vance"
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
            Service Notes & Replaced Parts
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-sans text-xs resize-none"
          />
        </div>

        {/* Invoice Upload */}
        <div>
          <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
            Upload Service Invoice / Receipt
          </label>
          <div className="border border-dashed border-[#353846] hover:border-[#b49aff] rounded-lg p-3 text-center transition-colors cursor-pointer relative bg-[#121319]">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center gap-1 text-[11px] text-[#858894]">
              <Upload className="w-4 h-4 text-[#b49aff]" />
              <span>
                {uploadedFile ? (
                  <b className="text-[#8be0b3] font-mono">{uploadedFile} (Attached)</b>
                ) : (
                  <>
                    <span className="text-[#eee] underline">Click to upload</span> or drag invoice PDF
                  </>
                )}
              </span>
              <span className="text-[9px] text-[#636674]">PDF, JPEG or PNG up to 10MB</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 border-t border-[#252730] flex justify-end gap-2">
          <Button variant="quiet" size="sm" type="button" onClick={onClose}>
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

