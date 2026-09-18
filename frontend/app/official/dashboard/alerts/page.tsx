"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  Filter,
  MapPin,
  Radio,
  Send,
  CheckCircle2,
  Clock,
  Search,
  Globe,
  PlusCircle,
  FileCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CommandAlert {
  id: string;
  title: string;
  severity: "CRITICAL" | "MODERATE" | "INFORMATIONAL";
  category: "Weather" | "Cyclone" | "Geofence" | "PFZ";
  location: string;
  coordinates: string;
  sensorReadout: string;
  description: string;
  targetSector: string;
  craftAffected: number;
  multilingual: string[];
  ackRate: string;
  dispatcher: string;
  timestamp: string;
  dispatchStatus: "Broadcast Dispatched" | "Pending Approval" | "Active Monitoring";
}

const SAMPLE_COMMAND_ALERTS: CommandAlert[] = [
  {
    id: "CMD-801",
    title: "Severe Swell Surge & Wave Height Advisory (>3.6m)",
    severity: "CRITICAL",
    category: "Weather",
    location: "Kochi-Munambam Deep Offshore (Sector 4)",
    coordinates: "09.97°N - 10.15°N, 76.05°E - 76.18°E",
    sensorReadout: "INCOIS Buoy CB-02: Wave 3.6m, Period 14.2s, Wind 52 km/h",
    description: "Multi-point swell surge detected by INCOIS buoy array. Deep sea artisanal craft instructed to return to harbour immediately.",
    targetSector: "Sector Alpha & Delta",
    craftAffected: 42,
    multilingual: ["Malayalam", "Tamil", "English"],
    ackRate: "94.2% (134 Receipts)",
    dispatcher: "Cmdr. R. Sharma (HQ)",
    timestamp: "10 mins ago",
    dispatchStatus: "Broadcast Dispatched",
  },
  {
    id: "CMD-802",
    title: "Tropical Depression System Warning (Comorin Basin)",
    severity: "CRITICAL",
    category: "Cyclone",
    location: "South Kerala Coast & Gulf of Mannar",
    coordinates: "08.10°N - 09.20°N, 76.80°E - 78.10°E",
    sensorReadout: "ISRO Satellite Telemetry: Press. 998 hPa, Gusts 65 km/h",
    description: "Depression forming 180nm SSE. Wind gusts exceeding 65 km/h. Coastal control room broadcast active on VHF Ch 16.",
    targetSector: "South Maritime Zones",
    craftAffected: 78,
    multilingual: ["Tamil", "Malayalam", "Hindi"],
    ackRate: "88.6% (210 Receipts)",
    dispatcher: "Off. A. Roy (Duty Officer)",
    timestamp: "35 mins ago",
    dispatchStatus: "Broadcast Dispatched",
  },
  {
    id: "CMD-803",
    title: "International Boundary Line Buffer Proximity Trigger",
    severity: "MODERATE",
    category: "Geofence",
    location: "IMBL Sector Echo (22.5 nm Offshore)",
    coordinates: "09.85°N, 76.05°E (Radius 2.0nm)",
    sensorReadout: "Radar Target Tracking: 3 Trawlers at 1.8nm IMBL distance",
    description: "Automated geofence alert: 3 registered trawlers approaching 2nm buffer boundary line. Warning audio pushed to onboard transponders.",
    targetSector: "IMBL Buffer Sector E",
    craftAffected: 3,
    multilingual: ["Malayalam", "English"],
    ackRate: "100% (3 Receipts)",
    dispatcher: "Auto-Geofence Agent",
    timestamp: "1.2 hours ago",
    dispatchStatus: "Active Monitoring",
  },
  {
    id: "CMD-804",
    title: "High Chlorophyll Density Satellite PFZ Update",
    severity: "INFORMATIONAL",
    category: "PFZ",
    location: "Chellanam Shelf (14nm SW)",
    coordinates: "09.70°N, 76.20°E",
    sensorReadout: "MODIS Satellite Chlorophyll: 4.8 mg/m³ (Sardine Cluster)",
    description: "Satellite ocean color data confirms high sardine cluster. Advisory published to fisherman app with GPS waypoints.",
    targetSector: "Coastal Artisanal Fleet",
    craftAffected: 110,
    multilingual: ["Malayalam", "Tamil"],
    ackRate: "91.0% (100 Receipts)",
    dispatcher: "Supv. V. Nair (Analyst)",
    timestamp: "3 hours ago",
    dispatchStatus: "Broadcast Dispatched",
  },
];

