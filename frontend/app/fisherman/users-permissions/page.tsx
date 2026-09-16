"use client";

import { Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function UsersPermissionsPage() {
  return (
    <div className="space-y-6 pb-12 text-slate-100 max-w-7xl mx-auto px-4 md:px-6 pt-4">
      {/* Header Banner */}
      <section className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/40 border border-cyan-700/50 text-cyan-300 text-xs font-semibold mb-3">
            <Users className="h-3.5 w-3.5 text-cyan-400" />
            Crew & Role Access
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Users & Permissions
          </h1>
          <p className="text-slate-300 text-sm md:text-base mt-1 max-w-2xl">
            Vessel captain access, crew member roles, and coastal organization permission settings.
          </p>
        </div>
      </section>

      {/* Placeholder Card */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-md">
        <CardContent className="p-12 text-center space-y-4">
          <div className="p-4 rounded-full bg-slate-950 border border-slate-800 text-slate-400 inline-flex">
            <Users className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Users & Team Permission Management</h3>
            <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto">
              Multi-user access control, vessel crew accounts, and organization role delegation will be configurable here in a future release.
            </p>
          </div>
          <Badge variant="outline" className="bg-slate-950 text-slate-400 border-slate-800 text-xs px-3 py-1">
            <Clock className="h-3 w-3 mr-1" /> Planned Module
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
