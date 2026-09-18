"use client";

import { useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Navigation,
  TrendingUp,
  Radio,
  Activity,
  Compass,
  ShieldAlert,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LeafletMap, { MapMarker, HeatPoint } from "@/components/map/LeafletMap";

const REGIONAL_MAP_CENTER = { lat: 9.9312, lng: 76.2673 };

export default function OfficialDashboardOverviewPage() {
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
      {/* Top Title Ribbon */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-cyan-800 text-[11px] font-semibold mb-2 shadow-sm">
            <Activity className="h-3 w-3 text-cyan-700" />
            Regional Control & Surveillance Console
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Official Command Overview
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            Live multi-agent marine monitoring, regional hazard broadcast controls, and vessel security analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge className="bg-white border-slate-200 text-slate-700 px-3 py-1.5 text-xs flex items-center gap-1.5 shadow-sm">
            <Clock className="h-3.5 w-3.5 text-cyan-700" />
            <span>Live Sync: Operational</span>
          </Badge>
        </div>
      </section>

      {/* Row of Stat Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-slate-500">Active Hazards</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-extrabold text-slate-900">5</div>
            <p className="text-[11px] text-amber-700 mt-1 font-medium flex items-center gap-1">
              <span>+2 high severity swell warnings</span>
            </p>
          </CardContent>
        </Card>

        {/* Stat 2 */}
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-slate-500">Vessels Tracked</CardTitle>
            <Navigation className="h-4 w-4 text-cyan-700" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-extrabold text-slate-900">128</div>
            <p className="text-[11px] text-cyan-700 mt-1 font-medium">
              12 active in deep-sea sectors
            </p>
          </CardContent>
        </Card>

        {/* Stat 3 */}
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-slate-500">Regions Monitored</CardTitle>
            <MapPin className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-extrabold text-slate-900">14</div>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">
              All coastal sectors online
            </p>
          </CardContent>
        </Card>

        {/* Stat 4 */}
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-medium text-slate-500">Queries Processed Today</CardTitle>
            <Activity className="h-4 w-4 text-cyan-700" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-extrabold text-slate-900">1,420</div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              98.4% resolution accuracy
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Regional Map View Focal Point */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="h-5 w-5 text-cyan-700" />
              Regional Marine Intelligence & Surveillance Surface
            </h2>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Wide regional ocean view (Malabar Coast & Laccadive Sea). Thermal surface highlights fishing clusters (Green) vs hazards (Red).
            </CardDescription>
          </div>
          <Badge variant="outline" className="self-start md:self-auto text-xs text-cyan-800 border-cyan-200 bg-cyan-50">
            Live AIS & Satellite Overlay
          </Badge>
        </div>

        <LeafletMap
          center={REGIONAL_MAP_CENTER}
          zoom={8}
          className="h-96 md:h-[420px] w-full rounded-xl"
          markers={regionalMarkers}
          heatPoints={regionalHeatPoints}
        />
      </section>

      {/* Alert Severity Summary Section */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            Alert Severity Summary
          </h2>
          <Badge variant="secondary" className="bg-slate-100 text-slate-600 border border-slate-200 text-xs">
            Live Severity Breakdown
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-red-900 uppercase tracking-wider">High Severity</div>
              <div className="text-xs text-red-700 mt-1">Swell waves & cyclonic depressions</div>
            </div>
            <span className="text-3xl font-extrabold text-red-700 font-mono">2</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-amber-900 uppercase tracking-wider">Moderate Severity</div>
              <div className="text-xs text-amber-700 mt-1">Boundary buffers & strong tide currents</div>
            </div>
            <span className="text-3xl font-extrabold text-amber-700 font-mono">2</span>
          </div>

          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-sky-900 uppercase tracking-wider">Informational</div>
              <div className="text-xs text-sky-700 mt-1">PFZ updates & daily marine forecasts</div>
            </div>
            <span className="text-3xl font-extrabold text-sky-700 font-mono">1</span>
          </div>
        </div>
      </section>

      {/* Teammate Slot: Alert Broadcast Panel & Hazard Zone Overlay */}
      {/* TODO: Kunal builds this - see CONTEXT.md */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <CardHeader className="p-0 pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Radio className="h-5 w-5 text-cyan-700" />
              Alert Broadcast Panel & Hazard Zone Overlay
            </CardTitle>
            <Badge className="bg-cyan-50 border-cyan-200 text-cyan-800 text-xs">Teammate Module Slot</Badge>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-1">
            Interactive hazard polygon editor, coastal warning broadcaster, and alert push dispatch console.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2 bg-slate-50">
            <div className="p-3 rounded-full bg-cyan-100 text-cyan-700 inline-flex">
              <Radio className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Alert Broadcast Panel & Hazard Overlay Slot</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              // TODO: Kunal builds this - see CONTEXT.md. This section will contain the interactive Turf.js hazard drawing overlay and live emergency broadcast dispatch controls.
            </p>
          </div>
        </CardContent>
      </section>

      {/* Optional Teammate Slot: Historical Trend Chart */}
      {/* OPTIONAL - build last if time permits, see CONTEXT.md */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <CardHeader className="p-0 pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Historical Trend Analytics Slot
            </CardTitle>
            <Badge variant="outline" className="text-slate-600 border-slate-200 text-xs">Optional Stretch Slot</Badge>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-1">
            Long-term ocean wave height, sea temperature anomaly, and seasonal catch analytics graphs.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2 bg-slate-50">
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-700 inline-flex">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Historical Trend Analytics Slot</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {/* OPTIONAL - build last if time permits, see CONTEXT.md */}
              Multi-month trends and historical fleet analytics will appear here.
            </p>
          </div>
        </CardContent>
      </section>
    </div>
  );
}
