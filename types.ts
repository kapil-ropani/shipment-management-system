
export enum ShipmentStatus {
  Pending = 'Pending',
  InTransit = 'In Transit',
  Delivered = 'Delivered',
  Delayed = 'Delayed',
  Exception = 'Exception',
}

export interface AIAnalysis {
  category: string;
  suggestedActions: string[];
}

export interface Exception {
  timestamp: string;
  description: string;
  aiAnalysis?: AIAnalysis;
}

export interface ShipmentHistory {
  timestamp: string;
  location: string;
  details: string;
}

export interface Shipment {
  id: string; // Tracking ID
  origin: string;
  destination: string;
  carrier: string;
  createdDate: string;
  estimatedDelivery: string;
  lastUpdate: string;
  status: ShipmentStatus;
  history: ShipmentHistory[];
  exceptions: Exception[];
}

export type NewShipmentData = Omit<Shipment, 'id' | 'createdDate' | 'lastUpdate' | 'status' | 'history' | 'exceptions'>;
