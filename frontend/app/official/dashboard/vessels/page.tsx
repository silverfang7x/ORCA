"use client";

import { useState } from "react";
import { Navigation, Anchor, Radio, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface VesselTrackItem {
  id: string;
  name: string;
  regId: string;
  type: "Artisanal Motorized" | "Deep Sea Trawler" | "Patrol Craft" | "Cargo/Tanker";
  lat: number;
  lng: number;
  speedKnots: number;
  heading: string;
  status: "Normal Operations" | "Near Boundary" | "Distress SOS Active" | "Anchored";
}

const SAMPLE_VESSELS: VesselTrackItem[] = [
  {
    id: "VES-101",
    name: "St. Mary IND-KL-02-MM-104",
    regId: "KL-02-104",
    type: "Artisanal Motorized",
    lat: 9.975,
    lng: 76.18,
    speedKnots: 6.2,
    heading: "WSW (240°)",
    status: "Normal Operations",
  },
  {
    id: "VES-102",
    name: "Ocean Queen II",
    regId: "KL-07-889",
    type: "Deep Sea Trawler",
    lat: 9.85,
    lng: 76.05,
    speedKnots: 8.5,
    heading: "SW (225°)",
    status: "Near Boundary",
  },
  {
    id: "VES-103",
    name: "ICGS Varaha Patrol 402",
    regId: "CG-402",
    type: "Patrol Craft",
    lat: 9.88,
    lng: 76.12,
    speedKnots: 14.0,
    heading: "NW (315°)",
    status: "Normal Operations",
  },
  {
    id: "VES-104",
    name: "Sea King Munambam",
    regId: "KL-02-450",
    type: "Artisanal Motorized",
    lat: 9.9312,
    lng: 76.2673,
    speedKnots: 0.0,
    heading: "N (0°)",
    status: "Anchored",
  },
  {
    id: "VES-105",
    name: "Kochi Fisheries Vessel #12",
    regId: "KL-07-302",
    type: "Deep Sea Trawler",
    lat: 9.7,
    lng: 76.2,
    speedKnots: 4.1,
    heading: "S (180°)",
    status: "Normal Operations",
  },
];

export default function OfficialVesselTrackingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredVessels = SAMPLE_VESSELS.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.regId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || v.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-semibold mb-2 shadow-sm">
            <Navigation className="h-3 w-3 text-cyan-700" />
            Coastal Automatic Identification System (AIS)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Vessel Tracking & Fleet Registry
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            Real-time GPS telemetry, vessel registration registry, speed metrics, and active maritime boundary alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 px-3 py-1 text-xs">
            128 Vessels Active
          </Badge>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by vessel name or reg ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-50 border-slate-200 text-xs text-slate-900 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="h-3.5 w-3.5 text-cyan-700" />
            Vessel Type:
          </span>
          {["All", "Artisanal Motorized", "Deep Sea Trawler", "Patrol Craft"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 ${
                typeFilter === t
                  ? "bg-cyan-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Vessel Tracking Table */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Anchor className="h-5 w-5 text-cyan-700" />
            Tracked Vessel Registry & Telemetry Table
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Live AIS telemetry data feed from coastal relay stations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5 pl-5">Vessel Name & Reg ID</th>
                <th className="p-3.5">Category Type</th>
                <th className="p-3.5">GPS Coordinates</th>
                <th className="p-3.5">Speed / Heading</th>
                <th className="p-3.5 pr-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredVessels.map((vessel) => {
                const isWarning = vessel.status === "Near Boundary";
                const isDistress = vessel.status === "Distress SOS Active";

                const badgeVariant = isDistress
                  ? "destructive"
                  : isWarning
                  ? "warning"
                  : "success";

                return (
                  <tr key={vessel.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-slate-900 text-xs">{vessel.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">Reg: {vessel.regId}</div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="outline" className="text-[10px] text-slate-600 border-slate-200">
                        {vessel.type}
                      </Badge>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 text-[11px]">
                      {vessel.lat.toFixed(4)}°N, {vessel.lng.toFixed(4)}°E
                    </td>
                    <td className="p-3.5 text-slate-700">
                      <span className="font-bold text-slate-900">{vessel.speedKnots} kn</span>
                      <span className="text-[10px] text-slate-400 ml-1">({vessel.heading})</span>
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <Badge variant={badgeVariant as any} className="text-[10px] px-2 py-0.5">
                        {vessel.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
