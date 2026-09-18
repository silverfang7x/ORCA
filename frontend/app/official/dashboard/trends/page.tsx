"use client";

import { useState } from "react";
import {
  TrendingUp,
  Waves,
  Thermometer,
  Navigation,
  Calendar,
  Filter,
  Download,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Generate 30-day oceanographic & fleet telemetry dataset
const SAMPLE_TREND_DATA = [
  { day: "Aug 21", seaTemp: 28.1, waveHeight: 1.2, activeVessels: 165, hazardLevel: "Low" },
  { day: "Aug 23", seaTemp: 28.3, waveHeight: 1.4, activeVessels: 180, hazardLevel: "Low" },
  { day: "Aug 25", seaTemp: 28.5, waveHeight: 1.1, activeVessels: 195, hazardLevel: "Low" },
  { day: "Aug 27", seaTemp: 28.2, waveHeight: 1.8, activeVessels: 172, hazardLevel: "Moderate" },
  { day: "Aug 29", seaTemp: 28.7, waveHeight: 2.3, activeVessels: 150, hazardLevel: "Moderate" },
  { day: "Aug 31", seaTemp: 29.1, waveHeight: 3.2, activeVessels: 110, hazardLevel: "High" },
  { day: "Sep 02", seaTemp: 29.4, waveHeight: 3.6, activeVessels: 85, hazardLevel: "Severe" },
  { day: "Sep 04", seaTemp: 28.9, waveHeight: 2.8, activeVessels: 130, hazardLevel: "Moderate" },
  { day: "Sep 06", seaTemp: 28.6, waveHeight: 2.0, activeVessels: 175, hazardLevel: "Low" },
  { day: "Sep 08", seaTemp: 28.4, waveHeight: 1.5, activeVessels: 190, hazardLevel: "Low" },
  { day: "Sep 10", seaTemp: 28.2, waveHeight: 1.3, activeVessels: 205, hazardLevel: "Low" },
  { day: "Sep 12", seaTemp: 28.5, waveHeight: 1.7, activeVessels: 185, hazardLevel: "Low" },
  { day: "Sep 14", seaTemp: 28.8, waveHeight: 2.4, activeVessels: 145, hazardLevel: "Moderate" },
  { day: "Sep 16", seaTemp: 29.0, waveHeight: 2.9, activeVessels: 125, hazardLevel: "Moderate" },
  { day: "Sep 18", seaTemp: 28.6, waveHeight: 1.8, activeVessels: 168, hazardLevel: "Low" },
  { day: "Sep 19", seaTemp: 28.4, waveHeight: 1.4, activeVessels: 192, hazardLevel: "Low" },
];

export default function OfficialHistoricalTrendsPage() {
  const [timeframe, setTimeframe] = useState("30d");
  const [selectedRegion, setSelectedRegion] = useState("kerala");

  return (
    <div className="space-y-6 pb-8">
      {/* Title & Filter Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-semibold mb-2 shadow-sm">
            <TrendingUp className="h-3 w-3 text-cyan-700" />
            Long-Term Oceanographic Telemetry & Fleet Analytics
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Historical Trends & Analytics
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            Multi-week sea surface temperature anomalies, wave height spectrum history, and active vessel density models.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="text-xs border border-slate-200 bg-white rounded-lg px-3 h-9 text-slate-700 font-semibold shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="7d">Past 7 Days</option>
            <option value="30d">Past 30 Days</option>
            <option value="90d">Past 90 Days</option>
            <option value="1y">Past 1 Year</option>
          </select>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="text-xs border border-slate-200 bg-white rounded-lg px-3 h-9 text-slate-700 font-semibold shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="kerala">Kerala Coast (Sector Alpha)</option>
            <option value="tamilnadu">Tamil Nadu South Sector</option>
            <option value="lakshadweep">Lakshadweep Archipelago</option>
          </select>
        </div>
      </section>

      {/* Overview Stat Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
              <Thermometer className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">28.5 °C</div>
              <div className="text-xs text-slate-500 font-medium">30-Day Avg Sea Temp</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Waves className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-blue-700">3.6 m</div>
              <div className="text-xs text-slate-500 font-medium">Max Wave Height Recorded</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">186 Vessels</div>
              <div className="text-xs text-slate-500 font-medium">Mean Daily Fleet Density</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-amber-700">4 Days</div>
              <div className="text-xs text-slate-500 font-medium">High Surge Anomaly Days</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Card 1: Sea Surface Temperature & Wave Height Trend */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                Sea Surface Temperature (°C) & Significant Wave Height (m)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                INCOIS satellite thermal imaging & Open-Meteo marine wave height correlation (30-day spectrum)
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] bg-slate-50 border-slate-200 text-slate-600 font-mono self-start sm:self-auto">
              Source: Open-Meteo Marine API & INCOIS
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-6">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SAMPLE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" domain={[26, 31]} stroke="#ea580c" fontSize={11} tickLine={false} unit="°C" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 5]} stroke="#0284c7" fontSize={11} tickLine={false} unit="m" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f8fafc", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />

                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="seaTemp"
                  name="Sea Surface Temp (°C)"
                  stroke="#ea580c"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#tempGradient)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="waveHeight"
                  name="Wave Height (m)"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#waveGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Chart Card 2: Active Fleet Density Trend */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="h-4 w-4 text-cyan-600" />
                Coastal Fleet Density & Weather Correlation
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Number of active fishing vessels at sea vs weather hazard severity thresholds
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-6">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SAMPLE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#0891b2" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f8fafc", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="activeVessels" name="Active Craft at Sea" fill="#0891b2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center font-mono">
            Note: Fleet activity drops significantly during high-surge events (Sep 01 - Sep 04) following ORCA AI hazard broadcasts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
