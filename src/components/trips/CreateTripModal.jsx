import React from 'react';
import Modal from '../common/Modal';
import TripForm from './TripForm';

export default function CreateTripModal({
  isOpen,
  onClose,
  initialTrip = null,
  vehicles = [],
  drivers = [],
  onTripSaved
}) {
  const isEditing = Boolean(initialTrip && initialTrip.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Trip Manifest: ${initialTrip?.id}` : 'Create New Fleet Trip'}
      subtitle={isEditing ? 'UPDATE ROUTE, CARGO & ASSIGNMENTS' : 'DISPATCH SCHEDULING & ROUTE PLANNING'}
      maxWidth="max-w-3xl"
    >
      <div className="max-h-[80vh] overflow-y-auto pr-1">
        <TripForm
          initialTrip={initialTrip}
          vehicles={vehicles}
          drivers={drivers}
          onSave={(saved) => {
            if (onTripSaved) onTripSaved(saved);
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </Modal>
  );
}

