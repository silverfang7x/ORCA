import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Waves, MessageSquareText, ShieldAlert, Compass, Sun } from "lucide-react";

export default function FishermanHomePage() {
  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Fisherman Quick Dashboard</h1>
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-950/30">
              Kochi Sector 4
            </Badge>
          </div>
          <p className="text-xs text-slate-400">
            Real-time coastal weather telemetry & safety advisories (Aditi's module route).
          </p>
        </div>
        <Button asChild className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2 text-xs">
          <Link href="/fisherman/chat">
            <MessageSquareText className="h-4 w-4" />
            <span>Ask ORCA Chat</span>
          </Link>
        </Button>
      </header>

      {/* Weather Card Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/80 border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5 text-xs text-slate-400">
              <Sun className="h-3.5 w-3.5 text-amber-400" />
              Sea Temperature
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-white">28.5°C</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">Normal coastal baseline</CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5 text-xs text-slate-400">
              <Waves className="h-3.5 w-3.5 text-cyan-400" />
              Swell & Wave Height
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-white">1.8 meters</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">Moderate sea condition</CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5 text-xs text-slate-400">
              <Compass className="h-3.5 w-3.5 text-emerald-400" />
              Wind Vector
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-white">24 km/h WNW</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">Light to moderate breeze</CardContent>
        </Card>
      </div>

      {/* Route Placeholder Info */}
      <Card className="bg-slate-900/50 border-slate-800 text-center p-8">
        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 mx-auto mb-3">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">Fisherman Home Route</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          This route will be populated by Aditi (Weather card, tide chart, wave display, SOS button, PDF export).
        </p>
      </Card>
    </div>
  );
}
