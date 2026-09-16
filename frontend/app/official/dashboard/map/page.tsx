"use client";

import { useState } from "react";
import { Compass, MapPin, Layers, Radio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LeafletMap, { MapMarker, HeatPoint } from "@/components/map/LeafletMap";

const REGIONAL_MAP_CENTER = { lat: 9.9312, lng: 76.2673 };

export default function OfficialRegionalMapPage() {
  const [regionalHeatPoints] = useState<HeatPoint[]>([
    { lat: 9.975, lng: 76.18, intensity: 0.95 },
    { lat: 10.15, lng: 76.05, intensity: 0.85 },
    { lat: 9.85, lng: 76.05, intensity: 0.1 },
    { lat: 9.7, lng: 76.2, intensity: 0.25 },
    { lat: 10.05, lng: 75.9, intensity: 0.9 },
  ]);

  const [regionalMarkers] = useState<MapMarker[]>([
    { lat: 9.9312, lng: 76.2673, label: "Coast Guard Command Station Alpha", icon: "landing" },
    { lat: 9.88, lng: 76.12, label: "Marine Patrol Vessel ICGS-402", icon: "boat" },
    { lat: 10.08, lng: 76.02, label: "Coastal Surveillance Beacon #7", icon: "boat" },
    { lat: 9.75, lng: 76.15, label: "Artisanal Fishing Craft Cluster", icon: "boat" },
  ]);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-semibold mb-2 shadow-sm">
            <Compass className="h-3 w-3 text-cyan-700" />
            Full-Screen Regional Tactical View
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Regional Marine Surveillance Map
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            Expanded high-resolution ocean surface map showing real-time AIS vessel locations, buoy sensors, and thermal potential overlays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 px-3 py-1 text-xs flex items-center gap-1.5">
            <Radio className="h-3 w-3 text-emerald-600 animate-pulse" />
            AIS Feed Active
          </Badge>
        </div>
      </section>

      {/* Standalone Map Container */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-cyan-700" />
              Malabar Coast Standalone Marine Intelligence Map
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Continuous thermal heatmap surface (Green = safe/PFZ, Red = hazard/avoid)
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs text-cyan-800 border-cyan-200 bg-cyan-50">
            <Layers className="h-3 w-3 mr-1" /> Multi-Layer AIS
          </Badge>
        </CardHeader>
        <CardContent className="p-4">
          <LeafletMap
            center={REGIONAL_MAP_CENTER}
            zoom={9}
            className="h-[520px] w-full rounded-xl"
            markers={regionalMarkers}
            heatPoints={regionalHeatPoints}
          />
        </CardContent>
      </Card>
    </div>
  );
}
