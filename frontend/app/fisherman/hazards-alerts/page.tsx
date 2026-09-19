"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  ShieldCheck,
  RefreshCw,
  Info,
  Filter,
  CheckCircle2,
  AlertTriangle,
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

  // Fetch live backend query/broadcast updates
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/broadcasts");
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
    <div className="space-y-6 pb-12 text-slate-900 max-w-7xl mx-auto px-4 md:px-6 pt-4">
      {/* Page Header Banner */}
      <section className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 text-white border border-slate-800/20 p-6 md:p-8 shadow-md overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-amber-200 text-xs font-semibold mb-3">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-300" />
              Real-time Coastal Safety & Hazard Feed
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Hazards & Alerts
            </h1>
            <p className="text-slate-200 text-sm md:text-base mt-1 max-w-2xl">
              Live weather advisories, cyclone alerts, geofencing boundary warnings, and potential fishing zone notifications for coastal fishermen.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={isLoading}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs flex items-center gap-1.5 backdrop-blur"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh Feed</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Filter Chips Bar */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0 mr-2">
          <Filter className="h-3.5 w-3.5 text-cyan-700" />
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
                  ? "bg-cyan-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Alert List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <span className="font-bold text-slate-900">{filteredAlerts.length}</span> active advisories
            </span>
            <span>Category: <span className="text-cyan-700 font-semibold">{selectedCategory}</span></span>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 space-y-2 shadow-sm">
              <Info className="h-8 w-8 text-cyan-600 mx-auto opacity-70" />
              <p className="text-sm font-medium">No alerts matching category "{selectedCategory}".</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isHigh = alert.severity === "High";
              const isMedium = alert.severity === "Medium";

              const borderClass = isHigh
                ? "border-l-4 border-l-red-500 bg-red-50/40 border-slate-200"
                : isMedium
                ? "border-l-4 border-l-amber-500 bg-amber-50/40 border-slate-200"
                : "border-l-4 border-l-sky-500 bg-sky-50/40 border-slate-200";

              const badgeClass = isHigh
                ? "bg-red-600 text-white"
                : isMedium
                ? "bg-amber-600 text-white"
                : "bg-sky-600 text-white";

              return (
                <Card
                  key={alert.id}
                  className={`border shadow-sm transition-all hover:shadow-md bg-white ${borderClass}`}
                >
                  <CardContent className="p-4 md:p-5 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-[10px] font-bold uppercase ${badgeClass}`}>
                          {alert.severity} Priority
                        </Badge>
                        <Badge variant="secondary" className="bg-slate-100 border-slate-200 text-slate-600 text-[10px]">
                          {alert.category}
                        </Badge>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{alert.timestamp}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 tracking-tight">{alert.title}</h3>

                    <div className="flex items-center gap-1.5 text-xs text-cyan-700 font-medium">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{alert.location}</span>
                    </div>

                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed pt-1">
                      {alert.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
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
          {/* Sidebar Alert Summary Card */}
          <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
                Alert Summary
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Breakdown of active advisories by severity rating
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {/* High Chip */}
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex flex-col items-center text-center">
                  <span className="text-xl font-extrabold text-red-700">{highCount}</span>
                  <span className="text-[11px] font-semibold text-red-900 mt-0.5">High</span>
                </div>

                {/* Moderate Chip */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center text-center">
                  <span className="text-xl font-extrabold text-amber-700">{mediumCount}</span>
                  <span className="text-[11px] font-semibold text-amber-900 mt-0.5">Moderate</span>
                </div>

                {/* Info Chip */}
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex flex-col items-center text-center">
                  <span className="text-xl font-extrabold text-sky-700">{lowCount}</span>
                  <span className="text-[11px] font-semibold text-sky-900 mt-0.5">Info</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                <span>Total Active Entries:</span>
                <span className="font-bold text-slate-900">{alerts.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Safety Status Card */}
          <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Overall Safety Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div
                className={`p-4 rounded-xl border flex items-center gap-3 ${
                  isHazardActive
                    ? "bg-red-50 border-red-300 text-red-950"
                    : "bg-emerald-50 border-emerald-300 text-emerald-950"
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
                  <div className="font-extrabold text-sm text-slate-900">
                    {isHazardActive ? "HAZARD ACTIVE - EXERCISE CAUTION" : "NO IMMEDIATE DANGER"}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {isHazardActive
                      ? "High severity sea swells or squalls detected. Review active warnings before sailing."
                      : "Coastal waters off Kochi are clear of major severe warnings."}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex justify-between pt-1 font-mono">
                <span>Last updated: {lastUpdated || "Just now"}</span>
                <span className="text-emerald-700 font-semibold font-sans">Sensors Live</span>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Emergency Contacts Card */}
          <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PhoneCall className="h-5 w-5 text-red-600" />
                Emergency Contacts
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Tap to dial directly on mobile devices
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {/* Contact 1 */}
              <a
                href="tel:1554"
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-red-300 hover:bg-red-50/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-100 text-red-700 group-hover:scale-110 transition-transform">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 group-hover:text-red-900">
                      Indian Coast Guard Emergency
                    </div>
                    <div className="text-xs text-slate-500">Toll-Free Search & Rescue</div>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-red-700 bg-red-100 px-2.5 py-1 rounded-lg border border-red-200">
                  1554
                </span>
              </a>

              {/* Contact 2 */}
              <a
                href="tel:04842666011"
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-100 text-cyan-700 group-hover:scale-110 transition-transform">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 group-hover:text-cyan-900">
                      Kochi Marine Control Room
                    </div>
                    <div className="text-xs text-slate-500">Harbor & Coastal Patrol</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-cyan-700 bg-cyan-100 px-2.5 py-1 rounded-lg border border-cyan-200">
                  0484-2666011
                </span>
              </a>

              {/* Contact 3 */}
              <a
                href="tel:1077"
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 group-hover:scale-110 transition-transform">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 group-hover:text-amber-900">
                      Disaster Helpline
                    </div>
                    <div className="text-xs text-slate-500">District Emergency Center</div>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200">
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
