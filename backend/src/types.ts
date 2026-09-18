export interface LocationQuery {
  latitude: number;
  longitude: number;
  date: string;
}

export interface HazardGeofenceData {
  hazardAlerts: { type: string; severity: string; description: string }[];
  isInRestrictedZone: boolean;
  nearestBoundaryName: string | null;
  source: string;
}
