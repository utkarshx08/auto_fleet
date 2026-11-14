import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import {
  Fuel,
  Upload,
  DollarSign,
  Gauge,
  Calendar,
  Building,
  CreditCard,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import {
  FUEL_TYPES,
  FUEL_STATIONS,
  PAYMENT_METHODS
} from '../../data/fuelMockData';
import {
  calculateTotalAmount,
  detectFuelAnomalies
} from '../../services/fuelService';

export default function FuelPurchaseModal({
  isOpen,
  onClose,
  onSaveRecord,
  recordToEdit = null,
  vehicles = [],
  drivers = [],
  existingRecords = []
}) {
  const isEditing = Boolean(recordToEdit);

  const [formData, setFormData] = useState({
    vehicleId: vehicles[0]?.plate || 'RST-291',
    driverName: vehicles[0]?.driver || drivers[0]?.name || 'Aarav Sharma',
    driverId: drivers[0]?.id || 'drv-1',
    fuelType: 'Diesel',
    quantity: 50.0,
    pricePerLitre: 1.68,
    odometerReading: vehicles[0]?.odometer || 12000,
    fuelStation: FUEL_STATIONS[0],
    paymentMethod: PAYMENT_METHODS[0],
    purchaseDate: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM
    receiptFileName: `REC-FUEL-${Date.now().toString().slice(-4)}.pdf`
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (recordToEdit) {
      setFormData({
        vehicleId: recordToEdit.vehicleId,
        driverName: recordToEdit.driverName,
        driverId: recordToEdit.driverId,
        fuelType: recordToEdit.fuelType || 'Diesel',
        quantity: recordToEdit.quantity,
        pricePerLitre: recordToEdit.pricePerLitre,
        odometerReading: recordToEdit.odometerReading,
        fuelStation: recordToEdit.fuelStation || FUEL_STATIONS[0],
        paymentMethod: recordToEdit.paymentMethod || PAYMENT_METHODS[0],
        purchaseDate: recordToEdit.purchaseDate ? recordToEdit.purchaseDate.slice(0, 16) : new Date().toISOString().slice(0, 16),
        receiptFileName: recordToEdit.receiptUrl || 'receipt.pdf'
      });
      setUploadedFile(recordToEdit.receiptUrl || null);
    } else {
      const selectedVeh = vehicles[0];
      setFormData({
        vehicleId: selectedVeh?.plate || 'RST-291',
        driverName: selectedVeh?.driver || 'Aarav Sharma',
        driverId: 'drv-1',
        fuelType: 'Diesel',
        quantity: 50.0,
        pricePerLitre: 1.68,
        odometerReading: selectedVeh?.odometer || 12000,
        fuelStation: FUEL_STATIONS[0],
        paymentMethod: PAYMENT_METHODS[0],
        purchaseDate: new Date().toISOString().slice(0, 16),
        receiptFileName: `REC-FUEL-${Date.now().toString().slice(-4)}.pdf`
      });
      setUploadedFile(null);
    }
    setErrors({});
  }, [recordToEdit, isOpen, vehicles, drivers]);

  // When vehicle changes, update driver and odometer
  const handleVehicleChange = (plate) => {
    const veh = vehicles.find((v) => v.plate === plate);
    const assignedDriver = drivers.find((d) => d.vehicleAssigned === plate) || {
      name: veh?.driver || 'Operator',
      id: 'drv-custom'
    };

    setFormData((prev) => ({
      ...prev,
      vehicleId: plate,
      driverName: assignedDriver.name,
      driverId: assignedDriver.id,
      odometerReading: veh?.odometer || prev.odometerReading
    }));
  };

  // Live Auto-Calculation: Total Amount = Quantity * Price Per Litre
  const computedTotalAmount = calculateTotalAmount(formData.quantity, formData.pricePerLitre);

  // Live Anomaly Detection preview
  const anomalyCheck = detectFuelAnomalies(
    {
      ...formData,
      id: recordToEdit ? recordToEdit.id : 'temp-new',
      totalAmount: computedTotalAmount
    },
    existingRecords
  );

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      setFormData((prev) => ({ ...prev, receiptFileName: file.name }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.vehicleId) errs.vehicleId = 'Vehicle is required';
    if (!formData.driverName) errs.driverName = 'Driver is required';
    if (Number(formData.quantity) <= 0) errs.quantity = 'Quantity must be > 0';
    if (Number(formData.pricePerLitre) <= 0) errs.pricePerLitre = 'Price must be > 0';
    if (Number(formData.odometerReading) < 0) errs.odometerReading = 'Odometer cannot be negative';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const pDate = formData.purchaseDate ? new Date(formData.purchaseDate) : new Date();
    const safePurchaseDate = !isNaN(pDate.getTime()) ? pDate.toISOString() : new Date().toISOString();

    const payload = {
      id: isEditing ? recordToEdit.id : `FUEL-${Math.floor(1000 + Math.random() * 8999)}`,
      vehicleId: formData.vehicleId,
      driverId: formData.driverId,
      driverName: formData.driverName,
      fuelType: formData.fuelType,
      quantity: Number(formData.quantity),
      pricePerLitre: Number(formData.pricePerLitre),
      totalAmount: computedTotalAmount,
      odometerReading: Number(formData.odometerReading),
      fuelStation: formData.fuelStation,
      paymentMethod: formData.paymentMethod,
      receiptUrl: formData.receiptFileName,
      purchaseDate: safePurchaseDate,
      isAnomaly: anomalyCheck.isAnomaly,
      anomalyReason: anomalyCheck.anomalyReason
    };

    onSaveRecord(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Fuel Purchase Record' : 'Record Fuel Purchase'}
      subtitle="Fleet Card Telemetry & Anomaly Screening"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-sans">
        {/* Live Anomaly Detection Warning Banner */}
        {anomalyCheck.isAnomaly && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2.5 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-tight">
              <b>Flagged by Rule-Based Anomaly Monitor</b>
              <p className="mt-0.5 text-amber-300/80 mb-0 font-mono text-[10px]">
                {anomalyCheck.anomalyReason}
              </p>
            </div>
          </div>
        )}

        {/* Vehicle & Driver */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Vehicle Registration
            </label>
            <select
              value={formData.vehicleId}
              onChange={(e) => handleVehicleChange(e.target.value)}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs cursor-pointer"
            >
              {vehicles.map((v) => (
                <option key={v.id || v.plate} value={v.plate}>
                  {v.plate} ({v.model})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Driver / Operator
            </label>
            <input
              type="text"
              required
              value={formData.driverName}
              onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs font-sans"
            />
          </div>
        </div>

        {/* Fuel Type & Quantity & Price per Litre */}
        <div className="grid grid-cols-3 gap-2.5">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Fuel Type
            </label>
            <select
              value={formData.fuelType}
              onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs cursor-pointer"
            >
              {FUEL_TYPES.map((ft) => (
                <option key={ft} value={ft}>
                  {ft}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Quantity (Litres)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
              />
              <span className="absolute right-2 top-2 text-[10px] text-[#717480] font-mono">L</span>
            </div>
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Price / Litre ($)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={formData.pricePerLitre}
                onChange={(e) => setFormData({ ...formData, pricePerLitre: e.target.value })}
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] pl-5 pr-2 py-1.5 text-[#eee] outline-none font-mono text-xs"
              />
              <span className="absolute left-2 top-2 text-[10px] text-[#717480] font-mono">$</span>
            </div>
          </div>
        </div>

        {/* Auto-Calculated Total Amount Banner */}
        <div className="p-3 bg-[#121319] border border-[#272935] rounded-lg flex items-center justify-between">
          <div>
            <span className="font-mono text-[8px] text-[#858894] uppercase block">
              Calculated Total Purchase Amount
            </span>
            <small className="text-[10px] text-[#747783] font-mono">
              Formula: {formData.quantity}L × ${formData.pricePerLitre}/L
            </small>
          </div>
          <b className="text-lg font-mono text-[#8be0b3] font-bold">
            ${computedTotalAmount.toFixed(2)}
          </b>
        </div>

        {/* Odometer & Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Odometer Reading at Pump
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                required
                value={formData.odometerReading}
                onChange={(e) => setFormData({ ...formData, odometerReading: Number(e.target.value) })}
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
              />
              <span className="absolute right-2.5 top-2 text-[10px] text-[#717480] font-mono">km</span>
            </div>
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Purchase Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs cursor-pointer"
            />
          </div>
        </div>

        {/* Fuel Station & Payment Method */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Fuel Station / Terminal
            </label>
            <select
              value={formData.fuelStation}
              onChange={(e) => setFormData({ ...formData, fuelStation: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs cursor-pointer"
            >
              {FUEL_STATIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Payment Method
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs cursor-pointer"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Receipt / Invoice Upload */}
        <div>
          <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
            Receipt / Invoice Attachment
          </label>
          <div className="border border-dashed border-[#353846] hover:border-[#b49aff] rounded-lg p-2.5 text-center transition-colors cursor-pointer relative bg-[#121319]">
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
                    <span className="text-[#eee] underline">Click to upload</span> or drag receipt image/PDF
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[#252730] flex justify-end gap-2">
          <Button variant="quiet" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            {isEditing ? 'Update transaction' : 'Log purchase'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

