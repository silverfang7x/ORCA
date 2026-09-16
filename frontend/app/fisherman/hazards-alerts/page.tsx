"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  PhoneCall,
  Waves,
  Wind,
  Compass,
  MapPin,
  ShieldCheck,
  RefreshCw,
  Info,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface HazardAlertItem {
  id: string;
  title: string;
  category: "Weather" | "Cyclone" | "Fishing Zones" | "Geofencing" | "Tide";
  severity: "High" | "Medium" | "Low";
  location: string;
  description: string;
  timestamp: string;
  source: string;
}

const SAMPLE_ALERTS: HazardAlertItem[] = [
  {
    id: "alert-1",
    title: "High Swell Wave & Rough Sea Warning",
    category: "Weather",
    severity: "High",
    location: "Kochi-Munambam Sector (0–15 nm)",
    description:
      "Swell waves between 2.4m and 3.1m expected with rough sea conditions. Small motorized boats advised to stay within 8 nautical miles.",
    timestamp: "12 mins ago",
    source: "INCOIS Marine Forecast",
  },
  {
    id: "alert-2",
    title: "Squally Weather Advisory & Wind Gusts",
    category: "Cyclone",
    severity: "High",
    location: "South Kerala Coast",
    description:
      "Wind speeds reaching 35-45 km/h gusting to 55 km/h associated with depression system off Comorin area. Deep sea fishing prohibited.",
    timestamp: "45 mins ago",
    source: "IMD Cyclone Warning Bulletin",
  },
  {
    id: "alert-3",
    title: "High Potential Fishing Zone (PFZ) Satellite Advisory",
    category: "Fishing Zones",
    severity: "Low",
    location: "14.2 nm SW of Kochi Port",
    description:
      "Satellite SST & Chlorophyll overlay indicates high pelagic fish aggregation (Sardine & Mackerel cluster). Sea surface calm.",
    timestamp: "1.5 hours ago",
    source: "INCOIS Satellite Remote Sensing",
  },
  {
    id: "alert-4",
    title: "Maritime Boundary Proximity Advisory",
    category: "Geofencing",
    severity: "Medium",
    location: "International Boundary Buffer (Sector E)",
    description:
      "Automated geofencing alert: Maintain minimum 5 nautical miles distance from restricted international maritime boundary line.",
    timestamp: "3 hours ago",
    source: "Turf.js GeoJSON Geofencing Engine",
  },
  {
    id: "alert-5",
    title: "High Tide & Ebbing Surge Warning",
    category: "Tide",
    severity: "Medium",
    location: "Fort Kochi Entrance Channel",
    description:
      "High spring tide peaking at 1.4m @ 14:30 IST resulting in strong ebbing current surge (1.2 knots). Exercise caution while docking.",
    timestamp: "5 hours ago",
    source: "National Hydrographic Office",
  },
];

const FILTER_CATEGORIES = ["All", "Weather", "Cyclone", "Fishing Zones", "Geofencing", "Tide"] as const;

