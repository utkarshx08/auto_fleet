import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { DollarSign, Tag, FileText, Calendar } from 'lucide-react';
import { EXPENSE_TYPES, addTripExpense } from '../../services/tripService';

export default function TripExpenseModal({
  isOpen,
  onClose,
  tripId,
  onExpenseAdded
}) {
  const [formData, setFormData] = useState({
    type: 'Fuel',
    amount: '',
    description: '',
    recordedAt: new Date().toISOString().slice(0, 16),
    receiptUrl: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Please enter a valid expense amount greater than $0.00');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please provide a short description or receipt memo.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { updatedTrip, newExpense } = addTripExpense(tripId, {
        type: formData.type,
        amount: amt,
        description: formData.description.trim(),
        recordedAt: new Date(formData.recordedAt).toISOString(),
        receiptUrl: formData.receiptUrl || null
      });

      if (onExpenseAdded) {
        onExpenseAdded(updatedTrip, newExpense);
      }
      onClose();
      // Reset form
      setFormData({
        type: 'Fuel',
        amount: '',
        description: '',
        recordedAt: new Date().toISOString().slice(0, 16),
        receiptUrl: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Trip Operational Expense"
      subtitle="FUEL, TOLL, ALLOWANCE & TRANSIT DISBURSEMENT"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#d4d4dc]">
        {error && (
          <div className="p-3 rounded-[7px] bg-[#2a171a] border border-[#522930] text-[#fca5a5] text-xs">
            {error}
          </div>
        )}

        {/* Expense Category */}
        <div>
          <label className="block text-[11px] font-mono text-[#858894] uppercase tracking-[1px] mb-1.5">
            Expense Category <span className="text-[#f87171]">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-[#121319] border border-[#2b2e38] text-xs text-[#f0f0f4] px-3 py-2 rounded-[7px] focus:outline-none focus:border-[#ad91ff] cursor-pointer"
            >
              {EXPENSE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-[11px] font-mono text-[#858894] uppercase tracking-[1px] mb-1.5">
            Expense Amount ($ USD) <span className="text-[#f87171]">*</span>
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#747683]" />
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              className="w-full bg-[#121319] border border-[#2b2e38] text-sm text-[#f0f0f4] pl-9 pr-3 py-2 rounded-[7px] focus:outline-none focus:border-[#ad91ff] font-mono"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-mono text-[#858894] uppercase tracking-[1px] mb-1.5">
            Description / Vendor Memo <span className="text-[#f87171]">*</span>
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g. Shell Queens - 45L Ultra Low Diesel, or Tunnel Toll"
            className="w-full bg-[#121319] border border-[#2b2e38] text-xs text-[#f0f0f4] px-3 py-2 rounded-[7px] focus:outline-none focus:border-[#ad91ff]"
          />
        </div>

        {/* Date / Time */}
        <div>
          <label className="block text-[11px] font-mono text-[#858894] uppercase tracking-[1px] mb-1.5">
            Transaction Date & Time
          </label>
          <input
            type="datetime-local"
            value={formData.recordedAt}
            onChange={(e) => setFormData({ ...formData, recordedAt: e.target.value })}
            className="w-full bg-[#121319] border border-[#2b2e38] text-xs text-[#f0f0f4] px-3 py-2 rounded-[7px] focus:outline-none focus:border-[#ad91ff] font-mono"
          />
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-[#252834] flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="quiet"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging...' : 'Record Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
