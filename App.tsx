
import React, { useState, useMemo } from 'react';
import { useShipments } from './hooks/useShipments';
import { Shipment, NewShipmentData, Exception } from './types';
import { ShipmentList } from './components/ShipmentList';
import { CreateShipmentModal } from './components/CreateShipmentModal';
import { ShipmentDetailsModal } from './components/ShipmentDetailsModal';
import { BoxIcon } from './components/IconComponents';

const App: React.FC = () => {
  const { shipments, addShipment, addExceptionToShipment } = useShipments();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredShipments = useMemo(() => {
    if (!searchTerm) {
      return shipments;
    }
    return shipments.filter(shipment =>
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [shipments, searchTerm]);

  const handleCreateShipment = (data: NewShipmentData) => {
    addShipment(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-brand-blue shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <BoxIcon className="w-8 h-8 text-white mr-3" />
            <h1 className="text-2xl font-bold text-white tracking-wider">ComFreight Track</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Shipment Dashboard</h2>
              <p className="text-brand-gray mt-1">Track and manage all your freight shipments in one place.</p>
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="w-full sm:w-auto bg-brand-lightblue text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-blue transition duration-300 shadow-sm"
            >
              + Create Shipment
            </button>
          </div>
          <div className="mt-6">
            <input
              type="text"
              placeholder="Search by Tracking ID, Origin, or Destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-lightblue"
            />
          </div>
        </div>

        <ShipmentList shipments={filteredShipments} onSelectShipment={setSelectedShipment} />
      </main>

      <CreateShipmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateShipment}
      />
      
      <ShipmentDetailsModal
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
        onAddException={addExceptionToShipment}
      />
    </div>
  );
};

export default App;
