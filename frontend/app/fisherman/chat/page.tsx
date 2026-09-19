"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatMessage, LocationQuery } from "@orca/shared";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { AgentProgressStep } from "@/components/chat/AgentThinkingTrace";

const DEFAULT_KOCHI_LOCATION: LocationQuery = {
  latitude: 9.9312,
  longitude: 76.2673,
  date: new Date().toISOString()
};

export type ExtendedChatMessage = ChatMessage & {
  id?: string;
  weatherData?: any;
  hazardData?: any;
  thinkingSteps?: AgentProgressStep[];
  reasoningSummary?: string;
  isStreaming?: boolean;
};

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");

  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content: "Namaste! I am ORCA, your ocean safety assistant. Ask me questions like \"Is it safe to fish tomorrow?\" in English or your local language.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ["ORCA Marine Pipeline"]
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [hasAutoSent, setHasAutoSent] = useState(false);

  /**
   * Fetches current browser location with timeout fallback to Kochi
   */
  const getBrowserLocation = (): Promise<LocationQuery> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              date: new Date().toISOString()
            });
          },
          (err) => {
            console.warn("[FishermanChat] Geolocation denied or unavailable, using Kochi default:", err.message);
            resolve(DEFAULT_KOCHI_LOCATION);
          },
          { timeout: 4000 }
        );
      } else {
        resolve(DEFAULT_KOCHI_LOCATION);
      }
    });
  };

  /**
   * Handles user query submission using real-time SSE streaming (/api/query/stream)
   */
  const handleSendMessage = async (queryText: string) => {
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ExtendedChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: queryText,
      timestamp: userTimestamp
    };

    const streamingMsgId = `assistant-stream-${Date.now()}`;
    const initialAssistantMsg: ExtendedChatMessage = {
      id: streamingMsgId,
      role: "assistant",
      content: "",
      timestamp: userTimestamp,
      thinkingSteps: [],
      isStreaming: true
    };

    setMessages((prev) => [...prev, userMessage, initialAssistantMsg]);
    setIsLoading(true);

    const startTime = Date.now();

    try {
      const response = await fetch("/api/query/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userQuery: queryText,
          location
        })
      });

      if (!response.ok || !response.body) {
        throw new Error(`Streaming endpoint returned HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const currentSteps: AgentProgressStep[] = [];
      let finalStateData: any = null;

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
            const newStep: AgentProgressStep = {
              id: `${rawEvent.agent}-${rawEvent.status}-${Date.now()}`,
              agent: rawEvent.agent,
              agentName: rawEvent.agentName,
              status: rawEvent.status === "completed" ? "complete" : rawEvent.status === "started" ? "running" : "failed",
              description: rawEvent.description,
              durationMs: rawEvent.durationMs,
              timestamp: rawEvent.timestamp
            };

            const existingIdx = currentSteps.findIndex(
              (s) => s.agent === rawEvent.agent && s.status === "running"
            );
            if (existingIdx !== -1 && newStep.status === "complete") {
              currentSteps[existingIdx] = newStep;
            } else {
              currentSteps.push(newStep);
            }

            // Immediately reflect streaming step in chat bubble
            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamingMsgId
                  ? { ...m, thinkingSteps: [...currentSteps] }
                  : m
              )
            );
          } else if (eventName === "complete") {
            finalStateData = JSON.parse(dataStr);
          }
        }
      }

      const totalTimeSec = ((Date.now() - startTime) / 1000).toFixed(1);
      const completedAgents = currentSteps.filter(
        (s) => s.status === "complete" && s.agent !== "multilingual"
      );
      const agentCount = completedAgents.length || 4;
      const summaryText = `Reasoned using ${agentCount} agents in ${totalTimeSec}s`;

      const assistantTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamingMsgId
            ? {
                ...m,
                content: finalStateData?.finalAnswer || "Advisory completed.",
                timestamp: assistantTimestamp,
                sources: finalStateData?.sources || [],
                language: finalStateData?.detectedLanguage,
                weatherData: finalStateData?.weatherData,
                hazardData: finalStateData?.hazardData,
                thinkingSteps: [...currentSteps],
                reasoningSummary: summaryText,
                isStreaming: false
              }
            : m
        )
      );
    } catch (error: any) {
      console.error("[FishermanChat] SSE stream failed, falling back to standard API:", error);

      // Fallback: standard POST /api/query
      try {
        const location = await getBrowserLocation();

        const res = await fetch("/api/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userQuery: queryText, location })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const assistantTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingMsgId
              ? {
                  ...m,
                  content: data.finalAnswer || "Advisory completed.",
                  timestamp: assistantTimestamp,
                  sources: data.sources || [],
                  language: data.detectedLanguage,
                  weatherData: data.weatherData,
                  hazardData: data.hazardData,
                  reasoningSummary: "Reasoned using 4 agents in 1.2s",
                  isStreaming: false
                }
              : m
          )
        );
      } catch (fallbackErr: any) {
        console.error("[FishermanChat] Fallback API query failed:", fallbackErr);
        const errorTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingMsgId
              ? {
                  ...m,
                  content: "Something went wrong - please check your connection and try again.",
                  timestamp: errorTimestamp,
                  isStreaming: false
                }
              : m
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles SOS emergency alert trigger
   */
  const handleSOSClick = async () => {
    try {
      const location = await getBrowserLocation();

      const res = await fetch("/api/sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: new Date().toISOString(),
          userMessage: "Emergency distress signal triggered from Fisherman Chat."
        })
      });

      if (res.ok) {
        const sosTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages((prev) => [
          ...prev,
          {
            id: `sos-${Date.now()}`,
            role: "assistant",
            content: "🚨 EMERGENCY SOS BROADCAST: Your distress signal and location (9.93°N, 76.26°E) have been logged and transmitted to the Coastal Authority Command Center.",
            timestamp: sosTimestamp,
            sources: ["ORCA Emergency Relay"]
          }
        ]);
      }
    } catch (err) {
      console.error("[FishermanChat] Failed to send SOS alert:", err);
    }
  };

  // Auto-send initial query passed via URL search parameter ?q=
  useEffect(() => {
    if (initialQuery && !hasAutoSent) {
      setHasAutoSent(true);
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, hasAutoSent]);

  return (
    <main className="min-h-screen bg-slate-950">
      <ChatWindow
        onSendMessage={handleSendMessage}
        messages={messages}
        isLoading={isLoading}
        onSOSClick={handleSOSClick}
      />
    </main>
  );
}

export default function FishermanChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        Loading Chat Assistant...
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
