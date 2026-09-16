"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  MapPin,
  ShieldCheck,
  Navigation,
  TrendingUp,
  FileText,
  Users,
  Settings,
  Menu,
  Radio,
  Activity,
  Compass,
  ShieldAlert,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import LeafletMap, { MapMarker, HeatPoint } from "@/components/map/LeafletMap";

// Regional map center (Kochi & Malabar Coast regional view)
const REGIONAL_MAP_CENTER = { lat: 9.9312, lng: 76.2673 };

// Admin Navigation Menu Items (Exclusive to Official Command Dashboard)
const ADMIN_NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, href: "#overview" },
  { id: "live-alerts", label: "Live Alerts", icon: AlertTriangle, href: "#live-alerts" },
  { id: "regional-map", label: "Regional Map", icon: MapPin, href: "#regional-map" },
  { id: "geofencing", label: "Geofencing & Boundaries", icon: ShieldCheck, href: "#geofencing" },
  { id: "vessel-tracking", label: "Vessel Tracking", icon: Navigation, href: "#vessel-tracking" },
  { id: "historical-trends", label: "Historical Trends", icon: TrendingUp, href: "#historical-trends", optional: true },
  { id: "reports", label: "Reports & Analytics", icon: FileText, href: "#reports" },
  { id: "users", label: "Users & Permissions", icon: Users, href: "#users" },
  { id: "settings", label: "Settings", icon: Settings, href: "#settings" },
];