export default function OfficialLiveAlertsPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showDispatchForm, setShowDispatchForm] = useState(false);

  // New broadcast form state
  const [newTitle, setNewTitle] = useState("");
  const [newSector, setNewSector] = useState("Sector Alpha (Kochi)");
  const [newSeverity, setNewSeverity] = useState("CRITICAL");
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const filteredAlerts = SAMPLE_COMMAND_ALERTS.filter((a) => {
    const matchesFilter =
      selectedFilter === "All" ||
      a.severity === selectedFilter ||
      a.category === selectedFilter;
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateBroadcast = () => {
    if (!newTitle.trim()) return;
    setDispatchSuccess(true);
    setTimeout(() => {
      setDispatchSuccess(false);
      setShowDispatchForm(false);
      setNewTitle("");
    }, 2000);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Title Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-800 text-[11px] font-semibold mb-2 shadow-sm font-mono">
            <ShieldAlert className="h-3 w-3 text-red-600" />
            Official Emergency Broadcast & Hazard Dispatch Console
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Live Coastal Hazard Alerts
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            Full-width regional hazard warning log, automated sensor trigger telemetry, and emergency broadcast controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setShowDispatchForm(!showDispatchForm)}
            className="bg-red-700 hover:bg-red-600 text-white font-bold text-xs shadow-sm flex items-center gap-2 h-9 px-4"
          >
            <PlusCircle className="h-4 w-4" />
            {showDispatchForm ? "Close Dispatch Console" : "New Broadcast Advisory"}
          </Button>
        </div>
      </section>

      {/* Admin Broadcast Dispatch Console Form (Shown on Toggle) */}
      {showDispatchForm && (
        <Card className="bg-slate-900 text-white border-slate-800 shadow-md animate-in fade-in duration-200">
          <CardHeader className="p-4 pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                <Radio className="h-4 w-4 text-red-400 animate-pulse" />
                Dispatch Regional Emergency Warning Advisory
              </CardTitle>
              <Badge variant="outline" className="bg-red-950 text-red-400 border-red-800 text-[10px] font-mono">
                Level 3 Operator Command
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {dispatchSuccess && (
              <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Emergency Advisory successfully dispatched via Bhashini Multilingual API & VHF Radio!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="text-xs font-mono text-slate-300 block mb-1">Advisory Title / Hazard Warning</label>
                <Input
                  placeholder="e.g. High Swell Surge Warning — Deep Sea Ban Sector 4"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-xs text-white h-9 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Target Coastal Sector</label>
                <select
                  value={newSector}
                  onChange={(e) => setNewSector(e.target.value)}
                  className="w-full text-xs border border-slate-800 bg-slate-950 rounded-lg p-2.5 text-white font-mono h-9"
                >
                  <option value="Sector Alpha (Kochi)">Sector Alpha (Kochi-Munambam)</option>
                  <option value="South Kerala">South Kerala Coast</option>
                  <option value="IMBL Buffer">IMBL Buffer Zone</option>
                  <option value="Lakshadweep">Lakshadweep Channel</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">
                Auto-translates to Malayalam, Tamil & Hindi via Bhashini Engine
              </div>
              <Button
                onClick={handleCreateBroadcast}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs h-9 px-5 flex items-center gap-2"
              >
                <Send className="h-3.5 w-3.5" />
                Dispatch Broadcast Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Severity Summary Bar */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-red-900 uppercase tracking-wider">Critical Warnings</div>
            <div className="text-xs text-red-700 mt-0.5">Swell surge & cyclonic depressions</div>
          </div>
          <span className="text-3xl font-extrabold text-red-700 font-mono">2 Active</span>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">Moderate Caution</div>
            <div className="text-xs text-amber-700 mt-0.5">IMBL geofence buffer alerts</div>
          </div>
          <span className="text-3xl font-extrabold text-amber-700 font-mono">1 Active</span>
        </div>

        <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-sky-900 uppercase tracking-wider">Informational</div>
            <div className="text-xs text-sky-700 mt-0.5">PFZ ocean color & sardine zones</div>
          </div>
          <span className="text-3xl font-extrabold text-sky-700 font-mono">1 Active</span>
        </div>
      </section>

      {/* Filter & Search Controls */}
      <section className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by ID, sector, or warning..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs bg-slate-50 border-slate-200 h-8"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <Filter className="h-3.5 w-3.5 text-slate-500 shrink-0 mr-1" />
          {["All", "CRITICAL", "MODERATE", "INFORMATIONAL", "Weather", "Cyclone", "Geofence", "PFZ"].map((chip) => (
            <button
              key={chip}
              onClick={() => setSelectedFilter(chip)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                selectedFilter === chip
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </section>

      {/* Dense Operator Alert Logbook */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isCrit = alert.severity === "CRITICAL";
          const isMod = alert.severity === "MODERATE";

          return (
            <Card
              key={alert.id}
              className={`shadow-sm overflow-hidden border ${
                isCrit
                  ? "border-l-4 border-l-red-600 bg-white border-slate-200"
                  : isMod
                  ? "border-l-4 border-l-amber-500 bg-white border-slate-200"
                  : "border-l-4 border-l-sky-500 bg-white border-slate-200"
              }`}
            >
              <CardHeader className="p-4 pb-2 border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`text-[10px] font-mono font-bold ${
                        isCrit ? "bg-red-600 text-white" : isMod ? "bg-amber-600 text-white" : "bg-sky-600 text-white"
                      }`}
                    >
                      {alert.severity}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] text-slate-700 border-slate-300 font-mono">
                      {alert.category}
                    </Badge>
                    <span className="text-[11px] font-mono font-bold text-slate-900">ID: {alert.id}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                    <span>Dispatched by: <strong className="text-slate-800">{alert.dispatcher}</strong></span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
                <CardTitle className="text-base font-bold text-slate-900 mt-2">{alert.title}</CardTitle>
              </CardHeader>

              <CardContent className="p-4 space-y-3 text-xs">
                {/* Geolocation & Telemetry Grid (Admin Sensor Readouts) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 font-mono text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-cyan-700 shrink-0" />
                    <span><strong>Sector:</strong> {alert.location}</span>
                  </div>
                  <div className="text-slate-600">
                    <strong>Bounds:</strong> {alert.coordinates}
                  </div>
                  <div className="md:col-span-2 text-slate-800 font-bold bg-white p-1.5 rounded border border-slate-200 text-[11px]">
                    <strong>Raw Sensor Readout:</strong> {alert.sensorReadout}
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed text-xs">{alert.description}</p>

                {/* Multilingual & Dispatch Audit Footer */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-500">Multilingual Broadcasts:</span>
                    {alert.multilingual.map((lang) => (
                      <span key={lang} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                        {lang}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">ACK Delivery Rate: <strong className="text-emerald-700">{alert.ackRate}</strong></span>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                      {alert.dispatchStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
