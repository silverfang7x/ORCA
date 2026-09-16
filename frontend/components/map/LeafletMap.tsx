"use client";

import dynamic from "next/dynamic";
import type { LeafletMapProps, MapMarker, HeatPoint } from "./LeafletMapInner";

// Export types for consumer convenience
export type { LeafletMapProps, MapMarker, HeatPoint };

// Skeleton loading component rendered on server side or while Leaflet loads client-side
function MapSkeleton({ className = "h-96 w-full" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse ${className}`}>
      <div className="flex flex-col items-center gap-2 text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-spin"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <span className="text-xs font-medium">Loading Interactive Marine Map...</span>
      </div>
    </div>
  );
}

// Dynamically import LeafletMapInner with SSR disabled to prevent window/document undefined errors
const LeafletMapInner = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
  loading: ({ error }) => {
    if (error) {
      return (
        <div className="flex items-center justify-center h-96 w-full rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200">
          Failed to load map visualization.
        </div>
      );
    }
    return <MapSkeleton />;
  },
});

export default function LeafletMap(props: LeafletMapProps) {
  return <LeafletMapInner {...props} />;
}
