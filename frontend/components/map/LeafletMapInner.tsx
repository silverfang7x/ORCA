"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  icon?: "boat" | "landing";
}

export interface HeatPoint {
  lat: number;
  lng: number;
  intensity: number; // 0.0 to 1.0 (1.0 = green / safe / high fish potential, 0.0 = red / hazard)
}

export interface LeafletMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers?: MapMarker[];
  heatPoints?: HeatPoint[];
  className?: string;
}

// Custom Leaflet DivIcon factory for boat and landing markers
const createCustomMarkerIcon = (type: "boat" | "landing" = "boat") => {
  const isBoat = type === "boat";

  const iconHtml = isBoat
    ? `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-600 text-white shadow-md border-2 border-white transform transition-transform hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
        </svg>
       </div>`
    : `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white shadow-md border-2 border-white transform transition-transform hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
       </div>`;

  return L.divIcon({
    html: iconHtml,
    className: "orca-leaflet-custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Component to manage heatmap rendering via L.heatLayer
function HeatmapOverlay({
  heatPoints,
  center,
}: {
  heatPoints?: HeatPoint[];
  center: { lat: number; lng: number };
}) {
  const map = useMap();

  useEffect(() => {
    if (typeof window === "undefined" || !map) return;

    // Load leaflet.heat plugin dynamically on client
    require("leaflet.heat");

    /**
     * DEMO VISUALIZATION NOTE:
     * This synthetic grid interpolation generates a continuous thermal surface for visual demonstration
     * purposes (green = safe/high fish potential, red = hazard/avoid) from discrete backend data points,
     * and is not a scientifically derived ocean model.
     *
     * Reverse Heatmap Color Mapping:
     * High intensity (1.0) maps to green (safe/good fishing zone).
     * Low intensity (0.0) maps to red (hazard/avoid zone).
     */

    // Seed points from props or standard demo locations around the map center
    const pointsToUse: HeatPoint[] =
      heatPoints && heatPoints.length > 0
        ? heatPoints
        : [
            { lat: center.lat + 0.04, lng: center.lng + 0.04, intensity: 0.95 }, // Safe high potential zone (Green)
            { lat: center.lat + 0.02, lng: center.lng - 0.03, intensity: 0.8 },  // Good zone (Lime/Yellow)
            { lat: center.lat - 0.03, lng: center.lng - 0.04, intensity: 0.1 },  // Hazard zone (Red)
            { lat: center.lat - 0.05, lng: center.lng + 0.03, intensity: 0.35 }, // Warning/caution zone (Orange)
          ];

    // Generate smooth synthetic surface interpolation across a dense sub-grid
    const interpolatedTuples: Array<[number, number, number]> = [];

    pointsToUse.forEach((pt) => {
      // Primary point center
      interpolatedTuples.push([pt.lat, pt.lng, pt.intensity]);

      // Sub-grid satellite interpolation points to produce continuous thermal surface gradients
      const radiusDeg = 0.045;
      const step = 0.009;

      for (let dLat = -radiusDeg; dLat <= radiusDeg; dLat += step) {
        for (let dLng = -radiusDeg; dLng <= radiusDeg; dLng += step) {
          if (dLat === 0 && dLng === 0) continue;
          const dist = Math.sqrt(dLat * dLat + dLng * dLng);
          if (dist <= radiusDeg) {
            // Gaussian-like falloff calculation
            const weight = Math.exp(-Math.pow(dist / (radiusDeg * 0.6), 2));
            const subIntensity = Math.min(1.0, Math.max(0.0, pt.intensity * weight));
            interpolatedTuples.push([pt.lat + dLat, pt.lng + dLng, subIntensity]);
          }
        }
      }
    });

    // Create L.heatLayer with explicit color gradient mapping:
    // 0.0 -> Red (#ef4444)
    // 0.35 -> Orange (#f97316)
    // 0.6 -> Yellow (#eab308)
    // 0.8 -> Lime (#84cc16)
    // 1.0 -> Green (#22c55e)
    const heatLayerInstance = (L as unknown as {
      heatLayer: (
        points: Array<[number, number, number]>,
        options: Record<string, unknown>
      ) => L.Layer;
    }).heatLayer(interpolatedTuples, {
      radius: 35,
      blur: 20,
      maxZoom: 15,
      max: 1.0,
      minOpacity: 0.4,
      gradient: {
        0.0: "#ef4444",   // Hazard / Avoid (Red)
        0.35: "#f97316",  // Caution (Orange)
        0.6: "#eab308",   // Moderate / Fair (Yellow)
        0.8: "#84cc16",   // Good (Lime)
        1.0: "#22c55e",   // Safe / High Potential (Green)
      },
    });

    heatLayerInstance.addTo(map);

    return () => {
      if (map && heatLayerInstance) {
        map.removeLayer(heatLayerInstance);
      }
    };
  }, [map, heatPoints, center]);

  return null;
}

// Helper component to invalidate map size automatically when container resizes or mounts
function MapResizer() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Trigger initial resize invalidate after mount
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [map]);

  return null;
}

export default function LeafletMapInner({
  center,
  zoom,
  markers = [],
  heatPoints = [],
  className = "h-96 w-full",
}: LeafletMapProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dynamic map auto-resizer on viewport/orientation change */}
        <MapResizer />

        {/* Heatmap Continuous Gradient Overlay */}
        <HeatmapOverlay heatPoints={heatPoints} center={center} />

        {/* Custom Boat / Landing Markers */}
        {markers.map((marker, idx) => (
          <Marker
            key={`${marker.lat}-${marker.lng}-${idx}`}
            position={[marker.lat, marker.lng]}
            icon={createCustomMarkerIcon(marker.icon)}
          >
            <Popup>
              <div className="p-1 font-sans">
                <div className="font-semibold text-slate-900 text-sm">{marker.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Lat: {marker.lat.toFixed(4)}, Lng: {marker.lng.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
