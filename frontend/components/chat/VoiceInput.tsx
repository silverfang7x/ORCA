"use client";

import { useEffect, useState, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        const instance = new SpeechRecognition();
        instance.continuous = false;
        instance.interimResults = false;
        instance.lang = "en-IN";

        instance.onresult = (event: any) => {
          const transcript = event.results[0]?.[0]?.transcript;
          if (transcript) {
            onTranscript(transcript);
          }
          setIsListening(false);
        };

        instance.onerror = (event: any) => {
          console.warn("[VoiceInput] Speech recognition error:", event.error);
          setIsListening(false);
        };

        instance.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = instance;
      }
    }
  }, [onTranscript]);

  if (!isSupported) {
    return null;
  }

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("[VoiceInput] Could not start speech recognition:", err);
      }
    }
  };

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "secondary"}
      size="icon"
      onClick={toggleListening}
      disabled={disabled}
      className={`relative h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 transition-all ${
        isListening
          ? "animate-pulse ring-2 ring-red-500 shadow-md shadow-red-500/30"
          : "bg-slate-100 hover:bg-slate-200 text-cyan-700 border border-slate-200"
      }`}
      title={isListening ? "Stop listening" : "Speak your question (Voice Input)"}
    >
      {isListening ? (
        <MicOff className="h-5 w-5 text-white animate-bounce" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
}
