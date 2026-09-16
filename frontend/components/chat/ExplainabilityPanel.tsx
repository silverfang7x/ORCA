import { Check, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExplainabilityPanelProps {
  sources?: string[];
}

export function ExplainabilityPanel({ sources }: ExplainabilityPanelProps) {
  if (!sources || sources.length === 0) return null;

  const getPillLabel = (src: string) => {
    const s = src.toLowerCase();
    if (s.includes("weather") || s.includes("meteo") || s.includes("open-meteo")) return "Weather Data";
    if (s.includes("hazard") || s.includes("turf") || s.includes("geofence")) return "Hazard & Geofence";
    if (s.includes("tide")) return "Tide Forecast";
    if (s.includes("pfz") || s.includes("ocean")) return "Ocean / PFZ";
    return src;
  };

  return (
    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
      <div className="flex items-center gap-1.5 text-slate-600 font-medium mb-2">
        <ShieldCheck className="h-3.5 w-3.5 text-cyan-700" />
        <span>How ORCA Decided: Fed by {sources.length} verified data {sources.length === 1 ? 'source' : 'sources'}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {sources.map((src, idx) => (
          <Badge
            key={idx}
            variant="secondary"
            className="bg-cyan-50 border border-cyan-200 text-cyan-800 font-normal py-1 px-2.5 rounded-full flex items-center gap-1 text-[11px]"
          >
            <Check className="h-3 w-3 text-cyan-700 shrink-0" />
            <span>{getPillLabel(src)}</span>
          </Badge>
        ))}
      </div>
    </div>
  );
}
