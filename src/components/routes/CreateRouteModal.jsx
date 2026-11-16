import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Route as RouteIcon, MapPin, Truck, User, Plus } from 'lucide-react';
import { initialVehicles, initialDrivers } from '../../data/mockData';

export default function CreateRouteModal({ isOpen, onClose, onCreateRoute }) {
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    destination: '',
    stops: 4,
    distance: 25.5,
    eta: '40 mins',
    assignedVehicle: initialVehicles[0]?.plate || 'RST-291',
    assignedDriver: initialDrivers[0]?.name || 'Aarav Sharma',
    status: 'Scheduled'
  });

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.origin.trim() || !formData.destination.trim()) {
      setError('Route name, origin, and destination are required.');
      return;
    }

    const newRoute = {
      id: `RT-${Math.floor(400 + Math.random() * 99)}`,
      name: formData.name.trim(),
      origin: formData.origin.trim(),
      destination: formData.destination.trim(),
      stops: Number(formData.stops) || 3,
      distance: `${formData.distance} km`,
      eta: formData.eta || '45 mins',
      assignedVehicle: formData.assignedVehicle,
      assignedDriver: formData.assignedDriver,
      status: formData.status
    };

    onCreateRoute(newRoute);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Delivery Corridor"
      subtitle="Dispatch & Waypoint Sequencing"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        {error && (
          <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#FAD2D2] text-[#E05252] font-mono text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
            Route Name / Corridor Description
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Midtown Express Corridor"
            className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none font-mono text-xs shadow-2xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
              Origin Depot
            </label>
            <input
              type="text"
              required
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              placeholder="e.g. Queens Cargo Terminal"
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none font-mono text-xs shadow-2xs"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
              Destination Hub
            </label>
            <input
              type="text"
              required
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              placeholder="e.g. Financial District Bay"
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none font-mono text-xs shadow-2xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
              Waypoints (Stops)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={formData.stops}
              onChange={(e) => setFormData({ ...formData, stops: e.target.value })}
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none font-mono text-xs shadow-2xs"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
              Distance (km)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none font-mono text-xs shadow-2xs"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
              Est. Duration
            </label>
            <input
              type="text"
              value={formData.eta}
              onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
              placeholder="e.g. 50 mins"
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none font-mono text-xs shadow-2xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
              Assigned Vehicle
            </label>
            <select
              value={formData.assignedVehicle}
              onChange={(e) => setFormData({ ...formData, assignedVehicle: e.target.value })}
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none font-mono text-xs cursor-pointer shadow-2xs"
            >
              {initialVehicles.map((v) => (
                <option key={v.id} value={v.plate}>
                  {v.plate} ({v.model})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase tracking-wider block mb-1">
              Assigned Driver
            </label>
            <select
              value={formData.assignedDriver}
              onChange={(e) => setFormData({ ...formData, assignedDriver: e.target.value })}
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] rounded-xl px-3 py-2 text-[#172033] outline-none font-mono text-xs cursor-pointer shadow-2xs"
            >
              {initialDrivers.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2.5">
          <Button variant="default" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" icon={Plus}>
            Create Corridor
          </Button>
        </div>
      </form>
    </Modal>
  );
}
