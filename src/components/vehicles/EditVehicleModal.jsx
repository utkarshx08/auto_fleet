import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Save } from 'lucide-react';

export default function EditVehicleModal({
  isOpen,
  onClose,
  vehicle,
  onUpdateVehicle
}) {
  const [formData, setFormData] = useState({
    driver: '',
    driverPhone: '',
    location: '',
    status: 'active',
    fuel: 100,
    odometer: 0,
    nextService: ''
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        driver: vehicle.driver || '',
        driverPhone: vehicle.driverPhone || '',
        location: vehicle.location || '',
        status: vehicle.status || 'active',
        fuel: vehicle.fuel !== undefined ? vehicle.fuel : 100,
        odometer: vehicle.odometer || 0,
        nextService: vehicle.nextService || ''
      });
    }
  }, [vehicle]);

  if (!vehicle) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...vehicle,
      ...formData,
      fuel: Number(formData.fuel),
      odometer: Number(formData.odometer)
    };
    onUpdateVehicle(updated);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Vehicle — ${vehicle.plate}`}
      subtitle="Update Operational Telemetry"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-sans">
        <div>
          <label className="font-mono text-[10px] text-[#8A97AB] uppercase block mb-1 font-semibold">
            Assigned Operator
          </label>
          <input
            type="text"
            required
            value={formData.driver}
            onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
            className="w-full bg-[#F8FAFD] border border-[#E2E8F0] focus:border-[#2879E8] focus:bg-white rounded-xl px-3 py-2 text-[#172033] outline-none text-xs transition-all shadow-2xs"
          />
        </div>

        <div>
          <label className="font-mono text-[10px] text-[#8A97AB] uppercase block mb-1 font-semibold">
            Current Hub / Location
          </label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full bg-[#F8FAFD] border border-[#E2E8F0] focus:border-[#2879E8] focus:bg-white rounded-xl px-3 py-2 text-[#172033] outline-none text-xs transition-all shadow-2xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[10px] text-[#8A97AB] uppercase block mb-1 font-semibold">
              Operational Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-[#F8FAFD] border border-[#E2E8F0] focus:border-[#2879E8] focus:bg-white rounded-xl px-3 py-2 text-[#172033] outline-none text-xs transition-all shadow-2xs"
            >
              <option value="active">Active</option>
              <option value="service">In service</option>
              <option value="idle">Idle</option>
            </select>
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#8A97AB] uppercase block mb-1 font-semibold">
              Fuel Level (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.fuel}
              onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
              className="w-full bg-[#F8FAFD] border border-[#E2E8F0] focus:border-[#2879E8] focus:bg-white rounded-xl px-3 py-2 text-[#172033] outline-none font-mono text-xs transition-all shadow-2xs"
            />
          </div>
        </div>

        <div>
          <label className="font-mono text-[10px] text-[#8A97AB] uppercase block mb-1 font-semibold">
            Odometer (km)
          </label>
          <input
            type="number"
            min="0"
            value={formData.odometer}
            onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
            className="w-full bg-[#F8FAFD] border border-[#E2E8F0] focus:border-[#2879E8] focus:bg-white rounded-xl px-3 py-2 text-[#172033] outline-none font-mono text-xs transition-all shadow-2xs"
          />
        </div>

        <div>
          <label className="font-mono text-[10px] text-[#8A97AB] uppercase block mb-1 font-semibold">
            Next Service Notice
          </label>
          <input
            type="text"
            value={formData.nextService}
            onChange={(e) => setFormData({ ...formData, nextService: e.target.value })}
            className="w-full bg-[#F8FAFD] border border-[#E2E8F0] focus:border-[#2879E8] focus:bg-white rounded-xl px-3 py-2 text-[#172033] outline-none text-xs transition-all shadow-2xs"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E2E8F0] mt-4">
          <Button variant="default" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" icon={Save}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
