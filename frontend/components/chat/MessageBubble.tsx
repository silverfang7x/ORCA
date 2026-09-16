import { ChatMessage } from "@orca/shared";
import { Badge } from "@/components/ui/badge";
import { Waves, User, ExternalLink, ShieldCheck } from "lucide-react";
import { ExplainabilityPanel } from "./ExplainabilityPanel";
import { QuickOverviewList } from "./QuickOverviewList";

interface MessageBubbleProps {
  message: ChatMessage & { weatherData?: any; hazardData?: any };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full my-3 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-3 max-w-[88%] sm:max-w-[78%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-md ${
            isUser
              ? "bg-slate-700 text-slate-200 border border-slate-600"
              : "bg-cyan-600 text-white border border-cyan-500 shadow-cyan-500/20"
          }`}
        >
          {isUser ? <User className="h-4 w-4" /> : <Waves className="h-4 w-4" />}
        </div>

        {/* Message Card / Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg transition-all ${
            isUser
              ? "bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tr-xs"
              : "bg-slate-900/95 border border-slate-800 text-slate-100 rounded-tl-xs backdrop-blur-md"
          }`}
        >
          {/* Assistant Ribbon Header */}
          {!isUser && (
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-800/80 text-xs text-cyan-400 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span>ORCA SAFETY ADVISORY</span>
              {message.language && message.language !== "en" && (
                <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0 border-slate-700 text-slate-400">
                  {message.language.toUpperCase()}
                </Badge>
              )}
            </div>
          )}

          {/* Quick Overview Summary (Rendered inside Assistant Message) */}
          {!isUser && (message.weatherData || message.hazardData) && (
            <QuickOverviewList weatherData={message.weatherData} hazardData={message.hazardData} />
          )}

          {/* Message Content */}
          <div className="whitespace-pre-wrap text-slate-200 font-sans tracking-wide">
            {message.content}
          </div>

          {/* Explainability Panel ("How ORCA Decided") */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <ExplainabilityPanel sources={message.sources} />
          )}

          {/* Cited Sources Section */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-500 font-mono">CITED SOURCES:</span>
              {message.sources.map((src, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="bg-slate-800/80 hover:bg-slate-800 text-cyan-300 border border-slate-700/70 text-[10px] px-2 py-0.5 gap-1 font-mono"
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
              isUser ? "text-slate-400 text-right" : "text-slate-500 text-left"
            }`}
          >
            {message.timestamp}
          </div>
        </div>
      </div>
    </div>
  );
}
