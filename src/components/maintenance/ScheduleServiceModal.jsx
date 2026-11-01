import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Plus, Wrench } from 'lucide-react';

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
    technician: 'Marcus Vance'
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
      <form onSubmit={handleSubmit} className="space-y-3 text-xs font-sans">
        <div>
          <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
            Target Vehicle
          </label>
          <select
            value={formData.vehicle}
            onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
            className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.plate}>
                {v.plate} — {v.model} ({v.driver})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
            Service Description
          </label>
          <input
            type="text"
            required
            value={formData.serviceType}
            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
            className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Scheduled Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
              Estimated Cost
            </label>
            <input
              type="text"
              required
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none font-mono text-xs"
            />
          </div>
        </div>

        <div>
          <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
            Service Provider / Bay
          </label>
          <input
            type="text"
            required
            value={formData.provider}
            onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
            className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-2.5 py-1.5 text-[#eee] outline-none text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#252730] mt-3">
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

