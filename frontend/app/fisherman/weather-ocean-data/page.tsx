"use client";

import { Sun, Waves, Compass, Wind, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-6 pb-12 text-slate-900 max-w-7xl mx-auto px-4 md:px-6 pt-4">
      {/* Header Banner */}
      <section className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 text-white border border-slate-800/20 p-6 md:p-8 shadow-md overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-cyan-200 text-xs font-semibold mb-3">
            <Sun className="h-3.5 w-3.5 text-amber-400" />
            Live Marine Telemetry
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Weather & Ocean Data
          </h1>
          <p className="text-slate-200 text-sm md:text-base mt-1 max-w-2xl">
            Real-time sea surface temperature, swell dynamics, and tidal forecast for coastal fishing sectors.
          </p>
        </div>
      </section>

      {/* Three Stat Cards (Reused from Home) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Card 1: Weather */}
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-500" />
              Sea Weather
            </CardTitle>
            <Badge variant="outline" className="text-xs text-cyan-700 border-cyan-200 bg-cyan-50">Kochi Sector</Badge>
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
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
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
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
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

      {/* Short Note Banner */}
      <section className="p-5 bg-white border border-slate-200 rounded-2xl flex items-start gap-3 text-slate-700 text-xs md:text-sm shadow-sm">
        <Info className="h-5 w-5 text-cyan-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900">Detailed Forecast & High-Resolution Telemetry</span>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Extended 72-hour wave spectrum modeling, satellite SST grid maps, and deep-sea current profiles are currently being integrated by our oceanographic telemetry pipeline.
          </p>
        </div>
      </section>
    </div>
  );
}
