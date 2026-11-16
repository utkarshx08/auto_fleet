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
      const recDate = formData.recordedAt ? new Date(formData.recordedAt) : new Date();
      const safeRecordedAt = !isNaN(recDate.getTime()) ? recDate.toISOString() : new Date().toISOString();

      const { updatedTrip, newExpense } = addTripExpense(tripId, {
        type: formData.type,
        amount: amt,
        description: formData.description.trim(),
        recordedAt: safeRecordedAt,
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
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        {error && (
          <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#FAD2D2] text-[#E05252] text-xs font-mono">
            {error}
          </div>
        )}

        {/* Expense Category */}
        <div>
          <label className="block text-[10px] font-mono text-[#68758A] uppercase tracking-wider mb-1 font-semibold">
            Expense Category <span className="text-[#E05252]">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] text-xs text-[#172033] px-3 py-2 rounded-xl focus:outline-none focus:border-[#2879E8] cursor-pointer shadow-2xs"
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
          <label className="block text-[10px] font-mono text-[#68758A] uppercase tracking-wider mb-1 font-semibold">
            Expense Amount ($ USD) <span className="text-[#E05252]">*</span>
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A97AB]" />
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] text-sm text-[#172033] pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-[#2879E8] font-mono shadow-2xs font-bold"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-mono text-[#68758A] uppercase tracking-wider mb-1 font-semibold">
            Description / Vendor Memo <span className="text-[#E05252]">*</span>
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g. Shell Fuel Station - 45L Diesel, or Bridge Toll"
            className="w-full bg-[#F8FAFD] border border-[#D5E2F1] text-xs text-[#172033] px-3 py-2 rounded-xl focus:outline-none focus:border-[#2879E8] shadow-2xs"
          />
        </div>

        {/* Date / Time */}
        <div>
          <label className="block text-[10px] font-mono text-[#68758A] uppercase tracking-wider mb-1 font-semibold">
            Transaction Date & Time
          </label>
          <input
            type="datetime-local"
            value={formData.recordedAt}
            onChange={(e) => setFormData({ ...formData, recordedAt: e.target.value })}
            className="w-full bg-[#F8FAFD] border border-[#D5E2F1] text-xs text-[#172033] px-3 py-2 rounded-xl focus:outline-none focus:border-[#2879E8] font-mono shadow-2xs cursor-pointer"
          />
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging...' : 'Record Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