export default function FishermanHazardsAlertsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [alerts, setAlerts] = useState<HazardAlertItem[]>(SAMPLE_ALERTS);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }, []);

  // Fetch live backend query/broadcast updates if available
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/broadcasts`);
      if (res.ok) {
        const broadcasts = await res.json();
        if (Array.isArray(broadcasts) && broadcasts.length > 0) {
          const mapped: HazardAlertItem[] = broadcasts.map((b: any, idx: number) => ({
            id: `broadcast-${idx}`,
            title: b.type || "Broadcast Advisory",
            category: (b.type?.includes("Weather") ? "Weather" : "Geofencing") as any,
            severity: b.severity || "Medium",
            location: b.region || "Coastal Sector",
            description: b.message || "Official broadcast message from maritime authority.",
            timestamp: "Just now",
            source: "Official Broadcast Feed",
          }));
          setAlerts([...mapped, ...SAMPLE_ALERTS]);
        }
      }
    } catch (err) {
      console.warn("[HazardsAlerts] Broadcast fetch fallback to default alerts:", err);
    } finally {
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setIsLoading(false);
    }
  };

  // Filtered alert list
  const filteredAlerts = alerts.filter(
    (alert) => selectedCategory === "All" || alert.category === selectedCategory
  );

  // Severity counts
  const highCount = alerts.filter((a) => a.severity === "High").length;
  const mediumCount = alerts.filter((a) => a.severity === "Medium").length;
  const lowCount = alerts.filter((a) => a.severity === "Low").length;

  const isHazardActive = highCount > 0;

  return (
    <div className="space-y-6 pb-12 text-slate-100 max-w-7xl mx-auto px-4 md:px-6 pt-4">
      {/* Page Header */}
      <section className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/40 border border-amber-700/50 text-amber-300 text-xs font-semibold mb-3">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
              Real-time Coastal Safety & Hazard Feed
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Hazards & Alerts
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-1 max-w-2xl">
              Live weather advisories, cyclone alerts, geofencing boundary warnings, and potential fishing zone notifications for coastal fishermen.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={isLoading}
              className="bg-slate-900/80 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh Feed</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Filter Chips Bar */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-2">
          <Filter className="h-3.5 w-3.5 text-cyan-400" />
          Filter Alerts:
        </span>
        {FILTER_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                isActive
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                  : "bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </section>

      {/* Main Grid: Left 2 Cols (Alert List), Right 1 Col (Sidebar Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Alert List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <span className="font-bold text-white">{filteredAlerts.length}</span> active advisories
            </span>
            <span>Category: <span className="text-cyan-400 font-semibold">{selectedCategory}</span></span>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 space-y-2">
              <Info className="h-8 w-8 text-cyan-400 mx-auto opacity-70" />
              <p className="text-sm font-medium">No alerts matching category "{selectedCategory}".</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              // Severity styling logic
              const isHigh = alert.severity === "High";
              const isMedium = alert.severity === "Medium";

              const borderClass = isHigh
                ? "border-l-4 border-l-red-500 border-slate-800 bg-slate-900/90"
                : isMedium
                ? "border-l-4 border-l-amber-500 border-slate-800 bg-slate-900/90"
                : "border-l-4 border-l-cyan-500 border-slate-800 bg-slate-900/90";

              const badgeVariant = isHigh
                ? "bg-red-950/80 border-red-500/60 text-red-400"
                : isMedium
                ? "bg-amber-950/80 border-amber-500/60 text-amber-400"
                : "bg-cyan-950/80 border-cyan-500/60 text-cyan-300";

              return (
                <Card
                  key={alert.id}
                  className={`border shadow-md transition-all hover:border-slate-700 ${borderClass}`}
                >
                  <CardContent className="p-4 md:p-5 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] font-bold uppercase ${badgeVariant}`}>
                          {alert.severity} Priority
                        </Badge>
                        <Badge variant="secondary" className="bg-slate-950 border-slate-800 text-slate-400 text-[10px]">
                          {alert.category}
                        </Badge>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">{alert.timestamp}</span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">{alert.title}</h3>

                    <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{alert.location}</span>
                    </div>

                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed pt-1">
                      {alert.description}
                    </p>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Source: {alert.source}</span>
                      <span className="text-slate-400">ID: {alert.id}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* 3. Sidebar Alert Summary Card */}
          <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-400" />
                Alert Summary
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Breakdown of active advisories by severity rating
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {/* High Chip */}
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 flex flex-col items-center text-center">
                  <span className="text-xl font-extrabold text-red-400">{highCount}</span>
                  <span className="text-[11px] font-semibold text-red-300 mt-0.5">High</span>
                </div>

                {/* Moderate Chip */}
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 flex flex-col items-center text-center">
                  <span className="text-xl font-extrabold text-amber-400">{mediumCount}</span>
                  <span className="text-[11px] font-semibold text-amber-300 mt-0.5">Moderate</span>
                </div>

                {/* Info Chip */}
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/50 flex flex-col items-center text-center">
                  <span className="text-xl font-extrabold text-cyan-400">{lowCount}</span>
                  <span className="text-[11px] font-semibold text-cyan-300 mt-0.5">Info</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
                <span>Total Active Entries:</span>
                <span className="font-bold text-white">{alerts.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* 4. Sidebar Safety Status Card */}
          <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                Overall Safety Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className={`p-4 rounded-xl border flex items-center gap-3 ${
                  isHazardActive
                    ? "bg-red-950/50 border-red-500/80 text-red-200"
                    : "bg-emerald-950/50 border-emerald-500/80 text-emerald-200"
                }`}
              >
                <div
                  className={`p-2.5 rounded-full shrink-0 ${
                    isHazardActive ? "bg-red-600 text-white animate-pulse" : "bg-emerald-600 text-white"
                  }`}
                >
                  {isHazardActive ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                </div>
                <div>
                  <div className="font-extrabold text-sm text-white">
                    {isHazardActive ? "HAZARD ACTIVE - EXERCISE CAUTION" : "NO IMMEDIATE DANGER"}
                  </div>
                  <p className="text-xs opacity-90 mt-0.5">
                    {isHazardActive
                      ? "High severity sea swells or squalls detected. Review active warnings before sailing."
                      : "Coastal waters off Kochi are clear of major severe warnings."}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                <span>Last updated: {lastUpdated || "Just now"}</span>
                <span className="text-emerald-400 font-medium">Sensors Live</span>
              </div>
            </CardContent>
          </Card>

          {/* 5. Sidebar Emergency Contacts Card (Mobile Dialable tel: Links) */}
          <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <PhoneCall className="h-5 w-5 text-red-400" />
                Emergency Contacts
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Tap to dial directly on mobile devices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Contact 1: Coast Guard Emergency */}
              <a
                href="tel:1554"
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-red-500/60 hover:bg-red-950/20 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-900/40 text-red-400 group-hover:scale-110 transition-transform">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white group-hover:text-red-300">
                      Indian Coast Guard Emergency
                    </div>
                    <div className="text-xs text-slate-400">Toll-Free Search & Rescue</div>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-red-400 bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-900">
                  1554
                </span>
              </a>

              {/* Contact 2: Local Control Room */}
              <a
                href="tel:04842666011"
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/60 hover:bg-cyan-950/20 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-900/40 text-cyan-400 group-hover:scale-110 transition-transform">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white group-hover:text-cyan-300">
                      Kochi Marine Control Room
                    </div>
                    <div className="text-xs text-slate-400">Harbor & Coastal Patrol</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-900">
                  0484-2666011
                </span>
              </a>

              {/* Contact 3: State Disaster Management */}
              <a
                href="tel:1077"
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/60 hover:bg-amber-950/20 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-900/40 text-amber-400 group-hover:scale-110 transition-transform">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white group-hover:text-amber-300">
                      Disaster Helpline
                    </div>
                    <div className="text-xs text-slate-400">District Emergency Center</div>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-900">
                  1077
                </span>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
