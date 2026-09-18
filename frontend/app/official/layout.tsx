"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const ADMIN_NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/official/dashboard" },
  { id: "live-alerts", label: "Live Alerts", icon: AlertTriangle, href: "/official/dashboard/alerts" },
  { id: "regional-map", label: "Regional Map", icon: MapPin, href: "/official/dashboard/map" },
  { id: "geofencing", label: "Geofencing & Boundaries", icon: ShieldCheck, href: "/official/dashboard/geofencing" },
  { id: "vessel-tracking", label: "Vessel Tracking", icon: Navigation, href: "/official/dashboard/vessels" },
  { id: "historical-trends", label: "Historical Trends", icon: TrendingUp, href: "/official/dashboard/trends", optional: true },
  { id: "reports", label: "Reports & Analytics", icon: FileText, href: "/official/dashboard/reports" },
  { id: "users", label: "Users & Permissions", icon: Users, href: "/official/dashboard/users" },
  { id: "settings", label: "Settings", icon: Settings, href: "/official/dashboard/settings" },
];

export default function OfficialLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-900 flex flex-col md:flex-row">
      {/* ========================================================================= */}
      {/* Persistent Desktop Sidebar Navigation (Dark Navy)                        */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-900 text-slate-200 shrink-0 min-h-screen p-4 space-y-6 sticky top-0 h-screen z-30">
        {/* Command Header Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 px-2 py-1 border-b border-slate-800 pb-4 group hover:opacity-95 transition-all cursor-pointer"
          title="Return to Role Selector"
        >
          <div className="p-2.5 rounded-xl bg-cyan-600 text-white shadow-md group-hover:bg-cyan-500 transition-colors">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="font-extrabold text-white text-base tracking-wider flex items-center gap-1.5">
              <span>ORCA</span>
              <Badge className="bg-cyan-950 text-cyan-400 border-cyan-800 text-[9px] px-1.5 py-0">ADMIN</Badge>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Coastal Command Center</p>
          </div>
        </Link>

        {/* Sidebar Nav Items */}
        <nav className="space-y-1 flex-1 overflow-y-auto">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-3 mb-2">
            Command Modules
          </div>
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
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
              </Link>
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
      {/* Mobile Top Header & Drawer                                                */}
      {/* ========================================================================= */}
      <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-white">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer" title="Return to Role Selector">
          <div className="p-2 rounded-lg bg-cyan-600 text-white group-hover:bg-cyan-500 transition-colors">
            <Radio className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">ORCA Command</div>
            <div className="text-[10px] text-slate-400">Official Control Panel</div>
          </div>
        </Link>

        <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-slate-950 border-slate-800 text-slate-300 min-h-[44px] min-w-[44px] shrink-0">
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
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 min-h-[44px] rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-cyan-600 text-white"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-cyan-400" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
