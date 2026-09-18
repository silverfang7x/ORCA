"use client";

import { useState } from "react";
import {
  BarChart3,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  Waves,
  Download,
  Fish,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FishingTrip {
  id: string;
  date: string;
  location: string;
  durationHours: number;
  catchTag: string;
  seaCondition: string;
  maxWaveMeters: number;
  safetyAdvisoryChecked: boolean;
}

const PAST_WEEK_WAVE_DATA = [
  { day: "Mon", waveHeight: 1.1, seaTemp: 28.2 },
  { day: "Tue", waveHeight: 1.3, seaTemp: 28.4 },
  { day: "Wed", waveHeight: 1.0, seaTemp: 28.1 },
  { day: "Thu", waveHeight: 1.5, seaTemp: 28.5 },
  { day: "Fri", waveHeight: 2.1, seaTemp: 28.8 },
  { day: "Sat", waveHeight: 1.4, seaTemp: 28.3 },
  { day: "Sun", waveHeight: 1.2, seaTemp: 28.0 },
];

const RECENT_TRIPS: FishingTrip[] = [
  {
    id: "TRIP-0918",
    date: "Yesterday, Sep 18",
    location: "Kochi Deep Offshore (Sector 4)",
    durationHours: 8.5,
    catchTag: "Good Sardine Yield (120 kg)",
    seaCondition: "Calm to Moderate",
    maxWaveMeters: 1.3,
    safetyAdvisoryChecked: true,
  },
  {
    id: "TRIP-0915",
    date: "Sep 15, 2026",
    location: "Munambam Shelf (12nm W)",
    durationHours: 6.0,
    catchTag: "Moderate Mackerel (85 kg)",
    seaCondition: "Gentle Swell",
    maxWaveMeters: 1.1,
    safetyAdvisoryChecked: true,
  },
  {
    id: "TRIP-0912",
    date: "Sep 12, 2026",
    location: "Chellanam Coastal Water",
    durationHours: 5.5,
    catchTag: "Anchovy & Tuna (95 kg)",
    seaCondition: "Clear Waters",
    maxWaveMeters: 0.9,
    safetyAdvisoryChecked: true,
  },
  {
    id: "TRIP-0908",
    date: "Sep 08, 2026",
    location: "Fort Kochi Outer Roadstead",
    durationHours: 7.0,
    catchTag: "Kingfish & Mackerel (110 kg)",
    seaCondition: "Moderate Breeze",
    maxWaveMeters: 1.4,
    safetyAdvisoryChecked: true,
  },
];

export default function ReportsAnalyticsPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadLogbook = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert("Downloaded your monthly fishing trip logbook & safety summary (PDF).");
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-900 max-w-5xl mx-auto px-4 md:px-6 pt-4">
      {/* Header Banner */}
      <section className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 text-white border border-slate-800/20 p-6 md:p-8 shadow-md overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-cyan-200 text-xs font-semibold mb-3">
              <BarChart3 className="h-3.5 w-3.5 text-cyan-300" />
              My Trip History & Catch Analytics
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Reports & Trip History
            </h1>
            <p className="text-slate-200 text-sm md:text-base mt-1 max-w-2xl">
              Track your past fishing trips, review 7-day ocean conditions, and keep your safety record strong.
            </p>
          </div>

          <Button
            onClick={handleDownloadLogbook}
            disabled={downloading}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-sm flex items-center gap-2 shrink-0 h-10 px-4"
          >
            <Download className={`h-4 w-4 ${downloading ? "animate-bounce" : ""}`} />
            {downloading ? "Downloading Log..." : "Download Trip PDF"}
          </Button>
        </div>
      </section>

      {/* 1. Motivating Safety Streak Card */}
      <Card className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-none shadow-md overflow-hidden relative">
        <div className="absolute right-0 top-0 p-6 text-white/10 pointer-events-none">
          <Award className="h-36 w-36 -mr-6 -mt-6" />
        </div>
        <CardContent className="p-6 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-white/20 backdrop-blur text-white shrink-0">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold mb-1">
                <Award className="h-3 w-3 text-amber-300" />
                100% Advisory Compliance
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
                12 Safe Trips Checked This Month!
              </h2>
              <p className="text-emerald-100 text-xs mt-1">
                You checked ORCA advisories before every departure. Zero boundary or wave hazard incidents logged.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. 7-Day Ocean Wave Trend Chart Card */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="pb-2 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Waves className="h-4 w-4 text-cyan-700" />
                7-Day Wave Height Trend (Kochi Sector)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Past week wave height spectrum (meters) for your primary fishing grounds
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs text-cyan-800 border-cyan-200 bg-cyan-50">
              Avg 1.3m (Calm Waters)
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-6">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PAST_WEEK_WAVE_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="fishermanWaveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#0891b2" fontSize={11} tickLine={false} unit="m" domain={[0, 3]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f8fafc", borderRadius: "8px", fontSize: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="waveHeight"
                  name="Wave Height (m)"
                  stroke="#0891b2"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#fishermanWaveGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 3. Recent Fishing Trips List */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-cyan-700" />
              Recent Fishing Trips
            </CardTitle>
            <Badge variant="outline" className="text-xs text-slate-600 border-slate-200 font-mono">
              4 Recorded Trips
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {RECENT_TRIPS.map((trip) => (
            <div
              key={trip.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-cyan-300 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">{trip.location}</span>
                  <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 text-[10px] font-semibold">
                    <Fish className="h-3 w-3 mr-1" />
                    {trip.catchTag}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    {trip.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    {trip.durationHours} hrs at sea
                  </span>
                  <span className="flex items-center gap-1 text-slate-700 font-semibold">
                    <Waves className="h-3 w-3 text-cyan-600" />
                    Max Wave {trip.maxWaveMeters}m
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs px-2.5 py-1 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Checked Advisory
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
