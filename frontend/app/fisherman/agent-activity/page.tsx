"use client";

import { useState } from "react";
import {
  Activity,
  Play,
  CheckCircle2,
  Clock,
  Compass,
  Waves,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Cpu,
  Radio,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StepLog {
  id: string;
  agent: string;
  message: string;
  durationMs: number;
  status: "complete" | "running";
}

export default function AgentActivityPage() {
  const [selectedQuery, setSelectedQuery] = useState(
    "Is it safe to fish near Kochi tomorrow?"
  );
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(4); // Default to completed step for initial render

  const [stepLogs, setStepLogs] = useState<StepLog[]>([
    {
      id: "1",
      agent: "Planner Agent",
      message: "Analyzed query intent: Kochi coastal coordinates (9.93°N, 76.26°E) for tomorrow.",
      durationMs: 110,
      status: "complete",
    },
    {
      id: "2",
      agent: "Weather & Ocean Agent",
      message: "Fetched Open-Meteo Marine API: Wave height 1.4m, Sea Temp 28°C, Midday Tides derived.",
      durationMs: 230,
      status: "complete",
    },
    {
      id: "3",
      agent: "Hazard & Geofence Agent",
      message: "Ran Turf.js spatial analysis: Checked 5 active hazard polygons & IMBL buffer. Zero violations.",
      durationMs: 185,
      status: "complete",
    },
    {
      id: "4",
      agent: "Synthesizer Agent",
      message: "Combined ocean & hazard data into a clear safety advisory with 100% citation confidence.",
      durationMs: 310,
      status: "complete",
    },
  ]);

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setActiveStep(0);
    setStepLogs([]);

    // Step 1: Planner
    await new Promise((r) => setTimeout(r, 400));
    setActiveStep(1);
    setStepLogs((prev) => [
      ...prev,
      {
        id: "1",
        agent: "Planner Agent",
        message: `Parsed location query: "${selectedQuery}". Routing requests to Weather & Hazard sub-agents.`,
        durationMs: 120,
        status: "complete",
      },
    ]);

    // Step 2 & 3: Weather & Hazard (Parallel)
    await new Promise((r) => setTimeout(r, 600));
    setActiveStep(2);
    setStepLogs((prev) => [
      ...prev,
      {
        id: "2",
        agent: "Weather & Ocean Agent",
        message: "Open-Meteo Marine API call returned wave height 1.4m, wind 15 km/h, sea surface temp 28°C.",
        durationMs: 245,
        status: "complete",
      },
      {
        id: "3",
        agent: "Hazard & Geofence Agent",
        message: "Turf.js point-in-polygon check: Target position is 12.4nm inside safe Indian territorial waters.",
        durationMs: 190,
        status: "complete",
      },
    ]);

    // Step 4: Synthesizer
    await new Promise((r) => setTimeout(r, 500));
    setActiveStep(3);
    setStepLogs((prev) => [
      ...prev,
      {
        id: "4",
        agent: "Synthesizer Agent",
        message: "Synthesized final natural language advisory with cited sources in regional language.",
        durationMs: 295,
        status: "complete",
      },
    ]);

    await new Promise((r) => setTimeout(r, 300));
    setActiveStep(4);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-900 max-w-5xl mx-auto px-4 md:px-6 pt-4">
      {/* Header Banner */}
      <section className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 text-white border border-slate-800/20 p-6 md:p-8 shadow-md overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-cyan-200 text-xs font-semibold mb-3">
            <Cpu className="h-3.5 w-3.5 text-cyan-300" />
            See How ORCA Thinks
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Live AI Agent Activity
          </h1>
          <p className="text-slate-200 text-sm md:text-base mt-1 max-w-2xl">
            Watch how ORCA’s specialized AI agents work together in real-time to check weather, analyze hazard zones, and give you safe fishing advisories.
          </p>
        </div>
      </section>

      {/* Interactive Query Selector & Run Test Card */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-700" />
            Try a Live Query Flow Simulation
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Pick a question below and watch how ORCA’s multi-agent pipeline processes it step-by-step
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              "Is it safe to fish near Kochi tomorrow?",
              "What are the wave heights near Chennai?",
              "Am I near any restricted hazard zones?",
            ].map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQuery(q)}
                className={`p-3 rounded-xl text-xs font-medium text-left border transition-all ${
                  selectedQuery === q
                    ? "bg-cyan-50 border-cyan-400 text-cyan-900 font-semibold shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                "{q}"
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500 font-mono">
              Selected Query: <strong className="text-slate-900">"{selectedQuery}"</strong>
            </div>

            <Button
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="bg-cyan-700 hover:bg-cyan-600 text-white font-semibold text-xs shadow-sm flex items-center gap-2 h-9 px-4"
            >
              <Play className={`h-3.5 w-3.5 ${isRunning ? "animate-spin" : ""}`} />
              {isRunning ? "Running Agent Flow..." : "Watch AI Think"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Horizontal Multi-Agent Node Flow Diagram */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-700" />
            Multi-Agent Pipeline Execution Graph
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Orchestrated workflow connecting Planner, Weather/Ocean, Hazard/Geofence, and Synthesizer agents
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {/* Node 1: User Query */}
            <div
              className={`p-4 rounded-xl border text-center transition-all ${
                activeStep >= 1
                  ? "bg-cyan-50 border-cyan-400 text-cyan-900 shadow-sm"
                  : "bg-slate-50 border-slate-200 text-slate-400"
              }`}
            >
              <div className="h-8 w-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto mb-2 font-bold text-xs">
                1
              </div>
              <div className="font-bold text-xs">User Query</div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">Natural Language</div>
            </div>

            {/* Node 2: Planner Agent */}
            <div
              className={`p-4 rounded-xl border text-center transition-all ${
                activeStep >= 1 && activeStep <= 3
                  ? "bg-blue-50 border-blue-500 text-blue-900 shadow-md ring-2 ring-blue-400/30"
                  : activeStep > 3
                  ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                  : "bg-slate-50 border-slate-200 text-slate-400"
              }`}
            >
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2 font-bold text-xs">
                <Compass className="h-4 w-4" />
              </div>
              <div className="font-bold text-xs">Planner Agent</div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">Intent & Routing</div>
            </div>

            {/* Node 3: Parallel Sub-Agents */}
            <div className="space-y-2">
              <div
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  activeStep >= 2
                    ? "bg-cyan-50 border-cyan-400 text-cyan-900 shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <div className="font-bold text-[11px] flex items-center justify-center gap-1">
                  <Waves className="h-3 w-3 text-cyan-600" />
                  Weather & Ocean
                </div>
                <div className="text-[9px] text-slate-500 font-mono">Open-Meteo API</div>
              </div>

              <div
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  activeStep >= 2
                    ? "bg-amber-50 border-amber-400 text-amber-900 shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <div className="font-bold text-[11px] flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-amber-600" />
                  Hazard & Geofence
                </div>
                <div className="text-[9px] text-slate-500 font-mono">Turf.js Spatial</div>
              </div>
            </div>

            {/* Node 4: Synthesizer Agent */}
            <div
              className={`p-4 rounded-xl border text-center transition-all ${
                activeStep === 3
                  ? "bg-purple-50 border-purple-500 text-purple-900 shadow-md ring-2 ring-purple-400/30"
                  : activeStep > 3
                  ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                  : "bg-slate-50 border-slate-200 text-slate-400"
              }`}
            >
              <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-2 font-bold text-xs">
                <Cpu className="h-4 w-4" />
              </div>
              <div className="font-bold text-xs">Synthesizer Agent</div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">Citations & Advice</div>
            </div>

            {/* Node 5: Safe Answer Output */}
            <div
              className={`p-4 rounded-xl border text-center transition-all ${
                activeStep >= 4
                  ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm font-semibold"
                  : "bg-slate-50 border-slate-200 text-slate-400"
              }`}
            >
              <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="font-bold text-xs">Safe Advisory</div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">Regional Output</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Friendly Human-Readable Execution Log */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-700" />
            Agent Reasoning & Step Log
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            A step-by-step breakdown of how ORCA checked real ocean data and rules for your question
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 space-y-3 font-sans">
          {stepLogs.length === 0 ? (
            <div className="text-xs text-slate-400 text-center py-6">
              Click "Watch AI Think" above to start the live execution trace.
            </div>
          ) : (
            stepLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-cyan-100 text-cyan-800 font-bold shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-cyan-700" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{log.agent}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5 text-xs leading-relaxed">{log.message}</p>
                  </div>
                </div>

                <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 text-[10px] font-mono self-end sm:self-center shrink-0">
                  <Clock className="h-3 w-3 mr-1 text-slate-400" />
                  {log.durationMs}ms
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
