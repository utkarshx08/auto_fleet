import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Plus, AlertCircle } from 'lucide-react';

export default function AddVehicleModal({ isOpen, onClose, onAddVehicle }) {
  const [formData, setFormData] = useState({
    plate: '',
    make: 'Mercedes-Benz',
    model: '',
    type: 'Van',
    year: 2024,
    driver: '',
    driverPhone: '',
    location: 'New York, NY',
    fuel: 100,
    odometer: 0,
    status: 'active',
    nextService: 'In 10,000 km · Scheduled',
    colorThumb: 'purple'
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.plate.trim()) {
      errs.plate = 'License plate identifier is required (e.g. RST-301)';
    } else if (formData.plate.trim().length < 4) {
      errs.plate = 'License plate must have at least 4 characters';
    }

    if (!formData.model.trim()) {
      errs.model = 'Vehicle model is required (e.g. Sprinter 3500)';
    }

    if (!formData.driver.trim()) {
      errs.driver = 'Assigned operator name is required';
    }

    if (formData.fuel < 0 || formData.fuel > 100) {
      errs.fuel = 'Fuel level must be between 0% and 100%';
    }

    if (formData.odometer < 0) {
      errs.odometer = 'Odometer reading cannot be negative';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newVehicle = {
      ...formData,
      id: formData.plate.toUpperCase().trim(),
      plate: formData.plate.toUpperCase().trim(),
      fuel: Number(formData.fuel),
      odometer: Number(formData.odometer),
      coordinates: { lat: 40.7128, lng: -74.006 },
      health: 'Optimal Condition'
    };

    onAddVehicle(newVehicle);
    onClose();
    // Reset form
    setFormData({
      plate: '',
      make: 'Mercedes-Benz',
      model: '',
      type: 'Van',
      year: 2024,
      driver: '',
      driverPhone: '',
      location: 'New York, NY',
      fuel: 100,
      odometer: 0,
      status: 'active',
      nextService: 'In 10,000 km · Scheduled',
      colorThumb: 'purple'
    });
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Fleet Vehicle"
      subtitle="Fleet Directory Intake"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-sans">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Plate Identifier *
            </label>
            <input
              type="text"
              placeholder="e.g. RST-301"
              value={formData.plate}
              onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
              className={`w-full bg-[#20222a] border ${
                errors.plate ? 'border-red-500/80' : 'border-[#30333d]'
              } focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs uppercase`}
            />
            {errors.plate && (
              <span className="text-red-400 text-[9px] mt-0.5 block flex items-center gap-1">
                <AlertCircle className="w-2.5 h-2.5" /> {errors.plate}
              </span>
            )}
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Vehicle Make
            </label>
            <select
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs"
            >
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Ford">Ford</option>
              <option value="Renault">Renault</option>
              <option value="Volkswagen">Volkswagen</option>
              <option value="Ram">Ram</option>
              <option value="Iveco">Iveco</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Model Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Sprinter 3500 Cargo"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className={`w-full bg-[#20222a] border ${
                errors.model ? 'border-red-500/80' : 'border-[#30333d]'
              } focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs`}
            />
            {errors.model && (
              <span className="text-red-400 text-[9px] mt-0.5 block flex items-center gap-1">
                <AlertCircle className="w-2.5 h-2.5" /> {errors.model}
              </span>
            )}
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Initial Operational Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs"
            >
              <option value="active">Active (On Road)</option>
              <option value="service">In Service / Maintenance</option>
              <option value="idle">Idle / Standby Depot</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Assigned Driver *
            </label>
            <input
              type="text"
              placeholder="e.g. Marcus Vance"
              value={formData.driver}
              onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
              className={`w-full bg-[#20222a] border ${
                errors.driver ? 'border-red-500/80' : 'border-[#30333d]'
              } focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs`}
            />
            {errors.driver && (
              <span className="text-red-400 text-[9px] mt-0.5 block flex items-center gap-1">
                <AlertCircle className="w-2.5 h-2.5" /> {errors.driver}
              </span>
            )}
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Assigned Hub / City
            </label>
            <input
              type="text"
              placeholder="e.g. New York, NY"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Current Fuel Level (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.fuel}
              onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Odometer Reading (km)
            </label>
            <input
              type="number"
              min="0"
              value={formData.odometer}
              onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#252730] mt-4">
          <Button variant="default" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" icon={Plus}>
            Register Vehicle
          </Button>
        </div>
      </form>
    </Modal>
  );
}

