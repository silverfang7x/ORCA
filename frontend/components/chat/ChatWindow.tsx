"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage, LocationQuery } from "@orca/shared";
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
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-slate-950 text-slate-100 border-x border-slate-900 shadow-2xl relative">
      {/* Top Telemetry & Navigation Header */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-sm">
              <Waves className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-tight">ORCA Assistant</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/40 text-emerald-400 bg-emerald-950/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping inline-block mr-1" />
                  SAT-LINK ACTIVE
                </Badge>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <Navigation className="h-3 w-3 text-cyan-400" />
                <span>Kochi Offshore (9.93°N, 76.26°E)</span>
              </div>
            </div>
          </div>
        </div>

        {/* SOS Alert Action */}
        <Button
          variant="destructive"
          size="sm"
          onClick={onSOSClick}
          className="bg-red-600/90 hover:bg-red-500 text-white font-semibold text-xs px-3 py-1.5 gap-1 shadow-md shadow-red-900/30"
        >
          <AlertTriangle className="h-3.5 w-3.5 animate-pulse" />
          <span className="hidden sm:inline">EMERGENCY</span> SOS
        </Button>
      </header>

      {/* Mini Radar / Telemetry Strip */}
      <div className="bg-slate-900/70 border-b border-slate-800/60 px-4 py-2 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <Compass className="h-3.5 w-3.5 text-cyan-400" />
          <span>ZONE 4 • SWELL: 1.8M @ 9S • EBB TIDE ACTIVE</span>
        </div>
        <div className="hidden sm:block text-[11px] text-slate-500">ISRO Coastal Data Pipeline</div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto text-slate-500">
            <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
              <Waves className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-200 mb-1">ORCA Marine Intelligence</h3>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
              Ask natural-language questions in your language regarding fishing safety, wave heights, tides, or hazard warnings.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => <MessageBubble key={index} message={msg} />)
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="flex items-start gap-3 max-w-[80%] my-3">
            <div className="h-8 w-8 rounded-full bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="space-y-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 w-full">
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>ORCA Agents Synthesizing Marine Data...</span>
              </div>
              <Skeleton className="h-4 w-3/4 bg-slate-800" />
              <Skeleton className="h-4 w-1/2 bg-slate-800" />
            </div>
          </div>
        )}
      </div>

      {/* Preset Query Chips */}
      <div className="bg-slate-950/80 px-4 py-2 border-t border-slate-900/80 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
        {PRESET_QUERIES.map((query, i) => (
          <button
            key={i}
            onClick={() => handlePresetClick(query)}
            disabled={isLoading}
            className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-full px-3 py-1 transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {query}
          </button>
        ))}
      </div>

      {/* Fixed Bottom Input Dock */}
      <footer className="sticky bottom-0 z-30 bg-slate-950 border-t border-slate-800/80 p-3 sm:p-4 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Voice Input Button */}
          <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />

          {/* Text Input */}
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask ORCA safety, tides, weather, or hazards..."
            disabled={isLoading}
            className="flex-1 bg-slate-900/90 border-slate-700/80 text-slate-100 placeholder:text-slate-500 text-sm focus-visible:ring-cyan-500"
          />

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold h-10 px-4 gap-1 shrink-0"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </footer>
    </div>
  );
}
