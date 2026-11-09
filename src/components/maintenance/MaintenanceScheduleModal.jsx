import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Wrench, Calendar, Gauge, Building, AlertTriangle } from 'lucide-react';
import { MAINTENANCE_CATEGORIES, SERVICE_CENTERS } from '../../data/maintenanceMockData';
import { calculateNextOdometer, calculateNextDate } from '../../services/maintenanceService';

export default function MaintenanceScheduleModal({
  isOpen,
  onClose,
  onSaveSchedule,
  scheduleToEdit = null,
  vehicles = []
}) {
  const isEditing = Boolean(scheduleToEdit);

  const [formData, setFormData] = useState({
    vehicleId: vehicles[0]?.plate || 'RST-291',
    maintenanceType: MAINTENANCE_CATEGORIES[0],
    intervalKm: 10000,
    intervalDays: 180,
    lastServiceDate: new Date().toISOString().split('T')[0],
    lastServiceOdometer: 10000,
    reminderKm: 1000,
    reminderDays: 14,
    serviceCenter: SERVICE_CENTERS[0],
    priority: 'Medium'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (scheduleToEdit) {
      setFormData({
        vehicleId: scheduleToEdit.vehicleId,
        maintenanceType: scheduleToEdit.maintenanceType,
        intervalKm: scheduleToEdit.intervalKm,
        intervalDays: scheduleToEdit.intervalDays,
        lastServiceDate: scheduleToEdit.lastServiceDate,
        lastServiceOdometer: scheduleToEdit.lastServiceOdometer,
        reminderKm: scheduleToEdit.reminderKm || 1000,
        reminderDays: scheduleToEdit.reminderDays || 14,
        serviceCenter: scheduleToEdit.serviceCenter || SERVICE_CENTERS[0],
        priority: scheduleToEdit.priority || 'Medium'
      });
    } else {
      const selectedVehicle = vehicles[0];
      setFormData({
        vehicleId: selectedVehicle?.plate || 'RST-291',
        maintenanceType: MAINTENANCE_CATEGORIES[0],
        intervalKm: 10000,
        intervalDays: 180,
        lastServiceDate: new Date().toISOString().split('T')[0],
        lastServiceOdometer: selectedVehicle?.odometer || 12000,
        reminderKm: 1000,
        reminderDays: 14,
        serviceCenter: SERVICE_CENTERS[0],
        priority: 'Medium'
      });
    }
    setErrors({});
  }, [scheduleToEdit, isOpen, vehicles]);

  // When vehicle changes in Add mode, default last odometer to vehicle current odometer
  const handleVehicleChange = (plate) => {
    const veh = vehicles.find((v) => v.plate === plate);
    setFormData((prev) => ({
      ...prev,
      vehicleId: plate,
      lastServiceOdometer: veh ? veh.odometer : prev.lastServiceOdometer
    }));
  };

  // Live calculated milestones
  const computedNextOdo = calculateNextOdometer(formData.lastServiceOdometer, formData.intervalKm);
  const computedNextDate = calculateNextDate(formData.lastServiceDate, formData.intervalDays);

  const validate = () => {
    const errs = {};
    if (!formData.vehicleId) errs.vehicleId = 'Vehicle is required';
    if (!formData.maintenanceType) errs.maintenanceType = 'Maintenance category is required';
    if (Number(formData.intervalKm) <= 0) errs.intervalKm = 'Interval km must be greater than 0';
    if (Number(formData.intervalDays) <= 0) errs.intervalDays = 'Interval days must be greater than 0';
    if (Number(formData.lastServiceOdometer) < 0) errs.lastServiceOdometer = 'Odometer cannot be negative';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      intervalKm: Number(formData.intervalKm),
      intervalDays: Number(formData.intervalDays),
      lastServiceOdometer: Number(formData.lastServiceOdometer),
      id: isEditing ? scheduleToEdit.id : `SCH-${Math.floor(100 + Math.random() * 899)}`,
      nextServiceOdometer: computedNextOdo,
      nextServiceDate: computedNextDate,
      status: isEditing ? scheduleToEdit.status : 'Active',
      createdAt: isEditing ? scheduleToEdit.createdAt : new Date().toISOString()
    };

    onSaveSchedule(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Maintenance Schedule' : 'Create Automated Service Schedule'}
      subtitle="Proactive Interval & Odometer Triggers"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-sans">
        {/* Vehicle Selection & Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Target Vehicle
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
              Maintenance Category
            </label>
            <select
              value={formData.maintenanceType}
              onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs cursor-pointer"
            >
              {MAINTENANCE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Intervals: Kilometres and Days */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Service Interval (Kilometres)
            </label>
            <div className="relative">
              <input
                type="number"
                min={500}
                step={500}
                required
                value={formData.intervalKm}
                onChange={(e) => setFormData({ ...formData, intervalKm: e.target.value })}
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
              />
              <span className="absolute right-2.5 top-2 text-[10px] text-[#717480] font-mono">km</span>
            </div>
            {errors.intervalKm && <p className="text-red-400 text-[10px] mt-0.5">{errors.intervalKm}</p>}
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Service Interval (Days)
            </label>
            <div className="relative">
              <input
                type="number"
                min={30}
                step={30}
                required
                value={formData.intervalDays}
                onChange={(e) => setFormData({ ...formData, intervalDays: e.target.value })}
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
              />
              <span className="absolute right-2.5 top-2 text-[10px] text-[#717480] font-mono">days</span>
            </div>
            {errors.intervalDays && <p className="text-red-400 text-[10px] mt-0.5">{errors.intervalDays}</p>}
          </div>
        </div>

        {/* Last Service Baseline */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Last Service Odometer
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                required
                value={formData.lastServiceOdometer}
                onChange={(e) => setFormData({ ...formData, lastServiceOdometer: e.target.value })}
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
              />
              <span className="absolute right-2.5 top-2 text-[10px] text-[#717480] font-mono">km</span>
            </div>
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Last Service Date
            </label>
            <input
              type="date"
              required
              value={formData.lastServiceDate}
              onChange={(e) => setFormData({ ...formData, lastServiceDate: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs cursor-pointer"
            />
          </div>
        </div>

        {/* Calculated Next Trigger Milestone Card */}
        <div className="p-3 bg-[#121319] border border-[#272935] rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[9px] text-[#b49aff] uppercase font-bold flex items-center gap-1">
              <Gauge className="w-3 h-3" /> Auto-Calculated Triggers
            </span>
            <span className="font-mono text-[9px] text-[#747783]">System Milestone</span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[11px] font-mono">
            <span>Next Odometer: <b className="text-[#8be0b3]">{computedNextOdo.toLocaleString()} km</b></span>
            <span>Next Date: <b className="text-[#c4b3ff]">{computedNextDate}</b></span>
          </div>
        </div>

        {/* Reminders & Service Center */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Assigned Service Centre
            </label>
            <select
              value={formData.serviceCenter}
              onChange={(e) => setFormData({ ...formData, serviceCenter: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs cursor-pointer"
            >
              {SERVICE_CENTERS.map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Maintenance Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs cursor-pointer"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Critical">Critical Priority</option>
            </select>
          </div>
        </div>

        {/* Reminder Thresholds */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Mileage Reminder Buffer
            </label>
            <input
              type="number"
              min={100}
              step={100}
              value={formData.reminderKm}
              onChange={(e) => setFormData({ ...formData, reminderKm: Number(e.target.value) })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
              placeholder="e.g. 1000 km before"
            />
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Date Reminder Buffer
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={formData.reminderDays}
              onChange={(e) => setFormData({ ...formData, reminderDays: Number(e.target.value) })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
              placeholder="e.g. 14 days before"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[#252730] flex justify-end gap-2">
          <Button variant="quiet" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            {isEditing ? 'Update schedule' : 'Save schedule'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

