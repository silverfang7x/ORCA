"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageSquareText,
  Compass,
  Waves,
  AlertTriangle,
  ShieldCheck,
  Activity,
  BarChart3,
  Users,
  Settings,
  MapPin,
  Fish,
  User,
  Anchor
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/LanguageContext";

const DESKTOP_NAV_ITEMS = [
  { key: "nav.home", href: "/fisherman/home", icon: Home },
  { key: "nav.chat", href: "/fisherman/chat", icon: MessageSquareText },
  { key: "nav.fishing_advisory", href: "/fisherman/fishing-advisory", icon: Compass },
  { key: "nav.weather_ocean_data", href: "/fisherman/weather-ocean-data", icon: Waves },
  { key: "nav.hazards_alerts", href: "/fisherman/hazards-alerts", icon: AlertTriangle },
  { key: "nav.geofencing_boundaries", href: "/fisherman/geofencing-boundaries", icon: ShieldCheck },
  { key: "nav.agent_activity", href: "/fisherman/agent-activity", icon: Activity },
  { key: "nav.reports_analytics", href: "/fisherman/reports-analytics", icon: BarChart3 },
  { key: "nav.users_permissions", href: "/fisherman/users-permissions", icon: Users },
  { key: "nav.settings", href: "/fisherman/settings", icon: Settings },
];

const MOBILE_NAV_ITEMS = [
  { key: "nav.home", href: "/fisherman/home", icon: Home },
  { key: "nav.map", href: "/fisherman/geofencing-boundaries", icon: MapPin },
  { key: "nav.alerts", href: "/fisherman/hazards-alerts", icon: AlertTriangle },
  { key: "nav.fishing_zones", href: "/fisherman/fishing-advisory", icon: Fish },
  { key: "nav.profile", href: "/fisherman/settings", icon: User },
];

export function FishermanNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <>
      {/* Desktop Persistent Sidebar (768px and up) */}
      <aside className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 z-40 bg-slate-950 border-r border-slate-900 text-slate-200 shrink-0">
        {/* Sidebar Header */}
        <div className="h-16 px-6 border-b border-slate-900 flex items-center justify-between shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-sm">
              <Anchor className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight">ORCA</span>
              <span className="text-[10px] text-cyan-400 block -mt-1 font-mono">{t("nav.fisherman_portal")}</span>
            </div>
          </Link>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/40 text-emerald-400 bg-emerald-950/30">
            ONLINE
          </Badge>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-none">
          {DESKTOP_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-cyan-600/90 text-white shadow-md shadow-cyan-900/30 border border-cyan-500/40 font-semibold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="truncate">{t(item.key)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-900 text-[11px] text-slate-500 font-mono flex items-center justify-between shrink-0">
          <span>SIH26176 • ISRO</span>
          <span>v1.0</span>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar (Below 768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-slate-900 px-2 py-1 shadow-2xl">
        <nav className="flex items-center justify-around">
          {MOBILE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 px-3 min-h-[44px] min-w-[44px] rounded-lg transition-all text-[10px] font-medium ${
                  isActive ? "text-cyan-400 font-semibold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-5 w-5 mb-0.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{t(item.key)}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
