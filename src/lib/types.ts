export interface Service {
  id: number;
  name: string;
  tooltip: string | null;
  description: string | null;
  color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Subservice {
  id: number;
  service_id: number;
  name: string;
  tooltip: string | null;
  color: string;
  weight: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceWithSubservices extends Service {
  subservices: Subservice[];
}

export interface ConfigData {
  services: ServiceWithSubservices[];
  lastUpdated: string;
}

export interface NormalizedSubservice extends Subservice {
  normalizedWeight: number;
  percentage: number;
}
