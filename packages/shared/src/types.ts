export interface LocationQuery {
  latitude: number;
  longitude: number;
  date: string; // ISO format
}

export interface WeatherOceanData {
  waveHeightMeters: number;
  seaSurfaceTempCelsius: number;
  windSpeedKmh: number;
  tideTimes: { time: string; type: "high" | "low" }[];
  locationName?: string;
  source: string;
}

export interface HazardGeofenceData {
  hazardAlerts: { type: string; severity: string; description: string }[];
  isInRestrictedZone: boolean;
  nearestBoundaryName: string | null;
  source: string;
}

export interface SOSRequest {
  latitude: number;
  longitude: number;
  timestamp: string;
  userMessage?: string;
}

export interface BroadcastAlert {
  region: string;
  type: string;
  severity: "Low" | "Medium" | "High";
  message: string;
  issuedAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  language?: string;
  sources?: string[];
}

export interface AgentState {
  userQuery: string;
  detectedLanguage: string;
  translatedQuery: string;
  preferredLanguage?: string;
  location?: LocationQuery;
  intent: {
    needsWeather: boolean;
    needsHazard: boolean;
    isOffTopic?: boolean;
    isCycloneQuery?: boolean;
  };
  weatherData?: WeatherOceanData;
  hazardData?: HazardGeofenceData;
  finalAnswer: string;
  sources: string[];
}
