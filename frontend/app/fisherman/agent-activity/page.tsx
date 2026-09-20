"use client";

import { useState } from "react";
import {
  Activity,
  Play,
  CheckCircle2,
  Compass,
  Waves,
  ShieldCheck,
  Sparkles,
  Cpu,
  FileText,
  AlertCircle,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AgentThinkingTrace, AgentProgressStep } from "@/components/chat/AgentThinkingTrace";
import { LocationQuery, AgentState } from "@orca/shared";

const DEFAULT_KOCHI_LOCATION: LocationQuery = {
  latitude: 9.9312,
  longitude: 76.2673,
  date: new Date().toISOString(),
};

export default function AgentActivityPage() {
  const [selectedQuery, setSelectedQuery] = useState(
    "Is it safe to fish near Kochi tomorrow?"
  );
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(4);
  const [steps, setSteps] = useState<AgentProgressStep[]>([]);
  const [finalResult, setFinalResult] = useState<AgentState | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunStream = async () => {
    setIsRunning(true);
    setActiveStep(0);
    setSteps([]);
    setFinalResult(null);
    setErrorMsg(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const preferredLanguage = (typeof window !== "undefined" && localStorage.getItem("orca_language_preference")) || "en";

    try {
      const response = await fetch(`${apiUrl}/api/query/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userQuery: selectedQuery,
          location: DEFAULT_KOCHI_LOCATION,
          preferredLanguage,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error ${response.status} connecting to streaming endpoint`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() || "";

        for (const block of blocks) {
          if (!block.trim()) continue;

          const eventMatch = block.match(/^event:\s*(.+)$/m);
          const dataMatch = block.match(/^data:\s*(.+)$/m);

          const eventName = eventMatch ? eventMatch[1].trim() : "progress";
          const dataStr = dataMatch ? dataMatch[1].trim() : "";

          if (!dataStr) continue;

          if (eventName === "progress") {
            const rawEvent = JSON.parse(dataStr);

            // Update graph node highlight
            if (rawEvent.agent === "multilingual") setActiveStep(0);
            else if (rawEvent.agent === "planner") setActiveStep(1);
            else if (rawEvent.agent === "weather" || rawEvent.agent === "hazard") setActiveStep(2);
            else if (rawEvent.agent === "synthesizer") setActiveStep(3);

            const newStep: AgentProgressStep = {
              id: `${rawEvent.agent}-${rawEvent.status}-${Date.now()}`,
              agent: rawEvent.agent,
              agentName: rawEvent.agentName,
              status: rawEvent.status === "completed" ? "complete" : rawEvent.status === "started" ? "running" : "failed",
              description: rawEvent.description,
              durationMs: rawEvent.durationMs,
              timestamp: rawEvent.timestamp,
            };

            setSteps((prev) => {
              // Replace running step for same agent if completing, or add new step
              const existingIdx = prev.findIndex((s) => s.agent === rawEvent.agent && s.status === "running");
              if (existingIdx !== -1 && newStep.status === "complete") {
                const copy = [...prev];
                copy[existingIdx] = newStep;
                return copy;
              }
              return [...prev, newStep];
            });
          } else if (eventName === "complete") {
            const stateData = JSON.parse(dataStr);
            setFinalResult(stateData);
            setActiveStep(4);
          } else if (eventName === "error") {
            const errData = JSON.parse(dataStr);
            setErrorMsg(errData.error || "Execution error encountered");
          }
        }
      }
    } catch (err: any) {
      console.error("[AgentActivity] Streaming execution failed:", err);
      setErrorMsg(err?.message || "Failed to connect to agent stream endpoint");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 text-slate-900 max-w-5xl mx-auto px-4 md:px-6 pt-4">
      {/* Header Banner */}
      <section className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 text-white border border-slate-800/20 p-6 md:p-8 shadow-md overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-cyan-200 text-xs font-semibold mb-3">
            <Cpu className="h-3.5 w-3.5 text-cyan-300" />
            Live SSE Agent Trace
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Live AI Agent Activity
          </h1>
          <p className="text-slate-200 text-sm md:text-base mt-1 max-w-2xl">
            Watch ORCA’s multi-agent pipeline execute in real time. Progress events stream directly from the LangGraph server with actual step durations.
          </p>
        </div>
      </section>

      {/* Interactive Query Selector & Run Test Card */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-700" />
            Run a Live Agent Execution Stream
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Select a question below and click "Watch AI Think" to trigger the live `/api/query/stream` SSE workflow
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
                disabled={isRunning}
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

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500 font-mono truncate max-w-md">
              Selected Query: <strong className="text-slate-900">"{selectedQuery}"</strong>
            </div>

            <Button
              onClick={handleRunStream}
              disabled={isRunning}
              className="bg-cyan-700 hover:bg-cyan-600 text-white font-semibold text-xs shadow-sm flex items-center gap-2 h-9 px-4 shrink-0"
            >
              <Play className={`h-3.5 w-3.5 ${isRunning ? "animate-spin" : ""}`} />
              {isRunning ? "Streaming Agent Flow..." : "Watch AI Think"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Multi-Agent Execution Graph Node Highlights */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-700" />
            Multi-Agent Pipeline Execution Graph
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Real-time status highlight across Planner, Weather/Ocean, Hazard/Geofence, and Synthesizer nodes
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {/* Node 1: Multilingual / Input */}
            <div
              className={`p-4 rounded-xl border text-center transition-all ${
                activeStep >= 0
                  ? "bg-cyan-50 border-cyan-400 text-cyan-900 shadow-sm"
                  : "bg-slate-50 border-slate-200 text-slate-400"
              }`}
            >
              <div className="h-8 w-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto mb-2 font-bold text-xs">
                <Globe className="h-4 w-4" />
              </div>
              <div className="font-bold text-xs">Multilingual Input</div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">Script Detection</div>
            </div>

            {/* Node 2: Planner Agent */}
            <div
              className={`p-4 rounded-xl border text-center transition-all ${
                activeStep === 1
                  ? "bg-blue-50 border-blue-500 text-blue-900 shadow-md ring-2 ring-blue-400/30 animate-pulse"
                  : activeStep > 1
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
                  activeStep === 2
                    ? "bg-cyan-50 border-cyan-500 text-cyan-900 shadow-md ring-2 ring-cyan-400/30 animate-pulse"
                    : activeStep > 2
                    ? "bg-emerald-50 border-emerald-400 text-emerald-900"
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
                  activeStep === 2
                    ? "bg-amber-50 border-amber-500 text-amber-900 shadow-md ring-2 ring-amber-400/30 animate-pulse"
                    : activeStep > 2
                    ? "bg-emerald-50 border-emerald-400 text-emerald-900"
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
                  ? "bg-purple-50 border-purple-500 text-purple-900 shadow-md ring-2 ring-purple-400/30 animate-pulse"
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
              <div className="text-[10px] text-slate-500 mt-1 font-mono">Final Output</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Agent Thinking Trace Component */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-700" />
            Live Agent Execution Trace & Telemetry
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Real-time SSE progress events captured directly from graph node execution
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {steps.length === 0 && !isRunning ? (
            <div className="text-xs text-slate-400 text-center py-8 border border-dashed border-slate-200 rounded-xl">
              Click "Watch AI Think" above to start the live Server-Sent Events execution trace.
            </div>
          ) : (
            <AgentThinkingTrace steps={steps} isStreaming={isRunning} />
          )}

          {finalResult && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-2">
              <div className="font-bold text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Live Execution Complete — Final Answer:</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-800 whitespace-pre-line font-sans">
                {finalResult.finalAnswer}
              </p>
              {finalResult.sources && finalResult.sources.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-emerald-200/60">
                  <span className="text-[10px] font-mono text-emerald-800">Cited Data Sources:</span>
                  {finalResult.sources.map((src) => (
                    <span key={src} className="px-2 py-0.5 rounded-full bg-white/80 border border-emerald-300 text-emerald-900 text-[10px] font-semibold">
                      {src}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
