
import { useState, useCallback } from 'react';
import { Shipment, ShipmentStatus, NewShipmentData, Exception } from '../types';

const initialShipments: Shipment[] = [
  {
    id: 'CFT-84620',
    origin: 'Los Angeles, CA',
    destination: 'New York, NY',
    carrier: 'FastLane Logistics',
    createdDate: '2024-07-15T09:00:00Z',
    estimatedDelivery: '2024-07-22T17:00:00Z',
    lastUpdate: '2024-07-18T14:30:00Z',
    status: ShipmentStatus.InTransit,
    history: [
      { timestamp: '2024-07-18T14:30:00Z', location: 'Omaha, NE', details: 'Departed from facility' },
      { timestamp: '2024-07-17T02:15:00Z', location: 'Denver, CO', details: 'Arrived at sorting hub' },
      { timestamp: '2024-07-15T18:00:00Z', location: 'Los Angeles, CA', details: 'Shipment picked up' },
    ],
    exceptions: [],
  },
  {
    id: 'CFT-51983',
    origin: 'Chicago, IL',
    destination: 'Miami, FL',
    carrier: 'Speedy Haulers',
    createdDate: '2024-07-16T11:30:00Z',
    estimatedDelivery: '2024-07-20T17:00:00Z',
    lastUpdate: '2024-07-19T08:45:00Z',
    status: ShipmentStatus.Delayed,
    history: [
      { timestamp: '2024-07-19T08:45:00Z', location: 'Atlanta, GA', details: 'Mechanical issue with vehicle. Delay expected.' },
      { timestamp: '2024-07-18T12:00:00Z', location: 'Nashville, TN', details: 'Departed from facility' },
      { timestamp: '2024-07-17T10:20:00Z', location: 'Chicago, IL', details: 'Shipment picked up' },
    ],
    exceptions: [],
  },
    {
    id: 'CFT-33741',
    origin: 'Seattle, WA',
    destination: 'Austin, TX',
    carrier: 'West-Coast Movers',
    createdDate: '2024-07-14T14:00:00Z',
    estimatedDelivery: '2024-07-19T17:00:00Z',
    lastUpdate: '2024-07-19T18:00:00Z',
    status: ShipmentStatus.Delivered,
    history: [
      { timestamp: '2024-07-19T18:00:00Z', location: 'Austin, TX', details: 'Delivered. Signed by J. Doe.' },
      { timestamp: '2024-07-19T09:00:00Z', location: 'Austin, TX', details: 'Out for delivery.' },
      { timestamp: '2024-07-15T05:00:00Z', location: 'Seattle, WA', details: 'Shipment picked up' },
    ],
    exceptions: [],
  },
  {
    id: 'CFT-91125',
    origin: 'Boston, MA',
    destination: 'San Francisco, CA',
    carrier: 'CrossCountry Freight',
    createdDate: '2024-07-17T08:00:00Z',
    estimatedDelivery: '2024-07-24T17:00:00Z',
    lastUpdate: '2024-07-20T03:15:00Z',
    status: ShipmentStatus.Exception,
    history: [
      { timestamp: '2024-07-20T03:15:00Z', location: 'Cleveland, OH', details: 'Package contents damaged during transit. Awaiting inspection.' },
      { timestamp: '2024-07-18T22:00:00Z', location: 'Buffalo, NY', details: 'Departed from facility' },
      { timestamp: '2024-07-17T15:00:00Z', location: 'Boston, MA', details: 'Shipment picked up' },
    ],
    exceptions: [
        { timestamp: '2024-07-20T03:15:00Z', description: 'Forklift operator reported a punctured crate. Visible damage to contents.' }
    ],
  },
];

export const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);

  const addShipment = useCallback((data: NewShipmentData) => {
    const newShipment: Shipment = {
      ...data,
      id: `CFT-${Math.floor(10000 + Math.random() * 90000)}`,
      createdDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      status: ShipmentStatus.Pending,
      history: [{
        timestamp: new Date().toISOString(),
        location: data.origin,
        details: 'Shipment created'
      }],
      exceptions: [],
    };
    setShipments(prev => [newShipment, ...prev]);
  }, []);
  
  const addExceptionToShipment = useCallback((shipmentId: string, exception: Exception) => {
    setShipments(prev => prev.map(shipment => {
        if (shipment.id === shipmentId) {
            return {
                ...shipment,
                status: ShipmentStatus.Exception,
                exceptions: [...shipment.exceptions, exception],
                lastUpdate: new Date().toISOString(),
            };
        }
        return shipment;
    }));
  }, []);

  return { shipments, addShipment, addExceptionToShipment };
};
