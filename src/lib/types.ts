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

export interface WheelSettings {
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  maxCharsPerLine: number;
  backgroundColor: string;
  strokeColor: string;
  strokeWidth: number;
  textColor: string;
  centerTitleSize: number;
  centerSubtitleSize: number;
  segmentPaddingInner: number;
  segmentPaddingOuter: number;
}

export const DEFAULT_WHEEL_SETTINGS: WheelSettings = {
  fontSize: 14,
  fontWeight: 600,
  lineHeight: 16,
  maxCharsPerLine: 12,
  backgroundColor: '#1a1a1a',
  strokeColor: '#1a1a1a',
  strokeWidth: 2,
  textColor: '#ffffff',
  centerTitleSize: 18,
  centerSubtitleSize: 10,
  segmentPaddingInner: 15,
  segmentPaddingOuter: 15,
};

export interface ConfigData {
  services: ServiceWithSubservices[];
  settings?: WheelSettings;
  lastUpdated: string;
}

export interface NormalizedSubservice extends Subservice {
  normalizedWeight: number;
  percentage: number;
}
