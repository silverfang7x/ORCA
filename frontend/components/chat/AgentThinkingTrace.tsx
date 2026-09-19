"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  Compass,
  Waves,
  ShieldCheck,
  Cpu,
  Globe,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface AgentProgressStep {
  id: string;
  agent: "planner" | "weather" | "hazard" | "synthesizer" | "multilingual";
  agentName: string;
  status: "pending" | "running" | "complete" | "failed";
  description: string;
  durationMs?: number;
  timestamp?: string;
}

interface AgentThinkingTraceProps {
  steps: AgentProgressStep[];
  isStreaming?: boolean;
  className?: string;
}

export function AgentThinkingTrace({ steps, isStreaming, className = "" }: AgentThinkingTraceProps) {
  const getAgentIcon = (agent: AgentProgressStep["agent"]) => {
    switch (agent) {
      case "multilingual":
        return <Globe className="h-4 w-4 text-indigo-600" />;
      case "planner":
        return <Compass className="h-4 w-4 text-blue-600" />;
      case "weather":
        return <Waves className="h-4 w-4 text-cyan-600" />;
      case "hazard":
        return <ShieldCheck className="h-4 w-4 text-amber-600" />;
      case "synthesizer":
        return <Cpu className="h-4 w-4 text-purple-600" />;
      default:
        return <Compass className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className={`space-y-3 font-sans ${className}`}>
      {steps.map((step) => {
        const isRunning = step.status === "running";
        const isComplete = step.status === "complete";
        const isFailed = step.status === "failed";

        return (
          <div
            key={step.id}
            className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs ${
              isRunning
                ? "bg-blue-50/80 border-blue-400 text-blue-900 shadow-sm ring-1 ring-blue-300/50 animate-pulse"
                : isComplete
                ? "bg-slate-50 border-slate-200 text-slate-900 shadow-none"
                : isFailed
                ? "bg-rose-50 border-rose-200 text-rose-900"
                : "bg-slate-50/50 border-slate-100 text-slate-400 opacity-60"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  isRunning
                    ? "bg-blue-100 text-blue-700"
                    : isComplete
                    ? "bg-emerald-100 text-emerald-700"
                    : isFailed
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isRunning ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                ) : isComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : isFailed ? (
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                ) : (
                  getAgentIcon(step.agent)
                )}
              </div>

              <div>
                <div className="font-bold flex items-center gap-2 text-slate-900">
                  <span>{step.agentName}</span>
                  {isRunning && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-[10px] animate-pulse">
                      Executing...
                    </Badge>
                  )}
                </div>
                <p
                  className={`mt-0.5 text-xs leading-relaxed ${
                    isRunning ? "text-blue-800 font-medium" : isComplete ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>

            <div className="self-end sm:self-center shrink-0">
              {isComplete && typeof step.durationMs === "number" ? (
                <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 text-[10px] font-mono">
                  <Clock className="h-3 w-3 mr-1 text-slate-400" />
                  {step.durationMs}ms
                </Badge>
              ) : isRunning ? (
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-[10px] font-mono">
                  Measuring...
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-slate-100 text-slate-400 border-slate-200 text-[10px] font-mono">
                  Pending
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
