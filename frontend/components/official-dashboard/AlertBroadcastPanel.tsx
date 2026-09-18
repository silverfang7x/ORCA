"use client";

import { useState } from "react";
import { Radio, Send, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface BroadcastAlert {
  region: string;
  type: string;
  severity: "Low" | "Medium" | "High";
  message: string;
  issuedAt: string;
}

const REGION_OPTIONS = [
  "Bay of Bengal / Odisha Coast",
  "Kerala Coast (Kochi)",
  "Gujarat Coast (Porbandar)",
  "Tamil Nadu Coast (Coromandel)",
  "Andhra Pradesh Coast (Visakhapatnam)",
  "West Bengal Sundarbans",
  "South Kerala & Kanyakumari",
];

const TYPE_OPTIONS = [
  "Cyclone Warning",
  "High Wave Alert",
  "Storm Warning",
  "Lightning Alert",
];

const SEVERITY_OPTIONS: ("Low" | "Medium" | "High")[] = ["Low", "Medium", "High"];

export function AlertBroadcastPanel() {
  const [region, setRegion] = useState(REGION_OPTIONS[0]);
  const [type, setType] = useState(TYPE_OPTIONS[0]);
  const [severity, setSeverity] = useState<"Low" | "Medium" | "High">("High");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastBroadcast, setLastBroadcast] = useState<BroadcastAlert | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setShowSuccessBanner(false);

    const payload: BroadcastAlert = {
      region,
      type,
      severity,
      message: message.trim(),
      issuedAt: new Date().toISOString(),
    };

    // Log the payload to console as specified
    console.log("[AlertBroadcastPanel] Broadcast payload:", payload);

    // TODO: Wire to real backend POST API route when endpoint is ready:
    // try {
    //   const response = await fetch('/api/broadcast-alert', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(payload),
    //   });
    //   if (!response.ok) throw new Error('Broadcast failed');
    // } catch (err) {
    //   console.error('Failed to broadcast alert:', err);
    // }

    // Simulate submission delay for smooth UI feedback
    await new Promise((resolve) => setTimeout(resolve, 400));

    setLastBroadcast(payload);
    setShowSuccessBanner(true);
    setMessage("");
    setIsSubmitting(false);
  };

  return (
    <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Radio className="h-5 w-5 text-cyan-700 animate-pulse" />
              Live Coastal Emergency Alert Broadcast Console
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Issue instant emergency weather, cyclone, and maritime hazard warnings to coastal fisher networks.
            </CardDescription>
          </div>
          <Badge className="bg-cyan-50 border-cyan-200 text-cyan-800 text-xs self-start sm:self-auto">
            Official Broadcast System
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Success Confirmation Toast Banner */}
        {showSuccessBanner && lastBroadcast && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start gap-3 text-emerald-900 text-xs animate-fade-in shadow-sm">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 text-sm">
                  Broadcast Alert Dispatched Successfully!
                </span>
                <span className="text-[10px] text-emerald-700 font-mono">
                  {new Date(lastBroadcast.issuedAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                <span className="font-semibold">{lastBroadcast.type}</span> ({lastBroadcast.severity} Severity) for{" "}
                <span className="font-semibold">{lastBroadcast.region}</span>: "{lastBroadcast.message}"
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Region Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                Coastal Region Target
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 transition-all"
              >
                {REGION_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                Alert Category Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 transition-all"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as "Low" | "Medium" | "High")}
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 transition-all"
              >
                {SEVERITY_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s} Severity
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Broadcast Message Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Broadcast Advisory Message Text</span>
              <span className="text-[10px] text-slate-400 font-mono">Will be dispatched in regional languages</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter specific safety advisory details (e.g., Cyclonic depression forming 50nm off Paradip. Fishermen advised to return to coast immediately...)"
              rows={3}
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 transition-all resize-none min-h-[80px]"
            />
          </div>

          {/* Submit Action Button */}
          <div className="flex items-center justify-end pt-2">
            <Button
              type="submit"
              disabled={!message.trim() || isSubmitting}
              className="bg-cyan-700 hover:bg-cyan-600 text-white font-semibold h-11 px-6 text-xs rounded-xl flex items-center gap-2 shadow-sm shrink-0 min-h-[44px]"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? "Dispatching Broadcast..." : "Broadcast Alert"}</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
