"use client";

import { LanguageProvider } from "@/lib/LanguageContext";
import { FishermanNav } from "@/components/layout/FishermanNav";

export default function FishermanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#f4f7fa] text-slate-900 flex flex-col md:flex-row">
        <FishermanNav />
        <div className="flex-1 md:pl-64 pb-16 md:pb-0">
          {children}
        </div>
      </div>
    </LanguageProvider>
  );
}
