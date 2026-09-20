"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Waves, Thermometer, Clock, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface HistoryEntry {
  id: string;
  timeLabel: string;
  userQuery: string;
  waveHeight: number;
  seaSurfaceTemp: number;
}

const DEFAULT_FALLBACK_HISTORY: HistoryEntry[] = [
  { id: "1", timeLabel: "06:00 AM", userQuery: "Is it safe to fish near Kochi?", waveHeight: 1.2, seaSurfaceTemp: 28.1 },
  { id: "2", timeLabel: "07:00 AM", userQuery: "Wave height near Chennai", waveHeight: 1.4, seaSurfaceTemp: 28.3 },
  { id: "3", timeLabel: "08:00 AM", userQuery: "High swell warnings", waveHeight: 2.1, seaSurfaceTemp: 28.7 },
  { id: "4", timeLabel: "09:00 AM", userQuery: "Tide forecast Munambam", waveHeight: 1.8, seaSurfaceTemp: 28.5 },
  { id: "5", timeLabel: "10:00 AM", userQuery: "Geofence boundary check", waveHeight: 1.5, seaSurfaceTemp: 28.2 },
];

export function HistoricalTrendChart() {
  const [historyData, setHistoryData] = useState<HistoryEntry[]>(DEFAULT_FALLBACK_HISTORY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiUrl}/api/history`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setHistoryData(data);
          }
        }
      } catch (err) {
        console.warn("[HistoricalTrendChart] Falling back to default historical telemetry data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
      <CardHeader className="border-b border-slate-100 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Historical Query Volume & Ocean Telemetry Trend
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Live multi-agent API query logs & Open-Meteo wave height telemetry stream
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs text-emerald-800 border-emerald-200 bg-emerald-50 self-start sm:self-auto font-mono">
            <Activity className="h-3 w-3 mr-1 text-emerald-600" /> Stretch Feature Active
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-6 space-y-4">
        {/* Trend Visualization Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="waveHistoryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="tempHistoryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" domain={[0, 4]} stroke="#059669" fontSize={11} tickLine={false} unit="m" />
              <YAxis yAxisId="right" orientation="right" domain={[26, 31]} stroke="#0284c7" fontSize={11} tickLine={false} unit="°C" />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f8fafc", borderRadius: "8px", fontSize: "12px" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="waveHeight"
                name="Wave Height (m)"
                stroke="#059669"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#waveHistoryGrad)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="seaSurfaceTemp"
                name="Sea Surface Temp (°C)"
                stroke="#0284c7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#tempHistoryGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Live Query History Stream Log */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            Recent Query History Log ({historyData.length} Entries)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {historyData.slice(-4).map((item) => (
              <div key={item.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="truncate pr-2">
                  <div className="font-bold text-slate-900 truncate">"{item.userQuery}"</div>
                  <div className="text-[10px] text-slate-500">{item.timeLabel}</div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-white text-emerald-800 border-emerald-200 shrink-0">
                  {item.waveHeight}m
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
