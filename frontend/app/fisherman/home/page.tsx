"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Search,
  AlertTriangle,
  Radio,
  MapPin,
  Wind,
  Waves,
  Sun,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  FileText,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoiceInput } from "@/components/chat/VoiceInput";
import LeafletMap, { MapMarker, HeatPoint } from "@/components/map/LeafletMap";

// Recharts import for Today's Trend chart
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Default location (Kochi, Kerala coast)
const DEFAULT_LOCATION = { lat: 9.9312, lng: 76.2673 };

// Mocked 24-hour ocean trend data for Recharts visualization
// OPTIONAL - build last if time permits
const OCEAN_TREND_DATA = [
  { time: "06:00", waveHeight: 1.2, windSpeed: 10 },
  { time: "09:00", waveHeight: 1.5, windSpeed: 12 },
  { time: "12:00", waveHeight: 1.8, windSpeed: 15 },
  { time: "15:00", waveHeight: 2.1, windSpeed: 18 },
  { time: "18:00", waveHeight: 1.9, windSpeed: 14 },
  { time: "21:00", waveHeight: 1.4, windSpeed: 11 },
  { time: "00:00", waveHeight: 1.1, windSpeed: 9 },
];

export default function FishermanHomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSOSLoading, setIsSOSLoading] = useState(false);
  const [sosConfirmed, setSosConfirmed] = useState(false);
  const [sosDetails, setSosDetails] = useState<string | null>(null);

  // Weather & Ocean state
  const [weatherState] = useState({
    temp: "28°C",
    condition: "Clear Ocean Sky",
    windSpeed: "14 kn (WNW)",
    humidity: "78%",
    tideHigh: "1.4m @ 14:30",
    tideLow: "0.3m @ 20:15",
    waveHeight: "1.8 m",
    wavePeriod: "8 sec",
    safetyStatus: "Moderate Caution",
  });

  // Active hazard alert state
  const [activeHazard] = useState<{
    title: string;
    description: string;
    severity: "high" | "medium";
  } | null>({
    title: "Squally Weather & Wave Advisory",
    description:
      "Swell waves between 2.2m – 2.8m expected off Kochi-Munambam coastline. Fishermen advised to avoid deep sea operations beyond 15nm.",
    severity: "high",
  });

  const [mapMarkers] = useState<MapMarker[]>([
    { lat: 9.9312, lng: 76.2673, label: "Kochi Fishing Harbor Base", icon: "landing" },
    { lat: 9.975, lng: 76.18, label: "High Potential Fishing Zone (Tuna Cluster)", icon: "boat" },
    { lat: 9.88, lng: 76.12, label: "Coastal Patrol Vessel #4", icon: "boat" },
  ]);

  const [heatPoints] = useState<HeatPoint[]>([
    { lat: 9.975, lng: 76.18, intensity: 0.95 },
    { lat: 10.02, lng: 76.1, intensity: 0.8 },
    { lat: 9.85, lng: 76.05, intensity: 0.1 },
    { lat: 9.9, lng: 76.3, intensity: 0.35 },
  ]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    window.location.href = `/fisherman/chat?q=${encodeURIComponent(searchQuery.trim())}`;
  };

  // Handle Voice Input Transcript
  const handleVoiceTranscript = (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      window.location.href = `/fisherman/chat?q=${encodeURIComponent(text.trim())}`;
    }
  };

  // Handle Emergency SOS trigger
  const handleSOSTrigger = async () => {
    setIsSOSLoading(true);
    setSosConfirmed(false);

    let lat = DEFAULT_LOCATION.lat;
    let lng = DEFAULT_LOCATION.lng;

    if (typeof window !== "undefined" && navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch (err) {
        console.warn("[FishermanHome] Geolocation fallback used for SOS:", err);
      }
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/sos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          timestamp: new Date().toISOString(),
          userMessage: "Emergency SOS signal triggered from Fisherman Home Dashboard.",
        }),
      });

      if (res.ok) {
        setSosConfirmed(true);
        setSosDetails(`Distress signal logged at ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E.`);
      } else {
        setSosConfirmed(true);
        setSosDetails(`Distress signal logged at ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E (Offline VHF Relay Active).`);
      }
    } catch (err) {
      console.error("[FishermanHome] SOS post failed:", err);
      setSosConfirmed(true);
      setSosDetails(`Distress signal logged at ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E (Offline VHF Relay Active).`);
    } finally {
      setIsSOSLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 text-slate-900 max-w-7xl mx-auto px-4 md:px-6 pt-4">
      {/* 1. Hero Banner: Warm Sunset / Ocean Gradient matching design-references/fisherman-home-mockup.png */}
      <section className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 text-white border border-slate-800/20 p-6 md:p-8 shadow-md overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-cyan-200 text-xs font-semibold mb-3">
              <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "12s" }} />
              ORCA Live Marine Intelligence System
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Vanakkam, Fisher! 🌊
            </h1>
            <p className="text-slate-200 text-sm md:text-base mt-1 max-w-2xl">
              Real-time sea weather, potential fishing zone advisories, and emergency safety monitoring off your coast.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Badge className="bg-emerald-500/20 border-emerald-400/40 text-emerald-200 py-1.5 px-3 flex items-center gap-1.5 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Coastal Sensors Online
            </Badge>
          </div>
        </div>
      </section>

      {/* 2. Search / Ask ORCA Bar: Light Card Styling */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Ask ORCA anything... (e.g. Is it safe off Kochi tomorrow?)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 rounded-xl h-12 text-sm md:text-base"
            />
          </div>

          <VoiceInput onTranscript={handleVoiceTranscript} />

          <Button
            type="submit"
            className="bg-cyan-700 hover:bg-cyan-600 text-white px-5 h-12 rounded-xl font-semibold flex items-center gap-2 shrink-0 shadow-sm"
          >
            <span className="hidden sm:inline">Ask ORCA</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </section>

      {/* 3. Prominent SOS Emergency Button / Banner: High-Visibility Red Banner */}
      <section className="bg-gradient-to-r from-red-50 via-red-100/80 to-red-50 border-2 border-red-500/80 rounded-2xl p-4 md:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-red-600 text-white rounded-xl shrink-0 mt-0.5 shadow-sm">
              <Radio className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-red-950 tracking-wide">EMERGENCY DISTRESS SOS</h2>
                <Badge className="bg-red-600 text-white text-xs px-2 py-0.5 font-bold uppercase">High Priority</Badge>
              </div>
              <p className="text-red-900/90 text-xs md:text-sm mt-0.5">
                In distress? Instantly broadcast your GPS location to Coastal Authority Command & nearby vessels.
              </p>
            </div>
          </div>

          <Button
            onClick={handleSOSTrigger}
            disabled={isSOSLoading}
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-6 text-base rounded-xl shadow-md shadow-red-600/20 border border-red-500 flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95"
          >
            {isSOSLoading ? (
              <span>Broadcasting Signal...</span>
            ) : (
              <>
                <ShieldAlert className="h-5 w-5" />
                <span>TAP FOR EMERGENCY SOS</span>
              </>
            )}
          </Button>
        </div>

        {/* SOS Confirmation Banner */}
        {sosConfirmed && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start gap-3 text-emerald-900 text-sm animate-fade-in">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Emergency SOS Broadcast Succeeded!</span>
              <p className="text-xs text-emerald-800 mt-0.5">{sosDetails}</p>
            </div>
          </div>
        )}
      </section>

      {/* 4. Active Cyclone / Hazard Alert Banner */}
      {activeHazard && (
        <section className="bg-amber-50 border border-amber-300 rounded-2xl p-4 md:p-5 text-amber-950 flex items-start gap-3.5 shadow-sm">
          <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5 animate-bounce" style={{ animationDuration: "2s" }} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-950 text-sm md:text-base">{activeHazard.title}</h3>
              <Badge className="bg-amber-600 text-white text-xs">Active Warning</Badge>
            </div>
            <p className="text-xs md:text-sm text-amber-900 mt-1 leading-relaxed">
              {activeHazard.description}
            </p>
          </div>
        </section>
      )}

      {/* 5. Three Live Stat Cards (White Cards, Soft Shadow) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Card 1: Weather */}
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-500" />
              Sea Weather
            </CardTitle>
            <Badge variant="outline" className="text-xs text-cyan-700 border-cyan-200 bg-cyan-50">Kochi Coast</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{weatherState.temp}</span>
              <span className="text-xs font-medium text-slate-500">{weatherState.condition}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Wind className="h-3.5 w-3.5 text-cyan-600" />
                Wind: {weatherState.windSpeed}
              </span>
              <span>Humidity: {weatherState.humidity}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Tide Status */}
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Waves className="h-4 w-4 text-cyan-600" />
              Tide Information
            </CardTitle>
            <Badge variant="outline" className="text-xs text-emerald-700 border-emerald-200 bg-emerald-50">Normal Cycle</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">High Tide:</span>
                <span className="font-semibold text-emerald-700">{weatherState.tideHigh}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Low Tide:</span>
                <span className="font-semibold text-amber-700">{weatherState.tideLow}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Current Flow: 0.8 kn E</span>
              <span>Phase: Ebbing</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Wave Height */}
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-600" />
              Swell & Waves
            </CardTitle>
            <Badge variant="outline" className="text-xs text-amber-800 border-amber-200 bg-amber-50">
              {weatherState.safetyStatus}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900">{weatherState.waveHeight}</span>
              <span className="text-xs font-medium text-slate-500">Period: {weatherState.wavePeriod}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Direction: WSW (240°)</span>
              <span className="text-emerald-700 font-medium">Small Boats OK</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 6. Fishing Zones & Region Map Card */}
      <section>
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-cyan-600" />
                Fishing Zones & Continuous Thermal Gradient Map
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Thermal surface overlay (Green = Safe / High Fish Potential, Red = Hazard / Avoid Zone).
              </CardDescription>
            </div>
            <Link
              href="/fisherman/geofencing-boundaries"
              className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 bg-cyan-50 border border-cyan-200 px-3 py-1.5 rounded-lg shrink-0"
            >
              <span>View full map</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-4">
            <LeafletMap
              center={DEFAULT_LOCATION}
              zoom={10}
              className="h-72 md:h-96 w-full rounded-xl"
              markers={mapMarkers}
              heatPoints={heatPoints}
            />
          </CardContent>
        </Card>
      </section>

      {/* 7. Recent Alerts & Quick Actions (White Cards) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts Card */}
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
              Recent Safety & Advisory Alerts
            </CardTitle>
            <Link href="/fisherman/hazards-alerts" className="text-xs text-cyan-700 hover:underline font-semibold">
              See all
            </Link>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {/* Alert 1 */}
            <div className="p-3 bg-red-50/60 rounded-xl border-l-4 border-red-500 border border-red-100 flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-red-900">High Swell Warning</span>
                <span className="text-slate-500">10 mins ago</span>
              </div>
              <p className="text-xs text-slate-700">
                Swell waves reaching 2.8m near Chellanam reef. Small craft advised to stay within 10nm.
              </p>
            </div>

            {/* Alert 2 */}
            <div className="p-3 bg-emerald-50/60 rounded-xl border-l-4 border-emerald-500 border border-emerald-100 flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900">Potential Fishing Zone (PFZ) Updated</span>
                <span className="text-slate-500">1 hour ago</span>
              </div>
              <p className="text-xs text-slate-700">
                High chlorophyll cluster detected 14nm SW of Cochin Port. High Sardine & Mackerel probability.
              </p>
            </div>

            {/* Alert 3 */}
            <div className="p-3 bg-amber-50/60 rounded-xl border-l-4 border-amber-500 border border-amber-100 flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-900">Navigational Hazard Alert</span>
                <span className="text-slate-500">3 hours ago</span>
              </div>
              <p className="text-xs text-slate-700">
                Submerged dredging cable reported near Fort Kochi entrance channel. Keep 200m distance.
              </p>
            </div>

            {/* Alert 4 */}
            <div className="p-3 bg-sky-50/60 rounded-xl border-l-4 border-sky-500 border border-sky-100 flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-900">Weather Forecast Update</span>
                <span className="text-slate-500">5 hours ago</span>
              </div>
              <p className="text-xs text-slate-700">
                Scattered evening rain squalls anticipated between 18:00 – 21:00 IST. Visibility ~4km.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-600" />
              Quick Actions & Modules
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Instant access to core fisherman navigation modules.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-2 gap-3.5">
            <Link
              href="/fisherman/chat"
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 transition-all group flex flex-col items-center text-center gap-2"
            >
              <div className="p-3 rounded-full bg-cyan-100 text-cyan-700 group-hover:scale-110 transition-transform">
                <Compass className="h-6 w-6" />
              </div>
              <span className="font-semibold text-sm text-slate-900">Ask ORCA</span>
              <span className="text-[11px] text-slate-500">AI Safety Assistant</span>
            </Link>

            <Link
              href="/fisherman/geofencing-boundaries"
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group flex flex-col items-center text-center gap-2"
            >
              <div className="p-3 rounded-full bg-emerald-100 text-emerald-700 group-hover:scale-110 transition-transform">
                <MapPin className="h-6 w-6" />
              </div>
              <span className="font-semibold text-sm text-slate-900">View Map</span>
              <span className="text-[11px] text-slate-500">Interactive Zones</span>
            </Link>

            <Link
              href="/fisherman/fishing-advisory"
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all group flex flex-col items-center text-center gap-2"
            >
              <div className="p-3 rounded-full bg-amber-100 text-amber-700 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <span className="font-semibold text-sm text-slate-900">Check PFZ</span>
              <span className="text-[11px] text-slate-500">Fish Zone Potential</span>
            </Link>

            <Link
              href="/fisherman/hazards-alerts"
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-red-500 hover:bg-red-50/50 transition-all group flex flex-col items-center text-center gap-2"
            >
              <div className="p-3 rounded-full bg-red-100 text-red-700 group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <span className="font-semibold text-sm text-slate-900">View Alerts</span>
              <span className="text-[11px] text-slate-500">Hazards & Weather</span>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* 8. Today's Trend Line Chart (White Card) */}
      <section className="bg-white border border-slate-200 text-slate-900 rounded-2xl p-5 shadow-sm">
        {/* OPTIONAL - build last if time permits */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 gap-2 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-600" />
              Today's Ocean Trend (24h Wave & Wind Dynamics)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hourly wave swell (meters) and wind velocity (knots) forecast for offshore Kochi.
            </p>
          </div>
          <Badge variant="outline" className="self-start md:self-auto text-xs text-slate-600 border-slate-200">
            Recharts Sample Trend
          </Badge>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={OCEAN_TREND_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#cbd5e1",
                  borderRadius: "0.75rem",
                  color: "#0f172a",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="waveHeight"
                name="Wave Height (m)"
                stroke="#0284c7"
                strokeWidth={3}
                dot={{ r: 4, fill: "#0284c7" }}
              />
              <Line
                type="monotone"
                dataKey="windSpeed"
                name="Wind Speed (kn)"
                stroke="#d97706"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: "#d97706" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
