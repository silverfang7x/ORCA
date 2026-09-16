import { AlertTriangle, ShieldCheck, Waves, Fish, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuickOverviewListProps {
  weatherData?: any;
  hazardData?: any;
}

export function QuickOverviewList({ weatherData, hazardData }: QuickOverviewListProps) {
  if (!weatherData && !hazardData) return null;

  const rows = [
    {
      label: "Weather Conditions",
      icon: Waves,
      status: weatherData?.windSpeedKmh > 30 ? "Caution" : "Good",
      badgeVariant: weatherData?.windSpeedKmh > 30 ? "warning" : "success",
      detail: weatherData ? `Wind: ${weatherData.windSpeedKmh} km/h • Waves: ${weatherData.waveHeightMeters}m` : "Data available"
    },
    {
      label: "Fish Potential Zone",
      icon: Fish,
      status: "High",
      badgeVariant: "success",
      detail: "Favorable sea surface temperature & currents"
    },
    {
      label: "Hazard Alerts",
      icon: AlertTriangle,
      status: hazardData?.hazardAlerts?.length > 0 ? "Alert Active" : "No Alert",
      badgeVariant: hazardData?.hazardAlerts?.length > 0 ? "destructive" : "success",
      detail: hazardData?.hazardAlerts?.length > 0 ? hazardData.hazardAlerts[0].title || "Active Advisory" : "All coastal sectors clear"
    },
    {
      label: "Geofencing",
      icon: ShieldCheck,
      status: hazardData?.isInRestrictedZone ? "Restricted" : "Allowed",
      badgeVariant: hazardData?.isInRestrictedZone ? "destructive" : "success",
      detail: hazardData?.isInRestrictedZone ? "Inside restricted zone" : "Clear of maritime boundaries"
    },
    {
      label: "Tides & Swell",
      icon: Compass,
      status: "Normal",
      badgeVariant: "secondary",
      detail: weatherData?.tideTimes?.length ? `High Tide: ${weatherData.tideTimes[0]?.time}` : "Standard tidal cycle"
    }
  ];

  return (
    <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
      <div className="font-semibold text-slate-700 pb-1 border-b border-slate-200 flex items-center justify-between">
        <span>Quick Overview Summary</span>
        <span className="text-[10px] text-cyan-700 font-mono">LIVE TELEMETRY</span>
      </div>
      <div className="space-y-1.5">
        {rows.map((row, idx) => {
          const Icon = row.icon;
          return (
            <div key={idx} className="flex items-center justify-between py-1 px-2 rounded-lg bg-white border border-slate-200">
              <div className="flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-cyan-700 shrink-0" />
                <div>
                  <div className="font-medium text-slate-900">{row.label}</div>
                  <div className="text-[10px] text-slate-500">{row.detail}</div>
                </div>
              </div>
              <Badge
                variant={row.badgeVariant as any}
                className="text-[10px] px-2 py-0.5 font-medium rounded-full"
              >
                {row.status}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
