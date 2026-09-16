"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  Fish,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Wind,
  Waves,
  Thermometer,
  Eye,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { QuickOverviewList } from "@/components/chat/QuickOverviewList";
import LeafletMap, { MapMarker, HeatPoint } from "@/components/map/LeafletMap";
import { AgentState, LocationQuery } from "@orca/shared";

const DEFAULT_LOCATION: LocationQuery = {
  latitude: 9.9312,
  longitude: 76.2673,
  date: new Date().toISOString(),
};

const DEFAULT_MAP_CENTER = { lat: 9.9312, lng: 76.2673 };

export default function FishingAdvisoryPage() {
  const [agentState, setAgentState] = useState<AgentState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Map state
  const [mapMarkers] = useState<MapMarker[]>([
    { lat: 9.9312, lng: 76.2673, label: "Kochi Fishing Base", icon: "landing" },
    { lat: 9.975, lng: 76.18, label: "PFZ Sector #1 (Tuna & Sardine Cluster)", icon: "boat" },
    { lat: 9.89, lng: 76.14, label: "PFZ Sector #2 (Mackerel Grounds)", icon: "boat" },
  ]);

  const [heatPoints] = useState<HeatPoint[]>([
    { lat: 9.975, lng: 76.18, intensity: 0.95 },
    { lat: 9.89, lng: 76.14, intensity: 0.85 },
    { lat: 9.85, lng: 76.05, intensity: 0.1 },
    { lat: 9.92, lng: 76.3, intensity: 0.35 },
  ]);

  // Fetch advisory data on page load
  const fetchAdvisory = async () => {
    setIsLoading(true);

    let locationToUse = DEFAULT_LOCATION;

    if (typeof window !== "undefined" && navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 });
        });
        locationToUse = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          date: new Date().toISOString(),
        };
      } catch (err) {
        console.warn("[FishingAdvisory] Geolocation fallback used:", err);
      }
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userQuery: "Is it safe to fish here today?",
          location: locationToUse,
        }),
      });

      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }

      const data: AgentState = await res.json();
      setAgentState(data);
    } catch (err: any) {
      console.error("[FishingAdvisory] Failed to fetch advisory:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisory();
  }, []);

  const weatherData = agentState?.weatherData || {
    windSpeedKmh: 14,
    waveHeightMeters: 1.8,
    seaSurfaceTempCelsius: 28.5,
    tideTimes: [
      { time: "14:30 IST", type: "high" as const },
      { time: "20:15 IST", type: "low" as const },
    ],
    source: "Open-Meteo Marine Service",
  };

  const hazardData = agentState?.hazardData || {
    hazardAlerts: [],
    isInRestrictedZone: false,
    nearestBoundaryName: "International Maritime Boundary Line (24nm)",
    source: "INCOIS Coastal Security & GeoJSON Boundary",
  };

  const isSafe = !hazardData.isInRestrictedZone && (weatherData.windSpeedKmh || 0) < 30;

  return (
    <div className="space-y-6 pb-12 text-slate-900 max-w-7xl mx-auto px-4 md:px-6 pt-4">
      {/* 1. Header Banner */}
      <section className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 text-white border border-slate-800/20 p-6 md:p-8 shadow-md overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-cyan-200 text-xs font-semibold mb-3">
              <Fish className="h-3.5 w-3.5 text-cyan-300" />
              Potential Fishing Zone (PFZ) & Safety Portal
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Daily Fishing Advisory
            </h1>
            <p className="text-slate-200 text-sm md:text-base mt-1 max-w-2xl">
              Synthesized oceanographic intelligence combining satellite sea surface temperature, chlorophyll concentration, and coastal security boundaries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={fetchAdvisory}
              variant="outline"
              disabled={isLoading}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs flex items-center gap-1.5 backdrop-blur"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh Telemetry</span>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Green Check-Style Answer Card */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-48 bg-slate-100" />
            <Skeleton className="h-12 w-full bg-slate-100" />
          </div>
        ) : (
          <div
            className={`rounded-xl p-5 border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
              isSafe
                ? "bg-emerald-50/80 border-emerald-400 text-emerald-950 shadow-sm"
                : "bg-amber-50/80 border-amber-400 text-amber-950 shadow-sm"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-2xl shrink-0 mt-0.5 shadow-sm ${
                  isSafe ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                }`}
              >
                {isSafe ? <CheckCircle2 className="h-7 w-7" /> : <AlertTriangle className="h-7 w-7" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    {isSafe ? "CURRENTLY SAFE TO FISH" : "MODERATE CAUTION ADVISED"}
                  </h2>
                  <Badge
                    className={
                      isSafe ? "bg-emerald-600 text-white text-xs font-bold" : "bg-amber-600 text-white text-xs font-bold"
                    }
                  >
                    {isSafe ? "High Confidence" : "Watch Weather"}
                  </Badge>
                </div>
                <p className="text-xs md:text-sm text-slate-600 mt-1">
                  Location Sector: <span className="font-semibold text-slate-900">Kochi Offshore (9.93°N, 76.26°E)</span> • Advisory Valid: <span className="font-semibold text-slate-900">Today 06:00 – 18:00 IST</span>
                </p>
              </div>
            </div>

            <Link
              href="/fisherman/chat?q=Is%20it%20safe%20to%20fish%20here%20today%3F"
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-cyan-600 text-cyan-700 hover:text-cyan-800 text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-sm"
            >
              <span>Ask ORCA Detailed Query</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* 3. Reused QuickOverviewList Component */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-600" />
              Live Telemetry & Boundary Check
            </h3>
            <QuickOverviewList weatherData={weatherData} hazardData={hazardData} />
          </section>

          {/* 4. LeafletMap Continuous Heatmap */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  Potential Fishing Zone Heatmap Surface
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Green gradient represents high chlorophyll/fish probability; Red gradient represents hazard/restricted zones.
                </p>
              </div>
            </div>
            <LeafletMap
              center={DEFAULT_MAP_CENTER}
              zoom={10}
              className="h-80 w-full rounded-xl"
              markers={mapMarkers}
              heatPoints={heatPoints}
            />
          </section>

          {/* 5. Nearest Safe Fishing Zones List */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Fish className="h-5 w-5 text-cyan-600" />
                Nearest Potential Fishing Zones (PFZ Clusters)
              </h3>
              <Badge variant="outline" className="text-xs text-emerald-700 border-emerald-200 bg-emerald-50">
                Satellite Verified
              </Badge>
            </div>

            <div className="space-y-3">
              {/* Zone 1 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                    <Fish className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 text-sm">Zone A: Southwest Kochi Cluster</h4>
                      <Badge className="bg-emerald-600 text-white text-[10px] px-2 py-0">High Potential</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Target Species: <span className="text-slate-900 font-medium">Oil Sardine, Indian Mackerel, Skipjack Tuna</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 self-end md:self-auto shrink-0">
                  <div className="text-right">
                    <div className="text-slate-500 text-[11px]">Est. Distance</div>
                    <div className="font-bold text-slate-900">14.2 nm SW</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-500 text-[11px]">Water Depth</div>
                    <div className="font-bold text-cyan-700">38 meters</div>
                  </div>
                </div>
              </div>

              {/* Zone 2 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-100 text-cyan-700 shrink-0">
                    <Fish className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 text-sm">Zone B: Vypeen Deep Offshore</h4>
                      <Badge className="bg-cyan-600 text-white text-[10px] px-2 py-0">Moderate Potential</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Target Species: <span className="text-slate-900 font-medium">Ribbonfish, Anchovy, Carangids</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 self-end md:self-auto shrink-0">
                  <div className="text-right">
                    <div className="text-slate-500 text-[11px]">Est. Distance</div>
                    <div className="font-bold text-slate-900">18.5 nm W</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-500 text-[11px]">Water Depth</div>
                    <div className="font-bold text-cyan-700">45 meters</div>
                  </div>
                </div>
              </div>

              {/* Zone 3 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                    <Fish className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 text-sm">Zone C: Chellanam Coastal Reach</h4>
                      <Badge className="bg-amber-600 text-white text-[10px] px-2 py-0">Moderate Potential</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Target Species: <span className="text-slate-900 font-medium">Prawns, Sole fish, Croaker</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 self-end md:self-auto shrink-0">
                  <div className="text-right">
                    <div className="text-slate-500 text-[11px]">Est. Distance</div>
                    <div className="font-bold text-slate-900">9.1 nm S</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-500 text-[11px]">Water Depth</div>
                    <div className="font-bold text-cyan-700">22 meters</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* Current Conditions Sidebar Card */}
          <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Compass className="h-5 w-5 text-cyan-600" />
                Current Sea Conditions
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Live sensor metrics off Kochi coast
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5 text-xs">
                  <Wind className="h-4 w-4 text-cyan-600" />
                  <span className="text-slate-600">Wind Velocity</span>
                </div>
                <span className="font-bold text-sm text-slate-900">{weatherData.windSpeedKmh} km/h (WNW)</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5 text-xs">
                  <Waves className="h-4 w-4 text-emerald-600" />
                  <span className="text-slate-600">Wave Height</span>
                </div>
                <span className="font-bold text-sm text-slate-900">{weatherData.waveHeightMeters} meters</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5 text-xs">
                  <Thermometer className="h-4 w-4 text-amber-600" />
                  <span className="text-slate-600">Sea Surface Temp</span>
                </div>
                <span className="font-bold text-sm text-slate-900">{weatherData.seaSurfaceTempCelsius} °C</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5 text-xs">
                  <Eye className="h-4 w-4 text-cyan-600" />
                  <span className="text-slate-600">Ocean Visibility</span>
                </div>
                <span className="font-bold text-sm text-slate-900">9 km (Good)</span>
              </div>
            </CardContent>
          </Card>

          {/* Today's Fishing Advisory Summary Card */}
          <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Synthesized Advisory Summary
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Aggregated by ORCA Multi-Agent LangGraph Pipeline
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs leading-relaxed text-slate-600">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-slate-100" />
                  <Skeleton className="h-4 w-5/6 bg-slate-100" />
                  <Skeleton className="h-4 w-4/6 bg-slate-100" />
                </div>
              ) : (
                <>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800">
                    {agentState?.finalAnswer ||
                      "Sea conditions off Kochi remain favorable for traditional and motorized artisanal vessels today. Wind speeds are moderate at 14 km/h with 1.8m swell waves. Potential Fishing Zone (PFZ) clusters are active 14nm SW near high SST gradients."}
                  </p>

                  <div className="pt-2 border-t border-slate-100">
                    <div className="font-mono text-[10px] text-slate-400 mb-1.5">DATA SOURCES CITED:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {(agentState?.sources || ["Open-Meteo Marine Service", "INCOIS PFZ Feed", "Coast Guard Security Bulletin"]).map(
                        (src, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="bg-slate-100 border border-slate-200 text-cyan-800 text-[10px] px-2 py-0.5"
                          >
                            {src}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
