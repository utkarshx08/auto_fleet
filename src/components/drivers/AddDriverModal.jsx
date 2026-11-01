import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Plus, User, AlertCircle } from 'lucide-react';

export default function AddDriverModal({ isOpen, onClose, onAddDriver, availableVehicles = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    license: '',
    licenseExpiry: '2026-12-31',
    status: 'On Duty',
    vehicleAssigned: availableVehicles[0]?.plate || 'RST-291',
    rating: 5.0,
    tripsCompleted: 0
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full driver name is required';
    if (!formData.license.trim()) errs.license = 'Commercial driver license number is required';
    if (!formData.phone.trim()) errs.phone = 'Mobile contact is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const initials = formData.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newDriver = {
      ...formData,
      id: `drv-${Date.now()}`,
      avatar: initials || 'DR',
      rating: 5.0,
      tripsCompleted: 0
    };

    onAddDriver(newDriver);
    onClose();
    setFormData({
      name: '',
      email: '',
      phone: '',
      license: '',
      licenseExpiry: '2026-12-31',
      status: 'On Duty',
      vehicleAssigned: availableVehicles[0]?.plate || 'RST-291',
      rating: 5.0,
      tripsCompleted: 0
    });
    setErrors({});
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Onboard Fleet Operator"
      subtitle="Driver Registry & Certification"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-xs font-sans">
        <div>
          <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
            Driver Full Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Samuel Bennett"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full bg-[#20222a] border ${
              errors.name ? 'border-red-500' : 'border-[#30333d]'
            } focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs`}
          />
          {errors.name && <span className="text-red-400 text-[9px] mt-0.5 block">{errors.name}</span>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Contact Phone *
            </label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full bg-[#20222a] border ${
                errors.phone ? 'border-red-500' : 'border-[#30333d]'
              } focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs`}
            />
            {errors.phone && <span className="text-red-400 text-[9px] mt-0.5 block">{errors.phone}</span>}
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="operator@autrail.io"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              License Number *
            </label>
            <input
              type="text"
              placeholder="DL-88201-NY"
              value={formData.license}
              onChange={(e) => setFormData({ ...formData, license: e.target.value })}
              className={`w-full bg-[#20222a] border ${
                errors.license ? 'border-red-500' : 'border-[#30333d]'
              } focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs`}
            />
            {errors.license && <span className="text-red-400 text-[9px] mt-0.5 block">{errors.license}</span>}
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              License Expiration
            </label>
            <input
              type="date"
              value={formData.licenseExpiry}
              onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Assign Vehicle
            </label>
            <select
              value={formData.vehicleAssigned}
              onChange={(e) => setFormData({ ...formData, vehicleAssigned: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
            >
              {availableVehicles.map((v) => (
                <option key={v.id} value={v.plate}>
                  {v.plate} ({v.model})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Duty Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs"
            >
              <option value="On Duty">On Duty</option>
              <option value="Available">Available</option>
              <option value="In Service">In Service</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#252730] mt-3">
          <Button variant="default" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" icon={Plus}>
            Confirm Driver
          </Button>
        </div>
      </form>
    </Modal>
  );
}

