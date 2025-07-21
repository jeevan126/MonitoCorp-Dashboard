export interface ServiceType {
  id: string;
  name: string;
  type: string;
  status: 'Online' | 'Offline' | 'Degraded';
}

export interface EventType {
  id: string;
  serviceId: string;
  status: string;
  timestamp: string;
}

export interface ServicesResponse { data: ServiceType[]; total: number; page: number; limit: number };
