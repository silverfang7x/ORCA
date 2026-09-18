"use client";

import { useState } from "react";
import {
  Compass,
  MapPin,
  Layers,
  Radio,
  Activity,
  SlidersHorizontal,
  Server,
  Crosshair,
  Waves,
  Navigation,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LeafletMap, { MapMarker, HeatPoint } from "@/components/map/LeafletMap";

const REGIONAL_MAP_CENTER = { lat: 9.9312, lng: 76.2673 };

interface TelemetryTarget {
  mmsi: string;
  name: string;
  type: string;
  speed: number;
  bearing: string;
  rangeNm: number;
  cpaNm: number;
  status: "Normal" | "Near IMBL" | "Swell Warning Zone";
}

const MOCK_RADAR_TARGETS: TelemetryTarget[] = [
  { mmsi: "419001042", name: "St. Mary IND-KL-02", type: "Artisanal", speed: 6.2, bearing: "240° WSW", rangeNm: 12.4, cpaNm: 4.8, status: "Normal" },
  { mmsi: "419007889", name: "Ocean Queen II", type: "Trawler", speed: 8.5, bearing: "225° SW", rangeNm: 22.1, cpaNm: 1.8, status: "Near IMBL" },
  { mmsi: "419000402", name: "ICGS Varaha CG-402", type: "Patrol", speed: 14.0, bearing: "315° NW", rangeNm: 8.6, cpaNm: 9.2, status: "Normal" },
  { mmsi: "419002450", name: "Sea King Munambam", type: "Artisanal", speed: 0.0, bearing: "000° N", rangeNm: 2.1, cpaNm: 12.0, status: "Normal" },
  { mmsi: "419003301", name: "Fisheries Trawler #12", type: "Trawler", speed: 4.1, bearing: "180° S", rangeNm: 18.5, cpaNm: 2.1, status: "Swell Warning Zone" },
];

export default function OfficialRegionalMapPage() {
  const [activeLayers, setActiveLayers] = useState<string[]>(["AIS", "Heatmap", "Boundaries"]);
  const [selectedTarget, setSelectedTarget] = useState<string | null>("419007889");

  const [regionalHeatPoints] = useState<HeatPoint[]>([
    { lat: 9.975, lng: 76.18, intensity: 0.95 },
    { lat: 10.15, lng: 76.05, intensity: 0.85 },
    { lat: 9.85, lng: 76.05, intensity: 0.1 },
    { lat: 9.7, lng: 76.2, intensity: 0.25 },
    { lat: 10.05, lng: 75.9, intensity: 0.9 },
  ]);

  const [regionalMarkers] = useState<MapMarker[]>([
    { lat: 9.9312, lng: 76.2673, label: "Coast Guard Command Station Alpha", icon: "landing" },
    { lat: 9.88, lng: 76.12, label: "ICGS Varaha Patrol Craft 402", icon: "boat" },
    { lat: 10.08, lng: 76.02, label: "INCOIS Telemetry Buoy CB-02", icon: "boat" },
    { lat: 9.75, lng: 76.15, label: "Artisanal Fishing Craft Cluster", icon: "boat" },
  ]);

  const toggleLayer = (layer: string) => {
    if (activeLayers.includes(layer)) {
      setActiveLayers(activeLayers.filter((l) => l !== layer));
    } else {
      setActiveLayers([...activeLayers, layer]);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Title Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-semibold mb-2 shadow-sm font-mono">
            <Compass className="h-3 w-3 text-cyan-700" />
            Tactical Marine Intelligence Surface & Telemetry Radar Matrix
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Regional Marine Surveillance Map
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            Real-time AIS target tracking, INCOIS ocean surface sensor telemetry, and geofence boundary overlay.
          </p>
        </div>

        <div className="flex items-center gap-2.5 font-mono">
          <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800 px-3 py-1.5 text-xs flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            AIS & Buoy Live Stream Active
          </Badge>
        </div>
      </section>

      {/* Layer Toggle Bar */}
      <section className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1 font-mono">
            <Layers className="h-4 w-4 text-cyan-700" />
            Active Radar Layers:
          </span>
          {["AIS Targets", "Thermal Heatmap", "IMBL Boundaries", "PFZ Chlorophyll", "Wave Surge Hazard"].map((layer) => {
            const isActive = activeLayers.includes(layer);
            return (
              <button
                key={layer}
                onClick={() => toggleLayer(layer)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                  isActive
                    ? "bg-cyan-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {layer}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Map Grid Center: <strong>09.9312°N, 76.2673°E</strong>
        </div>
      </section>

      {/* Dual Panel Tactical Command Surface (65% Map + 35% Live Sensor Telemetry Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Standalone Tactical Map */}
        <Card className="lg:col-span-2 bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden flex flex-col justify-between">
          <CardHeader className="border-b border-slate-100 p-4 pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-700" />
                Malabar Coast & Laccadive Sea Surface View
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Continuous thermal surface (Green = safe/PFZ, Red = surge hazard)
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] text-cyan-800 border-cyan-200 bg-cyan-50 font-mono">
              Scale 1:500,000
            </Badge>
          </CardHeader>

          <CardContent className="p-3">
            <LeafletMap
              center={REGIONAL_MAP_CENTER}
              zoom={9}
              className="h-[520px] w-full rounded-xl"
              markers={regionalMarkers}
              heatPoints={regionalHeatPoints}
            />
          </CardContent>
        </Card>

        {/* Right: Admin-Only Telemetry Data Stream Side Panel */}
        <div className="space-y-4 flex flex-col">
          {/* Active Buoy Sensor Readouts */}
          <Card className="bg-slate-900 text-white border-slate-800 shadow-sm">
            <CardHeader className="p-4 pb-2 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold font-mono text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Waves className="h-3.5 w-3.5 text-cyan-400" />
                  INCOIS Telemetry Buoy CB-02 Readout
                </CardTitle>
                <Badge variant="outline" className="bg-emerald-950 text-emerald-400 border-emerald-800 text-[9px] font-mono">
                  LIVE 10s
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 font-mono text-xs space-y-2">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">Sea Surface Temp</div>
                  <div className="text-orange-400 font-bold text-sm">28.4 °C</div>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">Significant Wave Ht</div>
                  <div className="text-cyan-400 font-bold text-sm">1.8 meters</div>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">Wave Peak Period</div>
                  <div className="text-slate-200 font-bold">14.2 sec</div>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">Current Velocity</div>
                  <div className="text-slate-200 font-bold">1.2 knots</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live AIS Radar Targets Stream Table */}
          <Card className="bg-white border-slate-200 text-slate-900 shadow-sm flex-1 flex flex-col justify-between">
            <CardHeader className="p-3.5 pb-2 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                  <Crosshair className="h-3.5 w-3.5 text-red-600" />
                  Active Telemetry Radar Targets
                </CardTitle>
                <span className="text-[10px] font-mono text-slate-400">5 Tracking</span>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex-1 overflow-y-auto max-h-[300px]">
              <table className="w-full text-left text-[11px] font-mono">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="p-2 pl-3">Target / MMSI</th>
                    <th className="p-2">Speed/Brg</th>
                    <th className="p-2">CPA</th>
                    <th className="p-2 pr-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {MOCK_RADAR_TARGETS.map((target) => (
                    <tr
                      key={target.mmsi}
                      onClick={() => setSelectedTarget(target.mmsi)}
                      className={`cursor-pointer transition-colors ${
                        selectedTarget === target.mmsi ? "bg-cyan-50/90 font-semibold" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="p-2 pl-3 font-mono text-[11px]">
                        <div className="font-bold text-slate-900">{target.name}</div>
                        <div className="text-[9px] text-slate-400">MMSI: {target.mmsi}</div>
                      </td>
                      <td className="p-2 font-mono text-[10px] text-slate-700">
                        {target.speed}kn <br />
                        <span className="text-slate-400">{target.bearing}</span>
                      </td>
                      <td className="p-2 font-mono text-[10px] text-slate-800">
                        {target.cpaNm} nm
                      </td>
                      <td className="p-2 pr-3 text-right">
                        <Badge
                          variant="outline"
                          className={`text-[9px] px-1.5 py-0 ${
                            target.status === "Near IMBL"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : target.status === "Swell Warning Zone"
                              ? "bg-red-50 text-red-700 border-red-300"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          {target.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>

            <div className="p-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Click target to center radar track</span>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] text-cyan-700 p-0">
                Refresh Radar
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
