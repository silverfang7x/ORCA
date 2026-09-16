"use client";

import { useState, useEffect } from "react";
import { Settings, Globe, Check, Bell, Save, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  description: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    description: "Standard English language interface & AI responses",
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    description: "കേരള തീരദേശ മത്സ്യത്തൊഴിലാളികൾക്കുള്ള ഭാഷാ പിന്തുണ",
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    description: "தமிழ்நாடு & ஆழ்கடல் மீனவர்களுக்கான மொழி உதவி",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    description: "राष्ट्रीय समुद्री सुरक्षा एवं सहायता भाषा विकल्प",
  },
];

export default function SettingsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [enableAudioAlerts, setEnableAudioAlerts] = useState<boolean>(true);
  const [enableHighWaveAlerts, setEnableHighWaveAlerts] = useState<boolean>(true);

  // Load saved preference on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("orca_language_preference");
      if (savedLang) {
        setSelectedLanguage(savedLang);
      }
    }
  }, []);

  // Save settings handler
  const handleSaveSettings = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("orca_language_preference", selectedLanguage);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-900 max-w-4xl mx-auto px-4 md:px-6 pt-4">
      {/* Header Banner */}
      <section className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 text-white border border-slate-800/20 p-6 md:p-8 shadow-md overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-cyan-200 text-xs font-semibold mb-3">
            <Settings className="h-3.5 w-3.5 text-cyan-300" />
            User Preferences & Multilingual Config
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Settings & Language Preferences
          </h1>
          <p className="text-slate-200 text-sm md:text-base mt-1 max-w-2xl">
            Configure your preferred response language for Bhashini translation pipeline, alert notifications, and audio output.
          </p>
        </div>
      </section>

      {/* Language Selector Card */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Globe className="h-5 w-5 text-cyan-700" />
                Select Preferred Language / ഭാഷ തെരഞ്ഞെടുക്കുക
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">
                ORCA AI will detect and translate safety advisories into your selected coastal language.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs text-cyan-800 border-cyan-200 bg-cyan-50">
              Bhashini Pipeline Active
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <div
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? "bg-cyan-50/80 border-cyan-500 shadow-sm ring-1 ring-cyan-500/50"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-slate-900">{lang.name}</span>
                        <span className="text-xs font-semibold text-cyan-700 font-mono">({lang.nativeName})</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{lang.description}</p>
                    </div>

                    <div
                      className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-cyan-600 border-cyan-500 text-white" : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
                    <span>Language Code: {lang.code}</span>
                    <span className={isSelected ? "text-cyan-700 font-semibold" : "text-slate-500"}>
                      {isSelected ? "Active Language" : "Tap to select"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notification Toggles */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-600" />
              Coastal Alert Preferences
            </h4>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-900">High Swell & Cyclone Audio Alerts</span>
                  <p className="text-slate-500 text-[11px]">Play audio warnings when entering high wave zones</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableAudioAlerts}
                  onChange={(e) => setEnableAudioAlerts(e.target.checked)}
                  className="h-4 w-4 accent-cyan-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-900">Emergency SOS Coastal Broadcasts</span>
                  <p className="text-slate-500 text-[11px]">Receive distress alerts from nearby fishing vessels</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableHighWaveAlerts}
                  onChange={(e) => setEnableHighWaveAlerts(e.target.checked)}
                  className="h-4 w-4 accent-cyan-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              onClick={handleSaveSettings}
              className="w-full sm:w-auto bg-cyan-700 hover:bg-cyan-600 text-white font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </Button>

            {savedSuccess && (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl animate-fade-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Settings saved! Language preference updated to {LANGUAGES.find(l => l.code === selectedLanguage)?.name}.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
