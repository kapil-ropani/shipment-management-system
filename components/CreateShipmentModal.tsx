
import React, { useState } from 'react';
import { NewShipmentData } from '../types';
import { CloseIcon } from './IconComponents';

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewShipmentData) => void;
}

export const CreateShipmentModal: React.FC<CreateShipmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [carrier, setCarrier] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !carrier || !estimatedDelivery) {
        alert("Please fill all fields.");
        return;
    }
    onSubmit({ origin, destination, carrier, estimatedDelivery });
    onClose();
    // Reset form
    setOrigin('');
    setDestination('');
    setCarrier('');
    setEstimatedDelivery('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg relative animate-fade-in-down">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <CloseIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-brand-blue mb-6">Create New Shipment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origin (City, State)</label>
            <input type="text" id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-lightblue focus:border-brand-lightblue" required />
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination (City, State)</label>
            <input type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-lightblue focus:border-brand-lightblue" required />
          </div>
          <div>
            <label htmlFor="carrier" className="block text-sm font-medium text-gray-700">Carrier</label>
            <input type="text" id="carrier" value={carrier} onChange={(e) => setCarrier(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-lightblue focus:border-brand-lightblue" required />
          </div>
          <div>
            <label htmlFor="estimatedDelivery" className="block text-sm font-medium text-gray-700">Estimated Delivery Date</label>
            <input type="date" id="estimatedDelivery" value={estimatedDelivery} onChange={(e) => setEstimatedDelivery(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-lightblue focus:border-brand-lightblue" required />
          </div>
          <div className="flex justify-end pt-4 space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-brand-lightblue text-white px-4 py-2 rounded-md hover:bg-brand-blue transition-colors">
              Create Shipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
