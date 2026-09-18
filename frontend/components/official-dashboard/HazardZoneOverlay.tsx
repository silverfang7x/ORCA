"use client";

import { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Flame,
  Filter,
  Layers,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LeafletMap, { MapMarker, HeatPoint } from "@/components/map/LeafletMap";
import {
  MOCK_HAZARD_ALERTS,
  MOCK_MARITIME_BOUNDARIES,
  MockHazardAlert,
  MockMaritimeBoundary,
} from "./mockHazardData";

interface HazardZoneOverlayProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  showMapOverlay?: boolean;
  onSelectHazard?: (hazard: MockHazardAlert) => void;
  className?: string;
}

const DEFAULT_CENTER = { lat: 15.0, lng: 78.5 }; // Central India coastal overview

export function HazardZoneOverlay({
  center = DEFAULT_CENTER,
  zoom = 5,
  showMapOverlay = true,
  onSelectHazard,
  className = "",
}: HazardZoneOverlayProps) {
  const [filterType, setFilterType] = useState<string>("All");
  const [selectedHazardId, setSelectedHazardId] = useState<string | null>(null);

  // Map intensity conversion: High -> 1.0 (Red), Medium -> 0.6 (Orange), Low -> 0.3 (Yellow)
  const mapHeatPoints: HeatPoint[] = MOCK_HAZARD_ALERTS.map((h) => ({
    lat: h.latitude,
    lng: h.longitude,
    intensity: h.severity === "High" ? 1.0 : h.severity === "Medium" ? 0.6 : 0.3,
  }));

  // Map markers for hazard epicenters and boundary zone centers
  const mapMarkers: MapMarker[] = [
    ...MOCK_HAZARD_ALERTS.map((h) => ({
      lat: h.latitude,
      lng: h.longitude,
      label: `${h.type} (${h.severity} Severity) - ${h.region}`,
      icon: "boat" as const,
    })),
    ...MOCK_MARITIME_BOUNDARIES.map((b) => ({
      lat: b.center.lat,
      lng: b.center.lng,
      label: `Restricted Zone: ${b.name}`,
      icon: "landing" as const,
    })),
  ];

  const filteredHazards = MOCK_HAZARD_ALERTS.filter((h) => {
    if (filterType === "All") return true;
    if (filterType === "High") return h.severity === "High";
    if (filterType === "Cyclone") return h.type === "Cyclone Warning";
    if (filterType === "Wave") return h.type === "High Wave Alert";
    return true;
  });

  const handleHazardClick = (hazard: MockHazardAlert) => {
    setSelectedHazardId(hazard.id);
    if (onSelectHazard) {
      onSelectHazard(hazard);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. Header & Thermal Gradient Legend Meter */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-600" />
                Active Maritime Hazard & Geofence Overlay
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Thermal severity gradient mapping & boundary zone telemetry across Indian coastal sectors.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-50 border-red-200 text-red-800 text-xs">
                7 Active Warnings
              </Badge>
              <Badge className="bg-cyan-50 border-cyan-200 text-cyan-800 text-xs">
                4 Restricted Zones
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 bg-slate-50/60 border-b border-slate-100">
          {/* Thermal Gradient Legend */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <Flame className="h-4 w-4 text-orange-600" />
              <span>Thermal Severity Legend:</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-100 border border-yellow-300 text-yellow-900">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                <span className="font-bold">Low (0.3)</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-100 border border-orange-300 text-orange-900">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                <span className="font-bold">Medium (0.6)</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-100 border border-red-300 text-red-900">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                <span className="font-bold">High (1.0)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Shared Map Visualization Overlay Component */}
      {showMapOverlay && (
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
          <CardHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-cyan-700" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Live Heatmap & Geofence Surface Overlay
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Auto-rendered Leaflet Heat Layer
            </span>
          </CardHeader>
          <CardContent className="p-3">
            {/* 
              Shared map overlay layer: integrates directly with frontend/components/map/LeafletMap.tsx.
              Renders thermal gradient surface (Yellow -> Orange -> Red) and marker epicenters.
            */}
            <LeafletMap
              center={center}
              zoom={zoom}
              className="h-80 md:h-[400px] w-full rounded-xl"
              markers={mapMarkers}
              heatPoints={mapHeatPoints}
            />
          </CardContent>
        </Card>
      )}

      {/* 3. Hazard Filter Chips & Detailed Legend Feed */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Hazard Warnings List (2 cols) */}
        <Card className="lg:col-span-2 bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardHeader className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Active Coastal Hazard Alerts
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Click any warning item to inspect radius bounds & epicenter coordinates.
              </CardDescription>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto shrink-0">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="h-3 w-3" />
                Filter:
              </span>
              {["All", "High", "Cyclone", "Wave"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    filterType === f
                      ? "bg-cyan-700 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-3 max-h-[460px] overflow-y-auto">
            {filteredHazards.map((hazard) => {
              const isSelected = selectedHazardId === hazard.id;
              const isHigh = hazard.severity === "High";
              const isMedium = hazard.severity === "Medium";

              const severityStyle = isHigh
                ? "bg-red-50/80 border-red-300 text-red-950 hover:bg-red-100/60"
                : isMedium
                ? "bg-orange-50/80 border-orange-300 text-orange-950 hover:bg-orange-100/60"
                : "bg-yellow-50/80 border-yellow-300 text-yellow-950 hover:bg-yellow-100/60";

              const badgeColor = isHigh
                ? "bg-red-600 text-white"
                : isMedium
                ? "bg-orange-600 text-white"
                : "bg-yellow-600 text-white";

              return (
                <div
                  key={hazard.id}
                  onClick={() => handleHazardClick(hazard)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${severityStyle} ${
                    isSelected ? "ring-2 ring-cyan-600 shadow-md" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm">{hazard.region}</span>
                      <Badge className={`text-[10px] px-2 py-0.5 font-bold ${badgeColor}`}>
                        {hazard.severity} Severity
                      </Badge>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                      Radius: {hazard.radiusKm} km
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed font-sans">
                    {hazard.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200/60">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-cyan-700" />
                      Lat: {hazard.latitude.toFixed(2)}°N, Lng: {hazard.longitude.toFixed(2)}°E
                    </span>
                    <span className="font-semibold text-slate-700">{hazard.type}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Right Column: Maritime Boundary Geofence Legend (1 col) */}
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardHeader className="p-4 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-700" />
              Restricted Maritime Geofence Zones
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              GeoJSON polygon zones monitored for vessel intrusion.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 space-y-3">
            {MOCK_MARITIME_BOUNDARIES.map((zone) => (
              <div
                key={zone.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{zone.type}</span>
                  <Badge variant="outline" className="text-[10px] text-cyan-800 border-cyan-200 bg-cyan-50">
                    {zone.status}
                  </Badge>
                </div>

                <div className="text-xs font-medium text-slate-700 leading-tight">
                  {zone.name}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                  <span>Center: {zone.center.lat.toFixed(2)}°N, {zone.center.lng.toFixed(2)}°E</span>
                  <span>{zone.coordinatesCount} Vertices</span>
                </div>
              </div>
            ))}

            <div className="p-3 bg-cyan-50/60 border border-cyan-200 rounded-xl flex items-center gap-2 text-xs text-cyan-900">
              <CheckCircle2 className="h-4 w-4 text-cyan-700 shrink-0" />
              <span>Turf.js spatial point-in-polygon engine active.</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
