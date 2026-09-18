"use client";

import { useState } from "react";
import {
  Navigation,
  Anchor,
  Radio,
  Search,
  Filter,
  ShieldAlert,
  AlertTriangle,
  MoreVertical,
  RadioTower,
  Send,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VesselTrackItem {
  id: string;
  name: string;
  regId: string;
  mmsi: string;
  port: string;
  type: "Artisanal Motorized" | "Deep Sea Trawler" | "Patrol Craft" | "Cargo/Tanker";
  lengthMeters: number;
  lat: number;
  lng: number;
  speedKnots: number;
  heading: string;
  cpaNm: number;
  lastPing: string;
  signalQuality: string;
  compliance: "Verified" | "Pending Audit" | "Licence Warning";
  contact: string;
  status: "Normal Operations" | "Near Boundary" | "Distress SOS Active" | "Anchored";
}

const SAMPLE_VESSELS: VesselTrackItem[] = [
  {
    id: "VES-101",
    name: "St. Mary IND-KL-02",
    regId: "KL-02-104",
    mmsi: "419001042",
    port: "Munambam Harbour",
    type: "Artisanal Motorized",
    lengthMeters: 12.5,
    lat: 9.975,
    lng: 76.18,
    speedKnots: 6.2,
    heading: "WSW (240°)",
    cpaNm: 4.8,
    lastPing: "42s ago",
    signalQuality: "98% (High)",
    compliance: "Verified",
    contact: "+91-98470-11204 (Ch 16)",
    status: "Normal Operations",
  },
  {
    id: "VES-102",
    name: "Ocean Queen II",
    regId: "KL-07-889",
    mmsi: "419007889",
    port: "Kochi Fisheries Port",
    type: "Deep Sea Trawler",
    lengthMeters: 24.0,
    lat: 9.85,
    lng: 76.05,
    speedKnots: 8.5,
    heading: "SW (225°)",
    cpaNm: 1.8,
    lastPing: "12s ago",
    signalQuality: "94% (High)",
    compliance: "Verified",
    contact: "+91-94471-88902 (Ch 16)",
    status: "Near Boundary",
  },
  {
    id: "VES-103",
    name: "ICGS Varaha Patrol 402",
    regId: "CG-402",
    mmsi: "419000402",
    port: "Coast Guard Command HQ",
    type: "Patrol Craft",
    lengthMeters: 45.0,
    lat: 9.88,
    lng: 76.12,
    speedKnots: 14.0,
    heading: "NW (315°)",
    cpaNm: 9.2,
    lastPing: "5s ago",
    signalQuality: "100% (Military)",
    compliance: "Verified",
    contact: "VHF Tactical Ch 68",
    status: "Normal Operations",
  },
  {
    id: "VES-104",
    name: "Sea King Munambam",
    regId: "KL-02-450",
    mmsi: "419002450",
    port: "Munambam Harbour",
    type: "Artisanal Motorized",
    lengthMeters: 10.8,
    lat: 9.9312,
    lng: 76.2673,
    speedKnots: 0.0,
    heading: "N (0°)",
    cpaNm: 12.0,
    lastPing: "2 mins ago",
    signalQuality: "85% (Medium)",
    compliance: "Verified",
    contact: "+91-98460-45091",
    status: "Anchored",
  },
  {
    id: "VES-105",
    name: "Kochi Fisheries Trawler #12",
    regId: "KL-07-302",
    mmsi: "419003301",
    port: "Kochi Fisheries Port",
    type: "Deep Sea Trawler",
    lengthMeters: 28.5,
    lat: 9.7,
    lng: 76.2,
    speedKnots: 4.1,
    heading: "S (180°)",
    cpaNm: 2.1,
    lastPing: "1 min ago",
    signalQuality: "90% (High)",
    compliance: "Pending Audit",
    contact: "+91-94462-30219",
    status: "Normal Operations",
  },
  {
    id: "VES-106",
    name: "Matsya Kanya III",
    regId: "KL-04-118",
    mmsi: "419004118",
    port: "Vizhinjam Port",
    type: "Deep Sea Trawler",
    lengthMeters: 22.0,
    lat: 8.38,
    lng: 76.98,
    speedKnots: 7.8,
    heading: "SE (135°)",
    cpaNm: 5.4,
    lastPing: "18s ago",
    signalQuality: "96% (High)",
    compliance: "Licence Warning",
    contact: "+91-98475-11844",
    status: "Normal Operations",
  },
];

export default function OfficialVesselTrackingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedVesselAction, setSelectedVesselAction] = useState<string | null>(null);

  const filteredVessels = SAMPLE_VESSELS.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.regId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.mmsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.port.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    const matchesType = typeFilter === "All" || v.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const triggerDirectAlert = (name: string, regId: string) => {
    setSelectedVesselAction(`Direct VHF advisory sent to ${name} (${regId})`);
    setTimeout(() => {
      setSelectedVesselAction(null);
    }, 3000);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Title Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-semibold mb-2 shadow-sm font-mono">
            <Navigation className="h-3 w-3 text-cyan-700" />
            Coastal Automatic Identification System (AIS) Command Console
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Vessel Tracking & Fleet Registry
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            Real-time GPS telemetry, vessel registration registry, speed metrics, CPA proximity alerts, and emergency contact channels.
          </p>
        </div>

        <div className="flex items-center gap-2.5 font-mono">
          <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800 px-3 py-1.5 text-xs flex items-center gap-1.5">
            <RadioTower className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            128 Vessels Tracked
          </Badge>
        </div>
      </section>

      {/* Action Notification Banner */}
      {selectedVesselAction && (
        <div className="p-3 bg-cyan-50 border border-cyan-300 text-cyan-900 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-cyan-700 shrink-0" />
          {selectedVesselAction}
        </div>
      )}

      {/* Fleet Sector Summary Stat Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100">
              <Anchor className="h-4 w-4" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-900 font-mono">42 Deep Sea</div>
              <div className="text-[11px] text-slate-500 font-medium">Commercial Trawlers</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
              <Navigation className="h-4 w-4" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-900 font-mono">76 Artisanal</div>
              <div className="text-[11px] text-slate-500 font-medium">Motorized Small Craft</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-900 font-mono">10 Patrol</div>
              <div className="text-[11px] text-slate-500 font-medium">Coast Guard Vessels</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-amber-700 font-mono">2 Incursions</div>
              <div className="text-[11px] text-slate-500 font-medium">Near IMBL Boundary</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multi-Filter & Search Controls Bar */}
      <section className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search vessel name, MMSI, or reg ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-slate-50 border-slate-200 text-xs text-slate-900 h-8 font-mono"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 font-mono">
              <Filter className="h-3.5 w-3.5 text-cyan-700" />
              Status Filter:
            </span>
            {["All", "Normal Operations", "Near Boundary", "Distress SOS Active", "Anchored"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono shrink-0 ${
                  statusFilter === s
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* High-Density 10-Column Fleet Registry Table */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 p-4 pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Anchor className="h-4 w-4 text-cyan-700" />
              Coastal Vessel Telemetry & Radar Registry
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Live AIS transponder data stream with CPA proximity alerts & radio callsigns
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-[10px] text-slate-700 border-slate-200 font-mono">
            Showing {filteredVessels.length} of {SAMPLE_VESSELS.length} Vessels
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3 pl-4">Vessel Name & MMSI</th>
                <th className="p-3">Port of Registry</th>
                <th className="p-3">Category & Length</th>
                <th className="p-3">GPS Position</th>
                <th className="p-3">Speed / Heading</th>
                <th className="p-3">IMBL CPA</th>
                <th className="p-3">Signal Quality</th>
                <th className="p-3">Compliance</th>
                <th className="p-3">Emergency Contact</th>
                <th className="p-3 pr-4 text-right">Direct Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredVessels.map((vessel) => {
                const isWarning = vessel.status === "Near Boundary";
                const isDistress = vessel.status === "Distress SOS Active";

                return (
                  <tr key={vessel.id} className="hover:bg-slate-50/90 transition-colors">
                    <td className="p-3 pl-4">
                      <div className="font-bold text-slate-900 text-xs">{vessel.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Reg: {vessel.regId} • MMSI: {vessel.mmsi}
                      </div>
                    </td>

                    <td className="p-3 font-mono text-[11px] text-slate-600">
                      {vessel.port}
                    </td>

                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px] text-slate-700 border-slate-200 font-mono">
                        {vessel.type} ({vessel.lengthMeters}m)
                      </Badge>
                    </td>

                    <td className="p-3 font-mono text-slate-700 text-[11px]">
                      {vessel.lat.toFixed(4)}°N, {vessel.lng.toFixed(4)}°E
                    </td>

                    <td className="p-3 font-mono text-[11px]">
                      <span className="font-bold text-slate-900">{vessel.speedKnots} kn</span>
                      <div className="text-[10px] text-slate-400">{vessel.heading}</div>
                    </td>

                    <td className="p-3 font-mono text-[11px]">
                      <span className={vessel.cpaNm < 2.0 ? "text-amber-700 font-bold" : "text-slate-600"}>
                        {vessel.cpaNm} nm
                      </span>
                    </td>

                    <td className="p-3 font-mono text-[10px] text-slate-500">
                      <div>{vessel.lastPing}</div>
                      <div className="text-emerald-700 font-bold">{vessel.signalQuality}</div>
                    </td>

                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={`text-[9px] px-1.5 py-0 font-mono ${
                          vessel.compliance === "Verified"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : vessel.compliance === "Pending Audit"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {vessel.compliance}
                      </Badge>
                    </td>

                    <td className="p-3 font-mono text-[10px] text-slate-600">
                      {vessel.contact}
                    </td>

                    <td className="p-3 pr-4 text-right">
                      <Button
                        onClick={() => triggerDirectAlert(vessel.name, vessel.regId)}
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10px] border-slate-200 hover:bg-cyan-50 hover:text-cyan-800 font-semibold"
                      >
                        <Send className="h-3 w-3 mr-1 text-cyan-700" />
                        Alert Vessel
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>

        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-mono">
          <div>Showing active AIS transponder targets for South-West Maritime Sector</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-[11px] border-slate-200" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px] border-slate-200" disabled>
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
