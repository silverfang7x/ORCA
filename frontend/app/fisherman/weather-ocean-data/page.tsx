"use client";

import { Sun, Waves, Compass, Wind, Clock, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WeatherOceanDataPage() {
  const weatherState = {
    temp: "28°C",
    condition: "Clear Ocean Sky",
    windSpeed: "14 kn (WNW)",
    humidity: "78%",
    tideHigh: "1.4m @ 14:30",
    tideLow: "0.3m @ 20:15",
    waveHeight: "1.8 m",
    wavePeriod: "8 sec",
    safetyStatus: "Moderate Caution",
  };

  return (
    <div className="space-y-6 pb-12 text-slate-100 max-w-7xl mx-auto px-4 md:px-6 pt-4">
      {/* Header Banner */}
      <section className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/40 border border-cyan-700/50 text-cyan-300 text-xs font-semibold mb-3">
            <Sun className="h-3.5 w-3.5 text-amber-400" />
            Live Marine Telemetry
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Weather & Ocean Data
          </h1>
          <p className="text-slate-300 text-sm md:text-base mt-1 max-w-2xl">
            Real-time sea surface temperature, swell dynamics, and tidal forecast for coastal fishing sectors.
          </p>
        </div>
      </section>

      {/* Three Stat Cards (Reused from Home) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Card 1: Weather */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-400" />
              Sea Weather
            </CardTitle>
            <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-800">Kochi Sector</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white">{weatherState.temp}</span>
              <span className="text-xs font-medium text-slate-400">{weatherState.condition}</span>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Wind className="h-3.5 w-3.5 text-cyan-400" />
                Wind: {weatherState.windSpeed}
              </span>
              <span>Humidity: {weatherState.humidity}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Tide Status */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Waves className="h-4 w-4 text-cyan-400" />
              Tide Information
            </CardTitle>
            <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-800">Normal Cycle</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">High Tide:</span>
                <span className="font-semibold text-emerald-400">{weatherState.tideHigh}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Low Tide:</span>
                <span className="font-semibold text-amber-400">{weatherState.tideLow}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
              <span>Current Flow: 0.8 kn E</span>
              <span>Phase: Ebbing</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Wave Height */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-400" />
              Swell & Waves
            </CardTitle>
            <Badge variant="outline" className="text-xs text-amber-400 border-amber-800">
              {weatherState.safetyStatus}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white">{weatherState.waveHeight}</span>
              <span className="text-xs font-medium text-slate-400">Period: {weatherState.wavePeriod}</span>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
              <span>Direction: WSW (240°)</span>
              <span className="text-emerald-400 font-medium">Small Boats OK</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Short Note Banner */}
      <section className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start gap-3 text-slate-300 text-xs md:text-sm">
        <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Detailed Forecast & High-Resolution Telemetry</span>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Extended 72-hour wave spectrum modeling, satellite SST grid maps, and deep-sea current profiles are currently being integrated by our oceanographic telemetry pipeline.
          </p>
        </div>
      </section>
    </div>
  );
}
