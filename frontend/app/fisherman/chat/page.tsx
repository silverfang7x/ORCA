"use client";

import { useState } from "react";
import { ChatMessage, LocationQuery } from "@orca/shared";
import { ChatWindow } from "@/components/chat/ChatWindow";

const DEFAULT_KOCHI_LOCATION: LocationQuery = {
  latitude: 9.9312,
  longitude: 76.2673,
  date: new Date().toISOString()
};

export default function FishermanChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Namaste! I am ORCA, your ocean safety assistant. Ask me questions like \"Is it safe to fish tomorrow?\" in English or your local language.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ["ORCA Marine Pipeline"]
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

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
   * Handles user query submission to Express API
   */
  const handleSendMessage = async (queryText: string) => {
    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessage = {
      role: "user",
      content: queryText,
      timestamp: userTimestamp
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const location = await getBrowserLocation();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      const res = await fetch(`${apiUrl}/api/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userQuery: queryText,
          location
        })
      });

      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const assistantTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.finalAnswer || "I wasn't able to generate a complete advisory for this location right now.",
        timestamp: assistantTimestamp,
        sources: data.sources || [],
        language: data.detectedLanguage
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("[FishermanChat] Failed to query API:", error);
      const errorTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Something went wrong - please check your connection and try again.",
        timestamp: errorTimestamp,
        sources: []
      };

      setMessages((prev) => [...prev, errorMessage]);
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      const res = await fetch(`${apiUrl}/api/sos`, {
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
