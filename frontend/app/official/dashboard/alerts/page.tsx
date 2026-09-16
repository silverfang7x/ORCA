"use client";

import { useState } from "react";
import { AlertTriangle, ShieldAlert, Filter, MapPin, Radio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CommandAlert {
  id: string;
  title: string;
  severity: "High" | "Medium" | "Low";
  category: "Weather" | "Cyclone" | "Geofence" | "PFZ";
  location: string;
  description: string;
  timestamp: string;
  dispatchStatus: "Broadcast Sent" | "Pending Approval" | "Active Monitoring";
}

const SAMPLE_COMMAND_ALERTS: CommandAlert[] = [
  {
    id: "CMD-801",
    title: "Severe Swell Surge & Wave Height Advisory (>3.2m)",
    severity: "High",
    category: "Weather",
    location: "Kochi-Munambam Deep Offshore (Sector 4)",
    description: "Multi-point swell surge detected by INCOIS buoy array. Deep sea artisanal craft instructed to return to harbour.",
    timestamp: "10 mins ago",
    dispatchStatus: "Broadcast Sent",
  },
  {
    id: "CMD-802",
    title: "Tropical Depression System Warning (Comorin Basin)",
    severity: "High",
    category: "Cyclone",
    location: "South Kerala Coast & Gulf of Mannar",
    description: "Depression forming 180nm SSE. Wind gusts exceeding 50 km/h. Coastal control room broadcast active.",
    timestamp: "35 mins ago",
    dispatchStatus: "Broadcast Sent",
  },
  {
    id: "CMD-803",
    title: "International Boundary Line Buffer Proximity Trigger",
    severity: "Medium",
    category: "Geofence",
    location: "IMBL Sector Echo (22.5 nm Offshore)",
    description: "Automated geofence alert: 3 registered trawlers approaching 2nm buffer boundary.",
    timestamp: "1.2 hours ago",
    dispatchStatus: "Active Monitoring",
  },
  {
    id: "CMD-804",
    title: "High Chlorophyll Density Satellite PFZ Update",
    severity: "Low",
    category: "PFZ",
    location: "Chellanam Shelf (14nm SW)",
    description: "Satellite ocean color data confirms high sardine cluster. Advisory published to fisherman app.",
    timestamp: "3 hours ago",
    dispatchStatus: "Broadcast Sent",
  },
];

export default function OfficialLiveAlertsPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const filtered = SAMPLE_COMMAND_ALERTS.filter(
    (a) => selectedFilter === "All" || a.severity === selectedFilter || a.category === selectedFilter
  );

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-800 text-[11px] font-semibold mb-2 shadow-sm">
            <ShieldAlert className="h-3 w-3 text-red-600" />
            Official Broadcast & Alert Registry
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Live Coastal Hazard Alerts
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            Full-width regional hazard warning log and emergency broadcast dispatch records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-red-600 text-white font-bold px-3 py-1 text-xs">
            2 High Severity Active
          </Badge>
        </div>
      </section>

      {/* Severity Breakdown Summary Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-red-900 uppercase">High Severity Warnings</div>
            <div className="text-xs text-red-700 mt-0.5">Immediate danger / Deep sea ban</div>
          </div>
          <span className="text-3xl font-extrabold text-red-700 font-mono">2</span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-amber-900 uppercase">Moderate Caution</div>
            <div className="text-xs text-amber-700 mt-0.5">Geofence buffer & channel surge</div>
          </div>
          <span className="text-3xl font-extrabold text-amber-700 font-mono">1</span>
        </div>

        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-sky-900 uppercase">Informational Broadcasts</div>
            <div className="text-xs text-sky-700 mt-0.5">PFZ ocean updates & daily weather</div>
          </div>
          <span className="text-3xl font-extrabold text-sky-700 font-mono">1</span>
        </div>
      </section>

      {/* Filter Chips Bar */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0 mr-2">
          <Filter className="h-3.5 w-3.5 text-cyan-700" />
          Filter Alerts:
        </span>
        {["All", "High", "Medium", "Low", "Weather", "Cyclone", "Geofence", "PFZ"].map((chip) => (
          <button
            key={chip}
            onClick={() => setSelectedFilter(chip)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              selectedFilter === chip
                ? "bg-cyan-700 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            {chip}
          </button>
        ))}
      </section>

      {/* Full Width Alert List */}
      <section className="space-y-4">
        {filtered.map((alert) => {
          const isHigh = alert.severity === "High";
          const isMed = alert.severity === "Medium";

          const borderClass = isHigh
            ? "border-l-4 border-l-red-500 bg-white border-slate-200"
            : isMed
            ? "border-l-4 border-l-amber-500 bg-white border-slate-200"
            : "border-l-4 border-l-sky-500 bg-white border-slate-200";

          const badgeClass = isHigh
            ? "bg-red-600 text-white"
            : isMed
            ? "bg-amber-600 text-white"
            : "bg-sky-600 text-white";

          return (
            <Card key={alert.id} className={`shadow-sm ${borderClass}`}>
              <CardContent className="p-5 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[10px] font-bold ${badgeClass}`}>
                      {alert.severity} Priority
                    </Badge>
                    <Badge variant="outline" className="text-[10px] text-slate-600 border-slate-200">
                      {alert.category}
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-400">ID: {alert.id}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{alert.timestamp}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{alert.title}</h3>

                <div className="flex items-center gap-1.5 text-xs text-cyan-700 font-medium">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{alert.location}</span>
                </div>

                <p className="text-xs md:text-sm text-slate-700 leading-relaxed pt-1">
                  {alert.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Dispatch Status:</span>
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                    <Radio className="h-3 w-3 mr-1 text-emerald-600 animate-pulse" />
                    {alert.dispatchStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
