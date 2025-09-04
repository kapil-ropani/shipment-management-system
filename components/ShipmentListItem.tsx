
import React from 'react';
import { Shipment, ShipmentStatus } from '../types';
import { TruckIcon, CheckCircleIcon, ClockIcon, ExclamationCircleIcon, BoxIcon, ArrowRightIcon } from './IconComponents';

interface ShipmentListItemProps {
  shipment: Shipment;
  onSelect: (shipment: Shipment) => void;
}

const statusStyles: { [key in ShipmentStatus]: { icon: React.ElementType, bgColor: string, textColor: string } } = {
  [ShipmentStatus.Pending]: { icon: BoxIcon, bgColor: 'bg-gray-100', textColor: 'text-gray-600' },
  [ShipmentStatus.InTransit]: { icon: TruckIcon, bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
  [ShipmentStatus.Delivered]: { icon: CheckCircleIcon, bgColor: 'bg-green-100', textColor: 'text-green-600' },
  [ShipmentStatus.Delayed]: { icon: ClockIcon, bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' },
  [ShipmentStatus.Exception]: { icon: ExclamationCircleIcon, bgColor: 'bg-red-100', textColor: 'text-red-600' },
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const ShipmentListItem: React.FC<ShipmentListItemProps> = ({ shipment, onSelect }) => {
  const { icon: Icon, bgColor, textColor } = statusStyles[shipment.status];

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer mb-4 p-4 border-l-4"
      style={{ borderColor: statusStyles[shipment.status].textColor.replace('text-', '').replace('-600', '') }}
      onClick={() => onSelect(shipment)}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Tracking ID */}
        <div className="md:col-span-2">
          <p className="text-sm text-gray-500">Tracking ID</p>
          <p className="font-bold text-brand-blue">{shipment.id}</p>
        </div>

        {/* Origin/Destination */}
        <div className="md:col-span-4 flex items-center">
          <div>
            <p className="text-sm text-gray-500">Origin</p>
            <p className="font-semibold text-gray-800">{shipment.origin}</p>
          </div>
          <ArrowRightIcon className="w-6 h-6 mx-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Destination</p>
            <p className="font-semibold text-gray-800">{shipment.destination}</p>
          </div>
        </div>
        
        {/* Status */}
        <div className="md:col-span-2">
          <p className="text-sm text-gray-500">Status</p>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
            <Icon className="w-4 h-4 mr-2" />
            {shipment.status}
          </span>
        </div>

        {/* Estimated Delivery */}
        <div className="md:col-span-2">
          <p className="text-sm text-gray-500">Est. Delivery</p>
          <p className="font-semibold text-gray-800">{formatDate(shipment.estimatedDelivery)}</p>
        </div>
        
        {/* Action Button */}
        <div className="md:col-span-2 text-right">
          <button 
            onClick={(e) => { e.stopPropagation(); onSelect(shipment); }}
            className="bg-brand-lightblue text-white px-4 py-2 rounded-md hover:bg-brand-blue transition-colors duration-300 text-sm font-semibold"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
