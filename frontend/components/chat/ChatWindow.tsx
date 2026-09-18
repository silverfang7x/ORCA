"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@orca/shared";
import { MessageBubble } from "./MessageBubble";
import { VoiceInput } from "./VoiceInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Waves, Send, Navigation, AlertTriangle, ArrowLeft, Loader2, Compass } from "lucide-react";
import Link from "next/link";

interface ChatWindowProps {
  onSendMessage: (query: string) => Promise<void>;
  messages: ChatMessage[];
  isLoading: boolean;
  onSOSClick?: () => void;
}

const PRESET_QUERIES = [
  "Is it safe to fish near Kochi tomorrow?",
  "What is the wave height and tide forecast today?",
  "Are there any cyclone alerts or restricted zones nearby?",
];

export function ChatWindow({ onSendMessage, messages, isLoading, onSOSClick }: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat on message updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const textToSend = inputText;
    setInputText("");
    await onSendMessage(textToSend);
  };

  const handlePresetClick = async (presetText: string) => {
    if (isLoading) return;
    await onSendMessage(presetText);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] md:h-screen max-w-4xl mx-auto bg-[#f4f7fa] text-slate-900 border-x border-slate-200 shadow-lg relative overflow-hidden">
      {/* Top Telemetry & Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button asChild variant="ghost" size="icon" className="h-10 w-10 min-h-[44px] min-w-[44px] text-slate-600 hover:text-slate-900">
            <Link href="/fisherman/home" title="Return to Home">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-700 flex items-center justify-center text-white shadow-sm shrink-0">
              <Waves className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight">ORCA Assistant</span>
                <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1.5 py-0 border-emerald-300 text-emerald-700 bg-emerald-50">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping inline-block mr-1" />
                  ACTIVE
                </Badge>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1 font-mono truncate max-w-[160px] sm:max-w-none">
                <Navigation className="h-3 w-3 text-cyan-600 shrink-0" />
                <span className="truncate">Kochi Offshore (9.93°N, 76.26°E)</span>
              </div>
            </div>
          </div>
        </div>

        {/* SOS Alert Action */}
        <Button
          variant="destructive"
          size="sm"
          onClick={onSOSClick}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-3 py-2 min-h-[44px] gap-1 shadow-sm shrink-0"
        >
          <AlertTriangle className="h-4 w-4 animate-pulse" />
          <span className="hidden sm:inline">EMERGENCY</span> SOS
        </Button>
      </header>

      {/* Mini Radar / Telemetry Strip */}
      <div className="bg-white/80 border-b border-slate-200 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-600 font-mono shrink-0">
        <div className="flex items-center gap-2 truncate">
          <Compass className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
          <span className="truncate">ZONE 4 • SWELL: 1.8M @ 9S • EBB TIDE ACTIVE</span>
        </div>
        <div className="hidden sm:block text-[11px] text-slate-400 shrink-0">ISRO Coastal Data Pipeline</div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 scroll-smooth overscroll-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto text-slate-500">
            <div className="h-12 w-12 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mb-3 shadow-sm">
              <Waves className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">ORCA Marine Intelligence</h3>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-6">
              Ask natural-language questions in your language regarding fishing safety, wave heights, tides, or hazard warnings.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => <MessageBubble key={index} message={msg} />)
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="flex items-start gap-3 max-w-[85%] my-3">
            <div className="h-8 w-8 rounded-full bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="space-y-2 bg-white border border-slate-200 rounded-2xl p-4 w-full shadow-sm">
              <div className="flex items-center gap-2 text-xs text-cyan-700 font-medium">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>ORCA Agents Synthesizing Marine Data...</span>
              </div>
              <Skeleton className="h-4 w-3/4 bg-slate-100" />
              <Skeleton className="h-4 w-1/2 bg-slate-100" />
            </div>
          </div>
        )}
      </div>

      {/* Preset Query Chips */}
      <div className="bg-white/90 px-3 py-2 border-t border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 shrink-0">
        {PRESET_QUERIES.map((query, i) => (
          <button
            key={i}
            onClick={() => handlePresetClick(query)}
            disabled={isLoading}
            className="text-xs bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-full px-3 py-2 min-h-[44px] flex items-center transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {query}
          </button>
        ))}
      </div>

      {/* Fixed Bottom Input Dock */}
      <footer className="sticky bottom-0 z-30 bg-white border-t border-slate-200 p-2.5 sm:p-4 shadow-md shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Voice Input Button */}
          <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />

          {/* Text Input */}
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask ORCA safety, tides, weather, hazards..."
            disabled={isLoading}
            className="flex-1 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus-visible:ring-cyan-600 min-h-[44px]"
          />

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-cyan-700 hover:bg-cyan-600 text-white font-semibold h-11 min-h-[44px] px-4 gap-1.5 shrink-0 shadow-sm"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </footer>
    </div>
  );
}
