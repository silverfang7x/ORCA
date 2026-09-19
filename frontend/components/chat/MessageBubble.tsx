import { motion } from "framer-motion";
import { ChatMessage } from "@orca/shared";
import { Badge } from "@/components/ui/badge";
import { Waves, User, ExternalLink, ShieldCheck } from "lucide-react";
import { ExplainabilityPanel } from "./ExplainabilityPanel";
import { QuickOverviewList } from "./QuickOverviewList";
import { InlineAgentTrace } from "./InlineAgentTrace";
import { AgentProgressStep } from "./AgentThinkingTrace";

interface MessageBubbleProps {
  message: ChatMessage & {
    weatherData?: any;
    hazardData?: any;
    thinkingSteps?: AgentProgressStep[];
    reasoningSummary?: string;
    isStreaming?: boolean;
  };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex w-full my-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex gap-3 max-w-[92%] sm:max-w-[82%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm ${
            isUser
              ? "bg-slate-700 text-white border border-slate-600"
              : "bg-cyan-700 text-white border border-cyan-600 shadow-cyan-600/20"
          }`}
        >
          {isUser ? <User className="h-4 w-4" /> : <Waves className="h-4 w-4" />}
        </div>

        {/* Message Card / Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all ${
            isUser
              ? "bg-slate-800 text-white rounded-tr-xs"
              : "bg-white border border-slate-200 text-slate-900 rounded-tl-xs"
          }`}
        >
          {/* Assistant Ribbon Header */}
          {!isUser && (
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-100 text-xs text-cyan-700 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-700" />
              <span>ORCA SAFETY ADVISORY</span>
              {message.language && message.language !== "en" && (
                <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0 border-slate-300 text-slate-600">
                  {message.language.toUpperCase()}
                </Badge>
              )}
            </div>
          )}

          {/* Inline Multi-Agent Thinking Trace & Reasoning Summary */}
          {!isUser && (message.thinkingSteps || message.reasoningSummary || message.isStreaming) && (
            <InlineAgentTrace
              steps={message.thinkingSteps || []}
              isStreaming={message.isStreaming}
              reasoningSummary={message.reasoningSummary}
            />
          )}

          {/* Quick Overview Summary */}
          {!isUser && (message.weatherData || message.hazardData) && (
            <QuickOverviewList weatherData={message.weatherData} hazardData={message.hazardData} />
          )}

          {/* Message Content */}
          {message.content && (
            <div className="whitespace-pre-wrap font-sans tracking-wide">
              {message.content}
            </div>
          )}

          {/* Explainability Panel ("How ORCA Decided") */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <ExplainabilityPanel sources={message.sources} />
          )}

          {/* Cited Sources Section */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-mono">CITED SOURCES:</span>
              {message.sources.map((src, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="bg-slate-100 text-cyan-800 border border-slate-200 text-[10px] px-2 py-0.5 gap-1 font-mono"
                >
                  <span>{src}</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                </Badge>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <div
            className={`text-[10px] mt-1.5 font-mono ${
              isUser ? "text-slate-300 text-right" : "text-slate-400 text-left"
            }`}
          >
            {message.timestamp}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