export default function OfficialDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Regional heatmap data for official surveillance map
  const [regionalHeatPoints] = useState<HeatPoint[]>([
    { lat: 9.975, lng: 76.18, intensity: 0.95 },
    { lat: 10.15, lng: 76.05, intensity: 0.85 },
    { lat: 9.85, lng: 76.05, intensity: 0.1 },
    { lat: 9.7, lng: 76.2, intensity: 0.25 },
    { lat: 10.05, lng: 75.9, intensity: 0.9 },
  ]);

  const [regionalMarkers] = useState<MapMarker[]>([
    { lat: 9.9312, lng: 76.2673, label: "Coast Guard Command Station Alpha", icon: "landing" },
    { lat: 9.88, lng: 76.12, label: "Marine Patrol Vessel ICGS-402", icon: "boat" },
    { lat: 10.08, lng: 76.02, label: "Coastal Surveillance Beacon #7", icon: "boat" },
    { lat: 9.75, lng: 76.15, label: "Artisanal Fishing Craft Cluster", icon: "boat" },
  ]);

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-900 flex flex-col md:flex-row">
      {/* ========================================================================= */}
      {/* 1. Desktop Persistent Sidebar Navigation (Dark Navy Retained)             */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900 text-slate-200 shrink-0 min-h-screen p-4 space-y-6 sticky top-0 h-screen">
        {/* Command Header Logo */}
        <div className="flex items-center gap-3 px-2 py-1 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-cyan-600 text-white shadow-md">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="font-extrabold text-white text-base tracking-wider flex items-center gap-1.5">
              <span>ORCA</span>
              <Badge className="bg-cyan-950 text-cyan-400 border-cyan-800 text-[9px] px-1.5 py-0">ADMIN</Badge>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Coastal Command Center</p>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="space-y-1 flex-1 overflow-y-auto">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-3 mb-2">
            Command Modules
          </div>
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-cyan-600/90 text-white shadow-sm border border-cyan-500/40 font-semibold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.optional && (
                  <span className="text-[9px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    Opt
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Operator Footer */}
        <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1 px-2 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[11px]">System Status:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              Operational
            </span>
          </div>
          <div className="text-[10px] text-slate-500">ISRO Coastal Command v2.4</div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* Mobile Top Bar & Hamburger Sheet Drawer                                    */}
      {/* ========================================================================= */}
      <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-white">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-600 text-white">
            <Radio className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">ORCA Command</div>
            <div className="text-[10px] text-slate-400">Official Control Panel</div>
          </div>
        </div>

        <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-slate-950 border-slate-800 text-slate-300">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-slate-900 border-slate-800 text-slate-100 w-72">
            <SheetHeader className="pb-4 border-b border-slate-800">
              <SheetTitle className="text-white text-left flex items-center gap-2">
                <Radio className="h-5 w-5 text-cyan-400" />
                ORCA Official Command
              </SheetTitle>
            </SheetHeader>
            <nav className="space-y-1.5 mt-4">
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-cyan-600 text-white"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-cyan-400" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      {/* ========================================================================= */}
      {/* Main Command Dashboard Content Container (LIGHT THEME)                     */}
      {/* ========================================================================= */}
      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-x-hidden">
        {/* Page Top Title Ribbon */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-cyan-800 text-[11px] font-semibold mb-2 shadow-sm">
              <Activity className="h-3 w-3 text-cyan-700" />
              Regional Control & Surveillance Console
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Official Command Dashboard
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              Live multi-agent marine monitoring, regional hazard broadcast controls, and vessel security analytics.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Badge className="bg-white border-slate-200 text-slate-700 px-3 py-1.5 text-xs flex items-center gap-1.5 shadow-sm">
              <Clock className="h-3.5 w-3.5 text-cyan-700" />
              <span>Live Sync: 08:20 IST</span>
            </Badge>
          </div>
        </section>

        {/* 2. Overview Section: Row of Stat Cards (White Cards, Soft Shadows) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-medium text-slate-500">Active Hazards</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-extrabold text-slate-900">5</div>
              <p className="text-[11px] text-amber-700 mt-1 font-medium flex items-center gap-1">
                <span>+2 high severity swell warnings</span>
              </p>
            </CardContent>
          </Card>

          {/* Stat 2 */}
          <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-medium text-slate-500">Vessels Tracked</CardTitle>
              <Navigation className="h-4 w-4 text-cyan-700" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-extrabold text-slate-900">128</div>
              <p className="text-[11px] text-cyan-700 mt-1 font-medium">
                12 active in deep-sea sectors
              </p>
            </CardContent>
          </Card>

          {/* Stat 3 */}
          <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-medium text-slate-500">Regions Monitored</CardTitle>
              <MapPin className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-extrabold text-slate-900">14</div>
              <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                All coastal sectors online
              </p>
            </CardContent>
          </Card>

          {/* Stat 4 */}
          <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-medium text-slate-500">Queries Processed Today</CardTitle>
              <Activity className="h-4 w-4 text-cyan-700" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-extrabold text-slate-900">1,420</div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                98.4% resolution accuracy
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Regional Map View Focal Point */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Compass className="h-5 w-5 text-cyan-700" />
                Regional Marine Intelligence & Surveillance Surface
              </h2>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Wide regional ocean view (Malabar Coast & Laccadive Sea). Thermal surface highlights fishing clusters (Green) vs hazards (Red).
              </CardDescription>
            </div>
            <Badge variant="outline" className="self-start md:self-auto text-xs text-cyan-800 border-cyan-200 bg-cyan-50">
              Live AIS & Satellite Overlay
            </Badge>
          </div>

          <LeafletMap
            center={REGIONAL_MAP_CENTER}
            zoom={8}
            className="h-96 md:h-[420px] w-full rounded-xl"
            markers={regionalMarkers}
            heatPoints={regionalHeatPoints}
          />
        </section>

        {/* 3. Alert Severity Summary Section (Light Color Tints) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
              Alert Severity Summary
            </h2>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border border-slate-200 text-xs">
              Live Severity Breakdown
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* High Chip */}
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-red-900 uppercase tracking-wider">High Severity</div>
                <div className="text-xs text-red-700 mt-1">Swell waves & cyclonic depressions</div>
              </div>
              <span className="text-3xl font-extrabold text-red-700 font-mono">2</span>
            </div>

            {/* Moderate Chip */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-amber-900 uppercase tracking-wider">Moderate Severity</div>
                <div className="text-xs text-amber-700 mt-1">Boundary buffers & strong tide currents</div>
              </div>
              <span className="text-3xl font-extrabold text-amber-700 font-mono">2</span>
            </div>

            {/* Informational Chip */}
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-sky-900 uppercase tracking-wider">Informational</div>
                <div className="text-xs text-sky-700 mt-1">PFZ updates & daily marine forecasts</div>
              </div>
              <span className="text-3xl font-extrabold text-sky-700 font-mono">1</span>
            </div>
          </div>
        </section>

        {/* 4. Placeholder Section 1: Alert Broadcast Panel & Hazard Zone Overlay */}
        {/* TODO: Kunal builds this - see CONTEXT.md */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <CardHeader className="p-0 pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Radio className="h-5 w-5 text-cyan-700" />
                Alert Broadcast Panel & Hazard Zone Overlay
              </CardTitle>
              <Badge className="bg-cyan-50 border-cyan-200 text-cyan-800 text-xs">Teammate Module Slot</Badge>
            </div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Interactive hazard polygon editor, coastal warning broadcaster, and alert push dispatch console.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2 bg-slate-50">
              <div className="p-3 rounded-full bg-cyan-100 text-cyan-700 inline-flex">
                <Radio className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Alert Broadcast Panel & Hazard Overlay Slot</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                // TODO: Kunal builds this - see CONTEXT.md. This section will contain the interactive Turf.js hazard drawing overlay and live emergency broadcast dispatch controls.
              </p>
              <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 text-[11px] mt-2">
                Module Ready For Integration
              </Badge>
            </div>
          </CardContent>
        </section>

        {/* 5. Placeholder Section 2: Historical Trend Chart */}
        {/* OPTIONAL - build last if time permits, see CONTEXT.md */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <CardHeader className="p-0 pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Historical Trend Analytics Slot
              </CardTitle>
              <Badge variant="outline" className="text-slate-600 border-slate-200 text-xs">Optional Stretch Slot</Badge>
            </div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Long-term ocean wave height, sea temperature anomaly, and seasonal catch analytics graphs.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2 bg-slate-50">
              <div className="p-3 rounded-full bg-emerald-100 text-emerald-700 inline-flex">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Historical Trend Analytics Slot</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                // OPTIONAL - build last if time permits, see CONTEXT.md. Multi-month trends and historical fleet analytics.
              </p>
            </div>
          </CardContent>
        </section>
      </main>
    </div>
  );
}
