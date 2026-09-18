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
  Server,
  Wifi,
  Users,
  Terminal,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LeafletMap, { MapMarker, HeatPoint } from "@/components/map/LeafletMap";

const REGIONAL_MAP_CENTER = { lat: 9.9312, lng: 76.2673 };

interface TelemetryLog {
  id: string;
  time: string;
  source: "INCOIS" | "AIS RADAR" | "GEOFENCE" | "BHASHINI" | "SOS";
  message: string;
  level: "INFO" | "WARN" | "CRITICAL";
}

const MOCK_TELEMETRY_LOGS: TelemetryLog[] = [
  { id: "LOG-9901", time: "02:45:12", source: "SOS", message: "Distress pulse beacon received from VES-102 (09.85°N, 76.05°E)", level: "CRITICAL" },
  { id: "LOG-9902", time: "02:44:05", source: "GEOFENCE", message: "Vessel KL-07-889 crossed 2.0nm IMBL warning buffer line", level: "WARN" },
  { id: "LOG-9903", time: "02:42:30", source: "INCOIS", message: "Swell wave peak period updated to 14.2s (Buoy CB-02)", level: "INFO" },
  { id: "LOG-9904", time: "02:40:18", source: "BHASHINI", message: "Malayalam advisory broadcast dispatched to 142 registered app clients", level: "INFO" },
  { id: "LOG-9905", time: "02:38:50", source: "AIS RADAR", message: "ICGS Varaha Patrol 402 updated heading to 315° NW (Speed 14kn)", level: "INFO" },
  { id: "LOG-9906", time: "02:35:10", source: "INCOIS", message: "Sea Surface Temp anomaly +1.8°C detected in Sector 4", level: "WARN" },
];

