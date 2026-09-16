"use client";

import { Settings, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OfficialSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Title Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-semibold mb-2 shadow-sm">
            <Settings className="h-3 w-3 text-cyan-700" />
            Control Center Configuration
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Command Settings
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            AIS radar update intervals, emergency SOS audio alert tones, and regional broadcast API keys.
          </p>
        </div>
      </section>

      {/* Placeholder Card */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-700" />
            System Preferences & Integrations
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Control room system parameters and API key management
          </CardDescription>
        </CardHeader>
        <CardContent className="p-12 text-center space-y-4">
          <div className="p-4 rounded-full bg-slate-50 border border-slate-200 text-slate-600 inline-flex">
            <Settings className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Control Center Settings</h3>
            <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto">
              Automated broadcast dispatch thresholds, satellite data refresh rates, and external Coast Guard API endpoints will be configured here.
            </p>
          </div>
          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs px-3 py-1">
            <Clock className="h-3 w-3 mr-1" /> Planned Module
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
