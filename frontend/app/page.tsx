import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Anchor, Shield, Waves, ArrowRight, MessageSquareText, LayoutDashboard } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen relative flex flex-col justify-between items-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-700/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Badge */}
      <header className="w-full max-w-5xl flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Waves className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">ORCA</span>
        </div>
        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-950/40 px-3 py-1">
          SIH26176 • ISRO Sponsored
        </Badge>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-4xl text-center my-auto py-12 z-10">
        <Badge variant="secondary" className="mb-4 bg-slate-900/80 border border-slate-800 text-slate-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-normal">
          Multi-Agent Conversational AI for Marine Safety & Coastal Intelligence
        </Badge>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Navigating Safe Waters with <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
            Explainable AI Advisories
          </span>
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          ORCA orchestrates specialized weather, oceanographic, and geofence agents to provide real-time, cited safety advice in regional languages.
        </p>

        {/* Surface Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
          {/* Card 1: Fisherman Surface */}
          <Card className="group relative overflow-hidden border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 hover:border-cyan-500/50 transition-all duration-300 shadow-2xl flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 text-cyan-500/10 group-hover:text-cyan-500/20 transition-colors">
              <Anchor className="h-28 w-28 -mr-6 -mt-6" />
            </div>

            <CardHeader className="relative z-10 pb-4">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                <Anchor className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                I'm a Fisherman
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm leading-relaxed mt-2">
                Ask questions in your regional language, get localized safety reports, check tides, wave heights, and trigger emergency SOS.
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 space-y-3 pt-2">
              <Button asChild size="lg" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center justify-between group-hover:shadow-lg group-hover:shadow-cyan-500/20">
                <Link href="/fisherman/chat">
                  <span>Launch Fisherman Chat</span>
                  <MessageSquareText className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full border-slate-800 text-slate-300 hover:bg-slate-800 text-xs">
                <Link href="/fisherman/home">
                  <span>View Fisherman Home Dashboard</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: Official Surface */}
          <Card className="group relative overflow-hidden border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 hover:border-blue-500/50 transition-all duration-300 shadow-2xl flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
              <Shield className="h-28 w-28 -mr-6 -mt-6" />
            </div>

            <CardHeader className="relative z-10 pb-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                I'm an Official
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm leading-relaxed mt-2">
                Access the operational map, broadcast real-time hazard alerts to coastal regions, and monitor emergency SOS signals.
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 space-y-3 pt-2">
              <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-between group-hover:shadow-lg group-hover:shadow-blue-500/20">
                <Link href="/official/dashboard">
                  <span>Open Official Dashboard</span>
                  <LayoutDashboard className="h-4 w-4" />
                </Link>
              </Button>
              <div className="text-xs text-slate-500 text-center py-1">
                Authorized Organization Access
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-5xl text-center text-slate-500 text-xs py-4 border-t border-slate-900 z-10">
        ORCA — Smart India Hackathon 2026 (Problem Statement SIH26176) • Sponsored by ISRO & Dept of Space
      </footer>
    </main>
  );
}
