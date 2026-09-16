import { Compass } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function FishingAdvisoryPage() {
  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      <header className="border-b border-slate-900 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Compass className="h-6 w-6 text-cyan-400" />
          Fishing Advisory & Potential Zones
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Potential Fishing Zone (PFZ) advisory reports and species target indicators.
        </p>
      </header>

      <Card className="bg-slate-900/60 border-slate-800 p-8 text-center text-slate-400 text-sm">
        Fishing Advisory Module — Active data feed initialized.
      </Card>
    </div>
  );
}
