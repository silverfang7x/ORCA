"use client";

import { useState } from "react";
import {
  Settings,
  Shield,
  Radio,
  Key,
  Save,
  CheckCircle2,
  Copy,
  RefreshCw,
  Bell,
  MapPin,
  Sliders,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OfficialSettingsPage() {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form states
  const [primarySector, setPrimarySector] = useState("kochi");
  const [monitoringRadius, setMonitoringRadius] = useState("50");
  const [autoGeofence, setAutoGeofence] = useState(true);
  const [highWaveAutoTrigger, setHighWaveAutoTrigger] = useState(true);

  const [refreshRate, setRefreshRate] = useState("5");
  const [sirenTone, setSirenTone] = useState("high");
  const [audioSirenEnabled, setAudioSirenEnabled] = useState(true);
  const [autoBroadcastAdvisories, setAutoBroadcastAdvisories] = useState(true);

  const [incoisKey, setIncoisKey] = useState("inc_live_9f823a10029b48f");
  const [isroKey, setIsroKey] = useState("isro_sat_77x1a980422c");
  const [bhashiniKey, setBhashiniKey] = useState("bhash_prod_442b0198e");

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3500);
  };

  const handleCopy = (keyName: string, keyValue: string) => {
    navigator.clipboard.writeText(keyValue);
    setCopiedKey(keyName);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Title & Action Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-semibold mb-2 shadow-sm">
            <Settings className="h-3 w-3 text-cyan-700" />
            Control Center Parameters & Telemetry Config
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Command Settings
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            AIS radar update intervals, emergency SOS audio sirens, and regional broadcast API keys.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className="bg-cyan-700 hover:bg-cyan-600 text-white font-semibold text-xs shadow-sm flex items-center gap-2 shrink-0 h-10 px-5"
        >
          <Save className="h-4 w-4" />
          Save Configuration
        </Button>
      </section>

      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          Command center configuration successfully saved and updated across active nodes.
        </div>
      )}

      {/* Card 1: Regional Coverage Configuration */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-cyan-700" />
            Regional Coverage & Monitoring Radius
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Define primary coastal sectors, geofence bounds, and automated safety thresholds
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                Primary Coastal Command Sector
              </label>
              <select
                value={primarySector}
                onChange={(e) => setPrimarySector(e.target.value)}
                className="w-full text-xs border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="kochi">Kochi Coastal HQ (Sector Alpha — 09.93°N, 76.26°E)</option>
                <option value="chennai">Chennai Maritime Control (13.08°N, 80.27°E)</option>
                <option value="vizhinjam">Vizhinjam Port Command (08.38°N, 76.98°E)</option>
                <option value="lakshadweep">Lakshadweep Outpost (10.56°N, 72.64°E)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                Active Monitoring Radius (Kilometers)
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={monitoringRadius}
                  onChange={(e) => setMonitoringRadius(e.target.value)}
                  className="text-xs bg-slate-50 border-slate-200 h-9 font-mono"
                />
                <span className="text-xs text-slate-500 font-mono shrink-0">km from HQ</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Automatic Geofence Boundary Enforcement</div>
                <div className="text-[11px] text-slate-500">Auto-flag vessels approaching international maritime boundaries.</div>
              </div>
              <button
                type="button"
                onClick={() => setAutoGeofence(!autoGeofence)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoGeofence ? "bg-cyan-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoGeofence ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">High Wave Emergency Protocol Auto-Trigger</div>
                <div className="text-[11px] text-slate-500">Automatically broadcast advisory alerts when wave heights exceed 3.0 meters.</div>
              </div>
              <button
                type="button"
                onClick={() => setHighWaveAutoTrigger(!highWaveAutoTrigger)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  highWaveAutoTrigger ? "bg-cyan-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    highWaveAutoTrigger ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Alert Broadcast Preferences */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Radio className="h-4 w-4 text-cyan-700" />
            Alert Broadcast & Telemetry Preferences
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Control room audio sirens, radar telemetry refresh rates, and automated broadcast dispatches
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                AIS & Open-Meteo Telemetry Refresh Rate
              </label>
              <select
                value={refreshRate}
                onChange={(e) => setRefreshRate(e.target.value)}
                className="w-full text-xs border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="1">Every 1 minute (Real-time telemetry)</option>
                <option value="5">Every 5 minutes (Standard operational)</option>
                <option value="15">Every 15 minutes (Low bandwidth mode)</option>
                <option value="30">Every 30 minutes</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                Emergency SOS Siren Tone
              </label>
              <select
                value={sirenTone}
                onChange={(e) => setSirenTone(e.target.value)}
                className="w-full text-xs border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="high">High Siren (Coastal Standard 105 dB)</option>
                <option value="pulse">Pulse Beacon Tone</option>
                <option value="flashing">Silent Flashing Visual Indicator Only</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">SOS Audio Alert Alarm Siren</div>
                <div className="text-[11px] text-slate-500">Play immediate audible alarm sound in control room when SOS distress signal is received.</div>
              </div>
              <button
                type="button"
                onClick={() => setAudioSirenEnabled(!audioSirenEnabled)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  audioSirenEnabled ? "bg-cyan-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    audioSirenEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Auto-Broadcast Critical Safety Advisories</div>
                <div className="text-[11px] text-slate-500">Allow AI Synthesizer Agent to auto-dispatch regional language broadcasts during Level-3 emergencies.</div>
              </div>
              <button
                type="button"
                onClick={() => setAutoBroadcastAdvisories(!autoBroadcastAdvisories)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoBroadcastAdvisories ? "bg-cyan-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoBroadcastAdvisories ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: API & External Integration Keys */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Key className="h-4 w-4 text-cyan-700" />
            API & Telemetry Integration Keys
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Access keys for INCOIS marine ocean data, ISRO satellite feeds, and Bhashini AI translation engine
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">
                INCOIS Live Ocean Data Key
              </label>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0">
                Connected
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="password"
                readOnly
                value={incoisKey}
                className="text-xs bg-slate-50 border-slate-200 h-9 font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy("incois", incoisKey)}
                className="h-9 text-xs border-slate-200 shrink-0"
              >
                {copiedKey === "incois" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">
                ISRO Satellite Telemetry Feed Key
              </label>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0">
                Active Feed
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="password"
                readOnly
                value={isroKey}
                className="text-xs bg-slate-50 border-slate-200 h-9 font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy("isro", isroKey)}
                className="h-9 text-xs border-slate-200 shrink-0"
              >
                {copiedKey === "isro" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">
                Bhashini Multilingual AI Engine API Key
              </label>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] px-1.5 py-0">
                Multilingual Active
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="password"
                readOnly
                value={bhashiniKey}
                className="text-xs bg-slate-50 border-slate-200 h-9 font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy("bhashini", bhashiniKey)}
                className="h-9 text-xs border-slate-200 shrink-0"
              >
                {copiedKey === "bhashini" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
