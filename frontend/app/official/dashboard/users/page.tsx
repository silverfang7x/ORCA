"use client";

import { Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OfficialUsersPermissionsPage() {
  return (
    <div className="space-y-6">
      {/* Title Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-semibold mb-2 shadow-sm">
            <Users className="h-3 w-3 text-cyan-700" />
            Command Staff & Role Access
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Users & Permissions
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            Coastal Guard operator access levels, control room officer privileges, and emergency broadcast delegation.
          </p>
        </div>
      </section>

      {/* Placeholder Card */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-cyan-700" />
            Operator Access Control
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Multi-tier role delegation for official command staff
          </CardDescription>
        </CardHeader>
        <CardContent className="p-12 text-center space-y-4">
          <div className="p-4 rounded-full bg-slate-50 border border-slate-200 text-slate-600 inline-flex">
            <Users className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Official Staff Role Management</h3>
            <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto">
              Control room officer credentials, emergency broadcast authorization levels, and audit trail logs will be managed here.
            </p>
          </div>
          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs px-3 py-1">
            <Clock className="h-3 w-3 mr-1" /> Planned Module
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
