import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function HazardsAlertsPage() {
  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      <header className="border-b border-slate-900 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-amber-400" />
          Hazards & Alerts
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Active marine warning notices, squall advisories, and emergency announcements.
        </p>
      </header>

      <Card className="bg-slate-900/60 border-slate-800 p-8 text-center text-slate-400 text-sm">
        Hazards & Alerts Center — Monitoring Active.
      </Card>
    </div>
  );
}
