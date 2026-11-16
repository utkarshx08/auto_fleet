import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Plus, User, AlertCircle, Phone, Mail, FileText, Calendar, Truck, Shield } from 'lucide-react';

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
      .trim()
      .split(/\s+/)
      .filter(Boolean)
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
      subtitle="Driver Registry & Safety Certification"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans text-[#172033]">
        <div>
          <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
            Driver Full Name *
          </label>
          <div className="flex items-center gap-2 bg-[#F8FAFD] border border-[#D5E2F1] focus-within:border-[#2879E8] focus-within:ring-2 focus-within:ring-[#2879E8]/15 rounded-xl px-3 py-2 transition-all">
            <User className="w-4 h-4 text-[#8A97AB] shrink-0" />
            <input
              type="text"
              placeholder="e.g. Samuel Bennett"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-transparent border-0 outline-none text-[#172033] font-medium placeholder-[#94A3B8]"
            />
          </div>
          {errors.name && <span className="text-[#E05252] text-[10px] mt-1 block font-medium">{errors.name}</span>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
              Contact Phone *
            </label>
            <div className="flex items-center gap-2 bg-[#F8FAFD] border border-[#D5E2F1] focus-within:border-[#2879E8] focus-within:ring-2 focus-within:ring-[#2879E8]/15 rounded-xl px-3 py-2 transition-all">
              <Phone className="w-4 h-4 text-[#8A97AB] shrink-0" />
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-transparent border-0 outline-none text-[#172033] font-mono font-medium placeholder-[#94A3B8]"
              />
            </div>
            {errors.phone && <span className="text-[#E05252] text-[10px] mt-1 block font-medium">{errors.phone}</span>}
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
              Email Address
            </label>
            <div className="flex items-center gap-2 bg-[#F8FAFD] border border-[#D5E2F1] focus-within:border-[#2879E8] focus-within:ring-2 focus-within:ring-[#2879E8]/15 rounded-xl px-3 py-2 transition-all">
              <Mail className="w-4 h-4 text-[#8A97AB] shrink-0" />
              <input
                type="email"
                placeholder="operator@autrail.io"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent border-0 outline-none text-[#172033] font-medium placeholder-[#94A3B8]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
              License Number *
            </label>
            <div className="flex items-center gap-2 bg-[#F8FAFD] border border-[#D5E2F1] focus-within:border-[#2879E8] focus-within:ring-2 focus-within:ring-[#2879E8]/15 rounded-xl px-3 py-2 transition-all">
              <Shield className="w-4 h-4 text-[#8A97AB] shrink-0" />
              <input
                type="text"
                placeholder="DL-88201-NY"
                value={formData.license}
                onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                className="w-full bg-transparent border-0 outline-none text-[#172033] font-mono font-medium placeholder-[#94A3B8]"
              />
            </div>
            {errors.license && <span className="text-[#E05252] text-[10px] mt-1 block font-medium">{errors.license}</span>}
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
              License Expiration
            </label>
            <div className="flex items-center gap-2 bg-[#F8FAFD] border border-[#D5E2F1] focus-within:border-[#2879E8] focus-within:ring-2 focus-within:ring-[#2879E8]/15 rounded-xl px-3 py-2 transition-all">
              <Calendar className="w-4 h-4 text-[#8A97AB] shrink-0" />
              <input
                type="date"
                value={formData.licenseExpiry}
                onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                className="w-full bg-transparent border-0 outline-none text-[#172033] font-mono font-medium"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
              Assign Vehicle
            </label>
            <div className="flex items-center gap-2 bg-[#F8FAFD] border border-[#D5E2F1] focus-within:border-[#2879E8] rounded-xl px-3 py-2">
              <Truck className="w-4 h-4 text-[#8A97AB] shrink-0" />
              <select
                value={formData.vehicleAssigned}
                onChange={(e) => setFormData({ ...formData, vehicleAssigned: e.target.value })}
                className="w-full bg-transparent border-0 outline-none text-[#172033] font-mono font-medium cursor-pointer"
              >
                {availableVehicles.map((v) => (
                  <option key={v.id} value={v.plate}>
                    {v.plate} ({v.model})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
              Duty Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] focus:ring-2 focus:ring-[#2879E8]/15 rounded-xl px-3 py-2 text-[#172033] outline-none font-medium cursor-pointer"
            >
              <option value="On Duty">On Duty</option>
              <option value="Available">Available</option>
              <option value="In Service">In Service</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0] mt-4">
          <Button variant="default" size="sm" onClick={onClose} className="rounded-xl px-4 py-2">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" icon={Plus} className="rounded-xl px-5 py-2 font-bold shadow-md shadow-[#2879E8]/25 active:scale-[0.98]">
            Confirm Driver
          </Button>
        </div>
      </form>
    </Modal>
  );
}
