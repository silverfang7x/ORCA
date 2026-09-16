"use client";

import { FileText, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OfficialReportsAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Title Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-semibold mb-2 shadow-sm">
            <FileText className="h-3 w-3 text-cyan-700" />
            Official Incident & Patrol Records
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            Automated daily hazard summary reports, SOS logbook exports, and coastal authority compliance metrics.
          </p>
        </div>
      </section>

      {/* Placeholder Card */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-700" />
            Automated Report Exports
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            PDF/CSV export generation for coastal command authorities
          </CardDescription>
        </CardHeader>
        <CardContent className="p-12 text-center space-y-4">
          <div className="p-4 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 inline-flex">
            <FileText className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Incident & Safety Analytics Reports</h3>
            <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto">
              Automated daily PDF report compilation and emergency distress log exports will be downloadable from this console.
            </p>
          </div>
          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs px-3 py-1">
            <Clock className="h-3 w-3 mr-1" /> Module In Development
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
