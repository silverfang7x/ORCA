"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Anchor, Shield, Waves, ArrowRight, MessageSquareText, LayoutDashboard } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen relative flex flex-col justify-between items-center bg-[#f4f7fa] text-slate-900 px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-200/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Badge */}
      <header className="w-full max-w-5xl flex flex-row justify-between items-center z-10 gap-2">
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-cyan-700 flex items-center justify-center shadow-md text-white">
            <Waves className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">ORCA</span>
        </div>
        <Badge variant="outline" className="border-cyan-300 text-cyan-800 bg-cyan-50 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-right shrink-0">
          SIH26176 • ISRO Sponsored
        </Badge>
      </header>

      {/* Magic UI Animated Hero Section */}
      <section className="w-full max-w-4xl text-center my-auto py-8 sm:py-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Badge variant="secondary" className="mb-4 bg-white border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-sm max-w-full leading-normal">
            Multi-Agent Conversational AI for Marine Safety & Coastal Intelligence
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4"
        >
          Navigating Safe Waters with <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-700 via-teal-700 to-blue-800 bg-clip-text text-transparent">
            Explainable AI Advisories
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2"
        >
          ORCA orchestrates specialized weather, oceanographic, and geofence agents to provide real-time, cited safety advice in regional languages.
        </motion.p>

        {/* Animated Surface Selection Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left w-full"
        >
          {/* Card 1: Fisherman Surface */}
          <Card className="group relative overflow-hidden border-slate-200 bg-white hover:border-cyan-500 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between w-full">
            <div className="absolute top-0 right-0 p-6 text-cyan-500/10 group-hover:text-cyan-500/20 transition-colors pointer-events-none">
              <Anchor className="h-28 w-28 -mr-6 -mt-6" />
            </div>

            <CardHeader className="relative z-10 pb-4">
              <div className="h-12 w-12 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 mb-3 group-hover:scale-110 transition-transform">
                <Anchor className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-cyan-800 transition-colors">
                I'm a Fisherman
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm leading-relaxed mt-2">
                Ask questions in your regional language, get localized safety reports, check tides, wave heights, and trigger emergency SOS.
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 space-y-3 pt-2">
              <Button asChild size="lg" className="w-full min-h-[44px] bg-cyan-700 hover:bg-cyan-600 text-white font-semibold flex items-center justify-between shadow-sm">
                <Link href="/fisherman/chat">
                  <span>Launch Fisherman Chat</span>
                  <MessageSquareText className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full min-h-[44px] border-slate-200 text-slate-700 hover:bg-slate-50 text-xs">
                <Link href="/fisherman/home">
                  <span>View Fisherman Home Dashboard</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: Official Surface */}
          <Card className="group relative overflow-hidden border-slate-200 bg-white hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between w-full">
            <div className="absolute top-0 right-0 p-6 text-blue-500/10 group-hover:text-blue-500/20 transition-colors pointer-events-none">
              <Shield className="h-28 w-28 -mr-6 -mt-6" />
            </div>

            <CardHeader className="relative z-10 pb-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-3 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
                I'm an Official
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm leading-relaxed mt-2">
                Access the operational map, broadcast real-time hazard alerts to coastal regions, and monitor emergency SOS signals.
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 space-y-3 pt-2">
              <Button asChild size="lg" className="w-full min-h-[44px] bg-blue-700 hover:bg-blue-600 text-white font-semibold flex items-center justify-between shadow-sm">
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
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-5xl text-center text-slate-500 text-xs py-4 border-t border-slate-200 z-10">
        ORCA — Smart India Hackathon 2026 (Problem Statement SIH26176) • Sponsored by ISRO & Dept of Space
      </footer>
    </main>
  );
}
