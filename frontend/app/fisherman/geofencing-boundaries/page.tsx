"use client";

import { useState } from "react";
import { ShieldCheck, MapPin, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LeafletMap, { MapMarker, HeatPoint } from "@/components/map/LeafletMap";

const DEFAULT_MAP_CENTER = { lat: 9.9312, lng: 76.2673 };

export default function GeofencingBoundariesPage() {
  const [mapMarkers] = useState<MapMarker[]>([
    { lat: 9.9312, lng: 76.2673, label: "Kochi Base Harbor", icon: "landing" },
    { lat: 9.85, lng: 76.05, label: "IMBL Sector Buffer (Restricted)", icon: "boat" },
    { lat: 9.98, lng: 76.22, label: "Commercial Shipping Channel", icon: "boat" },
  ]);

  const [heatPoints] = useState<HeatPoint[]>([
    { lat: 9.975, lng: 76.18, intensity: 0.95 },
    { lat: 9.85, lng: 76.05, intensity: 0.1 },
    { lat: 9.98, lng: 76.22, intensity: 0.35 },
  ]);

  const boundaryZones = [
    {
      name: "International Maritime Boundary Line (IMBL Buffer)",
      status: "Clear (18.4 nm distance)",
      type: "International Border",
      restrictionLevel: "Strict Prohibition Beyond Line",
      badgeVariant: "success" as const,
    },
    {
      name: "Cochin Port Outer Entrance Shipping Channel",
      status: "Caution (Channel Traffic)",
      type: "Navigational Route",
      restrictionLevel: "Cross with Beacon Clearance",
      badgeVariant: "warning" as const,
    },
    {
      name: "Chellanam Coral Reef Conservation Area",
      status: "Protected Marine Zone",
      type: "Ecological Reserve",
      restrictionLevel: "No Bottom Trawling",
      badgeVariant: "warning" as const,
    },
  ];

  return (
    <div className="space-y-6 pb-12 text-slate-900 max-w-7xl mx-auto px-4 md:px-6 pt-4">
      {/* Header Banner */}
      <section className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 text-white border border-slate-800/20 p-6 md:p-8 shadow-md overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-cyan-200 text-xs font-semibold mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Turf.js GeoJSON Geofencing Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Geofencing & Maritime Boundaries
          </h1>
          <p className="text-slate-200 text-sm md:text-base mt-1 max-w-2xl">
            Automated boundary tracking preventing accidental international maritime line crossings and port channel obstruction.
          </p>
        </div>
      </section>

      {/* Embedded LeafletMap in Heatmap Mode */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="pb-3 border-b border-slate-100 mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Interactive Zone & Boundary Map
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Continuous thermal heatmap surface highlighting restricted boundaries (Red) vs safe fishing waters (Green).
            </p>
          </div>
        </div>

        <LeafletMap
          center={DEFAULT_MAP_CENTER}
          zoom={10}
          className="h-80 md:h-96 w-full rounded-xl"
          markers={mapMarkers}
          heatPoints={heatPoints}
        />
      </section>

      {/* Named Boundary Zones List */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="h-5 w-5 text-cyan-600" />
          Tracked Maritime Boundary Zones
        </h3>

        <div className="space-y-3">
          {boundaryZones.map((zone, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-slate-200 text-cyan-700 shrink-0 mt-0.5">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900 text-sm">{zone.name}</h4>
                    <Badge variant={zone.badgeVariant as any} className="text-[10px] px-2 py-0 font-medium">
                      {zone.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Restriction: <span className="text-slate-900 font-medium">{zone.restrictionLevel}</span>
                  </p>
                </div>
              </div>

              <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg shrink-0 self-end md:self-auto">
                {zone.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Short Note Banner */}
      <section className="p-5 bg-white border border-slate-200 rounded-2xl flex items-start gap-3 text-slate-700 text-xs md:text-sm shadow-sm">
        <Info className="h-5 w-5 text-cyan-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900">Geofence Boundary Management</span>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Full boundary management & custom geofence alerts (custom vessel proximity radius, automated audio warnings) coming soon.
          </p>
        </div>
      </section>
    </div>
  );
}