export default function OfficialDashboardOverviewPage() {
  const [regionalHeatPoints] = useState<HeatPoint[]>([
    { lat: 9.975, lng: 76.18, intensity: 0.95 },
    { lat: 10.15, lng: 76.05, intensity: 0.85 },
    { lat: 9.85, lng: 76.05, intensity: 0.1 },
    { lat: 9.7, lng: 76.2, intensity: 0.25 },
    { lat: 10.05, lng: 75.9, intensity: 0.9 },
  ]);

  const [regionalMarkers] = useState<MapMarker[]>([
    { lat: 9.9312, lng: 76.2673, label: "Coast Guard Command HQ Alpha", icon: "landing" },
    { lat: 9.88, lng: 76.12, label: "ICGS Varaha Patrol Craft 402", icon: "boat" },
    { lat: 10.08, lng: 76.02, label: "INCOIS Telemetry Buoy CB-02", icon: "boat" },
    { lat: 9.75, lng: 76.15, label: "Artisanal Fishing Craft Cluster (Sector 3)", icon: "boat" },
  ]);

  return (
    <div className="space-y-5 pb-8">
      {/* 1. Command Center Operations Header Bar */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 text-white shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-[11px] font-mono font-semibold mb-2">
              <Activity className="h-3 w-3 text-cyan-400 animate-pulse" />
              ISRO / INCOIS Coastal Operations Center (V2.4 Console)
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Official Command Overview
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">
              Live multi-agent marine monitoring, regional hazard broadcast controls, and vessel security analytics.
            </p>
          </div>

          {/* Shift Info & Live Sync Status */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-cyan-400" />
              <span>Shift Lead: <strong className="text-white">Cmdr. R. Sharma</strong></span>
            </div>

            <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800 px-3 py-1.5 text-xs flex items-center gap-1.5 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Telemetry: 100% Sync</span>
            </Badge>
          </div>
        </div>

        {/* System Node Telemetry Bar (Admin-only System Status) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-mono">
          <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <Server className="h-4 w-4 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-400">INCOIS API Node</div>
              <div className="text-emerald-400 font-bold">ONLINE (42ms)</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <Wifi className="h-4 w-4 text-blue-400" />
            <div>
              <div className="text-[10px] text-slate-400">ISRO Sat Downlink</div>
              <div className="text-emerald-400 font-bold">ACTIVE (99.8%)</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <Zap className="h-4 w-4 text-purple-400" />
            <div>
              <div className="text-[10px] text-slate-400">Bhashini AI Engine</div>
              <div className="text-cyan-400 font-bold">READY (3 Langs)</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <Radio className="h-4 w-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400">VHF Relay Channels</div>
              <div className="text-amber-400 font-bold">CH 16 / CH 68</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Operational Metrics Grid (Dense Data Tiles) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardHeader className="p-3.5 pb-1 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Hazards</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent className="p-3.5 pt-0">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">5 Warnings</div>
            <p className="text-[11px] text-amber-700 mt-1 font-medium flex items-center gap-1">
              <span>2 High Swell • 1 Cyclonic • 2 Geofence</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardHeader className="p-3.5 pb-1 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vessels Under Radar</CardTitle>
            <Navigation className="h-4 w-4 text-cyan-700" />
          </CardHeader>
          <CardContent className="p-3.5 pt-0">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">128 Craft</div>
            <p className="text-[11px] text-cyan-800 mt-1 font-medium">
              42 Trawlers • 76 Artisanal • 10 Patrol
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardHeader className="p-3.5 pb-1 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monitored Sectors</CardTitle>
            <MapPin className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-3.5 pt-0">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">14 Sectors</div>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">
              Malabar, Gulf of Mannar & Laccadive
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardHeader className="p-3.5 pb-1 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Advisories Synthesized</CardTitle>
            <Activity className="h-4 w-4 text-purple-700" />
          </CardHeader>
          <CardContent className="p-3.5 pt-0">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">1,420 Today</div>
            <p className="text-[11px] text-purple-800 mt-1 font-medium">
              98.4% Resolution • 0 False Emergencies
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 3. Main Split Surface: Tactical Map (65%) + Live Telemetry Audit Stream (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Tactical Map Container */}
        <section className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-3 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Compass className="h-4 w-4 text-cyan-700" />
                Regional Tactical Ocean Map (Malabar & Laccadive Sea)
              </h2>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Multi-layer AIS feed overlaying thermal potential (Green = safe/PFZ, Red = hazard/surge).
              </CardDescription>
            </div>
            <Badge variant="outline" className="self-start sm:self-auto text-[11px] text-cyan-800 border-cyan-200 bg-cyan-50 font-mono">
              <Layers className="h-3 w-3 mr-1" /> Dual AIS & Thermal
            </Badge>
          </div>

          <LeafletMap
            center={REGIONAL_MAP_CENTER}
            zoom={8}
            className="h-[400px] w-full rounded-xl"
            markers={regionalMarkers}
            heatPoints={regionalHeatPoints}
          />
        </section>

        {/* Live Telemetry & Event Audit Stream (Admin-Only Real-Time Log) */}
        <Card className="bg-slate-950 border-slate-800 text-slate-100 shadow-md flex flex-col h-full">
          <CardHeader className="p-4 pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                <Terminal className="h-4 w-4 text-cyan-400" />
                Live Telemetry & Audit Log
              </CardTitle>
              <Badge variant="outline" className="bg-slate-900 border-slate-700 text-cyan-400 text-[10px] font-mono">
                Real-Time Stream
              </Badge>
            </div>
            <CardDescription className="text-[11px] text-slate-400 font-mono mt-0.5">
              Incoming AIS pings, INCOIS buoys, & agent dispatch events
            </CardDescription>
          </CardHeader>

          <CardContent className="p-3 space-y-2.5 flex-1 overflow-y-auto font-mono text-[11px] max-h-[380px] scrollbar-thin">
            {MOCK_TELEMETRY_LOGS.map((log) => (
              <div
                key={log.id}
                className={`p-2.5 rounded-lg border transition-all ${
                  log.level === "CRITICAL"
                    ? "bg-red-950/40 border-red-800/80 text-red-200"
                    : log.level === "WARN"
                    ? "bg-amber-950/40 border-amber-800/80 text-amber-200"
                    : "bg-slate-900/90 border-slate-800 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1 text-[10px]">
                  <span className="text-slate-400">{log.time}</span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] px-1.5 py-0 font-bold ${
                      log.level === "CRITICAL"
                        ? "bg-red-900 text-white border-red-700"
                        : log.level === "WARN"
                        ? "bg-amber-900 text-amber-100 border-amber-700"
                        : "bg-slate-800 text-cyan-300 border-slate-700"
                    }`}
                  >
                    {log.source}
                  </Badge>
                </div>
                <p className="leading-tight text-[11px]">{log.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 4. Sector Fleet Readiness & Response Matrix Table */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 p-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-700" />
                Sector Fleet Readiness & Response Matrix
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Operational status across all active coastal guard patrol command sectors
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200 font-mono text-slate-700">
              4 Sectors Active
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3 pl-4">Sector Name</th>
                <th className="p-3">Primary HQ</th>
                <th className="p-3">Active Craft</th>
                <th className="p-3">Sea Condition</th>
                <th className="p-3">Patrol Craft Assigned</th>
                <th className="p-3 pr-4 text-right">Response Readiness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              <tr className="hover:bg-slate-50/80">
                <td className="p-3 pl-4 font-bold text-slate-900">Sector Alpha (Kochi-Munambam)</td>
                <td className="p-3 text-slate-600 font-mono text-[11px]">Kochi Station HQ</td>
                <td className="p-3 font-mono text-slate-800 font-bold">54 Craft</td>
                <td className="p-3">
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">Moderate Swell (2.1m)</Badge>
                </td>
                <td className="p-3 text-slate-700 font-mono">ICGS Varaha (CG-402)</td>
                <td className="p-3 pr-4 text-right">
                  <span className="text-emerald-700 font-bold font-mono">LEVEL 1 (DEFCON 4)</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="p-3 pl-4 font-bold text-slate-900">Sector Bravo (Vizhinjam Deep Sea)</td>
                <td className="p-3 text-slate-600 font-mono text-[11px]">Vizhinjam Port HQ</td>
                <td className="p-3 font-mono text-slate-800 font-bold">38 Craft</td>
                <td className="p-3">
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">Calm (1.1m)</Badge>
                </td>
                <td className="p-3 text-slate-700 font-mono">ICGS Rajdoot (CG-108)</td>
                <td className="p-3 pr-4 text-right">
                  <span className="text-emerald-700 font-bold font-mono">LEVEL 1 (NORMAL)</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="p-3 pl-4 font-bold text-slate-900">Sector Charlie (Comorin Basin)</td>
                <td className="p-3 text-slate-600 font-mono text-[11px]">Kanyakumari Command</td>
                <td className="p-3 font-mono text-slate-800 font-bold">22 Craft</td>
                <td className="p-3">
                  <Badge className="bg-red-100 text-red-800 border-red-200 text-[10px]">Severe Surge (3.6m)</Badge>
                </td>
                <td className="p-3 text-slate-700 font-mono">ICGS Samar (CG-301)</td>
                <td className="p-3 pr-4 text-right">
                  <span className="text-red-700 font-bold font-mono">LEVEL 3 (EMERGENCY)</span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/80">
                <td className="p-3 pl-4 font-bold text-slate-900">Sector Delta (Lakshadweep Channel)</td>
                <td className="p-3 text-slate-600 font-mono text-[11px]">Kavaratti Outpost</td>
                <td className="p-3 font-mono text-slate-800 font-bold">14 Craft</td>
                <td className="p-3">
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">Moderate Current</Badge>
                </td>
                <td className="p-3 text-slate-700 font-mono">ICGS C-441 Fast Patrol</td>
                <td className="p-3 pr-4 text-right">
                  <span className="text-emerald-700 font-bold font-mono">LEVEL 1 (NORMAL)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
