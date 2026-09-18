export interface MockHazardAlert {
  id: string;
  region: string;
  type: string;
  severity: "Low" | "Medium" | "High";
  latitude: number;
  longitude: number;
  radiusKm: number;
  description: string;
}

export interface MockMaritimeBoundary {
  id: string;
  name: string;
  type: string;
  coordinatesCount: number;
  center: { lat: number; lng: number };
  status: "Restricted" | "Protected" | "Buffer Zone";
}

export const MOCK_HAZARD_ALERTS: MockHazardAlert[] = [
  {
    id: "HAZ-IN-001",
    region: "Bay of Bengal / Odisha Coast",
    type: "Cyclone Warning",
    severity: "High",
    latitude: 20.27,
    longitude: 86.70,
    radiusKm: 120,
    description: "Severe cyclonic storm approaching Paradip coast. Wind speeds exceeding 90 km/h."
  },
  {
    id: "HAZ-IN-002",
    region: "Kerala Coast (Kochi)",
    type: "High Wave Alert",
    severity: "Medium",
    latitude: 9.93,
    longitude: 76.26,
    radiusKm: 45,
    description: "Swell waves up to 2.8m expected off Kochi-Munambam coastline."
  },
  {
    id: "HAZ-IN-003",
    region: "Gujarat Coast (Porbandar)",
    type: "Storm Warning",
    severity: "High",
    latitude: 21.64,
    longitude: 69.60,
    radiusKm: 90,
    description: "Squally weather and rough sea conditions off Porbandar & Kutch coast."
  },
  {
    id: "HAZ-IN-004",
    region: "Tamil Nadu Coast (Coromandel)",
    type: "Lightning Alert",
    severity: "Medium",
    latitude: 13.08,
    longitude: 80.27,
    radiusKm: 30,
    description: "Frequent thunder and lightning strikes reported near offshore Chennai."
  },
  {
    id: "HAZ-IN-005",
    region: "Andhra Pradesh Coast (Visakhapatnam)",
    type: "Cyclone Warning",
    severity: "High",
    latitude: 17.68,
    longitude: 83.21,
    radiusKm: 100,
    description: "Deep depression intensifying into a cyclone near Visakhapatnam offshore."
  },
  {
    id: "HAZ-IN-006",
    region: "West Bengal Sundarbans",
    type: "Storm Warning",
    severity: "High",
    latitude: 21.65,
    longitude: 88.08,
    radiusKm: 60,
    description: "Heavy rainfall and gale wind advisories around Sagar Island and Sundarbans."
  },
  {
    id: "HAZ-IN-007",
    region: "South Kerala & Kanyakumari",
    type: "High Wave Alert",
    severity: "Low",
    latitude: 8.08,
    longitude: 77.55,
    radiusKm: 35,
    description: "Moderate swell waves near Kanyakumari convergence zone."
  }
];

export const MOCK_MARITIME_BOUNDARIES: MockMaritimeBoundary[] = [
  {
    id: "ZONE-01",
    name: "India-Sri Lanka International Maritime Boundary Buffer",
    type: "IMBL Buffer",
    coordinatesCount: 6,
    center: { lat: 9.35, lng: 79.50 },
    status: "Buffer Zone"
  },
  {
    id: "ZONE-02",
    name: "Gulf of Kutch Marine Protected Area",
    type: "Marine Sanctuary",
    coordinatesCount: 6,
    center: { lat: 22.50, lng: 69.50 },
    status: "Protected"
  },
  {
    id: "ZONE-03",
    name: "Andaman Islands Marine Protected Area",
    type: "Coral Reef Reserve",
    coordinatesCount: 6,
    center: { lat: 11.55, lng: 92.60 },
    status: "Protected"
  },
  {
    id: "ZONE-04",
    name: "Wadge Bank Protected Marine Zone",
    type: "Fishery Reserve",
    coordinatesCount: 6,
    center: { lat: 7.65, lng: 77.10 },
    status: "Restricted"
  }
];
