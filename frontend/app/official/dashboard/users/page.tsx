"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Shield,
  Clock,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Radio,
  SlidersHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Operator {
  id: string;
  name: string;
  email: string;
  role: string;
  accessLevel: "Full Command" | "Regional Broadcast" | "Read Only";
  lastActive: string;
  status: "Active" | "On Duty" | "Offline";
  location: string;
}

const MOCK_OPERATORS: Operator[] = [
  {
    id: "OP-101",
    name: "Cmdr. Rajesh Sharma",
    email: "r.sharma@coastguard.gov.in",
    role: "Chief Coastal Controller",
    accessLevel: "Full Command",
    lastActive: "Active now",
    status: "Active",
    location: "Kochi Control HQ",
  },
  {
    id: "OP-102",
    name: "Officer Ananya Roy",
    email: "a.roy@incois.gov.in",
    role: "Control Room Officer",
    accessLevel: "Regional Broadcast",
    lastActive: "4 mins ago",
    status: "On Duty",
    location: "Kerala Sector Alpha",
  },
  {
    id: "OP-103",
    name: "Supv. Vikramaditya Nair",
    email: "v.nair@isro.gov.in",
    role: "Oceanographic Data Analyst",
    accessLevel: "Regional Broadcast",
    lastActive: "12 mins ago",
    status: "On Duty",
    location: "Telemetry Station 4",
  },
  {
    id: "OP-104",
    name: "Insp. Priya Pillai",
    email: "p.pillai@marinesafety.in",
    role: "Fisheries Safety Inspector",
    accessLevel: "Read Only",
    lastActive: "1 hour ago",
    status: "Active",
    location: "Vizhinjam Port",
  },
  {
    id: "OP-105",
    name: "Coord. Suresh Menon",
    email: "s.menon@coastguard.gov.in",
    role: "Emergency Broadcast Lead",
    accessLevel: "Regional Broadcast",
    lastActive: "3 hours ago",
    status: "Offline",
    location: "Kochi Control HQ",
  },
  {
    id: "OP-106",
    name: "Tech. Karthik V.",
    email: "k.v@orca-systems.org",
    role: "AI Agent Telemetry Operator",
    accessLevel: "Full Command",
    lastActive: "18 mins ago",
    status: "On Duty",
    location: "Remote Command Node",
  },
  {
    id: "OP-107",
    name: "Officer Deepa Thomas",
    email: "d.thomas@incois.gov.in",
    role: "Geofence Enforcement Lead",
    accessLevel: "Regional Broadcast",
    lastActive: "Just now",
    status: "Active",
    location: "Lakshadweep Outpost",
  },
];

export default function OfficialUsersPermissionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All");

  const filteredOperators = MOCK_OPERATORS.filter((op) => {
    const matchesSearch =
      op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRoleFilter === "All" || op.accessLevel === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Title & Action Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-semibold mb-2 shadow-sm">
            <Users className="h-3 w-3 text-cyan-700" />
            Command Staff & Role Access Control
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Users & Permissions
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5">
            Manage coastal guard operator privileges, control room officer credentials, and emergency broadcast delegation.
          </p>
        </div>
        <Button className="bg-cyan-700 hover:bg-cyan-600 text-white font-semibold text-xs shadow-sm flex items-center gap-2 shrink-0">
          <UserPlus className="h-4 w-4" />
          Add Operator
        </Button>
      </section>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">14</div>
              <div className="text-xs text-slate-500 font-medium">Total Staff Operators</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-emerald-700">9 Active</div>
              <div className="text-xs text-slate-500 font-medium">Currently On Duty</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">3 Level-1</div>
              <div className="text-xs text-slate-500 font-medium">Full Command Rights</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900">8 Authorized</div>
              <div className="text-xs text-slate-500 font-medium">Broadcast Officers</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Operator Data Table Card */}
      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-700" />
                Coastal Command Personnel Roster
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Active control room operators, regional safety officers, and system administrators
              </CardDescription>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search staff or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 text-xs bg-slate-50 border-slate-200 h-8"
                />
              </div>

              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="text-xs border border-slate-200 bg-slate-50 rounded-lg px-2.5 h-8 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="All">All Access Levels</option>
                <option value="Full Command">Full Command</option>
                <option value="Regional Broadcast">Regional Broadcast</option>
                <option value="Read Only">Read Only</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Operator Name</th>
                <th className="py-3 px-4">Role Title</th>
                <th className="py-3 px-4">Command Sector</th>
                <th className="py-3 px-4">Access Rights</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredOperators.map((op) => (
                <tr key={op.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>{op.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{op.email}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 font-medium">{op.role}</td>

                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {op.location}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold px-2 py-0.5 ${
                        op.accessLevel === "Full Command"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : op.accessLevel === "Regional Broadcast"
                          ? "bg-cyan-50 text-cyan-800 border-cyan-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {op.accessLevel}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {op.lastActive}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        op.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : op.status === "On Duty"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          op.status === "Active"
                            ? "bg-emerald-500 animate-pulse"
                            : op.status === "On Duty"
                            ? "bg-blue-500"
                            : "bg-slate-400"
                        }`}
                      />
                      {op.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-700">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>

        {/* Footer Pagination */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-mono">
          <div>Showing {filteredOperators.length} of {MOCK_OPERATORS.length} staff members</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-[11px] border-slate-200" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px] border-slate-200" disabled>
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
