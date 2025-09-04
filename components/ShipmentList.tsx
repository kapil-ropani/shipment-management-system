
import React from 'react';
import { Shipment } from '../types';
import { ShipmentListItem } from './ShipmentListItem';

interface ShipmentListProps {
  shipments: Shipment[];
  onSelectShipment: (shipment: Shipment) => void;
}

export const ShipmentList: React.FC<ShipmentListProps> = ({ shipments, onSelectShipment }) => {
  if (shipments.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-brand-gray">No shipments match your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shipments.map((shipment) => (
        <ShipmentListItem key={shipment.id} shipment={shipment} onSelect={onSelectShipment} />
      ))}
    </div>
  );
};
