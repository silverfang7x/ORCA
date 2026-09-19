"use client";

import React, { useState } from "react";
import {
  Compass,
  Waves,
  ShieldCheck,
  Cpu,
  Globe,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Brain,
  Clock,
} from "lucide-react";
import { AgentProgressStep } from "./AgentThinkingTrace";

interface InlineAgentTraceProps {
  steps: AgentProgressStep[];
  isStreaming?: boolean;
  reasoningSummary?: string;
  defaultExpanded?: boolean;
}

export function InlineAgentTrace({
  steps,
  isStreaming = false,
  reasoningSummary,
  defaultExpanded = false,
}: InlineAgentTraceProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getAgentIcon = (agent: AgentProgressStep["agent"]) => {
    switch (agent) {
      case "multilingual":
        return <Globe className="h-3.5 w-3.5 text-indigo-600" />;
      case "planner":
        return <Compass className="h-3.5 w-3.5 text-blue-600" />;
      case "weather":
        return <Waves className="h-3.5 w-3.5 text-cyan-600" />;
      case "hazard":
        return <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />;
      case "synthesizer":
        return <Cpu className="h-3.5 w-3.5 text-purple-600" />;
      default:
        return <Compass className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  // Force expansion while actively streaming progress
  const showExpanded = isStreaming || isExpanded;

  return (
    <div className="my-1.5 text-xs font-sans">
      {/* Summary Line Badge / Toggle Button */}
      {!isStreaming && reasoningSummary && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50/90 hover:bg-cyan-100 border border-cyan-200 text-cyan-950 font-medium text-[11px] transition-all cursor-pointer shadow-2xs mb-2"
        >
          <Brain className="h-3.5 w-3.5 text-cyan-700" />
          <span>{reasoningSummary}</span>
          {showExpanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-cyan-700" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-cyan-700" />
          )}
        </button>
      )}

      {/* Streaming Active Indicator */}
      {isStreaming && (
        <div className="flex items-center gap-2 text-cyan-800 font-semibold text-xs mb-2 px-1">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-700" />
          <span>ORCA is reasoning in real time...</span>
        </div>
      )}

      {/* Trace Step Cards Container */}
      {showExpanded && steps && steps.length > 0 && (
        <div className="space-y-1.5 p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/80 shadow-2xs">
          {steps.map((step) => {
            const isRunning = step.status === "running";
            const isComplete = step.status === "complete";

            return (
              <div
                key={step.id}
                className={`flex items-center justify-between p-2 rounded-lg text-[11px] transition-all ${
                  isRunning
                    ? "bg-cyan-50 border border-cyan-300 text-cyan-950 font-medium"
                    : isComplete
                    ? "bg-white border border-slate-200/60 text-slate-800"
                    : "bg-slate-100/50 text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <div className="shrink-0">
                    {isRunning ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-600" />
                    ) : isComplete ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      getAgentIcon(step.agent)
                    )}
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-slate-900 mr-1.5">{step.agentName}:</span>
                    <span className="text-slate-600 truncate">{step.description}</span>
                  </div>
                </div>

                <div className="shrink-0 font-mono text-[10px] text-slate-500">
                  {isComplete && typeof step.durationMs === "number" ? (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      <Clock className="h-2.5 w-2.5 text-slate-400" />
                      {step.durationMs}ms
                    </span>
                  ) : isRunning ? (
                    <span className="text-cyan-700 font-semibold animate-pulse">Running...</span>
                  ) : (
                    <span>Pending</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
