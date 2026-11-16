import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Plus, Wrench, Calendar, DollarSign, Truck, Building } from 'lucide-react';

export default function ScheduleServiceModal({
  isOpen,
  onClose,
  onScheduleService,
  vehicles = []
}) {
  const [formData, setFormData] = useState({
    vehicle: vehicles[0]?.plate || 'RST-291',
    serviceType: 'Synthetic Oil & Filter Replacement',
    date: new Date().toISOString().split('T')[0],
    provider: 'Manhattan Fleet Hub',
    cost: '$180.00',
    technician: 'Vikram Singh'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRecord = {
      id: `srv-${Date.now().toString().slice(-4)}`,
      ...formData,
      status: 'Scheduled'
    };
    onScheduleService(newRecord);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Maintenance Bay Service"
      subtitle="Preventative Fleet Care Order"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div>
          <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
            Target Vehicle
          </label>
          <select
            value={formData.vehicle}
            onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
            className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none font-mono text-xs cursor-pointer shadow-2xs"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.plate}>
                {v.plate} — {v.model} ({v.driver})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
            Service Description
          </label>
          <input
            type="text"
            required
            value={formData.serviceType}
            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
            className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none text-xs shadow-2xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
              Scheduled Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none font-mono text-xs cursor-pointer shadow-2xs"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
              Estimated Cost
            </label>
            <input
              type="text"
              required
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none font-mono text-xs shadow-2xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
              Service Bay / Hub
            </label>
            <input
              type="text"
              required
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none text-xs shadow-2xs"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
              Assigned Specialist
            </label>
            <input
              type="text"
              required
              value={formData.technician}
              onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none text-xs shadow-2xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0] mt-3">
          <Button variant="default" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" icon={Plus}>
            Book Appointment
          </Button>
        </div>
      </form>
    </Modal>
  );
}

