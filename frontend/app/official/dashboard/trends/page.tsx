"use client";

// OPTIONAL - build last if time permits, see CONTEXT.md

import { TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OfficialHistoricalTrendsPage() {
  return (
    <div className="space-y-6">
      {/* Title Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-semibold mb-2 shadow-sm">
            <TrendingUp className="h-3 w-3 text-cyan-700" />
            Long-Term Oceanographic Analytics
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Historical Trends Analytics
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            Multi-month sea surface temperature anomalies, wave height spectrum history, and fleet density trends.
          </p>
        </div>
      </section>

      {/* Placeholder Card */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Historical Trend Module Slot
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Optional stretch visualization slot
          </CardDescription>
        </CardHeader>
        <CardContent className="p-12 text-center space-y-4">
          <div className="p-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 inline-flex">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Historical Trends & Multi-Month Analytics</h3>
            <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto">
              // OPTIONAL - build last if time permits, see CONTEXT.md. Long-term oceanographic trends and seasonal fish catch correlation data will be rendered here.
            </p>
          </div>
          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs px-3 py-1">
            <Clock className="h-3 w-3 mr-1" /> Stretch Module
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
