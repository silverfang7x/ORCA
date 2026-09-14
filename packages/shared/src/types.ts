// ORCA Shared Type Definitions
// Stable contract shared between Frontend, Backend, and Agent modules.

export type LanguageCode = 'en' | 'hi' | 'ml' | 'ta' | 'te' | 'kn' | string;

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface UserQueryRequest {
  id: string;
  query: string;
  language?: LanguageCode;
  location?: GeoCoordinates;
  timestamp: string;
}

export interface WeatherOceanData {
  location: GeoCoordinates;
  waveHeightMeters: number;
  wavePeriodSeconds: number;
  windSpeedKmh: number;
  windDirectionDegrees: number;
  seaSurfaceTempCelsius: number;
  tideInfo?: {
    highTideTime: string;
    lowTideTime: string;
  };
  safetyRating: 'SAFE' | 'CAUTION' | 'DANGER';
}

export interface HazardAlert {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  coordinates: GeoCoordinates[];
  activeFrom: string;
  activeUntil?: string;
}

export interface AgentRecommendation {
  queryId: string;
  summary: string;
  detailedAnalysis: string;
  safetyStatus: 'SAFE' | 'MODERATE_RISK' | 'HIGH_RISK' | 'UNSAFE';
  weatherData?: WeatherOceanData;
  hazards?: HazardAlert[];
  sources: string[];
  uncertaintyFlags?: string[];
  translatedResponse?: string;
  targetLanguage?: LanguageCode;
}

export interface SOSBroadcastPayload {
  alertId: string;
  fishermanId?: string;
  location: GeoCoordinates;
  timestamp: string;
  message?: string;
}
