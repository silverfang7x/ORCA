"use client";

import { useState } from "react";
import {
  Users,
  Anchor,
  UserPlus,
  Phone,
  CheckCircle2,
  Shield,
  Radio,
  Clock,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CrewMember {
  id: string;
  name: string;
  role: "Captain / Master" | "Senior Deckhand" | "Engine Operator" | "Net Handler";
  phone: string;
  status: "On Board" | "On Shore" | "On Duty";
  safetyBriefed: boolean;
}

const CREW_MEMBERS: CrewMember[] = [
  {
    id: "CREW-01",
    name: "Captain K. P. Francis",
    role: "Captain / Master",
    phone: "+91 98470 11204",
    status: "On Board",
    safetyBriefed: true,
  },
  {
    id: "CREW-02",
    name: "Anthony Joseph",
    role: "Senior Deckhand",
    phone: "+91 98471 22301",
    status: "On Board",
    safetyBriefed: true,
  },
  {
    id: "CREW-03",
    name: "Suresh Kumar",
    role: "Engine Operator",
    phone: "+91 94460 33412",
    status: "On Board",
    safetyBriefed: true,
  },
  {
    id: "CREW-04",
    name: "Biju Varghese",
    role: "Net Handler",
    phone: "+91 98462 44520",
    status: "On Shore",
    safetyBriefed: true,
  },
];

export default function UsersPermissionsPage() {
  const [invitedSuccess, setInvitedSuccess] = useState(false);

  const handleInviteCrew = () => {
    setInvitedSuccess(true);
    setTimeout(() => {
      setInvitedSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-900 max-w-4xl mx-auto px-4 md:px-6 pt-4">
      {/* Header Banner */}
      <section className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-900 to-slate-900 text-white border border-slate-800/20 p-6 md:p-8 shadow-md overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-cyan-200 text-xs font-semibold mb-3">
              <Anchor className="h-3.5 w-3.5 text-cyan-300" />
              Vessel & Crew Management
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Boat & Crew Roster
            </h1>
            <p className="text-slate-200 text-sm md:text-base mt-1 max-w-xl">
              Manage your fishing vessel registration details, emergency contacts, and onboard crew roster.
            </p>
          </div>

          <Button
            onClick={handleInviteCrew}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-sm flex items-center gap-2 shrink-0 h-10 px-4"
          >
            <UserPlus className="h-4 w-4" />
            Invite Crew Member
          </Button>
        </div>
      </section>

      {/* Invite Feedback Banner */}
      {invitedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          Crew invitation link generated! Send to your deckhand’s phone number.
        </div>
      )}

      {/* 1. Boat Information Card */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Anchor className="h-4 w-4 text-cyan-700" />
              Registered Vessel Information
            </CardTitle>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs px-2.5 py-0.5 font-mono">
              INCOIS Registered
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-mono">Vessel Name</div>
              <div className="font-extrabold text-slate-900 text-sm mt-0.5">St. Mary</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-mono">Registration Number</div>
              <div className="font-bold text-slate-800 font-mono text-xs mt-0.5">IND-KL-02-MM-104</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-mono">Home Port</div>
              <div className="font-semibold text-slate-800 text-xs mt-0.5">Munambam Harbour, Kochi</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-mono">Vessel Type & Length</div>
              <div className="font-semibold text-slate-800 text-xs mt-0.5">Artisanal Motorized (12.5m)</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-mono">Crew Capacity</div>
              <div className="font-semibold text-slate-800 text-xs mt-0.5">6 Members Max</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-mono">Emergency VHF Channel</div>
              <div className="font-bold text-cyan-800 font-mono text-xs mt-0.5">VHF Channel 16</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Onboard Crew Members Roster */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-700" />
                Active Crew Roster
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Registered deckhands and crew assigned to St. Mary
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs text-slate-600 border-slate-200 font-mono">
              4 Active Crew
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {CREW_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-cyan-100 text-cyan-800 font-extrabold flex items-center justify-center text-xs shrink-0">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <span>{member.name}</span>
                    <Badge variant="outline" className="text-[10px] text-slate-600 border-slate-200 font-mono">
                      {member.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <span>{member.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    member.status === "On Board"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      member.status === "On Board" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                    }`}
                  />
                  {member.status}
                </span>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
